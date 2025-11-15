import { createEnquiry, getAllEnquiries, getEnquiryById, updateEnquiry,deleteEnquiry } from "../controller/user-enquiry.js";
import express from 'express';
const router = express.Router();
router.post('/create', createEnquiry);
router.get('/getall', getAllEnquiries);
router.get('/getone/:id', getEnquiryById);
router.put('/update/:id', updateEnquiry);
router.delete('/remove/:id', deleteEnquiry);
export default router;