import {Word} from '../models/Word.js';

export async function WordPicker(){
    const count = await Word.countDocuments();
    const index  = Math.floor(Math.random() * count);

    //skips first index indicies
    const word = await Word.findOne().skip(index);
    return word;
}

export function WordComparer(actualWord, userGuess){
    console.log("Actual Word",actualWord);
    console.log("user word",userGuess);
    
    return actualWord.trim().toLowerCase() === userGuess.trim().toLowerCase();
}
