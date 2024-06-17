const distribusiRepository = require("./distribusi.repository");

// Get all distribusi
// Find distribusi with filters
const findDistribusi = async (filters) => {
  return await distribusiRepository.findDistribusi(filters);
};
// Get distribusi by ID
const getDistribusiById = async (id) => {
  return await distribusiRepository.findById(id);
};

// Create a new distribusi
const insertDistribusi = async (data) => {
  return await distribusiRepository.createDistribusi(data);
};

// Update distribusi by ID
const updateDistribusi = async (id, data) => {
  return await distribusiRepository.update(id, data);
};

// Delete distribusi by ID
const deleteDistribusiById = async (id) => {
  return await distribusiRepository.deleteDistribusiById(id);
};

module.exports = {
  findDistribusi,
  getDistribusiById,
  insertDistribusi,
  updateDistribusi,
  deleteDistribusiById,
};
