import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbConnection.js";
import authRoutes from './routes/authRoute.js';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
connectDB();

app.get('/', (req, res) =>{
    res.send('Welcome to the API!');
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});