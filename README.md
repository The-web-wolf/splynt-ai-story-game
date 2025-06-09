# Splynt AI Story Game

**Splynt AI Story Game** is a web-based interactive narrative game where players engage with an AI to create dynamic, adaptive stories. Built with Next.js and React, the game features a modular architecture and a simple local AI engine to generate story responses based on user input.

## **Features**

* **Dynamic AI-Powered Storytelling:** Interact with an AI that adapts the narrative based on your choices and input.

* **Intuitive UI:** Clean, responsive design with dedicated components for gameplay, logs, and navigation.

* **Global State Management:** Uses React Context to manage player data and story state.

* **Easily Extendable:** Modular structure for adding new stories, models, or UI components.

## **Getting Started**

### **Prerequisites**

* [Node.js](https://nodejs.org/) (v18 or higher recommended)

* [npm](https://www.npmjs.com/) or compatible package manager (Yarn, pnpm)

### **Installation**

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/splynt-ai-story-game.git  
cd splynt-ai-story-game  
npm install
```

### **Environment Variables**
Create a `.env.local` file in the root directory to configure environment variables.

```plaintext
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
```

### **Running the App**

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## **Project Structure**

splynt-ai-story-game/  
├── app/                \# Next.js App Router and pages  
├── components/         \# React UI components (Game, HomePage, LogsButton, etc.)  
├── context/            \# React Context for global state management  
├── lib/                \# AI/model logic, constants, and utility functions  
├── public/             \# Static assets (images, fonts, etc.)  
├── package.json        \# Project metadata and scripts  
└── ...                 \# Config files and other assets

## **Key Components**

* **HomePage:** Landing page and game entry point

* **Game:** Main interactive story UI

* **LogsButton:** View action or conversation logs

* **PlayBackTime:** Review previous game states or actions

* **Context:** React context for managing story/game state globally

* **model.js:** Simple AI/model logic to generate adaptive story responses

## **Customization**

You can extend or replace the story data and AI logic by editing files in the lib/ directory. To connect to a real AI service or language model, modify lib/model.js to call your backend API or service.

## **Deployment**

To build and deploy for production:
```bash
npm run build  
npm start
```

You can also deploy to [Vercel](https://vercel.com/) or any platform that supports Next.js.

## **Contributing**

Pull requests and suggestions are welcome\! Please fork the repository and open an issue or PR.

## **License**

MIT License – free to use, modify, and distribute.