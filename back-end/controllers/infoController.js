import { asyncHandler } from "../utils/asyncHandler";
import Info from "../models/infoModel.js";
import Form from "../models/formModel.js";
import User from "../models/userModel.js";


const createInfo = asyncHandler(async (req, res) => {
    const { org_Info, number_of_forms, form_Id, type_of_form, template_form } = req.body;

    const formExists = await Form.findById(template_form);
    if (!formExists) {
        return res.status(400).json({ message: "Template form not found" });
    }

    const info = new Info({
        org_Info,
        number_of_forms,
        form_Id,
        type_of_form,
        template_form
    });

    const savedInfo = await info.save();
    res.status(201).json(savedInfo);
});

const getAllInfo = asyncHandler(async (req, res) => {
    const infoData = await Info.find()
        .populate("form_Id")
        .populate("template_form"); 

    res.json(infoData);
});


const getInfoById = asyncHandler(async (req, res) => {
    const info = await User.findById(req.params.id)
        .populate("form_Id")
        .populate("template_form");

    if (!info) {
        return res.status(404).json({ message: "Info not found" });
    }

    res.json(info);
});

const updateInfo = asyncHandler(async (req, res) => {
    const { org_Info, number_of_forms, form_Id, type_of_form, template_form } = req.body;

    const updatedInfo = await Info.findByIdAndUpdate(
        req.params.id,
        { org_Info, number_of_forms, form_Id, type_of_form, template_form },
        { new: true, runValidators: true }
    ).populate("form_Id").populate("template_form");

    if (!updatedInfo) {
        return res.status(404).json({ message: "Info not found" });
    }

    res.json(updatedInfo);
});

const deleteInfo = asyncHandler(async (req, res) => {
    const info = await Info.findById(req.params.id);

    if (!info) {
        return res.status(404).json({ message: "Info not found" });
    }

    await info.deleteOne();
    res.json({ message: "Info deleted successfully" });
});

export { createInfo, getAllInfo, getInfoById, updateInfo, deleteInfo };
