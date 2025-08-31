const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 20,
  },
  profileImage: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please provide Email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Email Not Valid",
    ],
    unique: true,
  },
  password: {
    type: String,
    // required: [true, "Please Enter Password"],
    minLength: 5,
  },
  phoneNo: {
    type: String,
    required: [true, "Please provide phone number"],
    match: [/^\+?[1-9]\d{1,14}$/, "Phone number not valid"],
  },
  subsID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
    required: true
  },
  subsName: {
    type: String,
    required: [true, "Please provide subscription name"],
  },
  mode: {
    type: String,
    enum: ['manual', 'computerized'],
    required: [true, "Please provide Mode of System Usage"],
  },
  superadminID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Superadmin",
  },
  role: {
    type: String,
    default: "admin",
  },
  lastLogin:{
    type:Date,
    default:Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationTokenExpiresAt: {
    type: String,
  },
  country: {
    type: String,
    default: "Nepal"
  },
  status: {
    type: Boolean,
  },
  city: {
    type: String,
  },
  province: {
    type: String,
  },
  address: {
    type: String,
  }
  
  },
  { timestamps: true }
);

// adminSchema.pre("save", async function () {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

module.exports = mongoose.model("Admin", adminSchema);
