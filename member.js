// Initialize local storage for documents
function initializeDocuments() {
    if (!localStorage.getItem('familyDocuments')) {
        localStorage.setItem('familyDocuments', JSON.stringify({}));
    }
}

// Get current page person name from title
function getCurrentPerson() {
    const title = document.title;
    return title.split(' - ')[0].toLowerCase();
}

// Load documents from localStorage
function loadDocuments() {
    const person = getCurrentPerson();
    const allDocs = JSON.parse(localStorage.getItem('familyDocuments') || '{}');
    
    if (!allDocs[person]) {
        allDocs[person] = {};
    }
    
    // Add stored documents to each category
    Object.keys(allDocs[person]).forEach(category => {
        const categoryId = category.replace(/ /g, '-').toLowerCase();
        const section = document.getElementById(categoryId);
        
        if (section && allDocs[person][category].length > 0) {
            const grid = section.querySelector('.documents-grid');
            
            allDocs[person][category].forEach(doc => {
                addDocumentCard(grid, doc.name, doc.link, doc.date);
            });
            
            updateCategoryCount(categoryId);
        }
    });
}

// Add document card to grid
function addDocumentCard(grid, name, link, date) {
    const docCard = document.createElement('div');
    docCard.className = 'document-card';
    docCard.innerHTML = `
        <div class="doc-icon">
            <i class="fas fa-file-pdf"></i>
        </div>
        <div class="doc-info">
            <h4 class="doc-name">${name}</h4>
            <p class="doc-meta">Added: ${date}</p>
        </div>
        <a href="${link}" target="_blank" class="doc-link">
            <i class="fas fa-external-link-alt"></i> Open
        </a>
        <button class="delete-btn" onclick="deleteDocument(this, '${name}')">
            <i class="fas fa-trash"></i>
        </button>
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
        if (card.querySelector('.category-name').textContent === categoryName) {
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
function saveDocument() {
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
    
    // Get existing documents
    const allDocs = JSON.parse(localStorage.getItem('familyDocuments') || '{}');
    
    if (!allDocs[person]) {
        allDocs[person] = {};
    }
    
    if (!allDocs[person][categoryName]) {
        allDocs[person][categoryName] = [];
    }
    
    // Add new document
    const newDoc = {
        name: docName,
        link: docLink,
        date: currentDate
    };
    
    allDocs[person][categoryName].push(newDoc);
    localStorage.setItem('familyDocuments', JSON.stringify(allDocs));
    
    // Add to UI
    const grid = section.querySelector('.documents-grid');
    addDocumentCard(grid, docName, docLink, currentDate);
    
    // Update count
    updateCategoryCount(categoryId);
    
    // Close modal
    closeAddDocModal();
    
    // Show success message
    showNotification('Document added successfully!', 'success');
}

// Delete document
function deleteDocument(button, docName) {
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
    
    // Remove from localStorage
    const allDocs = JSON.parse(localStorage.getItem('familyDocuments') || '{}');
    
    if (allDocs[person] && allDocs[person][categoryName]) {
        allDocs[person][categoryName] = allDocs[person][categoryName].filter(
            doc => doc.name !== docName
        );
        localStorage.setItem('familyDocuments', JSON.stringify(allDocs));
    }
    
    // Remove from UI
    docCard.remove();
    
    // Update count
    updateCategoryCount(categoryId);
    
    showNotification('Document deleted successfully!', 'success');
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const allDocCards = document.querySelectorAll('.document-card');
    
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
    loadDocuments();
});

console.log('Member page loaded successfully! 🎉');