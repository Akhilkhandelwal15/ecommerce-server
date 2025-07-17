import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbConnection.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
connectDB();

app.get('/', (req, res) =>{
    res.send('Welcome to the API!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});