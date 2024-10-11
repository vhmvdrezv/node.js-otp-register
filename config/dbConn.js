import mongoose from "mongoose";

export default () => {
    try {
        mongoose.connect(process.env.DB_URL);
    } catch (err) {
        console.log(err);
    }
};