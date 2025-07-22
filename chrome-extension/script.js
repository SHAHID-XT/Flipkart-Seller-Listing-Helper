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
  const formData = await loadFormData();
  
  if (formData) {
    notifications.show("Previous listing data loaded", "info");
    
    // Handle special toggling elements
    if (formData["isdelivaryyyy"] === true || formData["isdelivaryyyy"] === "true") {
      document.querySelector(".isdelivary").checked = true;
      document.querySelector("#isdelivary").classList.remove("show");
    }
    
    if (formData["isManufacturingdate"] === true || formData["isManufacturingdate"] === "on") {
      document.querySelector(".isManufacturingdate").checked = true;
      document.querySelector("#ismanuf").classList.remove("show");
    }
    
    // Set all form values
    for (let key in formData) {
      const element = form.querySelector(`[name="${key}"]`);
      if (element) {
        element.value = formData[key];
      }
    }
  }
}

// Submit form handler
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("listingForm");
  const formData = {};
  
  for (let element of form.elements) {
    if (element.name) {
      if (element.name === "isdelivaryyyy") {
        formData[element.name] = document.querySelector(".isdelivary").checked;
      } else if (element.name === "isManufacturingdate") {
        formData[element.name] = document.querySelector(".isManufacturingdate").checked;
      } else {
        formData[element.name] = element.value;
      }
    }
  }
  
  try {
    await saveFormData(formData);
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
  initializeForm();
  
  // Initialize switches
  initializeSwitches();
  
  // Check server connection
  checkServerStatus();
  
  // Set up form submission
  const form = document.getElementById("listingForm");
  form.addEventListener("submit", handleFormSubmit);
  
  // Set up additional buttons
  
  // Show welcome message
  setTimeout(() => {
    notifications.show("Flipkart Listing Helper is ready!", "info");
  }, 500);
});