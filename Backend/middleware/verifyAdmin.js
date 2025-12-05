const { getCollections } = require("../config/database");

const verifyAdmin = async (req, res, next) => {
  const { users } = getCollections();
  const user = await users.findOne({
    email: req.firebaseUser.email,
  });

  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).send({ msg: "unauthorized" });
  }
};

module.exports = verifyAdmin;
