// Simple document display system - Read-only
function getCurrentPerson() {
    const title = document.title;
    return title.split(' - ')[0].toLowerCase();
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupSearchFunctionality();
});

console.log('Simple document viewer loaded! 📄');