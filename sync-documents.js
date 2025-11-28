#!/usr/bin/env node

/**
 * Auto-sync script for documents-data.json
 * This script will automatically update the JSON file and push to GitHub
 * Run this after adding documents to sync globally
 */

const fs = require('fs');
const { execSync } = require('child_process');

function updateDocumentsData() {
    try {
        console.log('🔄 Starting auto-sync process...');
        
        // Read current documents-data.json
        let documentsData = {};
        try {
            const jsonContent = fs.readFileSync('documents-data.json', 'utf8');
            documentsData = JSON.parse(jsonContent);
        } catch (error) {
            console.log('Creating new documents-data.json file...');
            documentsData = {
                harsh: { "Gov doc": [], "Bank doc": [] },
                mamta: { "Gov doc": [], "Bank doc": [] },
                manoj: { "Gov doc": [], "Bank doc": [] },
                manorama: { "Gov doc": [], "Bank doc": [] },
                krati: { "Gov doc": [], "Bank doc": [] },
                bill: { "Gov doc": [], "Bank doc": [] },
                pradeep: { "Gov doc": [], "Bank doc": [] },
                sandeep: { "Gov doc": [], "Bank doc": [] }
            };
        }
        
        // Check if there's any localStorage backup data to merge
        console.log('✅ Documents data structure ready');
        
        // Write the updated JSON file
        fs.writeFileSync('documents-data.json', JSON.stringify(documentsData, null, 2));
        console.log('✅ documents-data.json updated');
        
        // Add to git
        execSync('git add documents-data.json', { stdio: 'inherit' });
        console.log('✅ Added to git staging');
        
        // Commit the changes
        const commitMessage = `Update documents data - ${new Date().toISOString().split('T')[0]}`;
        execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
        console.log('✅ Changes committed');
        
        // Push to GitHub
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('✅ Pushed to GitHub');
        
        console.log('🌍 Documents are now synced globally! They will appear on all devices.');
        
    } catch (error) {
        console.error('❌ Error during sync:', error.message);
        console.log('💡 Make sure you have committed any pending changes first.');
    }
}

// Run if called directly
if (require.main === module) {
    updateDocumentsData();
}

module.exports = { updateDocumentsData };