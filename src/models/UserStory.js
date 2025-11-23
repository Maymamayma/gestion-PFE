const mongoose = require("mongoose");

const UserStorySchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: true,
  },
  sprint: {
    type: mongoose.Schema.ObjectId,
    ref: "Sprint",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Veuillez ajouter un titre à l'User Story"],
    trim: true,
    maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
  },
  description: {
    type: String,
    required: [true, "Veuillez ajouter une description"],
  },
  priority: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserStory", UserStorySchema);
