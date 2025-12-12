// Template generation functions

function getResumeCSS() {
    return `
    :root {
        --color-primary: #0066cc;
        --color-primary-hover: #0052a3;
        --color-secondary: #f0f4f8;
        --color-text: #1a1a1a;
        --color-text-light: #666;
        --color-border: #e0e0e0;
        --color-success: #10b981;
        --color-warning: #f59e0b;
        --spacing-sm: 8px;
        --spacing-md: 16px;
        --spacing-lg: 24px;
        --spacing-xl: 32px;
        --radius: 8px;
        
        /* Modern Template Colors */
        --modern-header-bg: #5D7B89;
        --modern-right-bg: #F2F2F2;
        --modern-text: #333333;
        
        /* Classic Template Colors */
        --classic-text: #000000;
        --classic-header: #333333;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: var(--color-text); background-color: #f9f9f9; line-height: 1.6; }

    /* Resume Preview Styles */
    .resume-preview { background: white; width: 100%; max-width: 800px; margin: 0 auto; text-transform: uppercase; letter-spacing: 1px; }

    /* Modern Template Styles */
    .resume-modern { display: flex; flex-direction: column; min-height: 1000px; font-family: Helvetica, Arial, sans-serif; color: var(--modern-text); }
    .resume-modern .resume-header { background-color: var(--modern-header-bg); color: white; padding: 30px; height: 150px; position: relative; display: flex; justify-content: center; align-items: center; text-align: center; }
    .resume-modern .header-content { width: 100%; }
    .resume-modern h1 { font-size: 32px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
    .resume-modern .job-title { font-size: 16px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; }
    .resume-modern .resume-body { display: flex; flex: 1; }
    .resume-modern .resume-left { width: 38%; padding: 48px; background: white; }
    .resume-modern .resume-right { width: 62%; padding: 38px; background-color: var(--modern-right-bg); }
    .resume-modern .resume-section-title { font-size: 14px; font-weight: bold; color: #808080; border-bottom: 3px solid #808080; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
    .resume-modern .resume-right .resume-section-title { border-bottom: 1px solid #ccc; }

    /* Classic Template Styles */
    .resume-classic { font-family: "Calibri", "Helvetica", Arial, sans-serif; background: #f5f5f5; display: flex; justify-content: center; padding: 40px 0; color: #333; }
    .resume-classic .resume-container { background: #ffffff; width: 750px; padding: 40px; border-radius: 12px; box-sizing: border-box; }
    .resume-classic .resume-header h1 { text-align: center; font-size: 32px; color: #0a6c78; letter-spacing: 1px; margin: 0; font-weight: 700; }
    .resume-classic .resume-header .contact { text-align: center; font-size: 14px; color: #666; margin: 8px 0 25px; }
    .resume-classic .section-title { color: #0a6c78; font-size: 18px; font-weight: 700; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #ddd; letter-spacing: 0.5px; text-transform: uppercase; }
    .resume-classic .summary { font-size: 14px; color: #333; line-height: 1.5; margin: 0 0 20px 0; }
    .resume-classic .skills-columns { display: flex; justify-content: space-between; margin-top: 10px; margin-bottom: 20px; }
    .resume-classic .skills-columns ul { list-style-type: disc; margin: 0; padding-left: 20px; width: 48%; }
    .resume-classic .skills-columns li { margin-bottom: 6px; font-size: 14px; }
    .resume-classic .job-block { margin-top: 20px; margin-bottom: 20px; }
    .resume-classic .job-dates { font-size: 13px; color: #555; letter-spacing: 0.5px; margin-bottom: 4px; font-weight: normal; }
    .resume-classic .job-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; color: #333; }
    .resume-classic .job-bullets { list-style-type: disc; padding-left: 20px; margin: 0; }
    .resume-classic .job-bullets li { margin-bottom: 6px; font-size: 14px; }
    .resume-classic .education-block { font-size: 14px; color: #333; margin-top: 10px; line-height: 1.4; margin-bottom: 20px; }
    .resume-classic .edu-year { font-weight: 700; }

    /* Shared Styles */
    .resume-section { margin-bottom: 25px; }
    .resume-item { margin-bottom: 15px; }
    .resume-item-title { font-weight: bold; font-size: 14px; }
    .resume-item-subtitle { font-size: 14px; margin-bottom: 5px; }
    .resume-date { font-size: 12px; color: #666; margin-bottom: 5px; }
    .resume-text { font-size: 13px; line-height: 1.5; }
    .resume-list { list-style: none; padding: 0; }
    .resume-list li { position: relative; padding-left: 15px; margin-bottom: 5px; font-size: 13px; }
    .resume-list li::before { content: "•"; position: absolute; left: 0; color: var(--modern-text); }
    `;
}

function getExecutiveTemplateHTML(data, forDocx = false) {
    // Process skills into 3 columns
    const skills = ResumeUtils.processSkills(data.skills);
    const columns = ResumeUtils.splitSkillsIntoColumns(skills, 3);

    const skillsHTML = columns.map(col => `
        <ul>
            ${col.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
    `).join('');

    // Safe access to experience and education
    const experience = data.experience || [];
    const education = data.education || [];

    // Generate experience HTML
    const experienceHTML = experience.map(job => {
        const { highlight, bullets } = ResumeUtils.parseJobDescriptionExecutive(job.description);
        
        return `
            <div class="job-block">
                <div class="job-company-line">
                    <span>${job.company.toUpperCase()}</span>
                    <span>${job.location || ''}</span>
                </div>
                <div class="job-title-line">
                    <span>${job.jobTitle.toUpperCase()}</span>
                    <span>${ResumeUtils.formatDateRangeYear(job.startDate, job.endDate)}</span>
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

    if (forDocx) {
        // Prepare Skills Columns for Table
        const skillCol1 = columns[0].map(s => `<div>➢ ${s}</div>`).join('');
        const skillCol2 = columns[1].map(s => `<div>➢ ${s}</div>`).join('');
        const skillCol3 = columns[2].map(s => `<div>➢ ${s}</div>`).join('');

        // Prepare Experience for Table
        const experienceTableHTML = experience.map(job => {
            const { highlight, bullets } = ResumeUtils.parseJobDescriptionExecutive(job.description);
            return `
                <div style="margin-bottom: 18px;">
                    <table width="100%" style="border-collapse: collapse; margin-bottom: 2px;">
                        <tr>
                            <td align="left" style="font-weight: bold; font-size: 11pt; text-transform: uppercase;">${job.company.toUpperCase()}</td>
                            <td align="right" style="font-weight: bold; font-size: 11pt; text-transform: uppercase;">${job.location || ''}</td>
                        </tr>
                    </table>
                    <table width="100%" style="border-collapse: collapse; margin-bottom: 8px;">
                        <tr>
                            <td align="left" style="font-weight: bold; font-size: 11pt; text-transform: uppercase;">${job.jobTitle.toUpperCase()}</td>
                            <td align="right" style="font-weight: bold; font-size: 11pt; text-transform: uppercase;">${ResumeUtils.formatDateRangeYear(job.startDate, job.endDate)}</td>
                        </tr>
                    </table>
                    ${highlight ? `<div style="font-size: 11pt; font-weight: bold; margin-bottom: 6px;">${highlight}</div>` : ''}
                    ${bullets.length > 0 ? `
                        <ul style="margin: 0 0 8px 0; padding-left: 20px;">
                            ${bullets.map(bullet => `<li style="font-size: 11pt; margin-bottom: 4px;">${bullet}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Prepare Education for Table
        const educationTableHTML = education.map(edu => {
             const year = edu.graduationDate ? new Date(edu.graduationDate).getFullYear() : '';
             return `
                <div style="font-size: 11pt; margin-bottom: 8px;">
                    <table width="100%" style="border-collapse: collapse;">
                        <tr>
                            <td align="left" style="font-weight: bold;">${edu.school.toUpperCase()}</td>
                            <td align="right" style="font-weight: bold;">${year}</td>
                        </tr>
                    </table>
                    <div style="margin-top: 2px;">${edu.degree}${edu.fieldOfStudy ? ': ' + edu.fieldOfStudy : ''}</div>
                </div>
             `;
        }).join('');

        return `
            <table width="100%" style="border: none; font-family: 'Times New Roman', serif; color: #000;">
                <tr>
                    <td style="padding: 0.5in;">
                        <!-- Header -->
                        <table width="100%" style="border-bottom: 1pt solid #000; margin-bottom: 18px;">
                            <tr>
                                <td valign="top" align="left">
                                    <h1 style="font-size: 26pt; font-weight: bold; text-transform: uppercase; margin: 0; letter-spacing: 2px;">${data.contact.fullName.toUpperCase()}</h1>
                                </td>
                                <td valign="top" align="right" style="font-size: 10.5pt; line-height: 1.4; white-space: nowrap;">
                                    ${data.contact.phone}<br>
                                    ${data.contact.email}<br>
                                    ${data.contact.location || ''}
                                </td>
                            </tr>
                        </table>

                        <!-- Professional Title -->
                        <div style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin-bottom: 12px;">${professionalTitle}</div>

                        <!-- Summary -->
                        ${data.professionalSummary ? `
                        <div style="margin-bottom: 15px;">
                            ${summaryTagline ? `<div style="font-size: 11pt; font-weight: bold; text-align: center; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">${summaryTagline}</div>` : ''}
                            <div style="font-size: 11pt; text-align: justify; line-height: 1.4; margin-bottom: 12px;">
                                ${data.professionalSummary}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Skills Table -->
                        ${skills.length > 0 ? `
                        <table width="100%" style="margin-bottom: 15px;">
                            <tr>
                                <td width="33%" valign="top" style="font-size: 11pt; line-height: 1.3;">${skillCol1}</td>
                                <td width="33%" valign="top" style="font-size: 11pt; line-height: 1.3;">${skillCol2}</td>
                                <td width="33%" valign="top" style="font-size: 11pt; line-height: 1.3;">${skillCol3}</td>
                            </tr>
                        </table>
                        ` : ''}

                        <!-- Experience -->
                        ${experience.length > 0 ? `
                            <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1pt solid #000; padding-bottom: 3px; margin-top: 18px; margin-bottom: 10px; letter-spacing: 0.5px;">PROFESSIONAL EXPERIENCE</div>
                            ${experienceTableHTML}
                        ` : ''}

                        <!-- Education -->
                        ${education.length > 0 ? `
                            <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1pt solid #000; padding-bottom: 3px; margin-top: 18px; margin-bottom: 10px; letter-spacing: 0.5px;">EDUCATION</div>
                            ${educationTableHTML}
                        ` : ''}
                    </td>
                </tr>
            </table>
        `;
    }

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
                ${data.professionalSummary ? `
                <div class="summary-section">
                    <div class="summary-tagline">${summaryTagline}</div>
                    <div class="summary-text">
                        ${data.professionalSummary}
                    </div>
                </div>
                ` : ''}

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

function getModernTemplateHTML(data, forDocx = false) {
    // Format dates
    const formatDate = (dateStr) => {
        return ResumeUtils.formatDate(dateStr).toUpperCase();
    };

    const skillsList = ResumeUtils.processSkills(data.skills).map(s => `<li>${s}</li>`).join('');

    // Split description into bullets if possible, else just text
    const formatDescription = (desc) => {
        const bullets = ResumeUtils.parseDescriptionBullets(desc);
        if (bullets.length === 1 && bullets[0] === desc && !desc.includes('\n')) {
             return `<p class="resume-text">${desc}</p>`;
        }
        return `<ul class="resume-list">${bullets.map(s => `<li>${s}</li>`).join('')}</ul>`;
    };
    
    // Contact info formatting
    let contactHtml = '';
    if (data.contact.location) contactHtml += `<div class="resume-item-subtitle">${data.contact.location}</div>`;
    contactHtml += `<div class="resume-item-subtitle">${data.contact.email}</div>`;
    contactHtml += `<div class="resume-item-subtitle">${data.contact.phone}</div>`;

    // Table-based layout (Unified for Web, PDF, and DOCX)
    return `
        <div class="resume-modern">
            <table width="100%" style="border-collapse: collapse; font-family: Helvetica, Arial, sans-serif; color: #333333;">
                <!-- Header -->
                <tr>
                    <td colspan="2" style="background-color: #5D7B89; color: white; padding: 30px; text-align: center;">
                        <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase;">${data.contact.fullName}</h1>
                        <div style="font-size: 16px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px;">${data.experience && data.experience.length > 0 ? data.experience[0].jobTitle : 'PROFESSIONAL'}</div>
                    </td>
                </tr>
                <!-- Body -->
                <tr>
                    <!-- Left Column -->
                    <td width="38%" valign="top" style="background-color: #FFFFFF; padding: 48px;">
                        ${data.professionalSummary ? `
                        <div style="margin-bottom: 25px;">
                            <div style="font-size: 14px; font-weight: bold; color: #808080; border-bottom: 3px solid #808080; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Personal Profile</div>
                            <p style="font-size: 13px; line-height: 1.5;">
                                ${data.professionalSummary}
                            </p>
                        </div>
                        ` : ''}

                        <div style="margin-bottom: 25px;">
                            <div style="font-size: 14px; font-weight: bold; color: #808080; border-bottom: 3px solid #808080; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Contact</div>
                            ${contactHtml}
                        </div>

                        <div style="margin-bottom: 25px;">
                            <div style="font-size: 14px; font-weight: bold; color: #808080; border-bottom: 3px solid #808080; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Education</div>
                            ${data.education ? data.education.map(edu => `
                            <div style="margin-bottom: 15px;">
                                <div style="font-weight: bold; font-size: 14px;">${edu.school}</div>
                                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">${formatDate(edu.graduationDate)}</div>
                                <div style="font-size: 14px; margin-bottom: 5px;">${edu.degree} in ${edu.fieldOfStudy}</div>
                            </div>
                            `).join('') : ''}
                        </div>
                    </td>

                    <!-- Right Column -->
                    <td width="62%" valign="top" style="background-color: #F2F2F2; padding: 38px;">
                        <div style="margin-bottom: 25px;">
                            <div style="font-size: 14px; font-weight: bold; color: #808080; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Skills</div>
                            <ul class="resume-list" style="list-style: none; padding: 0;">
                                ${skillsList}
                            </ul>
                        </div>

                        <div style="margin-bottom: 25px;">
                            <div style="font-size: 14px; font-weight: bold; color: #808080; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Work Experience</div>
                            ${data.experience ? data.experience.map((exp, idx) => `
                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                                    <div style="font-weight: bold; font-size: 14px;">${exp.company},</div>
                                    <div style="font-size: 14px; font-weight: normal;">${exp.jobTitle}</div>
                                </div>
                                <div style="font-size: 11px; color: #999; margin-bottom: 8px;">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'PRESENT'}</div>
                                ${formatDescription(exp.description)}
                            </div>
                            `).join('') : ''}
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    `;
}

function getClassicTemplateHTML(data, forDocx = false) {
    // Format dates
    const formatDate = ResumeUtils.formatDate;

    const skills = ResumeUtils.processSkills(data.skills);
    const midPoint = Math.ceil(skills.length / 2);
    const liStyle = forDocx ? 'margin-bottom: 6px;' : '';
    const col1 = skills.slice(0, midPoint).map(s => `<li style="${liStyle}">${s}</li>`).join('');
    const col2 = skills.slice(midPoint).map(s => `<li style="${liStyle}">${s}</li>`).join('');

    // Format description
    const formatDescription = (desc) => {
        const bullets = ResumeUtils.parseDescriptionBullets(desc);
        return `<ul class="job-bullets">${bullets.map(s => `<li>${s}</li>`).join('')}</ul>`;
    };

    // DOCX-specific styles (inline is safer for html-docx-js)
    const headerStyle = forDocx ? 'text-align: center; color: #0A6C78; font-size: 20pt; font-family: Calibri, sans-serif;' : '';
    const contactStyle = forDocx ? 'text-align: center;' : '';
    const sectionTitleStyle = forDocx ? 'color: #0A6C78; border-bottom: 1px solid #ddd; text-transform: uppercase; font-weight: bold; font-size: 14pt; margin-top: 15px; font-family: Calibri, sans-serif;' : '';
    const tableStyle = forDocx ? 'width: 100%; border-collapse: collapse; margin-top: 10px;' : '';
    const tdStyle = forDocx ? 'width: 50%; vertical-align: top;' : '';

    const skillsContent = forDocx ? `
        <table style="${tableStyle}" width="100%">
            <tr>
                <td style="${tdStyle}"><ul>${col1}</ul></td>
                <td style="${tdStyle}"><ul>${col2}</ul></td>
            </tr>
        </table>
    ` : `
        <div class="skills-columns">
            <ul>${col1}</ul>
            <ul>${col2}</ul>
        </div>
    `;

    return `
        <div class="resume-classic">
            <div class="resume-container">
                <header class="resume-header">
                    <h1 style="${headerStyle}">${data.contact.fullName.toUpperCase()}</h1>
                    <p class="contact" style="${contactStyle}">
                        ${data.contact.location ? `${data.contact.location} | ` : ''}${data.contact.phone} | ${data.contact.email}
                    </p>
                </header>

                ${data.professionalSummary ? `
                <section>
                    <h2 class="section-title" style="${sectionTitleStyle}">PROFESSIONAL SUMMARY</h2>
                    <p class="summary">
                        ${data.professionalSummary}
                    </p>
                </section>
                ` : ''}

                <section>
                    <h2 class="section-title" style="${sectionTitleStyle}">SKILLS</h2>
                    ${skillsContent}
                </section>

                <section>
                    <h2 class="section-title" style="${sectionTitleStyle}">WORK HISTORY</h2>
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
                    <h2 class="section-title" style="${sectionTitleStyle}">EDUCATION</h2>
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
