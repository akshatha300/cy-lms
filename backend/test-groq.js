import fetch from "node-fetch";

const testGroq = async () => {
  try {
    console.log("Testing Groq API...");
    console.log("API Key:", process.env.GROQ_API_KEY?.substring(0, 10) + "...");
    
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant."
            },
            {
              role: "user",
              content: "Hello, can you respond with just 'API test successful'?"
            }
          ],
          temperature: 0.4,
        }),
      }
    );

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error response:", errText);
      return;
    }

    const data = await response.json();
    console.log("Success response:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
};

testGroq();
