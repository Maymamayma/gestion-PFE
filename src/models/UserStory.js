const mongoose = require("mongoose");

const UserStorySchema = new mongoose.Schema({
  titre: { type: String, required: true, minlength: 3, maxlength: 255 },
  description: { type: String, required: true, minlength: 10 },
  priorite: {
    type: String,
    enum: ["Haute", "Moyenne", "Basse"],
    required: true,
  },
  acceptance: { type: String, required: true, minlength: 10 },

  sprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sprint",
    required: true,
  },
  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  dateCreation: { type: Date, default: Date.now },
  dateModification: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserStory", UserStorySchema);
