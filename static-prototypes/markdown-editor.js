// Get DOM elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const editorTextarea = document.querySelector('.editor-textarea');
const previewContent = document.querySelector('.preview-content');

// Tab switching functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active content
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(targetTab).classList.add('active');
        
        // If switching to preview, render the markdown
        if (targetTab === 'preview') {
            renderMarkdown();
        }
    });
});

// Render markdown to preview
function renderMarkdown() {
    const markdownText = editorTextarea.value;
    const htmlContent = marked.parse(markdownText);
    previewContent.innerHTML = htmlContent;
}

// Auto-focus on textarea when page loads
window.addEventListener('DOMContentLoaded', () => {
    editorTextarea.focus();
});

// Optional: Live preview update (can be enabled if desired)
// editorTextarea.addEventListener('input', () => {
//     if (document.getElementById('preview').classList.contains('active')) {
//         renderMarkdown();
//     }
// });