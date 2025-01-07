// Import Mongoose
import mongoose from "mongoose";

// Define the schema for the `requests` collection
const requestSchema = new mongoose.Schema({
  requestorName: {
    type: String,
    required: [true, "A request must have a requestor name"],
    minlength: [3, "Requestor name must be at least 3 characters long"],
    maxlength: [30, "Requestor name must not exceed 30 characters"],
  },
  itemRequested: {
    type: String,
    required: [true, "A request must have an item requested"],
    minlength: [2, "Item requested must be at least 2 characters long"],
    maxlength: [100, "Item requested must not exceed 100 characters"],
  },
  createdDate: {
    type: Date,
    required: [true, "A request must have a creation date"],
    default: Date.now,
  },
  lastEditedDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "approved", "rejected"],
    required: [true, "A request must have a status"],
    default: "pending",
  },
});

// Create and export the model
const Request = mongoose.model("Request", requestSchema);

export default Request;
