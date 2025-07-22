# 🚀 Flipkart Auto Listing Automation Tool (Built for Client)

This project automates the **repetitive product listing process on Flipkart Seller Hub**. It was developed commercially for a client who needed to fill the **same set of form fields repeatedly**. The tool includes a **Chrome Extension** for one-time data entry and a **Python Flask backend** that simulates keyboard input to auto-fill the listing form with a single keypress.

---

## 🔧 What Problem It Solves

The client was manually entering the same product listing data dozens or hundreds of times per day on Flipkart Seller Central. This project:

✅ Eliminates repetitive typing
✅ Speeds up listing form submission
✅ Requires zero browser extension interaction after the first run
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
3. Data is saved in Chrome's local storage
4. When the user visits Flipkart’s form, the extension sends the saved data to the **Flask backend**
5. The backend uses `keyboard` automation to simulate typing the form fields — **just like a human would**
6. Next time, the user **presses a key combo** (e.g. `Ctrl + Shift + L`), and the form is auto-filled instantly

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

---

## 📁 Project Structure

```
flipkart-auto-listing/
├── chrome-extension/
│   ├── manifest.json        # Extension manifest (MV3)
│   ├── popup.html           # UI form for entering listing data
│   ├── script.js            # Notification system
│   ├── backend.js           # Sends saved data to backend
│   ├── check.js             # Checks backend status
│   └── reception-*.svg      # Status indicator icons
├── main.py                  # Flask backend server
├── utils.py                 # Keyboard automation logic
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
4. Click **Submit** — this saves data locally and triggers the backend

### Repeat Use

* Simply visit the listing page and press your **hotkey** (e.g. `Arrow-Down`)
* The form will be filled automatically

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
