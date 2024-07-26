import express from 'express';
import cors from 'cors'

const app = express();

app.use(cors({
    credentials:true,
    origin: process.env.CORS_ORIGIN
}))

app.get('/register', (req, res) => {
  res.send('Hello, World!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export {app};