// Global document data that syncs across all devices
// This file is loaded directly from GitHub for instant cross-device sync

window.GLOBAL_DOCUMENTS_DATA = {
  "harsh": {
    "Gov doc": [
      {
        "name": "Test Document (Should appear on ALL devices)",
        "link": "https://drive.google.com/file/d/example123/view",
        "date": "2024-11-28"
      }
    ],
    "Bank doc": []
  },
  "mamta": {
    "Gov doc": [],
    "Bank doc": []
  },
  "manoj": {
    "Gov doc": [],
    "Bank doc": []
  },
  "manorama": {
    "Gov doc": [],
    "Bank doc": []
  },
  "krati": {
    "Gov doc": [],
    "Bank doc": []
  },
  "bill": {
    "Gov doc": [],
    "Bank doc": []
  },
  "pradeep": {
    "Gov doc": [],
    "Bank doc": []
  },
  "sandeep": {
    "Gov doc": [],
    "Bank doc": []
  }
};

// Auto-sync status
window.SYNC_STATUS = {
  lastUpdated: "2024-11-28",
  version: "1.0",
  syncEnabled: true
};

console.log("🌍 Global documents data loaded successfully!", window.GLOBAL_DOCUMENTS_DATA);