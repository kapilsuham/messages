import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User"
import bcrypt from "bcryptjs"
export async function POST(request:Request) {
    await dbConnect()
    try {
        const {userName,email,password}=await request.json()
        const existingUserVerifiedUsername=await UserModel.findOne({
            userName,
            isVerified:true,
        })
    if (existingUserVerifiedUsername) {
        return Response.json({
            success:true,
            message:"Username is already taken"

        },{status:500})
    }    
    const existingUserByEmail=await UserModel.findOne({email})
    const verifyCode=Math.floor(100000+Math.random()*900000).toString()
    if (existingUserByEmail) {
        if (existingUserByEmail.isVerified) {
            return Response.json(
                {
                    success:false,
                    message:"user already exist with this email"
                },
                {status:400}
            )
        }
        else{
            const hashedPassword=await bcrypt.hash(password,10)
            existingUserByEmail.password=hashedPassword
            existingUserByEmail.verifyCode=verifyCode
            existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
            await existingUserByEmail.save()
            
        }
        return Response.json({
            success:true,
            message:"email is already taken"

        },{status:500})
    } 
    else{
        const hashedPassword=await bcrypt.hash(password,10)
        const expiryDate=new Date()
        expiryDate.setHours(expiryDate.getHours()+1)

        const newUser=new UserModel({
            userName,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodeExpiry:expiryDate,
            isVerified:false,
            isAcceptingMessage:true,
            messages:[]   
        })
        await newUser.save()
        
    }
    // send verification mail
    const emailResponse=await sendVerificationEmail(
        email,
        userName,
        verifyCode
    )
    if (!emailResponse.message) {
        return Response.json(
            {success:false,
             message:emailResponse.message
            },
            {status:500}
        )}
    return Response.json(
        {success:true,
            message:"User registerd successfully, please verify your email"
        },
        {status:201})
 } catch (error) {
        console.log("Error registering User",error)
        return Response.json({
            success:false,
            message:"Error registering User"
        },{
            status:500
        })
    }
}