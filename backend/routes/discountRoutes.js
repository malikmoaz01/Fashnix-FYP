import express from 'express';
import {
  getAllDiscounts,
  searchDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  updateDiscountStatus,
  validateDiscount,
  incrementUsageCount
} from '../controllers/discountController.js';

const router = express.Router();

router.get('/', getAllDiscounts);
router.get('/search', searchDiscounts);
router.get('/:id', getDiscountById);
router.post('/', createDiscount);
router.put('/:id', updateDiscount);
router.delete('/:id', deleteDiscount);
router.put('/:id/status', updateDiscountStatus);
router.post('/validate', validateDiscount);
router.post('/use/:code', incrementUsageCount);

export default router;
