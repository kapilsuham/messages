import { Message } from "@/models/User";

export interface ApiResponse{
    sucess:boolean,
    message:string,
    isAcceptingMessage?:boolean,
    messages?:Array<Message>
}