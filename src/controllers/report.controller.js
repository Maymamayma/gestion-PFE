// src/controllers/report.controller.js
const VersionRapport = require("../models/VersionRapport");
const Project = require("../models/Project");

exports.uploadRapport = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { notes } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier fourni" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    const lastVersion = await VersionRapport.findOne({
      projet: projectId,
    }).sort({ version: -1 });

    const nextVersion = lastVersion ? lastVersion.version + 1 : 1;

    const versionRapport = new VersionRapport({
      version: nextVersion,
      urlFichier: req.file.path,
      projet: projectId,
      nomFichier: req.file.originalname,
      taille: req.file.size,
      notes: notes || null,
    });

    await versionRapport.save();

    res.status(201).json({
      message: "Rapport uploadé avec succès",
      versionRapport,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRapportById = async (req, res) => {
  try {
    const { projectId, reportId } = req.params;

    const rapport = await VersionRapport.findOne({
      _id: reportId,
      projet: projectId,
    });

    if (!rapport) {
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    res.json({
      message: "Rapport récupéré avec succès",
      versionRapport: rapport,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRapportNotes = async (req, res) => {
  try {
    const { projectId, reportId } = req.params;
    const { notes } = req.body;

    const rapport = await VersionRapport.findOneAndUpdate(
      {
        _id: reportId,
        projet: projectId,
      },
      {
        notes,
      },
      { new: true }
    );

    if (!rapport) {
      return res.status(404).json({ message: "Rapport non trouvé" });
    }

    res.json({
      message: "Notes mises à jour avec succès",
      versionRapport: rapport,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
