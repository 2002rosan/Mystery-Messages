import { SendVerificationEmail } from "@/helper/SendVerificationEmail";
import DBConnection from "@/lib/DBConnction";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

export async function POST(req: Request){
    await DBConnection()

    try {
        const {username, email, password} = await req.json()

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, {status: 400})
        }

        const existingUserByEmail  = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){

            if(existingUserByEmail){
                if(existingUserByEmail.isVerified){
                    return Response.json(
                        {
                            success: false,
                            message: "This email is already registered"
                        },
                        {status: 500}
                    )
                }else{
                    const hashedPassword = await bcrypt.hash(password, 10);
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verifyCode;
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                    existingUserByEmail.save()
                }
            }

        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser =  new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        // Send Verification email
        const emailResponse = await SendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {status: 500}
            )
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email"
            },
            {status: 200}
        )

    } catch (error) {
        console.log("Error registering user", error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}
