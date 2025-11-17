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

console.log('Member page loaded successfully! 🎉');
