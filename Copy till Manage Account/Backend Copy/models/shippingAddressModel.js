
import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema({
    address: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
});

const ShippingAddress = mongoose.model('ShippingAddress', shippingAddressSchema);

export default ShippingAddress;
