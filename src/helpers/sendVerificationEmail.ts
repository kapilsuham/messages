import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'app | Verification code',
            react: VerificationEmail({username,otp:verifyCode}),
          });
        return {
            sucess:true,message:"verification message send"
        }
    } catch (emailError) {
        console.log("Error send verification email",emailError);
        return {
            sucess:false,message:"Failed to send message"
        }
    }
}