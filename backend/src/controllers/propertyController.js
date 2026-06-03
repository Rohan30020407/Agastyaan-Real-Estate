const Property = require("../models/Property");

async function addProperty(req, res) {
  const images = (req.files || []).map((f) => `/uploads/${f.filename}`);
  const amenities = String(req.body.amenities || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const property = await Property.create({
    title: req.body.title,
    price: Number(req.body.price),
    location: req.body.location,
    type: req.body.type,
    description: req.body.description,
    amenities,
    images,
    createdBy: req.user.id
  });
  res.status(201).json(property);
}

async function listProperties(req, res) {
  const { location = "", type = "", maxPrice = "", minPrice = "", q = "" } = req.query;
  const filter = { status: "active" };
  if (location) filter.location = { $regex: location, $options: "i" };
  if (type) filter.type = type;
  if (q) filter.title = { $regex: q, $options: "i" };
  if (maxPrice || minPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  const items = await Property.find(filter).sort({ createdAt: -1 });
  res.json(items);
}

async function getPropertyById(req, res) {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: "Property not found" });
  res.json(property);
}

async function updateProperty(req, res) {
  const updates = { ...req.body };
  if (updates.price) updates.price = Number(updates.price);
  if (updates.amenities) {
    updates.amenities = String(updates.amenities).split(",").map((x) => x.trim()).filter(Boolean);
  }
  const property = await Property.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!property) return res.status(404).json({ message: "Property not found" });
  res.json(property);
}

async function deleteProperty(req, res) {
  const property = await Property.findByIdAndDelete(req.params.id);
  if (!property) return res.status(404).json({ message: "Property not found" });
  res.json({ message: "Property deleted" });
}

module.exports = { addProperty, listProperties, getPropertyById, updateProperty, deleteProperty };
