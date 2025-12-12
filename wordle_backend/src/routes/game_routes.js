import {WordPicker, WordComparer} from '../services/word_services.js';
import express from 'express';
import authMiddleware from '../middlewares/auth_middleware.js';
import {startGame} from '../controllers/game_controller.js';
import {makeGuess} from '../controllers/game_controller.js';

const router = express.Router();

let current_word = "";


router.post('/game-start',authMiddleware,startGame);
router.post('/guess', authMiddleware, makeGuess);

//route to pick word
router.get('/pick-word', authMiddleware,async (req, res) => {
    try {
        const Word = await WordPicker();  
        current_word = Word.word;
        res.json({ Word });
    } catch (error) {
        res.status(500).json({ error: 'Failed to pick a word' });
    }   
});

//route to accept user word
router.post('/guess',authMiddleware,async(req,res) =>{
    const { guess } = req.body;

    if(!guess){
        return res.status(400).json({error: "No guess provided"});
    }

    if(!current_word){
        return res.status(400).json({error: "No word picked!"});
    }

    const result = WordComparer( current_word, guess);

    console.log(result);
    res.json(result);
});

export default router;