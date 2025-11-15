import mongoose from "mongoose";
const userEnquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String, 
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const userEnquiryModel = mongoose.model('UserEnquiry', userEnquirySchema);
export default userEnquiryModel;