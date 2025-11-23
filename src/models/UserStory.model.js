const mongoose = require("mongoose");

const UserStorySchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 255 },
  description: { type: String, required: true, minlength: 10 },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  sprintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sprint",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

module.exports = mongoose.model("UserStory", UserStorySchema);
