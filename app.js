/********************************************
  MAIN APPLICATION LOGIC
 ********************************************/

/**
 * Data structure for each activity:
 * {
 *   id: string (unique),
 *   name: string,
 *   limit: number (minutes per day),
 *   used: number (minutes used so far)
 * }
 */

// On page load, initialize
window.addEventListener("DOMContentLoaded", () => {
    // 1. Check for daily reset
    handleDailyReset();
  
    // 2. Render existing activities
    renderActivities();
  
    // 3. Setup form submission listener
    const activityForm = document.getElementById("activity-form");
    activityForm.addEventListener("submit", handleAddActivity);
  });
  
  /**
   * Handles daily reset by comparing today's date to the stored date.
   * If they're different, reset usage for all activities.
   */
  function handleDailyReset() {
    const today = getTodayString(); // e.g., "2025-03-07"
    const lastReset = getLastResetDate();
  
    if (lastReset !== today) {
      // Reset usage
      const activities = getActivitiesFromStorage();
      activities.forEach((activity) => {
        activity.used = 0;
      });
      saveActivitiesToStorage(activities);
  
      // Update last reset date
      setLastResetDate(today);
    }
  }
  
  /**
   * Generate a simple YYYY-MM-DD string from the current date
   */
  function getTodayString() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  
  /**
   * Handle submission of the Add Activity form
   */
  function handleAddActivity(event) {
    event.preventDefault();
  
    const nameInput = document.getElementById("activity-name");
    const limitInput = document.getElementById("activity-limit");
  
    const nameValue = nameInput.value.trim();
    const limitValue = parseInt(limitInput.value, 10);
  
    if (!nameValue || isNaN(limitValue) || limitValue <= 0) {
      alert("Please provide a valid activity name and positive limit.");
      return;
    }
  
    // Create a new activity object
    const newActivity = {
      id: generateUniqueId(),
      name: nameValue,
      limit: limitValue,
      used: 0,
    };
  
    // Get activities from storage, add new item, save back
    const activities = getActivitiesFromStorage();
    activities.push(newActivity);
    saveActivitiesToStorage(activities);
  
    // Clear form inputs
    nameInput.value = "";
    limitInput.value = "";
  
    // Re-render
    renderActivities();
  }
  
  /**
   * Generate a random unique ID (simplistic approach)
   */
  function generateUniqueId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }
  
  /**
   * Render the list of activities in the #activities-container
   */
  function renderActivities() {
    const container = document.getElementById("activities-container");
    container.innerHTML = ""; // Clear out any existing cards
  
    const activities = getActivitiesFromStorage();
  
    activities.forEach((activity) => {
      // Create a new card element
      const card = document.createElement("div");
      card.classList.add("activity-card");
  
      // Check if limit is reached
      if (activity.used >= activity.limit) {
        card.classList.add("limit-reached");
      }
  
      // Activity details container
      const detailsDiv = document.createElement("div");
      detailsDiv.classList.add("activity-details");
  
      // Name
      const nameEl = document.createElement("div");
      nameEl.classList.add("activity-name");
      nameEl.textContent = activity.name;
  
      // Limit, Used, Remaining
      const limitEl = document.createElement("div");
      limitEl.classList.add("activity-limit");
      limitEl.textContent = `Daily Limit: ${activity.limit} min`;
  
      const usedEl = document.createElement("div");
      usedEl.classList.add("activity-used");
      usedEl.textContent = `Used: ${activity.used} min`;
  
      const remainingEl = document.createElement("div");
      remainingEl.classList.add("activity-remaining");
      const remaining = Math.max(activity.limit - activity.used, 0);
      remainingEl.textContent = `Remaining: ${remaining} min`;
  
      detailsDiv.appendChild(nameEl);
      detailsDiv.appendChild(limitEl);
      detailsDiv.appendChild(usedEl);
      detailsDiv.appendChild(remainingEl);
  
      // Buttons container
      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("activity-buttons");
  
      // +1 minute button
      const incrementBtn = document.createElement("button");
      incrementBtn.classList.add("increment-btn");
      incrementBtn.textContent = "+1 min";
      incrementBtn.addEventListener("click", () => {
        incrementUsedTime(activity.id, 1);
      });
  
      // Bulk add input (for adding multiple minutes at once)
      const bulkInput = document.createElement("input");
      bulkInput.type = "number";
      bulkInput.classList.add("bulk-input");
      bulkInput.placeholder = "min";
  
      const bulkAddBtn = document.createElement("button");
      bulkAddBtn.textContent = "Add";
      bulkAddBtn.addEventListener("click", () => {
        const bulkValue = parseInt(bulkInput.value, 10);
        if (!isNaN(bulkValue) && bulkValue > 0) {
          incrementUsedTime(activity.id, bulkValue);
          bulkInput.value = "";
        }
      });
  
      // Edit button
      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-btn");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => {
        editActivity(activity.id);
      });
  
      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        deleteActivity(activity.id);
      });
  
      buttonsDiv.appendChild(incrementBtn);
      buttonsDiv.appendChild(bulkInput);
      buttonsDiv.appendChild(bulkAddBtn);
      buttonsDiv.appendChild(editBtn);
      buttonsDiv.appendChild(deleteBtn);
  
      // Assemble card
      card.appendChild(detailsDiv);
      card.appendChild(buttonsDiv);
  
      // Add to container
      container.appendChild(card);
    });
  }
  
  /**
   * Increment the used time for a specific activity
   */
  function incrementUsedTime(activityId, amount) {
    const activities = getActivitiesFromStorage();
    const target = activities.find((act) => act.id === activityId);
    if (!target) return;
  
    target.used += amount;
    saveActivitiesToStorage(activities);
    renderActivities();
  }
  
  /**
   * Edit an activity (simple prompt-based approach for demonstration)
   */
  function editActivity(activityId) {
    const activities = getActivitiesFromStorage();
    const target = activities.find((act) => act.id === activityId);
    if (!target) return;
  
    // Prompt for new name
    const newName = prompt("Edit Activity Name:", target.name);
    if (newName !== null && newName.trim() !== "") {
      target.name = newName.trim();
    }
  
    // Prompt for new daily limit
    const newLimitStr = prompt("Edit Daily Limit (minutes):", target.limit.toString());
    const newLimitNum = parseInt(newLimitStr, 10);
  
    if (!isNaN(newLimitNum) && newLimitNum > 0) {
      target.limit = newLimitNum;
      // If usage exceeds new limit, you might want to clamp or reset usage
      if (target.used > newLimitNum) {
        target.used = newLimitNum;
      }
    }
  
    saveActivitiesToStorage(activities);
    renderActivities();
  }
  
  /**
   * Delete an activity by its ID
   */
  function deleteActivity(activityId) {
    let activities = getActivitiesFromStorage();
    activities = activities.filter((act) => act.id !== activityId);
    saveActivitiesToStorage(activities);
    renderActivities();
  }