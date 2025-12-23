import Game from "../models/Game.js";
import User from "../models/User.js";
import Word from "../models/Word.js";
import { WordComparer } from "../services/word_services.js";

export const startGame = async (req, res) => {
  try {
    const userId = req.user;
       console.log("User ID:", userId);
    // Get played words
    const user = await User.findById(userId).select("playedWords");

    if(!user){
        return res.status(404).json({error: "User not found"});
    }
    const playedWordIds = user.playedWords.map(pw => pw.word);
    
 
    console.log("Played word IDs:", playedWordIds);

    // Check existing active game
    const gameExists = await Game.findOne({
      user: userId,
      status: "in-progress"
    });

    if (gameExists) {
        console.log("Active game already exists for user:", userId);
      return res.status(400).json({ error: "A game is already in progress" });
    }

    // Pick a new, unplayed random word
    const randomWord = await Word.aggregate([
      { $match: { word: { $nin: playedWordIds } } },
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
        let { guess } = req.body;
        if (!guess) return res.status(400).json({ error: "No guess provided" });

        guess = guess.toLowerCase().trim();

        const validWord = await Word.exists({ word: guess });
        if (!validWord) return res.status(400).json({ error: "Invalid word guess" });

        const game = await Game.findOne({ user: req.user, status: "in-progress" });
        console.log("Game found for user:", game);
        if (!game) return res.status(400).json({ error: "No active game found" });

        const result = WordComparer(game.word, guess);
        game.attempts.push({ guess, result });

        const user = await User.findById(req.user);

        if (guess === game.word) {
            game.status = "won";
            user.currentLevel = (user.currentLevel || 0) + 1;
           // store played word
        if (!user.playedWords.some(pw => pw.word === game.word)) {
            user.playedWords.push({ word: game.word, status: game.status });
        }
        } else if (game.attempts.length >= game.maxAttempts) {
            game.status = "lost";
            // store played word
        if (!user.playedWords.some(pw => pw.word === game.word)) {
            user.playedWords.push({ word: game.word, status: game.status });
        }
        }

        await user.save();
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
