import fetch from "node-fetch";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama3-70b-8192"; // High performance model for code evaluation

export const evaluateSubmission = async (code, stdout) => {
  // Fallback if no API key
  if (!process.env.GROQ_API_KEY) {
    return deterministicFallback(code, stdout);
  }

  const prompt = `
You are an expert AI grader for a Machine Learning Lab (Experiment 1: Forward Feature Selection).

**Task Context:**
The student must predict student performance (e.g. 'writing score' or average) using 'StudentsPerformance.csv'.
They must use **Forward Feature Selection** to pick the best features.

**Grading Rubric (Total: 10 Marks):**
1. **Forward Selection Method (2 marks)**: Code must use 'SequentialFeatureSelector' with direction='forward' (or 'forward=True' in similar libs) OR a custom forward loop.
2. **Correct Target (2 marks)**: Target variable must be numeric (e.g. math/reading/writing score or derived).
3. **Important Features (3 marks)**: Selected features MUST include at least 2 of: ['math score', 'reading score', 'writing score'].
4. **Model Training (1 mark)**: Code must call .fit() and .predict() on a regression model.
5. **Performance (2 marks)**: R² Score must be ≥ 0.60.

**Code & Output:**
Code Given:
\`\`\`python
${code}
\`\`\`

Stdout:
\`\`\`
${stdout}
\`\`\`

**Instructions:**
Analyze the code and stdout.
Calculate the total marks based strictly on the rubric above.
Return ONLY a JSON object with this exact schema:
{
  "selected_features": ["list", "of", "features"],
  "r2_score": 0.XX,
  "feature_selection_method": "Forward" | "Other" | "None",
  "selected_important_features": true | false,
  "marks_breakdown": {
    "forward_selection": 0-2,
    "target_variable": 0-2,
    "important_features": 0-3,
    "model_training": 0-1,
    "performance": 0-2
  },
  "total_marks": 0-10, // Sum of breakdown
  "feedback": "Short constructive feedback explanation.",
  "status": "PASS" | "FAIL",
  // Legacy fields for frontend compatibility
  "accuracy": 0.XX, // same as r2_score
  "model": "String name of model",
  "marks": 0-10 // same as total_marks
}

Note:
- If R² < 0.50, status is FAIL.
- If 'selected_features' list is empty or has < 2 features, 'important_features' marks = 0.
`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a strict code evaluator. API must response with valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const resultString = data.choices[0].message.content;
    const result = JSON.parse(resultString);
    return result;

  } catch (error) {
    console.error("AI Evaluation failed:", error);
    return deterministicFallback(code, stdout);
  }
};

const deterministicFallback = (code, stdout) => {
    // Basic regex-based checking
    const hasSelection = code.includes("SequentialFeatureSelector") || code.includes("RFE") || code.includes("SelectKBest");
    
    // Extract R2
    const r2Match = stdout.match(/(?:R2|Score).*?(\d+\.\d+)/i);
    const r2_score = r2Match ? parseFloat(r2Match[1]) : 0;
    
    // Extract features (hacky regex look for list bracket)
    const featuresMatch = stdout.match(/\['.*?'\]/);
    const selected_features = featuresMatch ? featuresMatch[0].replace(/'/g, "").replace("[", "").replace("]", "").split(", ") : [];

    const meets_score_threshold = r2_score >= 0.60;
    
    let marks = 0;
    if (hasSelection && meets_score_threshold) marks = 10;
    else if (meets_score_threshold) marks = 5;

    return {
        selected_features,
        r2_score,
        passes_feature_selection: hasSelection,
        meets_score_threshold,
        total_marks: marks,
        feedback: hasSelection && meets_score_threshold ? "Great job!" : "Solution incomplete or method incorrect. (AI Offline)"
    };
};
