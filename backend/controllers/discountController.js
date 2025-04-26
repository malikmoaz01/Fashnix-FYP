import Discount from '../models/discountModel.js';

export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch discounts', error: error.message });
  }
};

export const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch discount', error: error.message });
  }
};

export const createDiscount = async (req, res) => {
  try {
    const existingDiscount = await Discount.findOne({ code: req.body.code.toUpperCase() });
    if (existingDiscount) {
      return res.status(400).json({ message: 'Discount code already exists' });
    }
    const newDiscount = new Discount(req.body);
    const savedDiscount = await newDiscount.save();
    res.status(201).json(savedDiscount);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create discount', error: error.message });
  }
};

export const updateDiscount = async (req, res) => {
  try {
    if (req.body.code) {
      const existingDiscount = await Discount.findOne({ 
        code: req.body.code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingDiscount) {
        return res.status(400).json({ message: 'Discount code already exists' });
      }
    }
    const updatedDiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDiscount) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    res.status(200).json(updatedDiscount);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update discount', error: error.message });
  }
};

export const deleteDiscount = async (req, res) => {
  try {
    const deletedDiscount = await Discount.findByIdAndDelete(req.params.id);
    if (!deletedDiscount) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    res.status(200).json({ message: 'Discount deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete discount', error: error.message });
  }
};

export const updateDiscountStatus = async (req, res) => {
  try {
    if (!req.body.status || !['active', 'inactive'].includes(req.body.status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const updatedDiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedDiscount) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    res.status(200).json(updatedDiscount);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update discount status', error: error.message });
  }
};

export const searchDiscounts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    const discounts = await Discount.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search discounts', error: error.message });
  }
};

export const incrementUsageCount = async (req, res) => {
  try {
    const discount = await Discount.findOne({ code: req.params.code.toUpperCase() });
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    if (discount.status !== 'active') {
      return res.status(400).json({ message: 'Discount is inactive' });
    }
    const currentDate = new Date();
    if (currentDate < discount.startDate || currentDate > discount.endDate) {
      return res.status(400).json({ message: 'Discount is not valid at this time' });
    }
    if (discount.maxUses !== null && discount.usageCount >= discount.maxUses) {
      return res.status(400).json({ message: 'Discount maximum uses reached' });
    }
    discount.usageCount += 1;
    await discount.save();
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ message: 'Failed to use discount', error: error.message });
  }
};

export const validateDiscount = async (req, res) => {
  try {
    const { code, purchaseAmount } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Discount code is required' });
    }
    const discount = await Discount.findOne({ code: code.toUpperCase() });
    if (!discount) {
      return res.status(404).json({ message: 'Invalid discount code' });
    }
    if (discount.status !== 'active') {
      return res.status(400).json({ message: 'Discount is inactive' });
    }
    const currentDate = new Date();
    if (currentDate < new Date(discount.startDate) || currentDate > new Date(discount.endDate)) {
      return res.status(400).json({ message: 'Discount is not valid at this time' });
    }
    if (discount.maxUses !== null && discount.usageCount >= discount.maxUses) {
      return res.status(400).json({ message: 'Discount maximum uses reached' });
    }
    if (purchaseAmount && discount.minPurchase > 0 && purchaseAmount < discount.minPurchase) {
      return res.status(400).json({ message: `Minimum purchase amount of ${discount.minPurchase} required to use this discount` });
    }
    let discountAmount = 0;
    if (purchaseAmount) {
      if (discount.discountType === 'percentage') {
        discountAmount = (purchaseAmount * discount.value) / 100;
      } else {
        discountAmount = discount.value;
      }
    }
    res.status(200).json({
      valid: true,
      discount,
      discountAmount: purchaseAmount ? discountAmount : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to validate discount', error: error.message });
  }
};
