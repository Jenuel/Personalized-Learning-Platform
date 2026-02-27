import express from "express"
import { connectDB } from "./db/client"
import authRoutes from "./routes/authRoutes.js"
import dotenv from "dotenv"

dotenv.config();

const app = express();

app.use("/auth", authRoutes);

async function startServer() {
    try {
        await connectDB;

        app.listen(process.env.PORT || 4000, () => {
            console.log(`Authentication server running on ${process.env.PORT || 4000}`);
        })

    } catch (error) {
        console.error("Cannot connect to database");
        process.exit(1);
    }
}

startServer();