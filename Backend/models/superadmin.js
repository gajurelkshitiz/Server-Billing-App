const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const superadminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      minLength: 3,
      maxLength: 20,
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
      required: [true, "Please Enter Password"],
      minLength: 5,
    },
    role: {
      type: String,
      default: "superadmin",
    },
  },
  { timestamps: true }
);

superadminSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("Superadmin", superadminSchema);
