const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    country_settings: { type: String, enum: ['AT', 'RU', 'BY', 'KZ'], default: 'RU' },
    tax_mode: { type: String, enum: ['AT_SVS', 'RU_NPD', 'BY_NPD'], default: 'RU_NPD' },
    timezone: { type: String, default: 'Europe/Moscow' },
    subscription_status: { type: String, enum: ['free', 'active', 'expired'], default: 'free' },
    subscription_type: { type: String },
    subscription_date_start: { type: Date },
    subscription_date_end: { type: Date },
    subscription_price: { type: Number },
    stripe_customer_id: { type: String },
    stripe_event_id: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
