import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    otp:String,
    otpExpires:Date,
    isVerified:{type:Boolean,default:false},
    refreshtoken:[
        {
            token:{type: String, required: true},
            expiresAt:{type: String, required: true},
        }
    ]

},{
    timestamps: true,
});

const UserModel = mongoose.model("users",userSchema);

export default UserModel;