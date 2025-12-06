const express = require("express");
const { ObjectId } = require("mongodb");
const { getCollections } = require("../config/database");
const verifyFirebaseToken = require("../middleware/auth");

const router = express.Router();

// Create donation request
router.post("/create-donation-request", async (req, res) => {
  const { donationRequest } = getCollections();
  const data = req.body;
  const result = await donationRequest.insertOne(data);
  res.send(result);
});

// Get my donation requests
router.get("/my-donation-request", verifyFirebaseToken, async (req, res) => {
  const { donationRequest } = getCollections();
  const query = { requesterEmail: req.firebaseUser.email };
  const data = await donationRequest.find(query).toArray();
  res.send(data);
});

// Get all donation requests (protected)
router.get("/all-donation-requests", verifyFirebaseToken, async (req, res) => {
  const { donationRequest } = getCollections();
  const data = await donationRequest.find().toArray();
  res.send(data);
});

// Get all donation requests (public - pending only)
router.get("/all-donation-requests-public", async (req, res) => {
  const { donationRequest } = getCollections();
  const data = await donationRequest
    .find({ donationStatus: "pending" })
    .toArray();
  res.send(data);
});

// Get donation request details
router.get("/details/:id", verifyFirebaseToken, async (req, res) => {
  const { donationRequest } = getCollections();
  const query = { _id: new ObjectId(req.params.id) };
  const data = await donationRequest.findOne(query);
  res.send(data);
});

// Get specific donation request
router.get("/get-donation-request/:ID", verifyFirebaseToken, async (req, res) => {
  const { donationRequest } = getCollections();
  const query = { _id: new ObjectId(req.params.ID) };
  const data = await donationRequest.findOne(query);
  res.send(data);
});

// Update donation request
router.put("/update-donation-request/:ID", verifyFirebaseToken, async (req, res) => {
  const { donationRequest } = getCollections();
  const { ID } = req.params;
  const updatedRequest = req.body;

  const filter = { _id: new ObjectId(ID) };
  const updateDoc = { $set: updatedRequest };

  const result = await donationRequest.updateOne(filter, updateDoc);
  res.send(result);
});

// Update donation status
router.patch("/donation-status", verifyFirebaseToken, async (req, res) => {
  const { donationRequest } = getCollections();
  const { id, donationStatus } = req.body;
  const result = await donationRequest.updateOne(
    { _id: new ObjectId(id) },
    { $set: { donationStatus } }
  );
  res.send(result);
});

// Delete donation request
router.delete("/delete-request/:id", async (req, res) => {
  const { donationRequest } = getCollections();
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid request ID" });
  }

  const query = { _id: new ObjectId(id) };
  const result = await donationRequest.deleteOne(query);
  res.send(result);
});

// Public stats endpoint
router.get("/public-stats", async (req, res) => {
  const { users, donationRequest } = getCollections();
  try {
    const [donors, requests] = await Promise.all([
      users.find({ role: "donor" }).toArray(),
      donationRequest.find().toArray(),
    ]);

    const stats = {
      totalDonors: donors.length,
      activeDonors: donors.filter((d) => d.status === "active").length,
      totalRequests: requests.length,
      completedRequests: requests.filter((r) => r.donationStatus === "done")
        .length,
    };

    res.send(stats);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
