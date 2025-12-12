import e from "express";
import Game from "../models/Game.js";
import User from "../models/User.js";
import Word from "../models/Word.js";
import { WordComparer } from "../services/word_services.js";

export const startGame = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get played words
    const user = await User.findById(userId).select("playedWords");
    const playedWordIds = user.playedWords.map(pw => pw.wordId);

    console.log("Played word IDs:", playedWordIds);

    // Check existing active game
    const gameExists = await Game.findOne({
      user: userId,
      status: "in-progress"
    });

    if (gameExists) {
        console.log("Active game already exists for user:", userId);
        await Game.deleteOne({ _id: gameExists._id });
      return res.status(400).json({ error: "A game is already in progress" });
    }

    // Pick a new, unplayed random word
    const randomWord = await Word.aggregate([
      { $match: { _id: { $nin: playedWordIds } } },
      { $sample: { size: 1 } }
    ]);

    console.log("Randomly selected word:", randomWord);

    if (randomWord.length === 0) {
      return res.status(400).json({
        message: "You have played all words!"
      });
    }


    // Create new game
    const game = await Game.create({
      user: userId,
      word: randomWord[0].word,
      attempts: [],
      maxAttempts: 6,
      status: "in-progress",
      score: 0
    });

    return res.status(201).json({
      message: "Game started successfully",
      gameId: game._id,
      wordLength: game.word.length
    });

  } catch (err) {
    console.log("Error starting the game", err);
    return res.status(500).json({ error: "Error starting the game" });
  }
};


export const makeGuess = async (req, res) => {
    try {
        const { guess } = req.body;
        if (!guess) return res.status(400).json({ error: "No guess provided" });

        const game = await Game.findOne({ user: req.user.userId, status: "in-progress" });
        if (!game) return res.status(400).json({ error: "No active game found" });

        const result = WordComparer(game.word, guess);
        game.attempts.push({ guess, result });

        let nextGame = null;

        if (guess === game.word) {
            game.status = "won";
            game.score = 1;
        } else if (game.attempts.length >= game.maxAttempts) {
            game.status = "lost";
        }

        await game.save();

        res.json({
            result,
            attemptsLeft: game.maxAttempts - game.attempts.length,
            status: game.status
        });
    } catch (err) {
        console.error("Error in makeGuess controller:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
