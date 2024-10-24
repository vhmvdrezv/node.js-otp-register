import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: false
    },
    username: {
        type: String, 
        required: true,
        unique: true  
    },
    phone: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String
    }
},
{
    timestamps: true
});

export default mongoose.model('User', userSchema);