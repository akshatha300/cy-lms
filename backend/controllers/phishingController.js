import { generatePhishingEmail } from "../services/phishingGenerator.js";

/**
 * POST /api/phishing/simulate
 * Body: { scenario: "bank scam" }
 */
export const createSimulation = async (req, res) => {
  try {
    const { scenario } = req.body;

    if (!scenario) {
      return res.status(400).json({ message: "Scenario is required." });
    }

    const simulation = await generatePhishingEmail(scenario);

    res.json({
      success: true,
      simulation,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
