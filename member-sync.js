// GitHub-based document management system
// This version stores data in GitHub repository for cross-device sync

const GITHUB_CONFIG = {
    owner: 'harshcoc',
    repo: 'document',
    filePath: 'documents-data.json',
    branch: 'main'
};

let documentsData = {};
let isLoading = false;

// Load documents from GitHub
async function loadDocumentsFromGitHub() {
    if (isLoading) return;
    isLoading = true;
    
    try {
        showLoadingMessage('Loading documents...');
        
        // Try to fetch from GitHub
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`
        );
        
        if (response.ok) {
            const data = await response.json();
            const content = atob(data.content);
            documentsData = JSON.parse(content);
        } else {
            console.log('No documents data found, starting fresh');
            documentsData = getDefaultDocumentsData();
        }
        
        hideLoadingMessage();
        displayDocuments();
        
    } catch (error) {
        console.error('Error loading from GitHub:', error);
        hideLoadingMessage();
        
        // Fallback to localStorage
        const localData = localStorage.getItem('familyDocuments');
        if (localData) {
            documentsData = JSON.parse(localData);
            displayDocuments();
            showNotification('Loaded from local storage. Some documents may not be synced across devices.', 'warning');
        } else {
            documentsData = getDefaultDocumentsData();
            displayDocuments();
        }
    }
    
    isLoading = false;
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

// Save documents to GitHub (requires personal access token)
async function saveDocumentsToGitHub() {
    try {
        showLoadingMessage('Saving document...');
        
        // For now, save to localStorage as backup
        localStorage.setItem('familyDocuments', JSON.stringify(documentsData));
        
        hideLoadingMessage();
        showNotification('Document saved! Note: Auto-sync to GitHub requires setup.', 'info');
        
        // Instructions for user to manually commit
        console.log('To enable auto-sync, you need to:');
        console.log('1. Create a GitHub Personal Access Token');
        console.log('2. Add it to the code');
        console.log('3. Or manually update documents-data.json file');
        
    } catch (error) {
        console.error('Error saving to GitHub:', error);
        hideLoadingMessage();
        
        // Fallback to localStorage
        localStorage.setItem('familyDocuments', JSON.stringify(documentsData));
        showNotification('Saved locally. Please manually update the repository for cross-device sync.', 'warning');
    }
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

// Initialize documents system
function initializeDocuments() {
    loadDocumentsFromGitHub();
}

// Get current page person name from title
function getCurrentPerson() {
    const title = document.title;
    return title.split(' - ')[0].toLowerCase();
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

// Save new document
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
    
    // Save to GitHub/localStorage
    await saveDocumentsToGitHub();
    
    // Add to UI
    const grid = section.querySelector('.documents-grid');
    addDocumentCard(grid, docName, docLink, currentDate, true);
    
    // Update count
    updateCategoryCount(categoryId);
    
    // Close modal
    closeAddDocModal();
    
    // Show success message
    showNotification('Document added successfully!', 'success');
}

// Delete document
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
    
    // Save to GitHub/localStorage
    await saveDocumentsToGitHub();
    
    // Remove from UI
    docCard.remove();
    
    // Update count
    updateCategoryCount(categoryId);
    
    showNotification('Document deleted successfully!', 'success');
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

// Show notification
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
        border-radius: 5px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
    }, 5000);
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
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
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addDocModal');
    if (event.target === modal) {
        closeAddDocModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDocuments();
});

console.log('GitHub-synced member page loaded successfully! 🎉');