import { Meeting, Reunion } from "../models/meeting.model.js";

// Create a new meeting
export const create = async (data) => {
  return await Reunion.create(data);
};

// Get all meetings with optional filters
export const getAll = async (filters = {}) => {
  return await Reunion.find(filters)
    .populate("projectId", "title description")
    .populate("createdBy", "name email")
    .populate("referenceId")
    .sort({ datePlanification: -1 });
};

// Get meeting by ID
export const getById = async (id) => {
  return await Reunion.findById(id)
    .populate("projectId", "title description")
    .populate("createdBy", "name email")
    .populate("referenceId");
};

// Update meeting
export const update = async (id, data) => {
  return await Reunion.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("projectId", "title description")
    .populate("createdBy", "name email")
    .populate("referenceId");
};

// Complete meeting with actual report
export const complete = async (id, compteRendu) => {
  return await Reunion.findByIdAndUpdate(
    id,
    {
      compteRendu,
      statut: "Effectuee",
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("projectId", "title description")
    .populate("createdBy", "name email")
    .populate("referenceId");
};

// Cancel meeting
export const cancel = async (id) => {
  return await Reunion.findByIdAndUpdate(
    id,
    {
      statut: "Annulee",
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("projectId", "title description")
    .populate("createdBy", "name email")
    .populate("referenceId");
};

// Delete meeting
export const deleteById = async (id) => {
  return await Reunion.findByIdAndDelete(id);
};

// Get meetings by project
export const getByProject = async (projectId) => {
  return await Reunion.find({ projectId })
    .populate("createdBy", "name email")
    .populate("referenceId")
    .sort({ datePlanification: -1 });
};

// Get upcoming meetings (Planifiee status)
export const getUpcoming = async (projectId = null) => {
  const filter = {
    datePlanification: { $gte: new Date() },
    statut: "Planifiee",
  };
  
  if (projectId) {
    filter.projectId = projectId;
  }

  return await Reunion.find(filter)
    .populate("projectId", "title description")
    .populate("createdBy", "name email")
    .populate("referenceId")
    .sort({ datePlanification: 1 });
};

// Get completed meetings (Effectuee status)
export const getCompleted = async (projectId = null) => {
  const filter = { statut: "Effectuee" };
  
  if (projectId) {
    filter.projectId = projectId;
  }

  return await Reunion.find(filter)
    .populate("projectId", "title description")
    .populate("createdBy", "name email")
    .populate("referenceId")
    .sort({ datePlanification: -1 });
};

// Get cancelled meetings
export const getCancelled = async (projectId = null) => {
  const filter = { statut: "Annulee" };
  
  if (projectId) {
    filter.projectId = projectId;
  }

  return await Reunion.find(filter)
    .populate("projectId", "title description")
    .populate("createdBy", "name email")
    .populate("referenceId")
    .sort({ datePlanification: -1 });
};

