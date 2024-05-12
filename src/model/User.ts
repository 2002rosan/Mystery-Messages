import mongoose, { Schema, Document } from "mongoose"


export interface Message extends Document{
    content: string,
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})


export interface User extends Document{
    email: string,
    userName: string,
    password: string,
    verifyCode: string,
    message: Message[],
    isVerified: boolean,
    verifyCodeExpiry: Date,
    isAcceptingMessage: boolean
}

const UserSchema: Schema<User> = new Schema({
    userName: {
        type: String,
        required: [true, "Username is required!"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address!"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    message: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel
