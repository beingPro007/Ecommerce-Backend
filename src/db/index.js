import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// 2 things db in another continent and db takes time
// therfore async await is must

const connectDB = async() => {
    try {
        const mongoDBconnection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Mongo DB connected Succesfully with DB Host : ${mongoDBconnection.connection.host}`);
    } catch (error) {
        console.log("Connection Error", error);
        process.exit(1);
    }
}

export default connectDB;