import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    credentials:true,
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json());
app.use(cookieParser())

//router imports
import userRoute from "./routes/user.router.js"
import productRoute from "./routes/product.routes.js"

app.use("/api/v1/users", userRoute);
app.use("/api/v1/products", productRoute);

export {app};