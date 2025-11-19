// Password verification for Harsh's page
function verifyPassword() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');
    
    // Credentials for Harsh
    if (username === 'harsh' && password === '9424561528') {
        // Hide modal and show content
        document.getElementById('passwordModal').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        errorMsg.classList.remove('active');
    } else {
        errorMsg.textContent = 'Invalid username or password!';
        errorMsg.classList.add('active');
    }
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

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        document.querySelectorAll('.category-card').forEach(card => {
            card.style.display = 'block';
        });
        document.querySelectorAll('.documents-section').forEach(section => {
            section.style.display = 'none';
        });
        return;
    }
    
    let hasResults = false;
    
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
        
        if (sectionHasMatch) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
    
    document.querySelectorAll('.category-card').forEach(card => {
        card.style.display = 'none';
    });
});

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

console.log('Harsh protected page loaded! 🔒');