const mongoose = require('mongoose');

const snSchema = new mongoose.Schema({
    sn: {type: number, required: true}
});

module.exports = mongoose.model('SN', snSchema);