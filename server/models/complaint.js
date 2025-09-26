// In server/models/complaint.js
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  complaintType: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Submitted' },
  submittedAt: { type: Date, default: Date.now },
  attachment: { type: String },
  reopenReason: { type: String, default: '' } // Add this line
});

module.exports = mongoose.model('Complaint', complaintSchema);