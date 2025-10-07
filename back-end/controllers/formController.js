import { asyncHandler } from "../utils/asyncHandler";
import Data from "../models/dataModel";

// const addForm = asyncHandler(async (req, res, next)=>{
//         const newForm = new Form(req.body);
//         await newForm.save();
    
//         res.status(201).json({
//             message: 'Form created successfully',
//             form: newForm,
//         });
// })
const getForms = asyncHandler(async (req, res) => {
    try {
        const forms = await Form.find();
        res.status(200).json(forms); 
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ error: 'Failed to fetch forms' });
    }
});

// const dataSummary = asyncHandler(async (req, res) => {
//     try {
//         const data = await Data.find();
//         if (!data || data.length === 0) {
//             return res.status(404).json({ message: "No data found" });
//         }
//         res.status(200).json(data);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });


export {
    // addForm,
    getForms,
    // dataSummary
}