import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import startRoutes from './routes/startRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use("/start", startRoutes)

app.get('/', (req, res) => {
  res.send("Welcome to the Assessment API");
});

async function startServer() {
  try {
    await connectDB();

    app.listen(3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });

  } catch (err) {
    console.error('Failed to start server due to DB error.');
    process.exit(1);
  }
}

startServer();

