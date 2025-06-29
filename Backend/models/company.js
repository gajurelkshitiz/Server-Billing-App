const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    logo: {
      type: String,
      // required: [true, 'Please provide company logo'],
      match: [
        /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/,
        "Logo URL not valid",
      ],
    },
    email: {
      type: String,
      required: [true, "Please provide company email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Email Not Valid",
      ],
      unique: true,
    },
    phoneNo: {
      type: String,
      required: [true, "Please provide company phone number"],
      match: [/^\+?[1-9]\d{1,14}$/, "Phone number not valid"],
    },
    address: {
      type: String,
      required: [true, "Please provide company address"],
      maxlength: 100,
    },
    vat: {
      type: String,
      required: [true, "Please provide company vat number"],
      maxlength: 20,
    },
    industrytype: {
      type: String,
      required: [true, "Please provide company industry type"],
      enum: [
        "IT",
        "Finance",
        "Healthcare",
        "Education",
        "Manufacturing",
        "Retail",
        "Other",
      ],
      // default: "Other",
    },
    website: {
      type: String,
    },
    Description: {
      type: String,
      maxlength: 500,
    },
    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Company", companySchema);
module.exports = mongoose.models.Company || mongoose.model("Company", companySchema);