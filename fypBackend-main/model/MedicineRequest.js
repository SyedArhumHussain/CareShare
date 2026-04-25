const mongoose = require('mongoose');

const MedicineRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: false
  },
  // Stores recipient location coordinates as "lat,lng" if provided
  location: {
    type: String,
    default: ''
  },
  medicineName: {
    type: String,
    required: true
  },
  medicineQty: {
    type: Number,
    required: true,
    min: 1
  },
  reason: {
    type: String,
    default: ''
  },
  prescriptionUrl: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  donorContactShared: {
    type: Boolean,
    default: false
  },
  donorInfo: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true,
  versionKey: false
});

// Add a pre-save hook to update timestamps when status changes
MedicineRequestSchema.pre('save', function(next) {
  // If this is a new document, don't do anything special
  if (this.isNew) {
    return next();
  }
  
  // Check if status field is modified
  if (this.isModified('status')) {
    // Update timestamps based on new status
    if (this.status === 'approved') {
      this.approvedAt = new Date();
    } else if (this.status === 'rejected') {
      this.rejectedAt = new Date();
    }
  }
  
  next();
});

// Create a text index for better search capabilities
MedicineRequestSchema.index({ 
  medicineName: 'text', 
  name: 'text', 
  email: 'text' 
});

const MedicineRequest = mongoose.model('MedicineRequest', MedicineRequestSchema); 
module.exports = MedicineRequest; 