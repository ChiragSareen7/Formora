import express from 'express';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import mongoose from 'mongoose';
import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import Feedback from '../models/feedback.js';
import User from "../models/userModel.js"; 
import bcrypt from "bcryptjs";
import Summary from '../models/aisummary.js';
import Form from '../models/formTemplate.model.js';
import InputData from "../models/inputmodel.js"; 
import CrossFormAnalysisSummary from '../models/CrossFormAnalysisSummary.js';
import { AIForm, FormSubmission } from '../models/aiForm.model.js';
import jwt from "jsonwebtoken";

const routes = express.Router();

routes.post("/signup", async (req, res) => {
    try {
      const { name, email, username, dob, gender, password } = req.body;
  
      if (!name || !email || !username || !dob || !gender || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === email ? "Email already in use." : "Username already taken.",
        });
      }
  
      const newUser = new User({ name, email, username, dob, gender, password });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Signup Error:", error);
  
      // Handle duplicate key error explicitly
      if (error.code === 11000) {
        const key = Object.keys(error.keyPattern)[0]; // Get which field caused the duplication
        return res.status(400).json({
          message: `${key === "email" ? "Email" : "Username"} already exists.`,
        });
      }
  
      res.status(500).json({ message: "Error registering user", error: error.message || error });
    }
  });

  routes.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
  
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Error logging in", error: error.message || error });
    }
  });
  


// 📌 Route to store feedback & generate AI summary
routes.post("/generate-summary", async (req, res) => {
    const inputData = req.body;

    if (!inputData || !Array.isArray(inputData.questions) || inputData.questions.length === 0) {
        return res.status(400).json({ error: "Invalid input data. Provide an array of questions and answers." });
    }

    let outputData = "";
    let errorData = "";

    try {
        // Step 1: Save the input data first
        const newInput = new InputData({ questions: inputData.questions });
        await newInput.save();

        // Step 2: Run the Python script
        const pythonProcess = spawn("python3", ["try.py", JSON.stringify(inputData)], {
          env: { ...process.env }
        });

        pythonProcess.stdout.on("data", (data) => {
            outputData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            errorData += data.toString();
        });

        pythonProcess.on("close", async (code) => {
            if (errorData) {
                console.error("Python Error:", errorData);
                return res.status(500).json({ error: "Python script error", details: errorData });
            }

            try {
                const jsonResponse = JSON.parse(outputData);

                // Step 3: Save the AI-generated summary and link it to the input data
                const newSummary = new Summary({ summary: jsonResponse, inputId: newInput._id });
                await newSummary.save();

                res.json({ 
                    message: "Feedback analyzed and saved successfully", 
                    summary: jsonResponse, 
                    inputId: newInput._id 
                });

            } catch (error) {
                console.error("JSON Parse Error:", error.message);
                res.status(500).json({ error: "Invalid JSON from Python script", details: outputData });
            }
        });
    } catch (err) {
        console.error("Unexpected Error:", err.message);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});
routes.get("/get-summaries", async (req, res) => {
    try {
        const latestSummary = await Summary.findOne().sort({ createdAt: -1 }); // ❌ Removed .populate("inputId")

        if (!latestSummary) {
            return res.status(404).json({ error: "No summaries found" });
        }

        res.json(latestSummary);
    } catch (error) {
        console.error("Error retrieving summary:", error);
        res.status(500).json({ error: "Error retrieving summary", details: error.message });
    }
});




routes.get('/analyze-cross-feedback', async (req, res) => {
    try {
        // Fetch the latest input data
        const inputData = await InputData.find().sort({ createdAt: -1 }).limit(2);
        console.log("Fetched inputData:", inputData);

        if (!inputData || inputData.length < 2) {
            return res.status(400).json({ error: 'Not enough input data for analysis' });
        }

        let outputData = '';
        let errorData = '';

        // Pass input data to the Python script
        const inputString = JSON.stringify(inputData).replace(/[\u2028\u2029]/g, '');
        const venvPython = join(__dirname, '..', 'venv', 'bin', 'python3');
        const pythonExecutable = existsSync(venvPython) ? venvPython : "python3";
        const pythonProcess = spawn(pythonExecutable, ['strategy.py', inputString], {
          env: { ...process.env },
          cwd: join(__dirname, '..')
        });

        pythonProcess.stdout.on('data', (data) => {
            outputData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            if (errorData) {
                console.error('Python Error:', errorData);
                return res.status(500).json({ error: 'Python script error', details: errorData });
            }

            if (!outputData.trim()) {
                return res.status(500).json({ error: 'No response from Python script' });
            }

            try {
                const jsonStart = outputData.indexOf('{');
                const jsonEnd = outputData.lastIndexOf('}');
                const jsonResponse = JSON.parse(outputData.slice(jsonStart, jsonEnd + 1));

                if (!jsonResponse.summary) {
                    return res.status(500).json({ error: 'Summary key missing in AI response', details: jsonResponse });
                }

                // Save only the summary object in the model
                const newSummary = new CrossFormAnalysisSummary({
                    summary: jsonResponse.summary
                });

                await newSummary.save();

                res.json({
                    message: 'Cross-feedback analysis completed',
                    newSummary: jsonResponse.summary,
                });
            } catch (error) {
                console.error('JSON Parse Error:', error.message);
                res.status(500).json({ error: 'Invalid JSON from Python script', details: outputData });
            }
        });
    } catch (err) {
        console.error('Unexpected Error:', err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});


// routes.get('/analyze-cross-feedback', async (req, res) => {
//     try {
//         const feedbackForms = await Feedback.find().sort({ createdAt: -1 });

//         if (!feedbackForms || feedbackForms.length < 2) {
//             return res.status(400).json({ error: 'Not enough feedback forms for comparative analysis' });
//         }

//         let outputData = '';
//         let errorData = '';

//         const pythonProcess = spawn('python3', ['strategy.py', JSON.stringify(feedbackForms)]);

//         pythonProcess.stdout.on('data', (data) => {
//             outputData += data.toString();
//         });

//         pythonProcess.stderr.on('data', (data) => {
//             errorData += data.toString();
//         });

//         pythonProcess.on('close', (code) => {
//             if (errorData) {
//                 console.error('Python Error:', errorData);
//                 return res.status(500).json({ error: 'Python script error', details: errorData });
//             }

//             if (!outputData.trim()) {
//                 return res.status(500).json({ error: 'No response from Python script' });
//             }

//             try {
//                 const jsonStart = outputData.indexOf('{');
//                 const jsonEnd = outputData.lastIndexOf('}');
//                 const jsonResponse = JSON.parse(outputData.slice(jsonStart, jsonEnd + 1));

//                 res.json({ message: 'Cross-feedback analysis completed', strategy: jsonResponse });
//             } catch (error) {
//                 console.error('JSON Parse Error:', error.message);
//                 res.status(500).json({ error: 'Invalid JSON from Python script', details: outputData });
//             }
//         });
//     } catch (err) {
//         console.error('Unexpected Error:', err.message);
//         res.status(500).json({ error: 'Server error', details: err.message });
//     }
// });

routes.get('/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 }); 
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving feedback' });
    }
});
routes.get("/get-inputs", async (req, res) => {
    try {
        const inputs = await InputData.find().sort({ createdAt: -1 });
        res.json(inputs);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving input data" });
    }
});

// Create a new form
routes.post("/forms", async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json({ success: true, message: "Form created successfully", form });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all forms
routes.get("/forms", async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json({ success: true, forms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get a specific form by ID
routes.get("/forms/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }
    res.status(200).json({ success: true, form });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a form by ID
routes.put("/forms/:id", async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }
    res.status(200).json({ success: true, message: "Form updated successfully", form });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete a form by ID
routes.delete("/forms/:id", async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }
    res.status(200).json({ success: true, message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== AI Form Generation Endpoints ====================

// Generate AI form from business description
routes.post("/ai-forms/generate", async (req, res) => {
  try {
    const { businessDescription } = req.body;

    if (!businessDescription || !businessDescription.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Business description is required" 
      });
    }

    let outputData = "";
    let errorData = "";

    // Call Python script to generate form
    const scriptPath = join(__dirname, '..', 'generateForm.py');
    
    // Verify script exists
    if (!existsSync(scriptPath)) {
      return res.status(500).json({ 
        success: false, 
        error: "Python script not found",
        details: `Script path: ${scriptPath}`
      });
    }

    console.log("Executing Python script:", scriptPath);
    console.log("Business description:", businessDescription);
    console.log("GROQ_API exists:", !!process.env.GROQ_API);

    // Use Python from virtual environment if it exists, otherwise use system python3
    const venvPython = join(__dirname, '..', 'venv', 'bin', 'python3');
    const pythonExecutable = existsSync(venvPython) ? venvPython : "python3";

    const pythonProcess = spawn(pythonExecutable, [scriptPath, businessDescription], {
      env: { ...process.env },
      cwd: join(__dirname, '..')
    });

    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", async (code) => {
      // Log for debugging
      console.log("Python process exited with code:", code);
      console.log("Output data:", outputData);
      console.log("Error data:", errorData);

      if (errorData) {
        console.error("Python Error:", errorData);
        return res.status(500).json({ 
          success: false, 
          error: "AI form generation failed", 
          details: errorData,
          exitCode: code
        });
      }

      if (!outputData || !outputData.trim()) {
        console.error("No output from Python script");
        return res.status(500).json({ 
          success: false, 
          error: "No response from AI service",
          details: "Python script returned no output"
        });
      }

      try {
        const jsonResponse = JSON.parse(outputData);

        if (jsonResponse.error) {
          return res.status(500).json({ 
            success: false, 
            error: jsonResponse.error,
            details: jsonResponse
          });
        }

        // Generate unique formId and ensure it doesn't exist
        let formId;
        let attempts = 0;
        do {
          formId = `ai_${randomBytes(8).toString('hex')}`;
          const existing = await AIForm.findOne({ formId });
          if (!existing) break;
          attempts++;
          if (attempts > 10) {
            return res.status(500).json({ 
              success: false, 
              error: "Failed to generate unique form ID"
            });
          }
        } while (true);

        // Create AI form document
        const aiForm = new AIForm({
          formId: formId,
          businessDescription: businessDescription,
          title: jsonResponse.title || "AI Generated Form",
          description: jsonResponse.description || "",
          initialQuestions: jsonResponse.questions.map((q, index) => {
            // Handle options - can be array or object (for rating type)
            let options = [];
            if (Array.isArray(q.options)) {
              options = q.options;
            } else if (q.options && typeof q.options === 'object') {
              // For rating type with min/max, store as array of strings representing the range
              if (q.inputType === 'rating' && q.options.min && q.options.max) {
                options = Array.from({ length: q.options.max - q.options.min + 1 }, 
                  (_, i) => String(q.options.min + i));
              }
            }
            
            return {
              questionId: q.questionId,
              question: q.question,
              inputType: q.inputType,
              options: options,
              required: q.required !== undefined ? q.required : true,
              placeholder: q.placeholder || "",
              order: q.order || index + 1,
              isFollowUp: false
            };
          })
        });

        try {
          await aiForm.save();
          console.log("✅ AI Form saved successfully with formId:", formId);
        } catch (saveError) {
          console.error("Error saving AI form:", saveError);
          return res.status(500).json({ 
            success: false, 
            error: "Failed to save form to database",
            details: saveError.message,
            stack: process.env.NODE_ENV === 'development' ? saveError.stack : undefined
          });
        }

        res.status(201).json({
          success: true,
          message: "AI form generated successfully",
          form: aiForm
        });

      } catch (error) {
        console.error("JSON Parse Error:", error.message);
        console.error("Output:", outputData);
        res.status(500).json({ 
          success: false, 
          error: "Invalid response from AI", 
          details: outputData 
        });
      }
    });

  } catch (error) {
    console.error("Error generating AI form:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
});

// Get AI form by formId
routes.get("/ai-forms/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await AIForm.findOne({ formId });

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: "AI form not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      form 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get all AI forms
routes.get("/ai-forms", async (req, res) => {
  try {
    const forms = await AIForm.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      forms 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Generate follow-up questions based on user response
routes.post("/ai-forms/:formId/followup", async (req, res) => {
  try {
    const { formId } = req.params;
    const { questionId, answer, allResponses } = req.body;

    if (!questionId || answer === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "questionId and answer are required" 
      });
    }

    // Get the form and find the question
    const form = await AIForm.findOne({ formId });
    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: "Form not found" 
      });
    }

    const question = form.initialQuestions.find(q => q.questionId === questionId);
    if (!question) {
      return res.status(404).json({ 
        success: false, 
        message: "Question not found" 
      });
    }

    let outputData = "";
    let errorData = "";

    // Prepare input for Python script
    const inputData = {
      question: {
        questionId: question.questionId,
        question: question.question,
        inputType: question.inputType,
        options: question.options
      },
      answer: answer,
      allResponses: allResponses || []
    };

    const scriptPath = join(__dirname, '..', 'generateFollowUp.py');
    // Use Python from virtual environment if it exists
    const venvPython = join(__dirname, '..', 'venv', 'bin', 'python3');
    const pythonExecutable = existsSync(venvPython) ? venvPython : "python3";
    
    const pythonProcess = spawn(pythonExecutable, [
      scriptPath, 
      JSON.stringify(inputData)
    ], {
      env: { ...process.env },
      cwd: join(__dirname, '..')
    });

    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", async (code) => {
      if (errorData) {
        console.error("Python Error:", errorData);
        return res.status(500).json({ 
          success: false, 
          error: "Follow-up generation failed", 
          details: errorData 
        });
      }

      try {
        const jsonResponse = JSON.parse(outputData);

        if (jsonResponse.error) {
          return res.status(500).json({ 
            success: false, 
            error: jsonResponse.error 
          });
        }

        // Update form with follow-up questions
        const followUpQuestions = jsonResponse.followUpQuestions.map((q, index) => ({
          questionId: `${questionId}_f${index + 1}`,
          question: q.question,
          inputType: q.inputType,
          options: q.options || [],
          required: q.required !== undefined ? q.required : false,
          placeholder: q.placeholder || "",
          parentQuestionId: questionId,
          triggerAnswer: answer,
          order: q.order || 1000 + index + 1,
          isFollowUp: true
        }));

        // Add follow-up questions to form
        form.initialQuestions.push(...followUpQuestions);
        form.updatedAt = new Date();
        await form.save();

        res.status(200).json({
          success: true,
          message: "Follow-up questions generated",
          followUpQuestions: followUpQuestions
        });

      } catch (error) {
        console.error("JSON Parse Error:", error.message);
        console.error("Output:", outputData);
        res.status(500).json({ 
          success: false, 
          error: "Invalid response from AI", 
          details: outputData 
        });
      }
    });

  } catch (error) {
    console.error("Error generating follow-up:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
});

// Submit form responses
routes.post("/ai-forms/:formId/submit", async (req, res) => {
  try {
    const { formId } = req.params;
    const { responses } = req.body;

    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ 
        success: false, 
        message: "Responses array is required" 
      });
    }

    const submission = new FormSubmission({
      formId: formId,
      responses: responses.map(r => ({
        questionId: r.questionId,
        answer: r.answer
      }))
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: "Form submitted successfully",
      submission: submission
    });

  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
});

// Get form submissions/reports
routes.get("/ai-forms/:formId/submissions", async (req, res) => {
  try {
    const { formId } = req.params;
    const { aiReport } = req.query; // Optional query parameter to generate AI report
    
    const form = await AIForm.findOne({ formId });
    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: "Form not found" 
      });
    }

    const submissions = await FormSubmission.find({ formId }).sort({ completedAt: -1 });
    
    // Calculate analytics
    const totalSubmissions = submissions.length;
    const questionAnalytics = {};
    
    form.initialQuestions.forEach(question => {
      if (!question.isFollowUp) {
        questionAnalytics[question.questionId] = {
          question: question.question,
          inputType: question.inputType,
          responses: [],
          options: question.options || []
        };
      }
    });

    submissions.forEach(submission => {
      submission.responses.forEach(response => {
        if (questionAnalytics[response.questionId]) {
          questionAnalytics[response.questionId].responses.push(response.answer);
        }
      });
    });

    const responseData = {
      success: true,
      form: {
        formId: form.formId,
        title: form.title,
        description: form.description,
        createdAt: form.createdAt
      },
      analytics: {
        totalSubmissions,
        questionAnalytics
      },
      submissions
    };

    // Generate AI report if requested
    if (aiReport === 'true' && submissions.length > 0) {
      try {
        let outputData = "";
        let errorData = "";

        // Prepare data for AI report generation
        const reportData = {
          form: {
            title: form.title,
            description: form.description
          },
          submissions: submissions.map(submission => ({
            responses: submission.responses.map(r => {
              const question = form.initialQuestions.find(q => q.questionId === r.questionId);
              return {
                question: question ? question.question : '',
                answer: r.answer
              };
            })
          }))
        };

        const scriptPath = join(__dirname, '..', 'generateReport.py');
        const venvPython = join(__dirname, '..', 'venv', 'bin', 'python3');
        const pythonExecutable = existsSync(venvPython) ? venvPython : "python3";
        
        const pythonProcess = spawn(pythonExecutable, [scriptPath, JSON.stringify(reportData)], {
          env: { ...process.env },
          cwd: join(__dirname, '..')
        });

        pythonProcess.stdout.on("data", (data) => {
          outputData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
          errorData += data.toString();
        });

        await new Promise((resolve, reject) => {
          pythonProcess.on("close", (code) => {
            if (errorData) {
              console.error("Python Error:", errorData);
              // Don't fail the request if AI report fails, just log it
              resolve();
            } else {
              try {
                const jsonResponse = JSON.parse(outputData);
                responseData.aiReport = jsonResponse;
                resolve();
              } catch (error) {
                console.error("JSON Parse Error:", error.message);
                resolve(); // Don't fail the request
              }
            }
          });
        });
      } catch (error) {
        console.error("Error generating AI report:", error);
        // Don't fail the request if AI report generation fails
      }
    }

    res.status(200).json(responseData);

  } catch (error) {
    console.error("Error fetching form submissions:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
});

// Get form strategy/analysis
routes.get("/ai-forms/:formId/strategy", async (req, res) => {
  try {
    const { formId } = req.params;
    
    const form = await AIForm.findOne({ formId });
    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: "Form not found" 
      });
    }

    const submissions = await FormSubmission.find({ formId });
    
    if (submissions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No submissions yet. Strategy will be available after receiving responses.",
        strategy: null
      });
    }

    // Prepare data for strategy analysis
    const feedbackData = submissions.map(submission => ({
      responses: submission.responses.map(r => {
        const question = form.initialQuestions.find(q => q.questionId === r.questionId);
        return {
          question: question ? question.question : '',
          answer: r.answer
        };
      })
    }));

    let outputData = "";
    let errorData = "";

    const inputString = JSON.stringify(feedbackData).replace(/[\u2028\u2029]/g, '');
    const venvPython = join(__dirname, '..', 'venv', 'bin', 'python3');
    const pythonExecutable = existsSync(venvPython) ? venvPython : "python3";
    
    console.log(`Using Python executable: ${pythonExecutable}`);
    console.log(`Working directory: ${join(__dirname, '..')}`);
    console.log(`Strategy script exists: ${existsSync(join(__dirname, '..', 'strategy.py'))}`);
    console.log(`Feedback data entries: ${feedbackData.length}`);
    
    const pythonProcess = spawn(pythonExecutable, [join(__dirname, '..', 'strategy.py'), inputString], {
      env: { ...process.env },
      cwd: join(__dirname, '..')
    });

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      console.log(`Python process exited with code: ${code}`);
      console.log(`Output data length: ${outputData.length}`);
      console.log(`Error data length: ${errorData.length}`);
      
      if (errorData) {
        console.error('Python Error:', errorData);
        return res.status(500).json({ 
          success: false, 
          error: 'Strategy analysis failed', 
          details: errorData 
        });
      }

      if (!outputData.trim()) {
        console.error('No output from Python script');
        return res.status(500).json({ 
          success: false, 
          error: 'No response from strategy analysis',
          details: `Python process exited with code ${code}`
        });
      }

      // Check if output contains an error
      if (outputData.includes('"error"')) {
        try {
          const errorResponse = JSON.parse(outputData);
          console.error('Python script returned error:', errorResponse);
          return res.status(500).json({ 
            success: false, 
            error: 'Strategy analysis failed', 
            details: errorResponse.error || errorResponse
          });
        } catch (e) {
          // Continue to try parsing as normal response
        }
      }

      try {
        const jsonStart = outputData.indexOf('{');
        const jsonEnd = outputData.lastIndexOf('}');
        
        if (jsonStart === -1 || jsonEnd === -1) {
          console.error('No JSON found in output:', outputData.substring(0, 500));
          return res.status(500).json({ 
            success: false, 
            error: 'Invalid response format from strategy analysis', 
            details: outputData.substring(0, 500)
          });
        }
        
        const jsonResponse = JSON.parse(outputData.slice(jsonStart, jsonEnd + 1));
        
        // Check if response contains error
        if (jsonResponse.error) {
          console.error('JSON response contains error:', jsonResponse.error);
          return res.status(500).json({ 
            success: false, 
            error: 'Strategy analysis failed', 
            details: jsonResponse.error
          });
        }

        // Return the full jsonResponse as strategy so frontend can access strategy.summary.keyInsights
        res.status(200).json({
          success: true,
          strategy: jsonResponse,
          strategies: jsonResponse.strategies || [],
          metrics: jsonResponse.metrics || [],
          tasks: jsonResponse.tasks || [],
          form: {
            formId: form.formId,
            title: form.title,
            description: form.description
          }
        });
      } catch (error) {
        console.error('JSON Parse Error:', error.message);
        console.error('Output data (first 1000 chars):', outputData.substring(0, 1000));
        res.status(500).json({ 
          success: false, 
          error: 'Invalid response from strategy analysis', 
          details: outputData.substring(0, 1000)
        });
      }
    });

  } catch (error) {
    console.error("Error generating strategy:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
});

export default routes;