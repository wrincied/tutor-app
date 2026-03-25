const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    tutor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rate_per_hour: { type: Number, required: true },
    balance_lessons: { type: Number, default: 0 },
    last_topic: { type: String },
    telegram_chat_id: { type: String },
    bot_active: { type: Boolean, default: false },
    auto_debit_enabled: { type: Boolean, default: true },
    invite_token: { type: String },
    token_expires: { type: Date },
    timezone: { type: String, default: 'Europe/Moscow' },
  },
  { timestamps: true },
);

studentSchema.index({ tutor_id: 1 });

module.exports = mongoose.model('Student', studentSchema);
