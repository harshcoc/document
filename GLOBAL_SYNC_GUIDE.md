# Global Document Sync - INSTRUCTIONS

## 🌍 HOW TO SYNC DOCUMENTS GLOBALLY

Your website now has **global sync capability**! Documents added on your laptop will appear on every device worldwide.

## ✅ WHAT'S BEEN UPDATED

1. **member.js** - Now loads documents from GitHub for global sync
2. **documents-data.json** - Central storage for all documents 
3. **sync-documents.js** - Auto-sync script for easy updates

## 🚀 HOW TO ADD DOCUMENTS GLOBALLY

### Method 1: Manual Sync (Recommended)
1. Add documents through your website as usual
2. Copy the data from browser console or localStorage
3. Update `documents-data.json` file manually
4. Commit and push to GitHub
5. Documents appear globally within minutes!

### Method 2: Auto-Sync Script
1. Add documents through your website
2. Run: `node sync-documents.js`
3. Script automatically commits and pushes to GitHub
4. Documents sync globally!

### Method 3: Direct JSON Edit
1. Edit `documents-data.json` directly
2. Add your document data in the correct person/category
3. Commit and push to GitHub
4. Instant global sync!

## 📱 TESTING GLOBAL SYNC

1. Add a document on your laptop
2. Update `documents-data.json` and push to GitHub  
3. Open website on your phone
4. Document should appear automatically!
5. Refresh page if needed

## 🔧 DOCUMENT DATA FORMAT

```json
{
  "harsh": {
    "Gov doc": [
      {
        "name": "Passport",
        "link": "https://drive.google.com/file/d/...",
        "date": "2024-11-28"
      }
    ],
    "Bank doc": []
  }
}
```

## 🌐 HOW IT WORKS

1. Website loads documents from GitHub (not localStorage)
2. Everyone sees the same data from `documents-data.json`
3. When you update GitHub, changes appear worldwide
4. All devices stay perfectly synchronized!

## ⚡ NEXT STEPS

1. **Test it now**: Add a document and manually sync
2. **Verify global sync**: Check on different devices
3. **Use regularly**: Update JSON file after adding documents

**Your family document system is now globally synchronized! 🎉**