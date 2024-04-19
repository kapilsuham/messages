import mongoose, { mongo } from "mongoose";
type ConnectionObject={isConnected?:number}
const connection:ConnectionObject={}
export default async function dbConnect():Promise<void> {
    if (connection.isConnected) {
        console.log("already connected to database");
        return
    }
    try {
        const db=await mongoose.connect(process.env.MONGODB_URI ||" ",{})
        connection.isConnected=db.connections[0].readyState
        console.log("DB connected");
        console.log(dbConnect);
    } catch (error) {
        console.log("DB connected failed",error);
        process.exit(1)
    }
}