const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err.message);
    res.status(500).json({ message: 'Server error retrieving products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Get product error:', err.message);
    res.status(500).json({ message: 'Server error retrieving product' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Name, price, and stock are required' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      image_url: image_url || undefined,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err.message);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name !== undefined ? name : product.name,
        description: description !== undefined ? description : product.description,
        price: price !== undefined ? price : product.price,
        stock: stock !== undefined ? stock : product.stock,
        image_url: image_url !== undefined ? image_url : product.image_url,
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    console.error('Update product error:', err.message);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err.message);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};
