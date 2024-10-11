import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
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