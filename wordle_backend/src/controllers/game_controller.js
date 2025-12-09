import {Word} from '../models/Word.js';

export async function WordPicker(){
    const count = await Word.countDocuments();
    const index  = Math.floor(Math.random() * count);

    //skips first index indicies
    const word = await Word.findOne().skip(index);
    return word;
}
