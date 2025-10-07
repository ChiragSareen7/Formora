import express from 'express';
import { spawn } from 'child_process';
import mongoose from 'mongoose';
import Feedback from '../models/feedback.js';
import User from "../models/userModel.js"; 
import bcrypt from "bcryptjs";
import Summary from '../models/aisummary.js';
import Form from '../models/formTemplate.model.js';
import InputData from "../models/inputmodel.js"; 
import CrossFormAnalysisSummary from '../models/CrossFormAnalysisSummary.js';
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
        const pythonProcess = spawn("python3", ["try.py", JSON.stringify(inputData)]);

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
        const pythonProcess = spawn('python3', ['strategy.py', inputString]);

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

export default routes;