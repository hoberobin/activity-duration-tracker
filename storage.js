/********************************************
  STORAGE MODULE
  Handles saving and loading data to LocalStorage
 ********************************************/

// Key names for LocalStorage
const ACTIVITIES_KEY = "activityList";
const LAST_RESET_KEY = "lastResetDate";

/**
 * Retrieves the list of activities from LocalStorage
 * Returns an empty array if not present
 */
function getActivitiesFromStorage() {
  const stored = localStorage.getItem(ACTIVITIES_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Saves the list of activities to LocalStorage
 */
function saveActivitiesToStorage(activities) {
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
}

/**
 * Gets the date (as a "YYYY-MM-DD" string) of the last reset
 */
function getLastResetDate() {
  return localStorage.getItem(LAST_RESET_KEY);
}

/**
 * Saves today's date as the last reset date
 */
function setLastResetDate(dateString) {
  localStorage.setItem(LAST_RESET_KEY, dateString);
}