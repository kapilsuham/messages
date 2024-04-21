import {NextAuthOptions} from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";


export const authOptions:NextAuthOptions={
    providers: [
        CredentialsProvider({
            id: "credentials",          
            name: "Credentials",      
            credentials: {
                email: { label: "email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
              },   
              async authorize(credentials:any):Promise<any> {
                await dbConnect()
                try {
                    const user=await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {userName:credentials.identifier}
                        ]
                    })
                    if (!user) {
                        throw new Error("no user found with this email")
                    }
                    if (!user.isVerified) {
                        throw new Error("user is not verified")
                    }
                    const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
                    if (isPasswordCorrect) {
                        return user
                    }
                    else{
                        throw new Error("invalid Password")
                    }
                } catch (error:any) {
                    throw new Error(error)
                    
                }
              }

})],
    callbacks: {
        async jwt({ token, user}) {
            if (user) {
                token._id=user._id?.toString()
                token.isVerified=user.isVerified
                token.isAcceptingMessages=user.isAcceptingMessages
                token.userName=user.userName
            }
            return token
            
        },
        async session({ session, token }) {
            if (token) {
                session.user._id= token._id
                session.user.isVerified= token.isVerified
                session.user.isAcceptingMessages= token.isAcceptingMessages
                session.user.userName= token.userName
            }
            return session
        
       
        }
    },
    pages:{
        signIn: "/sign-in"
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}
