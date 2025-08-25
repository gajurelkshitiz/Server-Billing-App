const mongoose = require("mongoose");
require("dotenv").config();


const itemConfigurationSchema = new mongoose.Schema({
    itemCode: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
    },
    group: {
        type: String,
    },
    hsCode: {
        type: Number,
    },
    unit: {
        type: String,
    },
    salesPrice: {
        type: Number,
    },
    purchasePrice: {
        type: Number,
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    adminID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        required: true,
    }
})

module.exports = mongoose.model("ItemConfiguration", itemConfigurationSchema);