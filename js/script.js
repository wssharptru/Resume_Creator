const resumeData = {
    selectedTemplate: 'classic' // Default
};
const functions = firebase.functions();
let currentStep = 1;

// --- DOM Elements ---
const signInLink = document.getElementById('signInLink');
const userInfo = document.getElementById('userInfo');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const authModal = document.getElementById('authModal');
const builderModal = document.getElementById('builderModal');

// --- Firebase Auth Functions ---
// Note: Core auth logic (init, sign in/up/out) is now handled in auth.js
// UI updates are handled by the global auth state listener in auth.js

function openBuilder() {
    if (auth.currentUser) {
        builderModal.classList.add('active');
        currentStep = 1;
        
        // Initialize with one empty entry if empty
        if (!document.querySelector('#experience-container .entry-group')) {
            addExperienceEntry();
        }
        if (!document.querySelector('#education-container .entry-group')) {
            addEducationEntry();
        }
        
        showStep(1);
    } else {
        // Should not happen if redirect works, but as a fallback:
        window.location.href = 'login.html';
    }
}

        function closeBuilder() {
            document.getElementById('builderModal').classList.remove('active');
        }

        function nextStep(step) {
            if (validateStep(currentStep)) {
                saveStepData(currentStep);
                currentStep = step;
                showStep(step);
            } else {
                alert('Please fill in all required fields');
            }
        }

        function prevStep(step) {
            saveStepData(currentStep);
            currentStep = step;
            showStep(step);
        }

        function showStep(step) {
            for (let i = 1; i <= 4; i++) {
                const stepEl = document.getElementById(`step${i}`);
                if (stepEl) {
                    stepEl.style.display = i === step ? 'block' : 'none';
                }
            }
        }

        function validateStep(step) {
            if (step === 1) {
                return document.getElementById('fullName').value.trim() !== '' &&
                       document.getElementById('email').value.trim() !== '' &&
                       document.getElementById('phone').value.trim() !== '';
            }
            if (step === 2) {
                // Check if at least one job title and company are filled
                const titles = document.querySelectorAll('#experience-container .job-title-input');
                const companies = document.querySelectorAll('#experience-container .company-input');
                let valid = false;
                for(let i=0; i<titles.length; i++) {
                    if(titles[i].value.trim() !== '' && companies[i].value.trim() !== '') {
                        valid = true;
                        break;
                    }
                }
                return valid;
            }
            if (step === 3) {
                // Check if at least one school and degree are filled
                const schools = document.querySelectorAll('#education-container .school-input');
                const degrees = document.querySelectorAll('#education-container .degree-input');
                let valid = false;
                for(let i=0; i<schools.length; i++) {
                    if(schools[i].value.trim() !== '' && degrees[i].value.trim() !== '') {
                        valid = true;
                        break;
                    }
                }
                return valid;
            }
            return true;
        }

        function saveStepData(step) {
            if (step === 1) {
                resumeData.contact = {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    location: document.getElementById('location').value
                };
            } else if (step === 2) {
                resumeData.experience = [];
                const groups = document.querySelectorAll('#experience-container .entry-group');
                groups.forEach(group => {
                    const jobTitle = group.querySelector('.job-title-input').value;
                    const company = group.querySelector('.company-input').value;
                    if (jobTitle && company) { // Only save if required fields are filled
                        resumeData.experience.push({
                            jobTitle: jobTitle,
                            company: company,
                            startDate: group.querySelector('.start-date-input').value,
                            endDate: group.querySelector('.end-date-input').value,
                            description: group.querySelector('.description-input').value
                        });
                    }
                });
            } else if (step === 3) {
                resumeData.education = [];
                const groups = document.querySelectorAll('#education-container .entry-group');
                groups.forEach(group => {
                    const school = group.querySelector('.school-input').value;
                    const degree = group.querySelector('.degree-input').value;
                    if (school && degree) { // Only save if required fields are filled
                        resumeData.education.push({
                            school: school,
                            degree: degree,
                            fieldOfStudy: group.querySelector('.field-input').value,
                            graduationDate: group.querySelector('.grad-date-input').value
                        });
                    }
                });
            } else if (step === 4) {
                resumeData.skills = document.getElementById('skills').value;
            }
        }

        function addExperienceEntry() {
            const container = document.getElementById('experience-container');
            const index = container.children.length;
            const div = document.createElement('div');
            div.className = 'entry-group';
            div.innerHTML = `
                ${index > 0 ? '<button type="button" class="btn-remove" onclick="removeEntry(this)">Remove</button>' : ''}
                <div class="form-group">
                    <label>Job Title *</label>
                    <input type="text" class="job-title-input" placeholder="Software Engineer">
                </div>
                <div class="form-group">
                    <label>Company Name *</label>
                    <input type="text" class="company-input" placeholder="Tech Company Inc.">
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="month" class="start-date-input">
                </div>
                <div class="form-group">
                    <label>End Date (leave blank if current)</label>
                    <input type="month" class="end-date-input">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="description-input" placeholder="Describe your responsibilities and achievements..."></textarea>
                </div>
            `;
            container.appendChild(div);
        }

        function addEducationEntry() {
            const container = document.getElementById('education-container');
            const index = container.children.length;
            const div = document.createElement('div');
            div.className = 'entry-group';
            div.innerHTML = `
                ${index > 0 ? '<button type="button" class="btn-remove" onclick="removeEntry(this)">Remove</button>' : ''}
                <div class="form-group">
                    <label>School/University *</label>
                    <input type="text" class="school-input" placeholder="University of Example">
                </div>
                <div class="form-group">
                    <label>Degree *</label>
                    <input type="text" class="degree-input" placeholder="Bachelor of Science">
                </div>
                <div class="form-group">
                    <label>Field of Study *</label>
                    <input type="text" class="field-input" placeholder="Computer Science">
                </div>
                <div class="form-group">
                    <label>Graduation Date</label>
                    <input type="month" class="grad-date-input">
                </div>
            `;
            container.appendChild(div);
        }

        function removeEntry(btn) {
            btn.closest('.entry-group').remove();
        }

        function completeResume() {
            saveStepData(4);
            
            if (!resumeData.contact || !resumeData.contact.fullName) {
                alert('Please complete all sections');
                return;
            }

            if (resumeData.selectedTemplate === 'modern' || resumeData.selectedTemplate === 'classic' || resumeData.selectedTemplate === 'executive') {
                openPrintableResume(resumeData);
                closeBuilder();
            } else {
                // Fallback for other templates (original behavior)
                const resumeText = generateResume();
                downloadResume(resumeText, resumeData.contact.fullName);
                closeBuilder();
                alert('Resume created successfully! Your download should start shortly.');
            }
        }

        function generateResume() {
            const data = resumeData;
            let resume = `${data.contact.fullName}\n`;
            resume += `${data.contact.email} | ${data.contact.phone}`;
            if (data.contact.location) resume += ` | ${data.contact.location}`;
            resume += `\n\n`;
            
            resume += `PROFESSIONAL EXPERIENCE\n`;
            if (data.experience && data.experience.length > 0) {
                data.experience.forEach(exp => {
                    resume += `${exp.jobTitle}\n`;
                    resume += `${exp.company}\n`;
                    if (exp.startDate) resume += `${exp.startDate} - ${exp.endDate || 'Present'}\n`;
                    if (exp.description) resume += `${exp.description}\n`;
                    resume += `\n`;
                });
            }
            
            resume += `EDUCATION\n`;
            if (data.education && data.education.length > 0) {
                data.education.forEach(edu => {
                    resume += `${edu.degree} in ${edu.fieldOfStudy}\n`;
                    resume += `${edu.school}\n`;
                    if (edu.graduationDate) resume += `Graduated: ${edu.graduationDate}\n`;
                    resume += `\n`;
                });
            }
            
            if (data.skills) {
                resume += `SKILLS\n${data.skills}\n`;
            }
            
            return resume;
        }

        function downloadResume(text, filename) {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', `${filename}_Resume.txt`);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }

        function selectTemplate(template) {
            resumeData.selectedTemplate = template;
            alert(`Selected ${template} template! Opening builder...`);
            openBuilder();
        }

        function openPrintableResume(data) {
            let resumeContent;
            if (data.selectedTemplate === 'classic') {
                resumeContent = getClassicTemplateHTML(data);
            } else if (data.selectedTemplate === 'executive') {
                resumeContent = getExecutiveTemplateHTML(data);
            } else {
                resumeContent = getModernTemplateHTML(data);
            }
            const printWindow = window.open('', '_blank');
            
            if (!printWindow) {
                alert('Please allow popups to view your resume.');
                return;
            }
            // Calculate base URL for assets
            const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${data.contact.fullName} - Resume</title>
                    <base href="${baseUrl}">
                    <link rel="stylesheet" href="css/styles.css?v=${new Date().getTime()}">
                    <style>
                        body { 
                            margin: 0; 
                            background: #555; /* Dark background for contrast in view mode */
                            padding: 20px;
                            display: flex;
                            justify-content: center;
                        }
                        .resume-modern, .resume-classic, .resume-executive {
                            background: white;
                            box-shadow: 0 0 20px rgba(0,0,0,0.5);
                            margin: 0 auto;
                            max-width: 800px; /* A4 width approx */
                            width: 100%;
                        }
                        
                        /* Print Overrides */
                        @media print {
                            body { 
                                background: white; 
                                padding: 0; 
                                display: block;
                            }
                            .resume-modern, .resume-classic, .resume-executive {
                                box-shadow: none;
                                max-width: 100%;
                                width: 100%;
                                margin: 0;
                            }
                            .no-print { 
                                display: none !important; 
                            }
                            /* Ensure background colors print */
                            * {
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                        }
                        
                        .action-bar {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: white;
                            padding: 15px;
                            border-radius: 8px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                            z-index: 1000;
                            display: flex;
                            gap: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="action-bar no-print">
                        <button onclick="window.print()" class="btn btn-primary">Save as PDF / Print</button>
                        <button onclick="window.close()" class="btn btn-outline">Close</button>
                    </div>
                    
                    ${resumeContent}
                    
                    <script>
                        // Auto-print prompt after load
                        window.onload = function() {
                            // Dynamic Margin Adjustment
                            const resume = document.querySelector('.resume-modern, .resume-classic, .resume-executive');
                            if (resume) {
                                const height = resume.scrollHeight;
                                const pageHeight = 1056; // US Letter height in px at 96 DPI (11 inches)
                                const threshold = 50; // Buffer
                                
                                // Check if over 1 page but less than ~1.4 pages (allow it to shrink)
                                console.log('Resume Height:', height, 'Page Height:', pageHeight);
                                if (height > pageHeight + 50 && height < pageHeight + 400) {
                                    resume.classList.add('compact-mode');
                                    console.log('Applied compact mode (1 page fit attempt). Height:', height);
                                } 
                                // Check if slightly over 2 pages
                                else if (height > (pageHeight * 2) + 50 && height < (pageHeight * 2) + 400) {
                                    resume.classList.add('compact-mode');
                                    console.log('Applied compact mode (2 page fit attempt). Height:', height);
                                }
                            }

                            setTimeout(() => {
                                // window.print(); 
                            }, 500);
                        };
                    <\/script>
                </body>
                </html>
            `;
            
            // Revert to document.write for reliable CSS loading from local file system
            // Blob URLs block local resource loading in many browsers
            printWindow.document.write(html);
            printWindow.document.close();
        }

        function getExecutiveTemplateHTML(data) {
            // Helper: Format date to "YYYY-YYYY" or "YYYY-Present"
            const formatDateRange = (startDate, endDate) => {
                const start = startDate ? new Date(startDate).getFullYear() : '';
                const end = endDate ? new Date(endDate).getFullYear() : 'Present';
                return start && end ? `${start}-${end}` : '';
            };

            // Helper: Process skills into 3 columns
            const skillsStr = data.skills || '';
            const skills = skillsStr.split(/,|\n/).map(s => s.trim().replace(/^[\*\-•]\s*/, '')).filter(s => s);
            const columns = [[], [], []];
            skills.forEach((skill, index) => {
                columns[index % 3].push(skill);
            });

            const skillsHTML = columns.map(col => `
                <ul>
                    ${col.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            `).join('');

            // Safe access to experience and education
            const experience = data.experience || [];
            const education = data.education || [];

            // Helper: Extract achievement highlight and bullets from description
            const parseJobDescription = (desc) => {
                if (!desc) return { highlight: '', bullets: [] };
                
                const lines = desc.split('\n').map(l => l.trim()).filter(l => l);
                
                // If first line is bold or doesn't start with bullet, treat as highlight
                let highlight = '';
                let bullets = [];
                
                if (lines.length > 0) {
                    // Check if first line looks like a summary (no bullet point)
                    const firstLine = lines[0].replace(/^[\*\-•]\s*/, '');
                    if (!lines[0].match(/^[\*\-•]/)) {
                        highlight = firstLine;
                        bullets = lines.slice(1).map(l => l.replace(/^[\*\-•]\s*/, ''));
                    } else {
                        bullets = lines.map(l => l.replace(/^[\*\-•]\s*/, ''));
                    }
                }
                
                return { highlight, bullets };
            };

            // Generate experience HTML
            const experienceHTML = experience.map(job => {
                const { highlight, bullets } = parseJobDescription(job.description);
                
                return `
                    <div class="job-block">
                        <div class="job-company-line">
                            <span>${job.company.toUpperCase()}</span>
                            <span>${job.location || ''}</span>
                        </div>
                        <div class="job-title-line">
                            <span>${job.jobTitle.toUpperCase()}</span>
                            <span>${formatDateRange(job.startDate, job.endDate)}</span>
                        </div>
                        ${highlight ? `<div class="job-achievement-highlight">${highlight}</div>` : ''}
                        ${bullets.length > 0 ? `
                            <ul class="job-bullets">
                                ${bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `;
            }).join('');

            // Generate education HTML
            const educationHTML = education.map(edu => {
                const year = edu.graduationDate ? new Date(edu.graduationDate).getFullYear() : '';
                return `
                    <div class="education-block">
                        <div class="education-line">
                            <span class="school-name">${edu.school.toUpperCase()}</span>
                            <span class="edu-date">${year}</span>
                        </div>
                        <div class="degree-info">${edu.degree}${edu.fieldOfStudy ? ': ' + edu.fieldOfStudy : ''}</div>
                    </div>
                `;
            }).join('');

            // Get professional title from first job
            const professionalTitle = experience.length > 0 
                ? experience[0].jobTitle.toUpperCase() 
                : 'PROFESSIONAL';

            // Generate summary tagline (customize as needed)
            const summaryTagline = "Organizational Development • Best Practices • Acquisition Leadership";

            return `
                <div class="resume-executive">
                    <div class="executive-border">
                        <!-- Header -->
                        <div class="resume-header">
                            <div class="header-left">
                                <h1>${data.contact.fullName.toUpperCase()}</h1>
                            </div>
                            <div class="header-right">
                                ${data.contact.phone}<br>
                                ${data.contact.email}<br>
                                ${data.contact.location || ''}
                            </div>
                        </div>

                        <!-- Professional Title -->
                        <div class="job-title-headline">${professionalTitle}</div>

                        <!-- Summary Section -->
                        <div class="summary-section">
                            <div class="summary-tagline">${summaryTagline}</div>
                            <div class="summary-text">
                                Accomplished professional with extensive experience and consummate achievements building multiple best-in-class organizations. A savvy team leader skilled in attracting the most qualified employees and matching them to jobs for which they are well suited. Pivotal contributor to senior operating and leadership executives, providing strategic guidance. Innovative problem solver, strategic decision maker, strong communicator.
                            </div>
                        </div>

                        <!-- Skills Section -->
                        ${skills.length > 0 ? `
                            <div class="skills-section">
                                ${skillsHTML}
                            </div>
                        ` : ''}

                        <!-- Professional Experience -->
                        ${experience.length > 0 ? `
                            <div class="section-title">PROFESSIONAL EXPERIENCE</div>
                            ${experienceHTML}
                        ` : ''}

                        <!-- Education -->
                        ${education.length > 0 ? `
                            <div class="section-title">EDUCATION</div>
                            ${educationHTML}
                        ` : ''}
                    </div>
                </div>
            `;
        }

        function getModernTemplateHTML(data) {
            // Format dates
            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
            };

            // Split skills: handle commas or newlines, and strip markdown bullets
            const processSkills = (skillsStr) => {
                if (!skillsStr) return [];
                return skillsStr.split(/,|\n/).map(s => s.trim().replace(/^[\*\-•]\s*/, '')).filter(s => s);
            };

            const skillsList = processSkills(data.skills).map(s => `<li>${s}</li>`).join('');

            // Split description into bullets if possible, else just text
            const formatDescription = (desc) => {
                if (!desc) return '';
                if (desc.includes('\n') || desc.includes('•')) {
                    return `<ul class="resume-list">${desc.split(/\n|•/).filter(s => s.trim()).map(s => `<li>${s.trim()}</li>`).join('')}</ul>`;
                }
                return `<p class="resume-text">${desc}</p>`;
            };
            
            // Contact info formatting
            let contactHtml = '';
            if (data.contact.location) contactHtml += `<div class="resume-item-subtitle">${data.contact.location}</div>`;
            contactHtml += `<div class="resume-item-subtitle">${data.contact.email}</div>`;
            contactHtml += `<div class="resume-item-subtitle">${data.contact.phone}</div>`;

            return `
                <div class="resume-modern">
                    <div class="resume-header">
                        <div class="header-content">
                            <h1>${data.contact.fullName}</h1>
                            <div class="job-title">${data.experience && data.experience.length > 0 ? data.experience[0].jobTitle : 'PROFESSIONAL'}</div>
                        </div>
                    </div>
                    <div class="resume-body">
                        <div class="resume-left">
                            <div class="resume-section">
                                <div class="resume-section-title">Personal Profile</div>
                                <p class="resume-text">
                                    Extremely motivated to constantly develop my skills and grow professionally. I am confident in my ability to come up with interesting ideas.
                                </p>
                            </div>
                            
                            <div class="resume-section">
                                <div class="resume-section-title">Contact</div>
                                ${contactHtml}
                            </div>
                            
                            <div class="resume-section">
                                <div class="resume-section-title">Education</div>
                                ${data.education ? data.education.map(edu => `
                                <div class="resume-item">
                                    <div class="resume-item-title">${edu.school}</div>
                                    <div class="resume-date">${formatDate(edu.graduationDate)}</div>
                                    <div class="resume-item-subtitle">${edu.degree} in ${edu.fieldOfStudy}</div>
                                </div>
                                `).join('') : ''}
                            </div>
                        </div>
                        
                        <div class="resume-right">
                            <div class="resume-section">
                                <div class="resume-section-title">Skills</div>
                                <ul class="resume-list">
                                    ${skillsList}
                                </ul>
                            </div>
                            
                            <div class="resume-section">
                                <div class="resume-section-title">Work Experience</div>
                                ${data.experience ? data.experience.map((exp, idx) => `
                                <div class="resume-item" ${idx > 0 ? 'style="margin-top: 15px;"' : ''}>
                                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                                        <div class="resume-item-title">${exp.company},</div>
                                        <div style="font-size: 14px; font-weight: normal;">${exp.jobTitle}</div>
                                    </div>
                                    <div class="resume-date" style="font-size: 11px; color: #999; margin-bottom: 8px;">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'PRESENT'}</div>
                                    ${formatDescription(exp.description)}
                                </div>
                                `).join('') : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function getClassicTemplateHTML(data) {
            // Format dates
            const formatDate = (dateStr) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            };

            // Split skills into two columns: handle commas or newlines, and strip markdown bullets
            const processSkills = (skillsStr) => {
                if (!skillsStr) return [];
                return skillsStr.split(/,|\n/).map(s => s.trim().replace(/^[\*\-•]\s*/, '')).filter(s => s);
            };

            const skills = processSkills(data.skills);
            const midPoint = Math.ceil(skills.length / 2);
            const col1 = skills.slice(0, midPoint).map(s => `<li>${s}</li>`).join('');
            const col2 = skills.slice(midPoint).map(s => `<li>${s}</li>`).join('');

            // Format description
            const formatDescription = (desc) => {
                if (!desc) return '';
                if (desc.includes('\n') || desc.includes('•')) {
                    return `<ul class="job-bullets">${desc.split(/\n|•/).filter(s => s.trim()).map(s => `<li>${s.trim()}</li>`).join('')}</ul>`;
                }
                return `<ul class="job-bullets"><li>${desc}</li></ul>`;
            };

            return `
                <div class="resume-classic">
                    <div class="resume-container">
                        <header class="resume-header">
                            <h1>${data.contact.fullName.toUpperCase()}</h1>
                            <p class="contact">
                                ${data.contact.location ? `${data.contact.location} | ` : ''}${data.contact.phone} | ${data.contact.email}
                            </p>
                        </header>

                        <section>
                            <h2 class="section-title">PROFESSIONAL SUMMARY</h2>
                            <p class="summary">
                                Motivated professional with experience in the industry. Dedicated to achieving results and contributing to team success.
                                Implement cost control measures to ensure operations remain within company targets. Maximize bottom-line performance.
                            </p>
                        </section>

                        <section>
                            <h2 class="section-title">SKILLS</h2>
                            <div class="skills-columns">
                                <ul>${col1}</ul>
                                <ul>${col2}</ul>
                            </div>
                        </section>

                        <section>
                            <h2 class="section-title">WORK HISTORY</h2>
                            ${data.experience ? data.experience.map(exp => `
                            <div class="job-block">
                                <p class="job-dates">${formatDate(exp.startDate).toUpperCase()} - ${exp.endDate ? formatDate(exp.endDate).toUpperCase() : 'CURRENT'}</p>
                                <p class="job-title">
                                    ${exp.jobTitle} | ${exp.company}
                                </p>
                                ${formatDescription(exp.description)}
                            </div>
                            `).join('') : ''}
                        </section>

                        <section>
                            <h2 class="section-title">EDUCATION</h2>
                            ${data.education ? data.education.map(edu => `
                            <p class="education-block">
                                <span class="edu-year">${new Date(edu.graduationDate).getFullYear()}</span><br />
                                <em>${edu.degree}: ${edu.fieldOfStudy}</em><br />
                                ${edu.school}
                            </p>
                            `).join('') : ''}
                        </section>
                    </div>
                </div>
            `;
        }

        function toggleFAQ(element) {
            element.closest('.faq-item').classList.toggle('active');
        }

        // Close modal when clicking outside
        document.getElementById('builderModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeBuilder();
            }
        });

        function saveResumeData() {
            // Ensure current step data is saved to the object
            saveStepData(currentStep);
            
            const dataStr = JSON.stringify(resumeData, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = "resume_data.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function loadResumeData(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const loadedData = JSON.parse(e.target.result);
                    
                    // Preserve currently selected template
                    const currentTemplate = resumeData.selectedTemplate;
                    
                    // Update resumeData object
                    Object.assign(resumeData, loadedData);
                    
                    // Restore selected template
                    resumeData.selectedTemplate = currentTemplate;
                    
                    // Update UI
                    // Step 1: Contact
                    if (resumeData.contact) {
                        document.getElementById('fullName').value = resumeData.contact.fullName || '';
                        document.getElementById('email').value = resumeData.contact.email || '';
                        document.getElementById('phone').value = resumeData.contact.phone || '';
                        document.getElementById('location').value = resumeData.contact.location || '';
                    }

                    // Step 2: Experience
                    const expContainer = document.getElementById('experience-container');
                    expContainer.innerHTML = ''; // Clear existing
                    if (resumeData.experience && resumeData.experience.length > 0) {
                        resumeData.experience.forEach(exp => {
                            addExperienceEntry();
                            const lastGroup = expContainer.lastElementChild;
                            lastGroup.querySelector('.job-title-input').value = exp.jobTitle || '';
                            lastGroup.querySelector('.company-input').value = exp.company || '';
                            lastGroup.querySelector('.start-date-input').value = exp.startDate || '';
                            lastGroup.querySelector('.end-date-input').value = exp.endDate || '';
                            lastGroup.querySelector('.description-input').value = exp.description || '';
                        });
                    } else {
                        addExperienceEntry(); // Add one empty if none
                    }

                    // Step 3: Education
                    const eduContainer = document.getElementById('education-container');
                    eduContainer.innerHTML = ''; // Clear existing
                    if (resumeData.education && resumeData.education.length > 0) {
                        resumeData.education.forEach(edu => {
                            addEducationEntry();
                            const lastGroup = eduContainer.lastElementChild;
                            lastGroup.querySelector('.school-input').value = edu.school || '';
                            lastGroup.querySelector('.degree-input').value = edu.degree || '';
                            lastGroup.querySelector('.field-input').value = edu.fieldOfStudy || '';
                            lastGroup.querySelector('.grad-date-input').value = edu.graduationDate || '';
                        });
                    } else {
                        addEducationEntry(); // Add one empty if none
                    }

                    // Step 4: Skills
                    if (resumeData.skills) {
                        document.getElementById('skills').value = resumeData.skills;
                    }

                    alert('Resume data loaded successfully!');
                    
                    // Reset file input so same file can be selected again if needed
                    event.target.value = '';
                    
                    // Go to step 1
                    currentStep = 1;
                    showStep(1);

                } catch (error) {
                    console.error('Error loading JSON:', error);
                    alert('Error loading file. Please make sure it is a valid JSON file.');
                }
            };
            reader.readAsText(file);
        }

        // --- Auth Modal UI Functions ---
        function openAuthModal() {
            authModal.classList.add('active');
        }

        function closeAuthModal() {
            authModal.classList.remove('active');
        }

        function toggleAuthForm(form) {
            const signInForm = document.getElementById('signInForm');
            const signUpForm = document.getElementById('signUpForm');
            const authTitle = document.getElementById('authTitle');

            if (form === 'signUp') {
                signInForm.style.display = 'none';
                signUpForm.style.display = 'block';
                authTitle.textContent = 'Sign Up';
            } else {
                signUpForm.style.display = 'none';
                signInForm.style.display = 'block';
                authTitle.textContent = 'Sign In';
            }
        }

        // --- AI Polish Feature ---

        async function polishContent(section) {
            // Check if there is anything to polish
            let hasContent = false;
            if (section === 'skills') {
                const val = document.getElementById('skills').value;
                if (val && val.trim() !== '') hasContent = true;
            } else if (section === 'experience') {
                const descriptions = document.querySelectorAll('.description-input');
                for (let i = 0; i < descriptions.length; i++) {
                    if (descriptions[i].value && descriptions[i].value.trim() !== '') {
                        hasContent = true;
                        break;
                    }
                }
            }

            if (!hasContent) {
                alert('Please enter some text to polish first.');
                return;
            }

            const originalText = '✨ Polish with AI';
            const buttons = document.querySelectorAll('.btn-ai-polish');
            buttons.forEach(btn => {
                btn.disabled = true;
                btn.innerHTML = '✨ Polishing...';
            });

            try {
                const polishFunction = functions.httpsCallable('polishContent');

                if (section === 'skills') {
                    const targetElement = document.getElementById('skills');
                    const textToPolish = targetElement.value;
                    
                    const prompt = `Rewrite the following skills to be professional and concise. Format as a bulleted list with each skill on a separate line. Do not use markdown formatting like **bold**. Text: "${textToPolish}"`;
                    
                    const result = await polishFunction({ prompt: prompt });
                    if (result.data && result.data.text) {
                        targetElement.value = result.data.text;
                    }
                } else if (section === 'experience') {
                    const descriptions = document.querySelectorAll('.description-input');
                    const promises = [];
                    
                    // Determine prompt style based on template
                    const isModern = resumeData.selectedTemplate === 'modern';
                    
                    descriptions.forEach(descInput => {
                        const text = descInput.value;
                        if (text && text.trim() !== '') {
                            let prompt = `Rewrite the following work-experience text to be professional, concise, and achievement-oriented. Preserve the original meaning and accuracy, but you may add common responsibilities or duties that are typically associated with this job title if the provided content is incomplete. Do NOT invent accomplishments, metrics, awards, or results that are not implied. You may add realistic day-to-day responsibilities, scope details, or context that aligns with standard industry expectations for this role. Use strong action verbs, improve clarity, and keep the tone appropriate for a resume. Return ONLY the rewritten text, formatted as clean resume-ready bullet points or short paragraphs (whichever fits the input best).`;
                            
                            if (isModern) {
                                prompt += ` Do NOT use bullet points. Separate distinct achievements with a newline character.`;
                            } else {
                                prompt += ` Use bullet points for each achievement.`;
                            }
                            
                            prompt += ` Text: "${text}"`;
                            
                            // Call Cloud Function for each description
                            promises.push(polishFunction({ prompt: prompt }).then(result => {
                                if (result.data && result.data.text) descInput.value = result.data.text;
                            }));
                        }
                    });
                    
                    await Promise.all(promises);
                }
            } catch (error) {
                console.error('Error polishing text:', error);
                alert('Failed to polish text. Please try again later.');
            } finally {
                buttons.forEach(btn => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                });
            }
        }

        // --- Initialize App ---
        document.addEventListener('DOMContentLoaded', () => {
            // initFirebaseAuth is now handled by auth.js listener, but we can keep this if needed for other init
            // initFirebaseAuth(); 
        });
