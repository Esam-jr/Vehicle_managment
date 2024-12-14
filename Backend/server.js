require("dotenv").config(); // Ensuring environment variables are loaded
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Importing CORS
const app = express();
const PORT = 5000;

app.use(cors()); // Enabling CORS for the frontend

app.use(express.json());

// MongoDB URI from environment variables
const uri = process.env.MONGO_URI;
console.log("Mongo URI:", uri); // Log the URI to ensure it's correct

// MongoDB connection setup
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Vehicle model
const Vehicle = require("./models/Vehicle");

// Fetch all vehicles
app.get("/api/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    if (vehicles.length === 0) {
      return res.status(404).json({ message: "No vehicles found" });
    }
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new vehicle
app.post("/api/vehicles", async (req, res) => {
  const { name, status } = req.body;

  // Input validation
  if (!name || !status) {
    return res.status(400).json({ message: "Name and status are required" });
  }

  try {
    const newVehicle = new Vehicle({ name, status });
    await newVehicle.save();
    res.status(201).json(newVehicle); // Respond with the created vehicle
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update vehicle status
app.put("/api/vehicles/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Input validation
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { status, lastUpdated: Date.now() },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(updatedVehicle); // Return the updated vehicle data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a vehicle
app.delete("/api/vehicles/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
