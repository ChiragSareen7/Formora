import mongoose from "mongoose";
import Form from "./formModel.js";

const infoSchema = new mongoose.Schema({
    org_Info: {
        type: String,
        required: true
    },
    number_of_forms: {
        type: [Number], 
        required: true
    },
    form_Id: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: "Form",
        required: true
    },
    type_of_form: {
        type: String,
        enum: ["manual", "ai", "hybrid"],
        required: true
    },
    template_form: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Form",
        required: true
    }
});

const Info = mongoose.model("Info", infoSchema);
export default Info;
