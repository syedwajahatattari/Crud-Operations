import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotnev from "dotenv";
import route from './routes/user.js';
import routes from './routes/user-enquiry.js';

const app = express();
app.use(cors());
app.use(express.json());
dotnev.config();

app.use('/api', route);
app.use('/api/enquiry', routes);

const port = process.env.PORT || 5000;
const MONGODB = process.env.MONGODB_URL;

mongoose.connect(MONGODB).then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
});

//http://localhost:3000/api/create