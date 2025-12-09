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
                resumeData.experienceLevel = document.getElementById('experienceLevel').value;
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
                            /* box-shadow: 0 0 20px rgba(0,0,0,0.5); Removed per user request */
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
                                box-shadow: none !important;
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
                        <button onclick="window.opener.generateDocxFromHTML(${JSON.stringify(data).replace(/"/g, '&quot;')}, document)" class="btn btn-primary" style="background-color: #2b579a; color: white;">Download DOCX</button>
                        <button onclick="window.close()" class="btn btn-outline">Close</button>
                    </div>
                    <div id="download-notification" class="no-print" style="display: none; position: fixed; top: 80px; right: 20px; background: #fff3cd; color: #856404; padding: 15px; border: 1px solid #ffeeba; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        Downloading...
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
            
            // Expose generateDocxFromHTML to the new window
            printWindow.generateDocxFromHTML = generateDocxFromHTML;
        }


        // Template functions and DOCX generation have been moved to:
        // - js/utils.js
        // - js/templates.js
        // - js/docx-generator.js


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
                        if (resumeData.experienceLevel) {
                            document.getElementById('experienceLevel').value = resumeData.experienceLevel;
                        }
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
                            // Find the job title in the same entry group
                            const entryGroup = descInput.closest('.entry-group');
                            const jobTitle = entryGroup ? entryGroup.querySelector('.job-title-input').value : '';
                            const expLevel = document.getElementById('experienceLevel').value || 'Mid Level';

                            let prompt = `Rewrite the following work-experience text for a "${jobTitle}" position at a ${expLevel} level. `;
                            
                            // Tailor instructions based on experience level
                            if (expLevel.includes('Entry') || expLevel.includes('Junior')) {
                                prompt += `Keep the tone eager and professional, focusing on learning, potential, and core responsibilities. Avoid overly complex jargon. `;
                            } else if (expLevel.includes('Senior') || expLevel.includes('Executive')) {
                                prompt += `Use authoritative, sophisticated professional language and industry-specific terminology suitable for a senior leader. Focus on strategic impact, leadership, and results. `;
                            } else {
                                // Mid Level
                                prompt += `Use clear, professional language. Focus on execution, specific achievements, and competency. `;
                            }

                            prompt += `Preserve the original meaning and accuracy, but you may add common responsibilities or duties that are typically associated with this job title if the provided content is incomplete. Do NOT invent accomplishments, metrics, awards, or results that are not implied. `;
                            prompt += `CRITICAL INSTRUCTIONS: Return ONLY the rewritten text. Do NOT include any introductory or concluding remarks (e.g., "Here is a rewrite..."). Do NOT use markdown bolding (like **text**). Ensure the response is concise, not wordy, and optimized for ATS reading. `;
                            
                            if (isModern) {
                                prompt += `Do NOT use bullet points. Separate distinct achievements with a newline character.`;
                            } else {
                                prompt += `Use bullet points for each achievement.`;
                            }
                            
                            prompt += ` Text: "${text}"`;
                            
                            console.log('Generating prompt for:', jobTitle, 'Level:', expLevel); // Debug log

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
