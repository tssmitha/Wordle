import {WordPicker, WordComparer} from '../services/word_services.js';
import express from 'express';

const router = express.Router();

let current_word = "";

//route to pick word
router.get('/pick-word', async (req, res) => {
    try {
        const Word = await WordPicker();  
        current_word = Word.word;
        res.json({ Word });
    } catch (error) {
        res.status(500).json({ error: 'Failed to pick a word' });
    }   
});

//route to accept user word
router.post('/guess',async(req,res) =>{
    const { guess } = req.body;

    if(!guess){
        return res.status(400).json({error: "No guess provided"});
    }

    if(!current_word){
        return res.status(400).json({error: "No word picked!"});
    }

    const is_same = WordComparer( current_word, guess);

    if(is_same){
        return res.json({
        message : "Bravo!!Correct Guess",
        your_Guess : guess,
        actual_word : current_word
    });
    }

    return res.json({
        message : "Wrong guess"
    })  
});

export default router;