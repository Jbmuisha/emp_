import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { IProduct } from "@/app/types/product";

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
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGO_URL);
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();
    const { productName, description, price, category, stockQuantity } = body;

    const product = await Product.findByIdAndUpdate(id, { productName, description, price: Number(price), category, stockQuantity: Number(stockQuantity) }, { new: true });
    return NextResponse.json(product);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product deleted" });
}