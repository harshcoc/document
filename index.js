// Search Functionality for Landing Page
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        document.querySelectorAll('.member-card-link').forEach(link => {
            link.style.display = 'block';
        });
        return;
    }
    
    document.querySelectorAll('.member-card-link').forEach(link => {
        const memberName = link.querySelector('.member-name').textContent.toLowerCase();
        if (memberName.includes(searchTerm)) {
            link.style.display = 'block';
        } else {
            link.style.display = 'none';
        }
    });
});

console.log('Family Document Archive - Landing Page Loaded! 🎉');
