const bcrypt = require("bcrypt");

// Hash a plain password
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error while hashing password");
  }
};

// Compare plain password with hashed password
// const comparePassword = async (plainPassword, hashedPassword) => {
//   try {
//     const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
//     return isMatch;
//   } catch (error) {
//     throw new Error("Error while comparing passwords");
//   }
// };

hashPassword(1234).then((hashedPassword) => {
  console.log(hashedPassword);
});

hashPassword(1234).then((hashedPassword) => {
  console.log(hashedPassword);
});

// module.exports = { hashPassword, comparePassword };
