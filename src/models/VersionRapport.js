const mongoose = require("mongoose");

const VersionRapportSchema = new mongoose.Schema({
  version: { type: Number, required: true },
  urlFichier: { type: String, required: true },
  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  nomFichier: { type: String, required: true },
  taille: { type: Number, required: true },
  notes: { type: String, default: null },
  dateCreation: { type: Date, default: Date.now },
});

module.exports = mongoose.model("VersionRapport", VersionRapportSchema);
