import Game from "../models/Game.js";
import Word from "../models/Word.js";

export  const startGame = async(req,res) =>{
    try{
        const userId = req.user.userId;
        console.log("Starting game for user:", userId);
        const randomWord = await Word.aggregate([{$sample : {size:1}}]);
        console.log("Picked word:", randomWord[0].word);
        const game = await Game.create({
            user: userId,
            word: randomWord[0].word,
            attempts: [],
            maxAttempts: 6,
            status: "in-progress",
            score: 0
        });

        res.status(201).json({
            message: "Game started successfully",
            gameId : game._id,
            wordLength : game.word.length
        });
    }catch(err){
        console.log("Error starting the game",err);
        return res.status(400).json({error : "Error starting the game"});
    }
}

export const makeGuess = async (req, res) => {
    try {
        const { guess } = req.body;
        if (!guess) return res.status(400).json({ error: "No guess provided" });

        const game = await Game.findOne({ user: req.user.userId, status: "in-progress" });
        if (!game) return res.status(400).json({ error: "No active game found" });

        const result = WordComparer(game.word, guess);
        game.attempts.push({ guess, result });

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
