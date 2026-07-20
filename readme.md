# 🚀 Flipkart Auto Listing Automation Tool (Built for Client)

This project automates the **repetitive product listing process on Flipkart Seller Hub**. It was developed commercially for a client who needed to fill the **same set of form fields repeatedly**. The tool includes a **Chrome Extension** for one-time data entry, **profile saving/loading in the popup**, and a **Python Flask backend** that simulates keyboard input to auto-fill the listing form with a single keypress.

---

## 🔧 What Problem It Solves

The client was manually entering the same product listing data dozens or hundreds of times per day on Flipkart Seller Central. This project:

✅ Eliminates repetitive typing
✅ Speeds up listing form submission
✅ Saves reusable product profiles in the popup
✅ Auto-fills the popup instantly when a saved profile is selected
✅ Keeps the current draft separate from saved profiles
✅ Auto-saves changes while you edit
✅ Works by simulating real user keyboard input (not DOM injection) — reducing detection risk

---

## 🧩 How It Works

```
┌──────────────┐       Press Button       ┌──────────────┐
│ Chrome Popup │  ─────────────────────▶ │ Flask Backend│
│ (Enter Form) │                         │   (main.py)  │
└──────────────┘                          └──────────────┘
       ▲                                         │
       │ Save Form Locally                       ▼
       │                                 Simulates Keyboard Typing
       │                                to Fill Flipkart Form
       ▼
Chrome Local Storage
```

---

## 🔄 Automation Flow

1. **User opens the extension popup**
2. Inputs the listing data once (e.g. SKU, price, stock)
3. Saves it as a profile such as `Product 1`
4. Selecting a saved profile fills the popup fields instantly
5. Changes are auto-saved while editing
6. When the user visits Flipkart’s form, the extension sends the saved data to the **Flask backend**
7. The backend uses `keyboard` automation to simulate typing the form fields — **just like a human would**

---

## 🧾 Fields Automatically Filled

Below are the fields the tool supports:

| Field Name                 | Type         | Example Value         |
| -------------------------- | ------------ | --------------------- |
| SKU ID                     | Text Input   | `SKU-1234-ABCD`       |
| Listing Status             | Dropdown     | `Active` / `Inactive` |
| Fulfillment                | Dropdown     | `Seller`              |
| MRP (Maximum Retail Price) | Number Input | `999.00`              |
| Your Selling Price         | Number Input | `899.00`              |
| Procurement SLA            | Dropdown     | `2 Days`, `3 Days`    |
| Stock Quantity             | Number Input | `50`                  |
| HSN Code                   | Text Input   | `61091000`            |
| Tax Rate (GST %)           | Dropdown     | `12%`                 |
| Product Dimensions         | Text Input   | `10x8x6 cm`           |
| Package Weight             | Text Input   | `0.5 kg`              |
| Country of Origin          | Dropdown     | `India`               |

> The tool can be easily extended to fill more fields as required.

### Popup Workflow

* Save a profile once and reuse it for the same product later.
* Choose a profile from the dropdown to load its values into the popup.
* Switch back to **Current draft** to keep editing unsaved work separately.
* The popup auto-saves edits, so manual save is still available but not required every time.

---

## 📁 Project Structure

```
flipkart-auto-listing/
├── chrome-extension/
│   ├── manifest.json        # Extension manifest (MV3)
│   ├── popup.html           # Popup UI for listing data and profiles
│   ├── script.js            # Popup logic, autosave, and profile loading
│   ├── backend.js           # Sends saved data to backend
│   ├── check.js             # Checks backend status
│   └── reception-*.svg      # Status indicator icons
├── main.py                  # Flask backend server
├── utils.py                 # Keyboard automation logic
├── run-flipkart-server.bat  # Windows launcher for the backend
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 🐍 Python Backend

1. Install dependencies:

```bash
pip install flask flask-cors keyboard
```

2. Run the server:

```bash
python main.py
```

On Windows, you can also use the batch launcher:

```bash
run-flipkart-server.bat
```

> ⚠️ Run the script in the **foreground**. Do not interact with your keyboard while automation is running.

---

### 🧩 Chrome Extension

1. Open Google Chrome
2. Go to `chrome://extensions`
3. Enable **Developer Mode**
4. Click **"Load Unpacked"**
5. Select the `chrome-extension/` folder

---

## 🎯 Usage Guide

### First Use

1. Open Flipkart Seller Center and go to the product listing page
2. Click the extension icon
3. Fill in the listing details in the popup form
4. Save the form as a profile if you want to reuse it later
5. Click **Save Listing** — this saves the current values locally and triggers the backend

### Repeat Use

* Open the popup and select a saved profile from the dropdown
* The fields load instantly in the popup
* Make changes and they auto-save to the active profile or draft

---

## 🔥 Hotkey Setup (Optional)

To trigger the automation with a single key:

1. Use an auto hotkey trigger in Python (not included by default)
2. Or assign a keyboard shortcut in Chrome to the extension (Settings → Extensions → Keyboard Shortcuts)

---

## 🛡️ Safety Notes

* This automation uses real keyboard simulation (`keyboard` library) — ensure you do not type while it's running.
* Works on Windows only (keyboard simulation limitation).
* Not officially affiliated with or endorsed by Flipkart.

---

## 📦 API Endpoints

| Endpoint | Method | Description                      |
| -------- | ------ | -------------------------------- |
| `/api`   | POST   | Accepts form data to auto-fill   |
| `/price` | POST   | Submits extracted price text     |
| `/test`  | POST   | Checks backend connection status |

---

## 📄 License

Private commercial project — not open-source. Contact me for reuse or customization rights.
