import Word from '../models/Word.js';

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
    
    const n = actualWord.length;

    if(userGuess.length != 5){
        throw new Error("Invalid guess length");
    }

    //initialising the result array to grey
    const result = new Array(n).fill('GREY');

    const frequencyMap = {};

    //counting freq of each letter
    for(let c of actualWord){
        frequencyMap[c] = (frequencyMap[c] || 0) + 1;
    }

    //finding which letters are at actual positions
    for(let i = 0; i < n;i++){
        if(actualWord[i] === userGuess[i]){
            result[i] = "GREEN";
            frequencyMap[actualWord[i]]--;
        }
    }

    //finding the letters in wrong position
    for(let i = 0; i < n;i++){
        if(result[i] == "GREEN"){
            continue;
        }

        if(frequencyMap[userGuess[i]] >= 1){
            result[i] = "YELLOW";
            frequencyMap[userGuess[i]]--;
        }
    }
    return result;
}
