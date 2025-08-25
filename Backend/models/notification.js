const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const notificationSchema = new mongoose.Schema({
    recipientID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide the recipient ID"],
        refPath: 'recipientModel' // dynamic reference
    },
    recipientModel: { 
        type: String, 
        enum: ['user', 'admin'], 
    },
    type: {
        type: String,
        required: [true, 'Please mention the type of message'],
        default: 'info',
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: [true, "Please enter the message"],
    },
    readStatus: {
        type: Boolean,
        required: [true, "Status Can't be absent"],
        default: false,
    }
}, { timestamps: true })


module.exports = mongoose.model("notification", notificationSchema);