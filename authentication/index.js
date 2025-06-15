import express from "express"
import { connectDB } from "./db/client"
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

app = express();

app.use("/auth", authRoutes);

async function startServer() {
    try {
        await connectDB;

        app.listen(process.env.PORT, () => {
            console.log(`Authentication server running on ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("Cannot connect to database");
        process.exit(1);
    }
}

startServer();