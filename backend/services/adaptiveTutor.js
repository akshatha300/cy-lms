import { decideNextLevel } from "./adaptiveEngine.js";

export const tutorQuestions = {
  easy: "What is phishing?",
  medium: "How does a phishing email trick users?",
  hard: "Explain technical indicators of phishing attacks."
};

export const getNextTutorStep = ({ level, userAnswer }) => {
  const correct = userAnswer.length > 10; // placeholder logic
  const nextLevel = decideNextLevel({ level, correct });

  return {
    nextLevel,
    question: tutorQuestions[nextLevel]
  };
};
