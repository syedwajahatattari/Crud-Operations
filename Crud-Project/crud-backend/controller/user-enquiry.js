import userEnquiryModel from "../models/user-enquiry.js";

export const createEnquiry = async (req, res) => {
    try{
        const enquiryData = new userEnquiryModel(req.body);
        await enquiryData.save();
        res.status(201).json({message: 'Enquiry submitted successfully'});
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getAllEnquiries = async (req, res) => {
    try{
        const enquiries = await userEnquiryModel.find();
        res.status(200).json(enquiries);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getEnquiryById = async (req, res) => {
    try{
        const {id} = req.params;
        const enquiry = await userEnquiryModel.findById(id);
        if (!enquiry){
            return res.status(404).json({message: 'Enquiry not found'});
        }
        res.status(200).json(enquiry);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

export const updateEnquiry = async (req, res) => {
    try { 
        const {id} = req.params;
        const userExist = await userEnquiryModel.findByIdAndUpdate(id, req.body, {new: true});
        if (!userExist){
            return res.status(404).json({message: 'Enquiry not found'});
        }
        res.status(200).json({message: 'Enquiry updated successfully'});
    }
    catch (error) {
        console.log('Error in update user:', error);
        res.status(500).json({message: error.message});
    }};

export const deleteEnquiry = async (req, res) => {
    try {
        const {id} = req.params;
        const enquiryExist = await userEnquiryModel.findByIdAndDelete(id);
        if (!enquiryExist){
            return res.status(404).json({message: 'Enquiry not found'});
        }
        res.status(200).json({message: 'Enquiry deleted successfully'});
    } catch (error) {
        console.log('Error in delete enquiry:', error);
        res.status(500).json({message: error.message});
    }
}