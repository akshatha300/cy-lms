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

// Update question (admin)
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const { moduleId, questionText, options, correctAnswer, explanation, difficulty, type } = req.body;

    if (moduleId !== undefined) question.moduleId = moduleId;
    if (questionText !== undefined) question.questionText = questionText;
    if (options !== undefined) question.options = options;
    if (correctAnswer !== undefined) question.correctAnswer = correctAnswer;
    if (explanation !== undefined) question.explanation = explanation;
    if (difficulty !== undefined) question.difficulty = difficulty;
    if (type !== undefined) question.type = type;

    const updated = await question.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete question (admin)
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    await question.remove();
    res.json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
