import express from 'express';
import {
  addProduct,
  getProducts,
  getProductById,
  editProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// Create Product
router.post('/products', addProduct);

// Get All Products
router.get('/products', getProducts);

// Get Single Product By ID
router.get('/products/:id', getProductById);

// Edit Product
router.put('/products/:productId', editProduct);

// Delete Product
router.delete('/products/:productId', deleteProduct);

export default router;
