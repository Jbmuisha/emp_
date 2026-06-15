const Product = require("../models/products");


exports.createProduct = async (req, res) => {
    try {  
        const { name, description, price, category, stockQuantity } = req.body;
        if (!name || !description || !price || !category || !stockQuantity) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newProduct = await Product.create({ 
            name, 
            description, 
            price,
            category , 
            stockQuantity });
        res.status(201).json(newProduct);
     }catch (error) {
        res.status(500).json({ message: error.message });
    }

}
exports.getProducts = async (req, res) => {
//to get all products from the database
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}
//get product by id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//update product by id
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stockQuantity } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category, stockQuantity },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.deleteProduct = async (req, res) => {
    try{
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if(!deletedProduct){
            return res.status(404).json({message:"Product not found"});
        }
        res.json({message:"Product deleted successfully"});
    }catch(error){
        res.status(500).json({message:error.message});
    }
}