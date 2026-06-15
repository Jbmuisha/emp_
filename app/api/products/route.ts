import {NextResponse} from "next/server";
import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL as string;

const ProductSchema = new mongoose.Schema({
    productName: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String, enum:["Electronic","Clothes","Books","Home","Other"],default:"Other"},
    stockQuantity: {type: Number, required: true}
}, {timestamps: true});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function connectToDatabase() {
    console.log("MongoDB URL:", MONGO_URL ? "defined" : "UNDEFINED!");
    if (!MONGO_URL) {
        const errMsg = "MONGO_URL is not defined in environment variables. Please add MONGO_URL to .env.local";
        console.error(errMsg);
        throw new Error(errMsg);
    }
    try {
        if (mongoose.connection.readyState === 0) {
            console.log("Connecting to MongoDB...");
            await mongoose.connect(MONGO_URL);
            console.log("Connected to MongoDB");
        } else {
            console.log("Already connected to MongoDB, state:", mongoose.connection.readyState);
        }
    } catch (dbError) {
        console.error("Database connection error:", dbError);
        throw dbError;
    }
}
export async function GET() {
    await connectToDatabase();
    const products= await Product.find();
    
    if (!products || products.length === 0) {
        return NextResponse.json({message:"No products found"}, {status:404});
    }
    return NextResponse.json(products);

}
export async function POST(request: Request) {
    await connectToDatabase();
    const body = await request.json();
    console.log("POST body received:", body);
    const {productName, description, price, category, stockQuantity} = body;

    if (!productName || !description || !price || !category || !stockQuantity) {
        return NextResponse.json({error: "Missing required fields"}, {status:400});
    }

    try {
        console.log("Creating product with:", {productName, description, price: Number(price), category, stockQuantity: Number(stockQuantity)});
        const product = await Product.create({
            productName,
            description,
            price: Number(price),
            category,
            stockQuantity: Number(stockQuantity)
        });
        console.log("Product created:", product);
        return NextResponse.json(product, {status:201});
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({error: "Error creating product: " + (error as Error).message}, {status:500});
    }

}
