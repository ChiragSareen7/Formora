import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.VITE_GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Generates a structured prompt and calls the Gemini API.
 * @param {string} businessModel - The type of business model.
 * @param {Array} questions - An array of questions related to the business model.
 * @returns {Promise<Object>} - JSON output containing refined questions and input types.
 */
async function refineQuestions(businessModel, questions) {
  try {
    // Construct a well-structured prompt for Gemini API
    const prompt = `
      You are an AI designed to refine questions based on a given business model.
      The business model is: "${businessModel}".
      The following questions are provided:
      ${questions.map((q, index) => `${index + 1}. ${q}`).join("\n")}
      
      Task:
      - If a question's answer is clear and satisfies the requirement, do nothing.
      - If an answer might be unclear, extend the question to clarify.
      - Extend at most 2 additional questions per form, only if needed.
      - Provide the output strictly in JSON format:
      {
        "questions": [
          {
            "question": "Refined question text",
            "inputType": "one of: text, email, password, number, date, textarea"
          }
        ]
      }
      
      Example:
      If the question is "How is your tech mentor doing?" and the user's answer is "Tech mentor is not doing good," this answer is not detailed enough for the business to take action. 
      In this case, AI should refine the question to: "What things do you dislike about your mentor, so that we can improve? Any constructive feedback?"
    `;

    // Call the Gemini API with the generated prompt
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return responseText;
  } catch (error) {
    console.error("Error generating refined questions:", error.message);
    return { error: "Failed to process the request. Please try again." };
  }
}

export default refineQuestions;

// Example usage
// (async () => {
//   const businessModel = "E-commerce platform";
//   const questions = [
//     "What is your preferred payment method?",
//     "How often do you shop online?"
//   ];
//
//   const refinedOutput = await refineQuestions(businessModel, questions);
//   console.log(refinedOutput);
// })();
