// app/gameContext.js
import { createContext, useState, useContext } from 'react';

// Initialize game state
const initialGameState = {
  hireability: 50,
  progress: [],
  outcome: null,
};

const difficultySettings = {
  light: {
    maxSteps: 5,
    maxGainPoints: 10,
    maxLosingPoints: 2,
    hiringThreshold: 60,
  },
  medium: {
    maxSteps: 6,
    maxGainPoints: 7,
    maxLosingPoints: 5,
    hiringThreshold: 70,
  },
  hard: {
    maxSteps: 8,
    maxGainPoints: 5,
    maxLosingPoints: 7,
    hiringThreshold: 70,
  },
  ultraHard: {
    maxSteps: 10,
    maxGainPoints: 3,
    maxLosingPoints: 9,
    hiringThreshold: 62,
  },
};

// Create the context
const GameContext = createContext();

// Create a custom hook to use the context
export const useGame = () => {
  return useContext(GameContext);
};

// Create a provider component
export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(initialGameState);
  const [currentStepData, setCurrentStepData] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameLog, setGameLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [conclusion, setConclusion] = useState("");
  const [backLogMessages, setBackLogMessages] = useState([]);

  const [playerDifficultySettings, setPlayerDifficultySettings] = useState(difficultySettings.medium)

  // Functions to update game state and other relevant data
  const updateGameState = (newState) => {
    setGameState((prevGameState) => ({ ...prevGameState, ...newState }));
  };

  const updateCurrentStepData = (data) => {
    setCurrentStepData(data);
  };

  const updateUserInput = (input) => {
    setUserInput(input);
  };

  const updateLoading = (value) => {
    setLoading(value);
  };

  const updateError = (message) => {
    setError(message);
  };

  const addGameLogEntry = (entry) => {
    setGameLog((prevLog) => [...prevLog, entry]);
  };

  const addBackLogMessage = (message) => {
    setBackLogMessages((prevMessages) => [...prevMessages, message]);
  }

  const setGameOverState = (value) => {
    setGameOver(value);
  };

  const setConclusionText = (text) => {
    setConclusion(text);
  };


  const resetGame = () => {
    setGameState(initialGameState);
    setCurrentStepData(null);
    setUserInput("");
    setLoading(false);
    setError(null);
    setGameLog([]);
    setGameOver(false);
    setConclusion("");
    setPlayerDifficultySettings(difficultySettings.medium)
  };

  const value = {
    gameState,
    setGameState: updateGameState,
    currentStepData,
    setCurrentStepData: updateCurrentStepData,
    userInput,
    setUserInput: updateUserInput,
    loading,
    setLoading: updateLoading,
    error,
    setError: updateError,
    gameLog,
    addGameLogEntry,
    gameOver,
    setGameOver: setGameOverState,
    conclusion,
    setConclusion: setConclusionText,
    resetGame,
    playerDifficultySettings,
    setPlayerDifficultySettings,
    backLogMessages,
    setBackLogMessages,
    addBackLogMessage,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export { GameContext, initialGameState, difficultySettings };