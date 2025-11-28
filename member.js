// Ultra-reliable global document sync system
let documentsData = {};
let isLoading = false;

// Initialize documents system with forced refresh
function initializeDocuments() {
    console.log('🔄 Initializing global document sync...');
    loadGlobalDocumentsReliable();
}

// Get current page person name from title
function getCurrentPerson() {
    const title = document.title;
    return title.split(' - ')[0].toLowerCase();
}

// Force load global documents with cache busting and multiple fallbacks
function loadGlobalDocumentsReliable() {
    if (isLoading) return;
    isLoading = true;
    
    showLoadingMessage('Loading documents globally...');
    
    // Try multiple loading strategies
    tryLoadingMethod1()
        .then(() => {
            console.log('✅ Method 1 successful');
            finishLoading();
        })
        .catch(() => {
            console.log('⚠️ Method 1 failed, trying Method 2...');
            tryLoadingMethod2()
                .then(() => {
                    console.log('✅ Method 2 successful');
                    finishLoading();
                })
                .catch(() => {
                    console.log('⚠️ Method 2 failed, trying Method 3...');
                    tryLoadingMethod3();
                });
        });
}

// Method 1: Check if global data is already loaded
function tryLoadingMethod1() {
    return new Promise((resolve, reject) => {
        if (window.GLOBAL_DOCUMENTS_DATA) {
            documentsData = window.GLOBAL_DOCUMENTS_DATA;
            resolve();
        } else {
            reject('Global data not pre-loaded');
        }
    });
}

// Method 2: Force reload the script with cache busting
function tryLoadingMethod2() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `docs-data.js?v=${Date.now()}&cache=false`;
        script.onload = function() {
            if (window.GLOBAL_DOCUMENTS_DATA) {
                documentsData = window.GLOBAL_DOCUMENTS_DATA;
                resolve();
            } else {
                reject('Script loaded but no data found');
            }
        };
        script.onerror = function() {
            reject('Failed to load script');
        };
        document.head.appendChild(script);
    });
}

// Method 3: Fallback to localStorage and show manual sync instructions
function tryLoadingMethod3() {
    console.log('🔧 Using fallback method...');
    const localData = localStorage.getItem('familyDocuments');
    if (localData) {
        documentsData = JSON.parse(localData);
        displayDocuments();
        showNotification('Loaded from local storage. For cross-device sync, add documents to docs-data.js file.', 'warning');
    } else {
        documentsData = getDefaultDocumentsData();
        displayDocuments();
        showNotification('Starting fresh. Add documents below and follow sync instructions.', 'info');
    }
    finishLoading();
}

// Finish loading process
function finishLoading() {
    hideLoadingMessage();
    displayDocuments();
    isLoading = false;
    
    // Show sync status
    const person = getCurrentPerson();
    const personDocs = documentsData[person] || {};
    const totalDocs = Object.values(personDocs).flat().length;
    console.log(`📊 Loaded ${totalDocs} documents for ${person}`);
    
    if (window.GLOBAL_DOCUMENTS_DATA) {
        showNotification(`✅ Global sync active! Loaded ${totalDocs} documents from cloud.`, 'success');
    }
}

// Get default documents structure
function getDefaultDocumentsData() {
    return {
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

// Display documents on the page
function displayDocuments() {
    const person = getCurrentPerson();
    const personData = documentsData[person] || {};
    
    Object.keys(personData).forEach(category => {
        const categoryId = category.replace(/ /g, '-').toLowerCase();
        const section = document.getElementById(categoryId);
        
        if (section && personData[category].length > 0) {
            const grid = section.querySelector('.documents-grid');
            
            // Clear existing dynamic documents (keep template ones)
            const existingDocs = grid.querySelectorAll('.document-card[data-dynamic="true"]');
            existingDocs.forEach(doc => doc.remove());
            
            // Add stored documents
            personData[category].forEach(doc => {
                addDocumentCard(grid, doc.name, doc.link, doc.date, true);
            });
            
            updateCategoryCount(categoryId);
        }
    });
}

// Add document card to grid
function addDocumentCard(grid, name, link, date, isDynamic = false) {
    const docCard = document.createElement('div');
    docCard.className = 'document-card';
    if (isDynamic) {
        docCard.setAttribute('data-dynamic', 'true');
    }
    
    docCard.innerHTML = `
        <div class="doc-icon">
            <i class="fas fa-file-pdf"></i>
        </div>
        <div class="doc-info">
            <h4 class="doc-name">${name}</h4>
            ${date ? `<p class="doc-meta">Added: ${date}</p>` : ''}
        </div>
        <a href="${link}" target="_blank" class="doc-link">
            <i class="fas fa-external-link-alt"></i> Open
        </a>
        ${isDynamic ? `<button class="delete-btn" onclick="deleteDocument(this, '${name}')">
            <i class="fas fa-trash"></i>
        </button>` : ''}
    `;
    grid.appendChild(docCard);
}

// Update category document count
function updateCategoryCount(categoryId) {
    const section = document.getElementById(categoryId);
    const grid = section.querySelector('.documents-grid');
    const count = grid.querySelectorAll('.document-card').length;
    
    // Find the category card and update count
    const categoryName = section.querySelector('.section-title').textContent.trim();
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        if (card.querySelector('.category-name').textContent.trim() === categoryName) {
            card.querySelector('.category-count').textContent = `${count} document(s)`;
        }
    });
}

// Toggle category sections
function toggleCategory(categoryId) {
    const section = document.getElementById(categoryId);
    const allSections = document.querySelectorAll('.documents-section');
    
    // Close all other sections
    allSections.forEach(sec => {
        if (sec.id !== categoryId) {
            sec.style.display = 'none';
        }
    });
    
    // Toggle the clicked section
    if (section.style.display === 'none') {
        section.style.display = 'block';
        // Smooth scroll to the section
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        section.style.display = 'none';
    }
}

// Show add document modal
function showAddDocModal(categoryId) {
    const modal = document.getElementById('addDocModal');
    const categoryName = document.getElementById(categoryId).querySelector('.section-title').textContent.trim();
    
    document.getElementById('modalCategoryName').textContent = categoryName;
    document.getElementById('modalCategoryId').value = categoryId;
    document.getElementById('docName').value = '';
    document.getElementById('docLink').value = '';
    document.getElementById('addDocError').classList.remove('active');
    
    modal.classList.add('active');
}

// Close add document modal
function closeAddDocModal() {
    document.getElementById('addDocModal').classList.remove('active');
}

// Save new document with clear global sync instructions
async function saveDocument() {
    const categoryId = document.getElementById('modalCategoryId').value;
    const docName = document.getElementById('docName').value.trim();
    const docLink = document.getElementById('docLink').value.trim();
    const errorMsg = document.getElementById('addDocError');
    
    // Validate inputs
    if (!docName || !docLink) {
        errorMsg.textContent = 'Please fill in all fields!';
        errorMsg.classList.add('active');
        return;
    }
    
    // Validate Google Drive link
    if (!docLink.includes('drive.google.com')) {
        errorMsg.textContent = 'Please enter a valid Google Drive link!';
        errorMsg.classList.add('active');
        return;
    }
    
    const person = getCurrentPerson();
    const section = document.getElementById(categoryId);
    const categoryName = section.querySelector('.section-title').textContent.trim();
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Initialize person data if needed
    if (!documentsData[person]) {
        documentsData[person] = {};
    }
    
    if (!documentsData[person][categoryName]) {
        documentsData[person][categoryName] = [];
    }
    
    // Add new document
    const newDoc = {
        name: docName,
        link: docLink,
        date: currentDate
    };
    
    documentsData[person][categoryName].push(newDoc);
    
    // Save to localStorage as backup
    localStorage.setItem('familyDocuments', JSON.stringify(documentsData));
    
    // Add to UI immediately
    const grid = section.querySelector('.documents-grid');
    addDocumentCard(grid, docName, docLink, currentDate, true);
    updateCategoryCount(categoryId);
    closeAddDocModal();
    
    // Show VERY clear sync instructions
    showGlobalSyncInstructions(person, categoryName, newDoc);
    showNotification('Document saved locally! Follow the instructions below to sync globally.', 'success');
}

// Show crystal clear global sync instructions
function showGlobalSyncInstructions(person, category, doc) {
    console.log('\n🌍 ======================================');
    console.log('🌍 MAKE THIS DOCUMENT APPEAR GLOBALLY');
    console.log('🌍 ======================================');
    console.log('\n📱 To see this document on YOUR PHONE:');
    console.log('1. Edit docs-data.js file');
    console.log(`2. Find "${person}" section`);
    console.log(`3. Find "${category}" array`);
    console.log('4. Add this exact text:');
    console.log('');
    console.log(JSON.stringify(doc, null, 4));
    console.log('');
    console.log('5. Save, commit, push to GitHub');
    console.log('6. Refresh website on phone = DOCUMENT APPEARS! 📱');
    console.log('');
    console.log('🔄 COPY THIS EXACT LINE:');
    console.log(`Add to docs-data.js → "${person}" → "${category}" array:`);
    console.log(JSON.stringify(doc, null, 2));
    
    // Create visual popup with instructions
    createSyncInstructionPopup(person, category, doc);
}

// Create a visual popup with sync instructions
function createSyncInstructionPopup(person, category, doc) {
    // Remove existing popup if any
    const existingPopup = document.getElementById('syncInstructionPopup');
    if (existingPopup) existingPopup.remove();
    
    const popup = document.createElement('div');
    popup.id = 'syncInstructionPopup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 3px solid #2196F3;
        border-radius: 15px;
        padding: 30px;
        max-width: 600px;
        z-index: 10001;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
    `;
    
    popup.innerHTML = `
        <h2 style="color: #2196F3; margin-top: 0;">🌍 Sync to ALL Devices</h2>
        <p><strong>To make this document appear on your phone:</strong></p>
        <ol style="line-height: 1.8;">
            <li>Edit <code>docs-data.js</code> file</li>
            <li>Find <code>"${person}"</code> section</li>
            <li>Add this to <code>"${category}"</code> array:</li>
        </ol>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0; overflow-x: auto;">
            <code>${JSON.stringify(doc, null, 2)}</code>
        </div>
        <ol start="4" style="line-height: 1.8;">
            <li>Save and push to GitHub</li>
            <li>Refresh website on phone = Document appears! 📱</li>
        </ol>
        <div style="margin-top: 20px; text-align: center;">
            <button onclick="document.getElementById('syncInstructionPopup').remove()" 
                    style="background: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px;">
                Got it! 👍
            </button>
            <button onclick="copyToClipboard('${JSON.stringify(doc).replace(/'/g, "\\'")}'); showNotification('Copied to clipboard!', 'success');"
                    style="background: #2196F3; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 16px; margin-left: 10px;">
                Copy Code 📋
            </button>
        </div>
    `;
    
    document.body.appendChild(popup);
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
}

// Delete document with better global sync
async function deleteDocument(button, docName) {
    // Password protection
    const password = prompt('Enter password to delete document:');
    if (password === null) return; // User clicked cancel
    
    if (password !== '9424561528') {
        showNotification('Incorrect password! Document not deleted.', 'error');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete "${docName}"?`)) {
        return;
    }
    
    const person = getCurrentPerson();
    const docCard = button.closest('.document-card');
    const section = docCard.closest('.documents-section');
    const categoryName = section.querySelector('.section-title').textContent.trim();
    const categoryId = section.id;
    
    // Remove from data
    if (documentsData[person] && documentsData[person][categoryName]) {
        documentsData[person][categoryName] = documentsData[person][categoryName].filter(
            doc => doc.name !== docName
        );
    }
    
    // Save to localStorage as backup
    localStorage.setItem('familyDocuments', JSON.stringify(documentsData));
    
    // Remove from UI
    docCard.remove();
    
    // Update count
    updateCategoryCount(categoryId);
    
    // Show sync instructions
    console.log('\n🗑️ DOCUMENT DELETED - SYNC INSTRUCTIONS:');
    console.log('=========================================');
    console.log('To remove this document from ALL devices:');
    console.log('1. Update docs-data.js file');
    console.log('2. Remove the deleted document entry');
    console.log('3. Save, commit and push to GitHub');
    console.log('4. Document will be removed from all devices! 🌍');
    
    showNotification('Document deleted! Update docs-data.js to sync deletion globally.', 'warning');
}

// Loading and notification functions
function showLoadingMessage(message) {
    let loader = document.getElementById('loadingMessage');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loadingMessage';
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        document.body.appendChild(loader);
    }
    
    loader.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span>${message}</span>
    `;
    loader.style.display = 'flex';
}

function hideLoadingMessage() {
    const loader = document.getElementById('loadingMessage');
    if (loader) {
        loader.style.display = 'none';
    }
}

// Show notification with better styling
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        font-size: 14px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 6000);
}

// Search functionality
function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm === '') {
                // Reset: show all categories, hide all document sections
                document.querySelectorAll('.category-card').forEach(card => {
                    card.style.display = 'block';
                });
                document.querySelectorAll('.documents-section').forEach(section => {
                    section.style.display = 'none';
                });
                return;
            }
            
            let hasResults = false;
            
            // Search through all document cards
            document.querySelectorAll('.documents-section').forEach(section => {
                const documentsInSection = section.querySelectorAll('.document-card');
                let sectionHasMatch = false;
                
                documentsInSection.forEach(card => {
                    const docName = card.querySelector('.doc-name').textContent.toLowerCase();
                    if (docName.includes(searchTerm)) {
                        card.style.display = 'flex';
                        sectionHasMatch = true;
                        hasResults = true;
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // Show section if it has matching documents
                if (sectionHasMatch) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
            
            // Hide category cards during search
            document.querySelectorAll('.category-card').forEach(card => {
                card.style.display = 'none';
            });
        });
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addDocModal');
    if (event.target === modal) {
        closeAddDocModal();
    }
}

// Initialize on page load with global sync and add refresh button
document.addEventListener('DOMContentLoaded', function() {
    initializeDocuments();
    setupSearchFunctionality();
    addRefreshButton();
});

// Add a refresh button to force reload documents
function addRefreshButton() {
    const navbar = document.querySelector('.nav-container');
    if (navbar) {
        const refreshBtn = document.createElement('button');
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Sync';
        refreshBtn.style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 10px;
        `;
        refreshBtn.onclick = function() {
            showNotification('Refreshing global sync...', 'info');
            location.reload();
        };
        navbar.appendChild(refreshBtn);
    }
}

console.log('🌍 Ultra-reliable global sync system loaded! 🔄');