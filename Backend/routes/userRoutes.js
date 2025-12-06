const express = require("express");
const { ObjectId } = require("mongodb");
const { getCollections } = require("../config/database");
const verifyFirebaseToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

// Add user
router.post("/add-user", async (req, res) => {
  const { users } = getCollections();
  const userData = req.body;
  const find_result = await users.findOne({
    email: userData.email,
  });
  if (find_result) {
    users.updateOne(
      { email: userData.email },
      {
        $inc: { loginCount: 1 },
      }
    );
    res.send({ msg: "user already exist" });
  } else {
    const result = await users.insertOne(userData);
    res.send(result);
  }
});

// Get user role
router.get("/get-user-role", verifyFirebaseToken, async (req, res) => {
  const { users } = getCollections();
  const user = await users.findOne({
    email: req.firebaseUser.email,
  });
  res.send({ msg: "ok", role: user.role, status: "active" });
});

// Get user status
router.get("/get-user-status", verifyFirebaseToken, async (req, res) => {
  const { users } = getCollections();
  const user = await users.findOne(
    { email: req.firebaseUser.email },
    { projection: { status: 1, _id: 0 } }
  );
  res.send({ status: user.status });
});

// Get currently logged in user
router.get("/get-user", verifyFirebaseToken, async (req, res) => {
  const { users } = getCollections();
  const user = await users.findOne({
    email: req.firebaseUser.email,
  });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.send(user);
});

// Update user
router.patch("/update-user/:id", verifyFirebaseToken, async (req, res) => {
  const { users } = getCollections();
  const { id } = req.params;
  const updatedData = req.body;

  const result = await users.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData }
  );

  res.send(result);
});

// Get all users (admin only)
router.get("/get-users", verifyFirebaseToken, verifyAdmin, async (req, res) => {
  const { users } = getCollections();
  const usersList = await users
    .find({ email: { $ne: req.firebaseUser.email } })
    .toArray();
  res.send(usersList);
});

// Get users for volunteer
router.get("/get-users-for-volunteer", verifyFirebaseToken, async (req, res) => {
  const { users } = getCollections();
  const usersList = await users
    .find({ email: { $ne: req.firebaseUser.email } })
    .toArray();
  res.send(usersList);
});

// Update user role (admin only)
router.patch("/update-role", verifyFirebaseToken, verifyAdmin, async (req, res) => {
  const { users } = getCollections();
  const { email, role } = req.body;
  const result = await users.updateOne(
    { email: email },
    {
      $set: { role },
    }
  );

  res.send(result);
});

// Update user status (admin only)
router.patch("/update-status", verifyFirebaseToken, verifyAdmin, async (req, res) => {
  const { users } = getCollections();
  const { email, status } = req.body;

  const result = await users.updateOne(
    { email: email },
    {
      $set: { status },
    }
  );

  res.send(result);
});

module.exports = router;
