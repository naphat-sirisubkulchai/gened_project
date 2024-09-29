import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB connection
const mongoURI = "mongodb+srv://6534418623:rGXQlWZwLLcXcSBj@cluster0.qfyra.mongodb.net/Clusters?retryWrites=true&w=majority"; // Update this line
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define a Mongoose schema and model
const itemSchema = new mongoose.Schema({
  Number: String,
  choice1: { type: Number, default: 0 },
  choice2: { type: Number, default: 0 },
  choice3: { type: Number, default: 0 }
});

// Specify the collection name as 'number1'
const Item = mongoose.model("Item", itemSchema, "Number1");

// API to get item by Number
app.get("/number/:number", async (req, res) => {
  console.log("Querying for number:", req.params.number);
  try {
    const item = await Item.findOne({ Number: req.params.number.trim() });
    console.log("Fetched item:", item);
    
    if (!item) {
      console.log("Item not found for number:", req.params.number);
      return res.status(404).send("Item not found");
    }
    
    res.json(item);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).send("Server error");
  }
});

// API to increment choice value
app.put("/number/:number/:choice", async (req, res) => {
  const { choice } = req.params;
  const validChoices = ["choice1", "choice2", "choice3"];
  
  if (!validChoices.includes(choice)) {
    return res.status(400).send("Invalid choice");
  }

  try {
    const item = await Item.findOneAndUpdate(
      { Number: req.params.number.trim() },
      { $inc: { [choice]: 1 } },
      { new: true }
    );

    if (!item) {
      console.log("Item not found for update:", req.params.number);
      return res.status(404).send("Item not found");
    }
    
    res.json(item);
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).send("Server error");
  }
});

// API to add a new item
app.post("/add-number", async (req, res) => {
  const { Number, choice1 = 0, choice2 = 0, choice3 = 0 } = req.body; // Destructure parameters from request body

  if (!Number) {
    return res.status(400).send("Number is required");
  }

  try {
    const newItem = new Item({ Number, choice1, choice2, choice3 });
    await newItem.save();
    res.status(201).send("New item created successfully");
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).send("Server error");
  }
});

// API to get all items
app.get("/all-items", async (req, res) => {
  try {
    const items = await Item.find({});
    console.log("All items in the database:", items);
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).send("Server error");
  }
});

app.get("/", (req, res) => res.send("back-end-for-gened"));

// Change the port to 3001 to avoid conflicts
app.listen(3001, () => console.log("Server ready on port 3001."));

export default app; // Use export default for ES6 modules
