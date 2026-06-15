const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String,
         enum: ["Electronics",
             "Clothing", 
             "Books", 
             "Home",
            "Other"], 
        default: "Electronics",
        required: true },
    stockQuantity: { type: Number, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;