import express from 'express';
import cors from 'cors';

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req,res)=> {
    res.send("Welcome to wordle2.0");
})

export default app;



