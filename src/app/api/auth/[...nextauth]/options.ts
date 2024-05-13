import bcrypt from "bcryptjs"
import UserModel from "@/model/User"
import { NextAuthOptions } from "next-auth"
import DBConnection from "@/lib/DBConnction"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "email", placeholder: "Enter your email..."},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials:any):Promise<any>{
                await DBConnection()

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                        ]
                    })

                    if(!user){
                        throw new Error("User not found")
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your account first")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("Incorrect password")
                    }

                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],

    callbacks: {
        async jwt({token, user}){

            if(user){
                token.username = user.username;
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }

            return token
        },
        async session({session, token}){

            if(token){
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages
            }

            return session
        }
    },

    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}
