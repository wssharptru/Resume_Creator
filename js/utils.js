// Utility functions for Resume Builder

const ResumeUtils = {
    /**
     * Parse skills string into an array, stripping bullets
     */
    processSkills: (skillsStr) => {
        if (!skillsStr) return [];
        return skillsStr.split(/\n/).map(s => s.trim().replace(/^[\*\-•]\s*/, '')).filter(s => s);
    },

    /**
     * Format date to "Mon YYYY" (e.g., "Jan 2024")
     */
    formatDate: (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    },

    /**
     * Format date range for Executive template (YYYY-YYYY or YYYY-Present)
     */
    formatDateRangeYear: (startDate, endDate) => {
        const start = startDate ? new Date(startDate).getFullYear() : '';
        const end = endDate ? new Date(endDate).getFullYear() : 'Present';
        return start && end ? `${start}-${end}` : '';
    },

    /**
     * Split skills into 3 columns for Executive template
     */
    splitSkillsIntoColumns: (skillsArr, numCols = 3) => {
        const columns = Array.from({ length: numCols }, () => []);
        skillsArr.forEach((skill, index) => {
            columns[index % numCols].push(skill);
        });
        return columns;
    },

    /**
     * Parse job description for Executive template (Highlight vs Bullets)
     */
    parseJobDescriptionExecutive: (desc) => {
        if (!desc) return { highlight: '', bullets: [] };
        
        const lines = desc.split('\n').map(l => l.trim()).filter(l => l);
        
        let highlight = '';
        let bullets = [];
        
        if (lines.length > 0) {
            // Check if first line looks like a summary (no bullet point)
            const firstLine = lines[0];
            if (!firstLine.match(/^[\*\-•]/)) {
                highlight = firstLine.replace(/^[\*\-•]\s*/, '');
                bullets = lines.slice(1).map(l => l.replace(/^[\*\-•]\s*/, ''));
            } else {
                bullets = lines.map(l => l.replace(/^[\*\-•]\s*/, ''));
            }
        }
        
        return { highlight, bullets };
    },

    /**
     * Simple split for Modern/Classic descriptions (newlines or bullets)
     */
    parseDescriptionBullets: (desc) => {
        if (!desc) return [];
        if (desc.includes('\n') || desc.includes('•')) {
            return desc.split(/\n|•/).filter(s => s.trim()).map(s => s.trim());
        }
        return [desc]; // Return as single item if no splitters found
    }
};
