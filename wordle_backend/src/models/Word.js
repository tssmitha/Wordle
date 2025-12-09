import mongoose from "mongoose";

const wordSchema = new mongoose.Schema(
  {
    word: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, "Word must be at least 3 characters long"],
        maxlength: [10, "Word cannot exceed 10 characters"],
    },
    length: { 
        type: Number,
        required: true,
        min : 3,
        max: 10,
    },
    difficulty: {   
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },
  },
    {   
    timestamps: true, // adds createdAt and updatedAt
  }
);

wordSchema.pre('save', function (next) {
  if(this.isModified('word') || this.isNew ) {
    this.length = this.word.length;
  }
    next();
});

export const Word = mongoose.model("Word", wordSchema);