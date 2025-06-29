const bcrypt = require("bcryptjs");

const checkPassword = async (candidatePassword, Password) => {
  const isMatch = await bcrypt.compare(candidatePassword, Password);
  return isMatch;
};

module.exports = checkPassword;
