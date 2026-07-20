// Notification System
class NotificationSystem {
  constructor() {
    this.container = document.getElementById('notification-area');
    this.notificationQueue = [];
    this.isProcessing = false;
  }

  show(message, type = 'info', duration = 2000) {
    // Add to queue
    this.notificationQueue.push({ message, type, duration });
    
    // Start processing if not already
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  processQueue() {
    if (this.notificationQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const { message, type, duration } = this.notificationQueue.shift();
    
    // Create the notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on notification type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    else if (type === 'error') icon = 'exclamation-circle';
    else if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
      <i class="fas fa-${icon}"></i>
      <span>${message}</span>
      <button class="close-btn"><i class="fas fa-times"></i></button>
    `;
    
    // Add to container
    this.container.appendChild(notification);
    
    // Setup close button
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      this.closeNotification(notification);
    });
    
    // Auto close after duration
    setTimeout(() => {
      this.closeNotification(notification);
    }, duration);
  }

  closeNotification(notification) {
    if (!notification || !this.container.contains(notification)) return;
    
    notification.classList.add('notification-exit');
    setTimeout(() => {
      if (this.container.contains(notification)) {
        this.container.removeChild(notification);
      }
      
      // Process next notification
      this.processQueue();
    }, 300);
  }
}

// Initialize notification system
const notifications = new NotificationSystem();
const PROFILE_STORAGE_KEY = "listingProfiles";
const ACTIVE_PROFILE_KEY = "activeProfileName";
let autoSaveTimeout = null;
let isFormReady = false;
let isApplyingProfile = false;
let currentProfileName = "";
let profileCache = {};

// Toggle visibility functions
function toggleSection(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.toggle('show');
  }
}

// Form data functions
function saveFormData(formData) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ "listingData": formData }, () => {
      resolve();
    });
  });
}

function loadFormData() {
  return new Promise((resolve) => {
    chrome.storage.local.get("listingData", (result) => {
      resolve(result.listingData);
    });
  });
}

function deleteAllData() {
  return new Promise((resolve) => {
    chrome.storage.local.remove("listingData", () => {
      resolve();
    });
  });
}

function getTodayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

function isTruthy(value) {
  return value === true || value === "true" || value === "on";
}

function getStorage(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => {
      resolve(result);
    });
  });
}

function setStorage(items) {
  return new Promise((resolve) => {
    chrome.storage.local.set(items, () => {
      resolve();
    });
  });
}

async function loadProfileState() {
  const result = await getStorage([PROFILE_STORAGE_KEY, ACTIVE_PROFILE_KEY]);

  return {
    profiles: result[PROFILE_STORAGE_KEY] || {},
    activeProfileName: result[ACTIVE_PROFILE_KEY] || "",
  };
}

function ensureManufacturingDefaults(form) {
  const manudate = form.querySelector("#manudate");
  const shelfLife = form.querySelector("#slife");

  if (manudate && !manudate.value) {
    manudate.value = getTodayIsoDate();
  }

  if (shelfLife && !shelfLife.value) {
    shelfLife.value = "30";
  }
}

function setFormElementValue(element, value) {
  if (!element) {
    return;
  }

  if (element.type === "checkbox") {
    element.checked = isTruthy(value);
    return;
  }

  if (element.tagName === "SELECT" || element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
    element.value = value;
    return;
  }

  element.textContent = value;
}

function applyFormDataToForm(form, formData) {
  if (!formData) {
    ensureManufacturingDefaults(form);
    return;
  }

  for (let key in formData) {
    const element = form.querySelector(`[name="${key}"]`);

    if (!element) {
      continue;
    }

    setFormElementValue(element, formData[key]);
  }

  const deliveryEnabled = isTruthy(formData["isdelivaryyyy"]);
  const manufacturingEnabled = isTruthy(formData["isManufacturingdate"]);

  const deliveryToggle = document.querySelector(".isdelivary");
  const deliverySection = document.querySelector("#isdelivary");
  if (deliveryToggle) {
    deliveryToggle.checked = deliveryEnabled;
  }
  if (deliverySection) {
    deliverySection.classList.toggle("show", !deliveryEnabled);
  }

  const manufacturingToggle = document.querySelector(".isManufacturingdate");
  const manufacturingSection = document.querySelector("#ismanuf");
  if (manufacturingToggle) {
    manufacturingToggle.checked = manufacturingEnabled;
  }
  if (manufacturingSection) {
    manufacturingSection.classList.toggle("show", !manufacturingEnabled);
  }

  ensureManufacturingDefaults(form);
}

async function refreshProfileDropdown(selectedProfileName = "") {
  const profileSelect = document.getElementById("profileSelect");
  if (!profileSelect) {
    return;
  }

  const { profiles, activeProfileName } = await loadProfileState();
  profileCache = profiles;
  const profileNames = Object.keys(profiles).sort((left, right) => left.localeCompare(right));
  const currentSelection = selectedProfileName || activeProfileName || "";

  profileSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Current draft";
  profileSelect.appendChild(defaultOption);

  for (const profileName of profileNames) {
    const option = document.createElement("option");
    option.value = profileName;
    option.textContent = profileName;
    profileSelect.appendChild(option);
  }

  profileSelect.value = profileNames.includes(currentSelection) ? currentSelection : "";
  currentProfileName = profileSelect.value;

  const profileNameInput = document.getElementById("profileName");
  if (profileNameInput && currentProfileName) {
    profileNameInput.value = currentProfileName;
  }
}

async function saveCurrentFormState(formData) {
  if (currentProfileName) {
    const { profiles } = await loadProfileState();
    profiles[currentProfileName] = formData;
    await setStorage({
      [PROFILE_STORAGE_KEY]: profiles,
      [ACTIVE_PROFILE_KEY]: currentProfileName,
    });
    return;
  }

  await saveFormData(formData);
}

async function saveProfileFromInput() {
  const form = document.getElementById("listingForm");
  const profileNameInput = document.getElementById("profileName");
  const profileName = profileNameInput ? profileNameInput.value.trim() : "";

  if (!profileName) {
    notifications.show("Enter a profile name first", "warning");
    return;
  }

  const formData = collectFormData(form);
  currentProfileName = profileName;

  try {
    clearTimeout(autoSaveTimeout);
    const { profiles } = await loadProfileState();
    profiles[profileName] = formData;
    await setStorage({
      [PROFILE_STORAGE_KEY]: profiles,
      [ACTIVE_PROFILE_KEY]: profileName,
    });
    await refreshProfileDropdown(profileName);
    notifications.show(`Profile "${profileName}" saved`, "success");
  } catch (error) {
    notifications.show("Error saving profile", "error");
  }
}

async function loadProfileIntoForm(profileName, profileData = null) {
  if (!profileData) {
    const { profiles } = await loadProfileState();
    profileData = profiles[profileName];
  }

  if (!profileData) {
    return false;
  }

  const form = document.getElementById("listingForm");
  isApplyingProfile = true;

  try {
    applyFormDataToForm(form, profileData);
    currentProfileName = profileName;
    const profileNameInput = document.getElementById("profileName");
    if (profileNameInput) {
      profileNameInput.value = profileName;
    }

    await setStorage({
      [ACTIVE_PROFILE_KEY]: profileName,
    });

    return true;
  } finally {
    isApplyingProfile = false;
  }
}

function collectFormData(form) {
  const formData = {};

  for (let element of form.elements) {
    if (!element.name) {
      continue;
    }

    if (element.name === "isdelivaryyyy") {
      formData[element.name] = document.querySelector(".isdelivary").checked;
    } else if (element.name === "isManufacturingdate") {
      formData[element.name] = document.querySelector(".isManufacturingdate").checked;
    } else {
      formData[element.name] = element.value;
    }
  }

  return formData;
}

function scheduleAutoSave() {
  if (!isFormReady || isApplyingProfile) {
    return;
  }

  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(async () => {
    const form = document.getElementById("listingForm");

    try {
      await saveCurrentFormState(collectFormData(form));
    } catch (error) {
      notifications.show("Error auto-saving listing data", "error");
    }
  }, 400);
}

// Initialize switch states
function initializeSwitches() {
  const manufacturingDateSwitch = document.querySelector(".isManufacturingdate");
  const deliverySwitch = document.querySelector(".isdelivary");
  
  manufacturingDateSwitch.addEventListener("click", () => {
    toggleSection("ismanuf");
  });
  
  deliverySwitch.addEventListener("click", () => {
    toggleSection("isdelivary");
  });
}

// Check server status
function checkServerStatus() {
  fetch('http://localhost:5000/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (response.status === 200) {
      return response.json();
    }
    throw new Error("Server not available");
  })
  .then(data => {
    if (data && data.status) {
      notifications.show("Server connected successfully", "success");
    }
  })
  .catch(error => {
    notifications.show("Server connection failed", "error");
  });
}

// Initialize form with saved data
async function initializeForm() {
  const form = document.getElementById("listingForm");
  const profileState = await loadProfileState();

  await refreshProfileDropdown(profileState.activeProfileName);

  if (profileState.activeProfileName && profileState.profiles[profileState.activeProfileName]) {
    notifications.show(`Profile "${profileState.activeProfileName}" loaded`, "info");
    await loadProfileIntoForm(profileState.activeProfileName);
  } else {
    const formData = await loadFormData();

    if (formData) {
      notifications.show("Previous listing data loaded", "info");
      applyFormDataToForm(form, formData);
    } else {
      ensureManufacturingDefaults(form);
    }
  }
}

// Submit form handler
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("listingForm");
  const formData = collectFormData(form);
  
  try {
    clearTimeout(autoSaveTimeout);
    await saveCurrentFormState(formData);
    const saveButton = document.getElementById("issaved");
    saveButton.textContent = "Saved!";
    
    notifications.show("Listing created successfully!", "success");
    
    setTimeout(() => {
      saveButton.textContent = "Save Listing";
      saveButton.innerHTML = "Save Listing";
    }, 2000);
    
  } catch (error) {
    notifications.show("Error saving listing data", "error");
  }
}




// Main initialization
document.addEventListener("DOMContentLoaded", () => {
  // Initialize form with saved data
  initializeForm().finally(() => {
    isFormReady = true;
  });
  
  // Initialize switches
  initializeSwitches();
  
  // Check server connection
  checkServerStatus();
  
  // Set up form submission
  const form = document.getElementById("listingForm");
  form.addEventListener("submit", handleFormSubmit);
  form.addEventListener("input", scheduleAutoSave);
  form.addEventListener("change", scheduleAutoSave);

  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const profileSelect = document.getElementById("profileSelect");

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", saveProfileFromInput);
  }

  if (profileSelect) {
    profileSelect.addEventListener("change", async (event) => {
      const selectedProfile = event.target.value;
      currentProfileName = selectedProfile;

      const profileNameInput = document.getElementById("profileName");
      if (profileNameInput && selectedProfile) {
        profileNameInput.value = selectedProfile;
      }

      if (!selectedProfile) {
        await setStorage({ [ACTIVE_PROFILE_KEY]: "" });
        const draftData = await loadFormData();
        applyFormDataToForm(form, draftData);
        notifications.show("Switched to current draft", "info");
        return;
      }

      try {
        clearTimeout(autoSaveTimeout);
        isApplyingProfile = true;
        const loaded = await loadProfileIntoForm(selectedProfile, profileCache[selectedProfile]);

        if (loaded) {
          notifications.show(`Profile "${selectedProfile}" loaded`, "info");
        }
      } catch (error) {
        notifications.show("Error loading profile", "error");
      } finally {
        isApplyingProfile = false;
      }
    });
  }
  
  // Set up additional buttons
  
  // Show welcome message
  setTimeout(() => {
    notifications.show("Flipkart Listing Helper is ready!", "info");
  }, 500);
});