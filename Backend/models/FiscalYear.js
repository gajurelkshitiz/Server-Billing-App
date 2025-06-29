const mongoose = require('mongoose');

const fiscalYearSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide fiscal year name'],
  },
  startDate: {
    type: String,
    required: [true, 'Please provide start date'],
  },
  endDate: {
    type: String,
    required: [true, 'Please provide end date'],
  },
  status: {
    type: Boolean,
    enum: [true, false],
    default: false,
    required: [true, "Please provide status"],
  },
  superadminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Superadmin',
  },
}, { timestamps: true });

module.exports = mongoose.model('FiscalYear', fiscalYearSchema);
