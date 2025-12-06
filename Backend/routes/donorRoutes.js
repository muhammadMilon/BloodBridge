const express = require("express");
const { getCollections } = require("../config/database");
const verifyFirebaseToken = require("../middleware/auth");

const router = express.Router();

// Add donor
router.post("/add-donor", async (req, res) => {
  const { donorInfo } = getCollections();
  const data = req.body;
  const result = await donorInfo.insertOne(data);
  res.send(result);
});

// Get donor history stats
router.get("/donor-history", async (req, res) => {
  const { donorInfo } = getCollections();
  const pipeline = [
    {
      $group: {
        _id: "$donorEmail",
        totalDonations: { $sum: 1 },
        lastDonationDate: { $max: "$createdAt" },
      },
    },
  ];
  const stats = await donorInfo.aggregate(pipeline).toArray();
  res.send(stats);
});

// Get donor history by email
router.get("/donor-history/:email", verifyFirebaseToken, async (req, res) => {
  const { donorInfo } = getCollections();
  const { email } = req.params;
  const stats = await donorInfo
    .find({ donorEmail: email })
    .sort({ createdAt: -1 })
    .toArray();
  res.send(stats);
});

// Find donor by donation ID
router.get("/find-donor", verifyFirebaseToken, async (req, res) => {
  const { donorInfo } = getCollections();
  const { donationId } = req.query;
  const data = await donorInfo.find({ donationId }).toArray();
  res.send(data);
});

// Get all donors
router.get("/get-donors", async (req, res) => {
  const { users } = getCollections();
  const donors = await users.find({ role: "donor" }).toArray();
  res.send(donors);
});

module.exports = router;
