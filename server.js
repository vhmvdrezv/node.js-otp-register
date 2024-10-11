import express from 'express';
import mongoose from 'mongoose';

import usersRouter from './routes/userRouter.js';
import connectDB from './config/dbConn.js';


const PORT = process.env.PORT;

connectDB();

const app = express();

// req.body
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello, world');
});

app.use('/users', usersRouter);

mongoose.connection.once('open', () => {
    console.log('connected to mongodb');
    app.listen(
        PORT,
        () => console.log(`Server is running on PORT ${PORT}`)
    );
});
