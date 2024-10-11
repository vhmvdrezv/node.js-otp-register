import mongoose from "mongoose";

const userVerificationSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            unique: true
        },
        otp: {
            type: String,
            required: true
        },
        createdAt: Date, 
        expiresAt: Date,
    }
);

export default mongoose.model('UserVerification', userVerificationSchema);