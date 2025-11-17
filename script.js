// Document Database Structure
// TO ADD MORE DOCUMENTS: Just copy-paste a document object and update the details
const documentDatabase = {
    manorama: {
        name: "Manorama",
        categories: {
            "Gov doc": [
                // DOCUMENT TEMPLATE - Copy from here to add more documents
                {
                    name: "Aadhaar Card",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
                // DOCUMENT TEMPLATE - Copy to here
                // Add more documents by copying the above structure
            ],
            "bank doc": [
                {
                    name: "Bank Passbook",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ]
        }
    },
    manoj: {
        name: "Manoj",
        categories: {
            "Gov doc": [
                {
                    name: "Aadhaar Card",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ],
            "Bank doc": [
                {
                    name: "Bank Statement",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ],
            "Car doc": [
                {
                    name: "Vehicle Registration",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ],
            "Other doc": [
                {
                    name: "Insurance Policy",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ]
        }
    },
    mamta: {
        name: "Mamta",
        categories: {
            "Gov doc": [
                {
                    name: "Aadhaar Card",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ],
            "bank doc": [
                {
                    name: "Bank Passbook",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ]
        }
    },
    krati: {
        name: "Krati",
        categories: {
            "Gov doc": [
                {
                    name: "Aadhaar Card",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ],
            "bank doc": [
                {
                    name: "Bank Account Details",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ],
            "college doc": [
                {
                    name: "Degree Certificate",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ]
        }
    },
    harsh: {
        name: "Harsh",
        protected: true,
        categories: {
            "Gov doc": [
                {
                    name: "Aadhaar Card",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ],
            "bank doc": [
                {
                    name: "Bank Statement",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ]
        }
    },
    pradeep: {
        name: "Pradeep",
        categories: {
            "Gov doc": [
                {
                    name: "Aadhaar Card",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ],
            "bank doc": [
                {
                    name: "Bank Passbook",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ]
        }
    },
    sandeep: {
        name: "Sandeep",
        categories: {
            "Gov doc": [
                {
                    name: "Aadhaar Card",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ],
            "bank doc": [
                {
                    name: "Bank Statement",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ]
        }
    }
    
    // TO ADD NEW MEMBER: Copy the template below and uncomment
    /*
    newmember: {
        name: "New Member Name",
        categories: {
            "Category 1": [
                {
                    name: "Document Name",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ],
            "Category 2": [
                {
                    name: "Document Name",
                    link: "https://drive.google.com/file/d/YOUR_FILE_ID/view",
                    type: "pdf",
                    addedDate: "2024-01-15"
                }
            ]
        }
    }
    */
};

// Global State
let currentMember = null;
let currentCategory = null;

// Navigation Functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function viewMember(memberId) {
    const member = documentDatabase[memberId];
    
    // Check if password protected
    if (member.protected) {
        currentMember = memberId;
        showPasswordModal();
        return;
    }
    
    loadMemberCategories(memberId);
}

function loadMemberCategories(memberId) {
    currentMember = memberId;
    const member = documentDatabase[memberId];
    
    document.getElementById('memberNameTitle').textContent = member.name + "'s Documents";
    
    const categoriesGrid = document.getElementById('categoriesGrid');
    categoriesGrid.innerHTML = '';
    
    const categoryIcons = {
        "Gov doc": "fa-landmark",
        "Bank doc": "fa-building-columns",
        "Car doc": "fa-car",
        "Other doc": "fa-folder",
        "college doc": "fa-graduation-cap"
    };
    
    Object.keys(member.categories).forEach(categoryName => {
        const documents = member.categories[categoryName];
        const icon = categoryIcons[categoryName] || "fa-folder";
        
        // CATEGORY CARD TEMPLATE - Easy to understand structure
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.onclick = () => viewCategory(memberId, categoryName);
        categoryCard.innerHTML = `
            <div class="category-icon">
                <i class="fas ${icon}"></i>
            </div>
            <h3 class="category-name">${categoryName}</h3>
            <p class="category-count">${documents.length} document(s)</p>
        `;
        categoriesGrid.appendChild(categoryCard);
    });
    
    showPage('categoriesPage');
}

function viewCategory(memberId, categoryName) {
    currentCategory = categoryName;
    const member = documentDatabase[memberId];
    const documents = member.categories[categoryName];
    
    document.getElementById('categoryTitle').textContent = categoryName;
    
    const documentsGrid = document.getElementById('documentsGrid');
    documentsGrid.innerHTML = '';
    
    if (documents.length === 0) {
        documentsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No documents in this category yet</p>
            </div>
        `;
    } else {
        documents.forEach(doc => {
            // DOCUMENT CARD TEMPLATE - Easy to copy structure
            const docCard = document.createElement('div');
            docCard.className = 'document-card';
            
            const fileIcon = getFileIcon(doc.type);
            
            docCard.innerHTML = `
                <div class="doc-icon">
                    <i class="fas ${fileIcon}"></i>
                </div>
                <div class="doc-info">
                    <h4 class="doc-name">${doc.name}</h4>
                    <p class="doc-meta">Added: ${doc.addedDate}</p>
                </div>
                <a href="${doc.link}" target="_blank" class="doc-link">
                    <i class="fas fa-external-link-alt"></i> Open
                </a>
            `;
            documentsGrid.appendChild(docCard);
        });
    }
    
    showPage('documentsPage');
}

function getFileIcon(type) {
    const icons = {
        pdf: 'fa-file-pdf',
        doc: 'fa-file-word',
        docx: 'fa-file-word',
        xls: 'fa-file-excel',
        xlsx: 'fa-file-excel',
        jpg: 'fa-file-image',
        png: 'fa-file-image',
        jpeg: 'fa-file-image'
    };
    return icons[type] || 'fa-file';
}

function goBack() {
    showPage('landingPage');
    currentMember = null;
}

function goBackToCategories() {
    loadMemberCategories(currentMember);
    currentCategory = null;
}

// Password Protection for Harsh
function showPasswordModal() {
    document.getElementById('passwordModal').classList.add('active');
    document.getElementById('errorMsg').classList.remove('active');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function closeModal() {
    document.getElementById('passwordModal').classList.remove('active');
}

function verifyPassword() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    
    // Credentials for Harsh
    if (username === 'harsh' && password === '9424561528') {
        closeModal();
        loadMemberCategories('harsh');
    } else {
        errorMsg.textContent = 'Invalid username or password!';
        errorMsg.classList.add('active');
    }
}

// Search Functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        document.querySelectorAll('.member-card').forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    document.querySelectorAll('.member-card').forEach(card => {
        const memberName = card.querySelector('.member-name').textContent.toLowerCase();
        if (memberName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('passwordModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Allow Enter key to submit password
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verifyPassword();
    }
});

document.getElementById('username').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('password').focus();
    }
});

console.log('Family Document Archive System Loaded Successfully! 🎉');
console.log('To add more documents, edit the documentDatabase object in script.js');
