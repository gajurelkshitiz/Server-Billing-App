const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide employee name"],
      maxlength: 50,
    },
    profileImage: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please provide employee email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Email Not Valid",
      ],
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
      minLength: 5,
    },
    phoneNo: {
      type: String,
      match: [/^\+?[1-9]\d{1,14}$/, "Phone number not valid"],
    },
    departmentNo: {
      type: String,
      required: [true, "Please provide employee department number"],
    },
    companyName: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    mode: {
      type: String,
      enum: ['manual', 'computerized'],
      required: [true, "Please provide Mode of System Usage"],
    },
    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    companyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    // emailVerificationTokenExpiresAt: Date,
    emailVerificationTokenExpiresAt: String,
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

userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
