// lib/gemini.js
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

// Initialize the Google Generative AI client
const genai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
const MODEL_NAME = 'gemini-1.5-flash' // Or use "gemini-1.0-pro" if preferred

const generationConfig = {
  temperature: 1, // Adjust for more or less creative responses
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
}

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
]

const model = genai.getGenerativeModel({ model: MODEL_NAME })

// Function to generate a story step
export async function generateStoryStep(currentGameState, difficultySettings) {
  const prompt = `
    You are narrating an interactive story set in the world of Suits, where the player takes on the role of Mike Ross navigating his interview at Pearson Hardman. The goal is to determine the player's "hireability," starting at 50, which changes based on their choices.

    - Begin the story from when the player meets at the reception Donna, the user should have ONLY ONE interaction with Donna and following steps with Harvey.
    - Player's current hireability: ${currentGameState.hireability}
    - Recent choices: ${currentGameState.progress}

    - Provide a short narration of the next story step based on the player's actions so far.
    - Present exactly three distinct concise choices the player can make. Each choice should subtly influence the hireability score.
    - Return the result as a JSON object in this format:

    {
      "story": "Narrate the next part of the story.",
      "choices": [
        {
          "text": "Choice A.",
          "effect": "+x"
        },
        {
          "text": "Choice B.",
          "effect": "-x"
        },
        {
          "text": "Choice C.",
          "effect": "+x"
        }
      ]
    }

    - Ensure "effect" reflects the impact each choice has on hireability, ranging FROM -${difficultySettings.maxLosingPoints} to +${difficultySettings.maxGainPoints}.
    - Keep the tone engaging, and align the narrative with Suits' high-stakes legal drama.
    - DO NOT add extra text — only output the object WITHOUT ANY FORMATTING.
  `
  try {
    const result = await model.generateContent(prompt, { generationConfig })
    const text = result.response.text()
    return JSON.parse(text.trim())
  } catch (error) {
    console.error('Error generating story step:', error)
    return null
  }
}

// Function to interpret user input
export async function interpretUserInput(userInput, currentGameState, stepStory, difficultySettings) {
  const prompt = `
    Player hireability: ${currentGameState.hireability}.
    Recent choices: ${currentGameState.progress}.
    The player has written a reply: "${userInput}" to the step "${stepStory}".
    Score the player's response and determine its effect on hireability.
    Return the response in JSON format like this:
    {
      "reply": "",
      "effect": "-x",
      "reasoning": ""
    }

    - Ensure "effect" reflects the impact each choice has on hireability, ranging FROM -${difficultySettings.maxLosingPoints} to +${difficultySettings.maxGainPoints}.
    - DO NOT add extra text — only output the object WITHOUT ANY FORMATTING.
  `
  try {
    const result = await model.generateContent(prompt, { generationConfig, safetySettings })
    const text = result.response.text()
    return JSON.parse(text.trim())
  } catch (error) {
    console.error('Error interpreting user input:', error)
    return null
  }
}

// Function to generate the conclusion
export async function generateConclusion(currentGameState, difficultySettings) {
  const prompt = `
    Based on the interview so far, craft a natural-sounding conclusion for the player’s interview with Harvey Specter. Reflect the current hireability score and the choices the player made:

    - Hireability: ${currentGameState.hireability}
    - Choices: ${currentGameState.progress}

    Conclude the interview accordingly. If the hireability is greater than ${difficultySettings.hiringThreshold}, make it sound like the player got hired. If it’s ${difficultySettings.hiringThreshold} or below, make it clear they got rejected but keep the tone professional and engaging.
    - Return only the conclusion as a string without any extra formatting.
  `
  try {
    const result = await model.generateContent(prompt, { generationConfig, safetySettings })
    return result.response.text().trim()
  } catch (error) {
    console.error('Error generating conclusion:', error)
    return 'The interview concludes abruptly.'
  }
}
