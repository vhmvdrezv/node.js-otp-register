import bcrypt from 'bcrypt';
import phoneValidator from "../config/joiValidation.js";
import User from "../models/User.js";
import UserVerification from "../models/UserVerification.js";

const registerUserHandler = async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status({ status: "FAILED", message: "not phone field" });
    
    // validate iranian phone numbers starts 091-092-093-099 and have 11 digits
    const { error } = phoneValidator.validate(phone);
    if (error) return res.status(400).json({ 
        status: "FAILED", 
        message: "Invalid phone number format"
    });

    // checking if there is a record with this phone 
    const userExists = await User.findOne({ phone });
    if (userExists) return res.status(400).json({ status: "FAILED", message: "There is a user with that phone number."});

    try {
        // checking if there is a recored with this phone or not and if there is its expiresAt is less than now or not
        const phoneExists = await UserVerification.findOne({ phone });
        if (phoneExists && phoneExists.expiresAt >  Date.now()) {
            return res.status(400).json({
                status: "FAILED",
                message: "An OTP has already been sent. Please use the existing OTP or wait for it to expire."
            })
        }

        // deleting every recored with this phone
        if (phoneExists) {
            await UserVerification.deleteMany({ phone });
        }

        // producing otp code
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        // hashing otp and create a record in db
        const hashedOTP = await bcrypt.hash(otp, 10);
        await UserVerification.create({
            phone,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + (1000 * 60 * 2), // expires in 2 min
        });

        // sending otp with otp sender serverice
        // ...

        console.log(otp);
        res.status(200).json({
            status: "SUCCESS",
            message: "OTP sent.",
            data: {
                phone
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
    }
};

const verifyOTPHandler = async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
        return res.status({ status: "FAILED", message: "Some fields missing" });
    }
    try {
        const userVerification = await UserVerification.findOne({ phone });
        if (!userVerification) {
            return res.status(400).json({
                status: "FAILED", 
                message: "Account recored doesn't exist or has been verified already. "
            });
        }

        const validOTP = await bcrypt.compare(otp, userVerification.otp);
        if (!validOTP) {
            return res.json({
                status: "FAILED",
                message: "Invalid code passed."
            });
        };

        await UserVerification.deleteMany({ phone });

        await User.create({
            username: phone,
            phone
        });

        res.status(200).json({
            status: "SUCCESS"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
    }    
};

const resendOTPHandler = async (req, res) => {
    const { phone } = req.body;
    try {
        const userVerification = await UserVerification.findOne({ phone });
        if (!userVerification) return res.status(400).json({ status: "FAILED", message: "No record, Try to Sign up again" });

        if (userVerification.expiresAt > Date.now()) {
            return res.status(400).json({
                status: "FAILED",
                message: "An OTP has already been sent. Please use the existing OTP or wait for it to expire."
            })
        };

        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        // hashing otp and create a record in db
        const hashedOTP = await bcrypt.hash(otp, 10);
        await UserVerification.updateOne({
            phone
        },{
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + (1000 * 60 * 2), // expires in 2 min
        });

        // sending otp with otp sender serverice
        // ...

        console.log(otp);
        res.status(200).json({
            status: "SUCCESS",
            message: "OTP sent.",
            data: { // i dont give a fuck about who you are and what you have
                phone
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err.message });
    }   
   
}

export { registerUserHandler, verifyOTPHandler, resendOTPHandler };