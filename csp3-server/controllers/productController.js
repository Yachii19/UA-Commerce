const Product = require("../models/Product");

// Utility function for error handling
const handleError = (res, err, message = 'Error in operation') => {
    console.error(err);
    return res.status(500).send({ 
        error: message, 
        details: err.message 
    });
};

// Get all products
module.exports.getAll = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (err) {
        handleError(res, err, 'Error fetching products');
    }
};

// Get all active products
module.exports.getAllActive = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true });
        res.status(200).send(products);
    } catch (err) {
        handleError(res, err, 'Error fetching active products');
    }
};

// Add a new product
module.exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        
        const newProduct = new Product({
            name,
            description,
            price,
            imageUrl: imageUrl || 'https://via.placeholder.com/150'
        });

        const savedProduct = await newProduct.save();
        res.status(201).send(savedProduct);
    } catch (err) {
        handleError(res, err, 'Error creating product');
    }
};

// Get a single product
module.exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.status(200).send(product);
    } catch (err) {
        handleError(res, err, 'Error fetching product');
    }
};

// Update a product
module.exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            { 
                name, 
                description, 
                price, 
                imageUrl,
                updatedOn: new Date() 
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }

        res.status(200).send({ 
            message: 'Product updated successfully', 
            product: updatedProduct 
        });
    } catch (err) {
        handleError(res, err, 'Error updating product');
    }
};

// Archive a product
module.exports.archiveProduct = async (req, res) => {
    try {
        const archivedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            { 
                isActive: false,
                updatedOn: new Date() 
            },
            { new: true }
        );

        if (!archivedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }

        res.status(200).send({ 
            message: 'Product archived successfully', 
            product: archivedProduct 
        });
    } catch (err) {
        handleError(res, err, 'Error archiving product');
    }
};

// Activate a product
module.exports.activateProduct = async (req, res) => {
    try {
        const activatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            { 
                isActive: true,
                updatedOn: new Date() 
            },
            { new: true }
        );

        if (!activatedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }

        res.status(200).send({ 
            message: 'Product activated successfully', 
            product: activatedProduct 
        });
    } catch (err) {
        handleError(res, err, 'Error activating product');
    }
};

// Search products by name
module.exports.searchByProductName = async (req, res) => {
    try {
        const searchName = req.body.name;
        const regex = new RegExp(searchName, 'i');
        
        const products = await Product.find({ name: regex });
        res.status(200).send(products);
    } catch (err) {
        handleError(res, err, 'Error searching products');
    }
};

// Search products by price range
module.exports.searchByProductPrice = async (req, res) => {
    try {
        const { minPrice = 0, maxPrice = Number.MAX_SAFE_INTEGER } = req.body;
        
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });
        
        res.status(200).send({ products });
    } catch (err) {
        handleError(res, err, 'Error searching products by price');
    }
};