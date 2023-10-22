import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
const app = express();
app.use(cookieParser());
app.use(express.json());

import { connect } from 'mongoose';
connect(process.env.MONGO_CLIENT!).then(()=>console.log('mongoose connected'));

import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import authorRouter from './routes/authorRouter';

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/author', authorRouter);

app.listen(process.env.PORT!,()=>console.log(`Listening on on port ${process.env.PORT!}`));