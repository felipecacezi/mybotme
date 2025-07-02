import express, { Request, Response } from 'express';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import companyRouter from './routes/company.route';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/company', companyRouter)

app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});
export default app;