const User = require("../models/user-model");

const requirePayment = async (req, res, next) => {
  const user = await User.findById(req.userID);
  if (!user) {
    return res.status(403).json({ message: "Access  dabon " });
  } else if (!user.hasPaid) {
    return res.status(403).json({ message: "not paid" });
  }
  next();
};
module.exports = requirePayment;
