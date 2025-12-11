import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
    guess : {
        type : String,
        required : true,
        trim : true
    },
    result:{
        type : Object,
        required : true
    }
});

const gameSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    word:{
        type : String,
        required : true
    },
    attempts:{
        type : [attemptSchema],
        default : []
    },
    maxAttempts : {
        type: Number,
        default : 6
    },
    status :{
        type : String,
        enum : ["won","in-progress","lost"],
        default : "in-progress"
    },
    score : {
        type : Number,
        default : 0
    }
},
{timestamps : true},
);

export default mongoose.model("Game", gameSchema);