const { Product } = require("../models/Project");

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find().populate("category supplier");
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  const result = await Product.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Product deleted" });
};
