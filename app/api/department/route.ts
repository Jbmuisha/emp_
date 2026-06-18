import mongoose from "mongoose";
import { NextResponse } from "next/server";

const MONGO_URL = process.env.MONGO_URL as string;

const DepatmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        enum:["HR", "Engineering", "Sales", "Marketing", "Finance", "Other"],
        default:"HR"
    },
    description: { type: String ,required:true }
},{timestamps:true})

const department = mongoose.models.department || mongoose.model("department",DepatmentSchema);


async function connectToDatabae(){
    if(mongoose.connection.readyState === 0){
        await mongoose.connect(MONGO_URL);
    }
}
export async function GET(){
    await connectToDatabae();
    const departments = await department.find();
// Always return an array (even if empty)
    return NextResponse.json(departments);

}
export async function POST(request :Request){
    await connectToDatabae();
    const body = await request.json();
    const {name, description}= body;

    if(!name || !description){
        return NextResponse.json({error: "field are missing "})
    }

    const departments = await department.create({name,description})
    return NextResponse.json(departments,{status:201});

   
}