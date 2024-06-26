import { resend } from "@/lib/Resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/EmailVerification";

export const SendVerificationEmail = async (
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Mystery Message | Verification Code",
            react: VerificationEmail({username, otp: verifyCode})
        })

        return {success: true, message: "Verification email sent successfully"};
    } catch (error) {
        console.error("Error while sending verification email", error)
        return {success: false, message: "Failed to send verification email"};
    }
} 
