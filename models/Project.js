const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    benefits: [String], // e.g., ["Immunity Boost", "Stress Relief"]
    images: [String], // URLs of product images
    stock: { type: Number, default: 0, min: 0 },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    createdAt: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, min: 1 },
            priceAtPurchase: Number, // Snapshot of price at order time
        },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    paymentMethod: { type: String, enum: ["stripe", "paypal"] },
    deliveryAddress: { type: Object }, // Copy of user's address at checkout
    status: { type: String, enum: ["processing", "shipped", "delivered"], default: "processing" },
    createdAt: { type: Date, default: Date.now },
});

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1, min: 1 },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now },
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., "Herbal Teas"
    description: String,
});

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { email: String, phone: String },
    productsSupplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const promotionSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // e.g., "SUMMER20"
    discountType: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    discountValue: { type: Number, required: true }, // e.g., 20 for 20%
    validFrom: Date,
    validUntil: Date,
    maxUses: { type: Number, default: null }, // Unlimited if null
    usedCount: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

const Product = mongoose.model('Product', productSchema);

const Order = mongoose.model('Order', orderSchema);

const Cart = mongoose.model('Cart', cartSchema);

const Review = mongoose.model('Review', reviewSchema);

const Category = mongoose.model('Category', categorySchema);

const Supplier = mongoose.model('Supplier', supplierSchema);

const Promotion = mongoose.model('Promotion', promotionSchema);

// Export all models
module.exports = {
    User,
    Product,
    Order,
    Cart,
    Review,
    Category,
    Supplier,
    Promotion
};