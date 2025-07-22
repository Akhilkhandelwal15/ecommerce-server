import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbConnection.js";
import authRoutes from './routes/authRoute.js';
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

app.use(cors({
  origin: process.env.CORS_ORIGIN, // your frontend URL
  credentials: process.env.CORS_CREDENTIALS === 'true' // this enables cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());
connectDB();

app.get('/', (req, res) =>{
    res.send('Welcome to the API!');
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});