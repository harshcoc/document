// Update Script - Copy the modal code below and add it to:
// - sandeep.html
// - pradeep.html
// - manoj.html (if not already added)
// - harsh.html (special case - needs harsh.js instead of member.js)

// MODAL CODE TO ADD BEFORE </body> tag:
/*
    <!-- Add Document Modal -->
    <div id="addDocModal" class="modal">
        <div class="modal-content">
            <h2>
                <i class="fas fa-plus-circle"></i> Add New Document
            </h2>
            <p>Add document to <strong id="modalCategoryName"></strong></p>
            <input type="hidden" id="modalCategoryId">
            
            <div class="form-group">
                <label for="docName">Document Name</label>
                <input type="text" id="docName" placeholder="e.g., Passport, PAN Card">
            </div>
            
            <div class="form-group">
                <label for="docLink">Google Drive Link</label>
                <input type="text" id="docLink" placeholder="https://drive.google.com/...">
            </div>
            
            <div class="modal-buttons">
                <button class="cancel-btn" onclick="closeAddDocModal()">Cancel</button>
                <button class="submit-btn" onclick="saveDocument()">Add Document</button>
            </div>
            <p id="addDocError" class="error-msg"></p>
        </div>
    </div>
*/

// Also replace each category section title from:
/*
<h3 class="section-title">
    <i class="fas fa-landmark"></i> Gov doc
</h3>
*/

// To:
/*
<div class="section-header">
    <h3 class="section-title">
        <i class="fas fa-landmark"></i> Gov doc
    </h3>
    <button class="add-doc-btn" onclick="showAddDocModal('gov-doc')">
        <i class="fas fa-plus"></i> Add Document
    </button>
</div>
*/
