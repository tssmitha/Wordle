import mongoose from "mongoose";
import Word from "../models/Word.js";

// 1. Connect to DB
const MONGO_URI = 'mongodb://127.0.0.1:27017/wordle_2';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// 2. Words to insert
const words = [
  { word: "apple", length: 5 },
  { word: "grape", length: 5 },
  { word: "mango", length: 5 },
  { word: "chair", length: 5 },
  { word: "flame", length: 5 },
  { word: "brick", length: 5 }
];

try {
  // 3. Clear old data (optional)
  await Word.deleteMany({});

  // 4. Insert new data
  await Word.insertMany(words);

  console.log("Inserted words successfully!");
} catch (err) {
  console.error("Error inserting words:", err);
}

// 5. Close connection
await mongoose.connection.close();
process.exit();
