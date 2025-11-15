// Store all jobs for filtering
let allJobs = [];
let filteredJobs = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get all job cards and store their data
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(card => {
        const jobData = JSON.parse(card.getAttribute('data-job'));
        allJobs.push({
            element: card,
            data: jobData
        });
    });
    
    filteredJobs = [...allJobs];
    
    // Add event listeners to filter checkboxes
    const filterInputs = document.querySelectorAll('.filter-input');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
});

// Handle search button click
function handleSearch() {
    const jobTitle = document.getElementById('job-title').value.toLowerCase().trim();
    const location = document.getElementById('location').value.toLowerCase().trim();
    
    // Filter jobs based on search criteria
    filteredJobs = allJobs.filter(job => {
        const titleMatch = !jobTitle || job.data.title.toLowerCase().includes(jobTitle);
        const companyMatch = !location || job.data.company.toLowerCase().includes(location);
        return titleMatch && companyMatch;
    });
    
    // Apply current filters after search
    applyFilters();
}

// Apply filters based on selected checkboxes
function applyFilters() {
    const selectedJobTypes = Array.from(document.querySelectorAll('.filter-input[data-filter="job_type"]:checked'))
        .map(cb => cb.value.toLowerCase());
    
    const selectedExperience = Array.from(document.querySelectorAll('.filter-input[data-filter="experience"]:checked'))
        .map(cb => cb.value.toLowerCase());
    
    const salaryMax = parseInt(document.getElementById('salary-slider').value);
    
    // Start with search-filtered jobs or all jobs
    let jobsToFilter = filteredJobs.length > 0 ? filteredJobs : allJobs;
    
    // Apply filters
    const filtered = jobsToFilter.filter(job => {
        // Job type filter
        if (selectedJobTypes.length > 0) {
            const jobTags = job.data.tags.map(tag => tag.toLowerCase());
            const hasJobType = selectedJobTypes.some(type => 
                jobTags.some(tag => tag.includes(type.replace(' ', '')) || tag.includes(type))
            );
            if (!hasJobType) return false;
        }
        
        // Experience level filter
        if (selectedExperience.length > 0) {
            const jobTags = job.data.tags.map(tag => tag.toLowerCase());
            const hasExperience = selectedExperience.some(exp => 
                jobTags.some(tag => tag.includes(exp.toLowerCase()))
            );
            if (!hasExperience) return false;
        }
        
        // Salary filter (extract rate from string like "$250/hr")
        const rate = parseInt(job.data.rate.replace(/[^0-9]/g, ''));
        // Convert hourly rate to approximate annual (assuming 2000 hours/year)
        const annualRate = rate * 2000;
        if (annualRate > salaryMax) return false;
        
        return true;
    });
    
    // Update display
    displayJobs(filtered);
}

// Display filtered jobs
function displayJobs(jobs) {
    const jobsList = document.getElementById('jobs-list');
    
    // Hide all jobs first
    allJobs.forEach(job => {
        job.element.style.display = 'none';
    });
    
    // Show filtered jobs
    if (jobs.length === 0) {
        jobsList.innerHTML = '<div class="no-jobs">No jobs found matching your criteria.</div>';
    } else {
        jobs.forEach(job => {
            job.element.style.display = 'block';
        });
        
        // Reorder jobs in DOM to match filtered order
        jobs.forEach(job => {
            jobsList.appendChild(job.element);
        });
    }
}

// Handle sorting
function handleSort() {
    const sortValue = document.getElementById('sort-select').value;
    const jobsList = document.getElementById('jobs-list');
    const visibleJobs = Array.from(jobsList.querySelectorAll('.job-card:not([style*="display: none"])'));
    
    if (visibleJobs.length === 0) {
        // If no visible jobs, sort all filtered jobs
        visibleJobs.push(...filteredJobs.map(job => job.element));
    }
    
    visibleJobs.sort((a, b) => {
        const jobA = JSON.parse(a.getAttribute('data-job'));
        const jobB = JSON.parse(b.getAttribute('data-job'));
        const rateA = parseInt(jobA.rate.replace(/[^0-9]/g, ''));
        const rateB = parseInt(jobB.rate.replace(/[^0-9]/g, ''));
        
        switch(sortValue) {
            case 'rate-high':
                return rateB - rateA;
            case 'rate-low':
                return rateA - rateB;
            case 'recent':
            default:
                return 0; // Keep original order
        }
    });
    
    // Reorder in DOM
    visibleJobs.forEach(job => {
        jobsList.appendChild(job);
    });
}

// Update salary display
function updateSalaryDisplay(value) {
    const salaryValue = document.getElementById('salary-value');
    salaryValue.textContent = parseInt(value).toLocaleString();
    applyFilters();
}

// Allow Enter key to trigger search
document.addEventListener('DOMContentLoaded', function() {
    const jobTitleInput = document.getElementById('job-title');
    const locationInput = document.getElementById('location');
    
    if (jobTitleInput) {
        jobTitleInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    if (locationInput) {
        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});

// Handle Apply button click
function handleApply(jobTitle, company) {
    alert(`Thank you for your interest!\n\nYou are applying for: ${jobTitle}\nCompany: ${company}\n\nWe will review your application and get back to you soon.`);
    // You can replace this with actual form submission or redirect to application page
}

