const express = require("express");
const { ObjectId } = require("mongodb");
const { getCollections } = require("../config/database");
const verifyFirebaseToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

// Add blog
router.post("/add-blog", async (req, res) => {
  const { blogs } = getCollections();
  const data = req.body;
  const result = await blogs.insertOne(data);
  res.send(result);
});

// Get all blogs (protected)
router.get("/get-blogs", verifyFirebaseToken, async (req, res) => {
  const { blogs } = getCollections();
  const data = await blogs.find().toArray();
  res.send(data);
});

// Get published blogs (public)
router.get("/get-blogs-public", async (req, res) => {
  const { blogs } = getCollections();
  const data = await blogs.find({ status: "published" }).toArray();
  res.send(data);
});

// Get blog details
router.get("/blog-details/:ID", verifyFirebaseToken, async (req, res) => {
  const { blogs } = getCollections();
  const query = { _id: new ObjectId(req.params.ID) };
  const data = await blogs.findOne(query);
  res.send(data);
});

// Update blog status (admin only)
router.patch("/update-blog-status", verifyFirebaseToken, verifyAdmin, async (req, res) => {
  const { blogs } = getCollections();
  const { id, status } = req.body;

  const result = await blogs.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );

  res.send(result);
});

// Delete blog
router.delete("/delete-blog/:id", verifyFirebaseToken, async (req, res) => {
  const { blogs } = getCollections();
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid blog ID" });
  }

  const query = { _id: new ObjectId(id) };
  const result = await blogs.deleteOne(query);
  res.send(result);
});

module.exports = router;
