const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  rating: { type: Number, default: 5.0 },
  reviews: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);