const repo = require('./repository');

async function createDepartment(name, createdBy) {
  // Normalize input at service layer as well to ensure callers that
  // use the service (instead of repository) get trimmed values.
  const sanitizedName = name ? name.trim() : name;
  return repo.createDepartment(sanitizedName, createdBy);
}

async function getDepartmentTeams(departmentId) {
  return repo.getDepartmentTeams(departmentId);
}

module.exports = {
  createDepartment,
  getDepartmentTeams,
};
