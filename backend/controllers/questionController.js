import Question from "../models/Questions.js";


export const createQuestion = async (req, res) => {
  try {
    const newQ = await Question.create(req.body);
    res.status(201).json(newQ);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getQuestionsByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const questions = await Question.find({ moduleId });
    console.log(
      `getQuestionsByModule: moduleId=${moduleId}, count=${questions.length}`
    );
    res.json(questions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
