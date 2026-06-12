import express from "express";
// import UserModel from "./models/user.js";
// import path from "path";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import connectDB from "./utils/db.js";
import cors from "cors";
import aqiRoutes from "./routes/aqiRoutes.js";
import authRoute from "./routes/auth_routes.js";
const app = express();
import predictRouter from "./routes/predictionRoutes.js";
// Your app setup continues here...

const PORT = 5001;


// Middleware for parsing request body
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
    credentials: true, // If you're using cookies or sessions
}));


// Serve static files
app.use("/", authRoute);;


// Connect to the database and start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
});

app.use('/api/aqi', aqiRoutes);
app.use('/predict', predictRouter);