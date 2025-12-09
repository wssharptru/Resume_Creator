// DOCX Generation Logic

function generateDocxFromHTML(data, targetDoc) {
    // Show notification
    const docToUse = targetDoc || document;
    const notification = docToUse.getElementById('download-notification');
    if (notification) {
        notification.style.display = 'flex';
        notification.textContent = 'Generating and downloading your resume...';
    }

    // Get the resume HTML content
    let resumeContent;
    if (data.selectedTemplate === 'classic') {
        resumeContent = getClassicTemplateHTML(data, true);
    } else if (data.selectedTemplate === 'executive') {
        resumeContent = getExecutiveTemplateHTML(data, true);
    } else {
        resumeContent = getModernTemplateHTML(data, true);
    }

    try {
        // Get CSS
        const css = getResumeCSS();

        // Construct full HTML with styles
        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    ${css}
                    /* Additional print/docx specific overrides if needed */
                    body { background: white; font-family: "Calibri", sans-serif; }
                    .resume-classic, .resume-modern, .resume-executive { margin: 0; box-shadow: none; }
                </style>
            </head>
            <body>
                ${resumeContent}
            </body>
            </html>
        `;

        // Convert to DOCX
        // Note: html-docx-js might be loaded as 'htmlDocx' global
        const converted = htmlDocx.asBlob(fullHTML, {
            orientation: 'portrait',
            margins: { top: 720, right: 720, bottom: 720, left: 720 } // Twips (1440 twips = 1 inch)
        });

        // Download
        const url = window.URL.createObjectURL(converted);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.contact.fullName.replace(/\s+/g, '_')}_Resume.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Update notification
        if (notification) {
            notification.textContent = 'Download started! You can close this window now.';
            notification.style.backgroundColor = '#d4edda';
            notification.style.color = '#155724';
            notification.style.borderColor = '#c3e6cb';
        }
    } catch (err) {
        console.error('Error generating DOCX:', err);
        if (notification) {
            notification.textContent = 'Error generating DOCX. Please try again.';
            notification.style.backgroundColor = '#f8d7da';
            notification.style.color = '#721c24';
            notification.style.borderColor = '#f5c6cb';
        }
    }
}
