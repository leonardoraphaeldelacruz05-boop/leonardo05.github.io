// ===== LOCAL STORAGE PARA SA USER DATA =====
// Initialize users array sa localStorage kung wala pa
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// ===== REGISTRATION VALIDATION WITH STORAGE =====
function validateRegistration(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.querySelector('input[name="terms"]')?.checked || false;
    const messageBox = document.getElementById('registerMessage');
    
    // Clear previous messages
    if (messageBox) {
        messageBox.classList.add('hidden');
        messageBox.classList.remove('success', 'error');
    }
    clearErrors();
    
    let isValid = true;
    
    // Validate fullname
    if (fullname.length < 2) {
        showError('fullnameError', 'Full name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('regEmailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (password.length < 6) {
        showError('regPasswordError', 'Password must be at least 6 characters');
        isValid = false;
    } else if (!/[A-Z]/.test(password)) {
        showError('regPasswordError', 'Password must contain at least one uppercase letter');
        isValid = false;
    } else if (!/[0-9]/.test(password)) {
        showError('regPasswordError', 'Password must contain at least one number');
        isValid = false;
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
        showError('confirmError', 'Passwords do not match');
        isValid = false;
    }
    
    // Validate terms
    if (!terms) {
        alert('Please agree to the Terms and Conditions');
        isValid = false;
    }
    
    if (isValid) {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);
        
        if (userExists) {
            if (messageBox) {
                messageBox.textContent = 'Email already registered! Please login.';
                messageBox.classList.add('error');
                messageBox.classList.remove('hidden');
            }
            return false;
        }
        
        // Save new user
        const newUser = {
            fullname: fullname,
            email: email,
            password: password,
            username: email.split('@')[0]
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        if (messageBox) {
            messageBox.textContent = 'Registration successful! Redirecting to login...';
            messageBox.classList.add('success');
            messageBox.classList.remove('hidden');
        }
        
        // Save registered email for login
        localStorage.setItem('lastRegistered', email);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
    
    return false;
}

// ===== LOGIN VALIDATION WITH STORAGE =====
function validateLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const messageBox = document.getElementById('loginMessage');
    
    // Clear previous messages
    if (messageBox) {
        messageBox.classList.add('hidden');
        messageBox.classList.remove('success', 'error');
    }
    clearErrors();
    
    // Basic validation
    if (username.length < 1) {
        showError('usernameError', 'Please enter username or email');
        return false;
    }
    
    if (password.length < 1) {
        showError('passwordError', 'Please enter password');
        return false;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if any user matches
    const user = users.find(u => 
        (u.email === username || u.username === username || u.fullname === username) && 
        u.password === password
    );
    
    if (user) {
        // Login successful
        if (messageBox) {
            messageBox.textContent = 'Login successful! Welcome ' + user.fullname + '! Redirecting...';
            messageBox.classList.add('success');
            messageBox.classList.remove('hidden');
        }
        
        // Save logged in user
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to homepage after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        // Login failed
        if (messageBox) {
            messageBox.textContent = 'Invalid username/email or password. Please try again.';
            messageBox.classList.add('error');
            messageBox.classList.remove('hidden');
        }
    }
    
    return false;
}

// ===== STORY FUNCTIONS =====
let currentPart = 1;
const totalParts = 3;

function toggleStoryPart(part) {
    const content = part.querySelector('.story-part-content');
    const icon = part.querySelector('.toggle-icon');
    
    if (content) {
        content.classList.toggle('show');
        if (icon) {
            icon.textContent = content.classList.contains('show') ? '▲' : '▼';
        }
    }
}

function nextPart() {
    if (currentPart < totalParts) {
        const currentPartElement = document.querySelector(`.story-part:nth-child(${currentPart}) .story-part-content`);
        if (currentPartElement) currentPartElement.classList.remove('show');
        
        currentPart++;
        updatePartDisplay();
        
        const newPartElement = document.querySelector(`.story-part:nth-child(${currentPart}) .story-part-content`);
        if (newPartElement) {
            newPartElement.classList.add('show');
            newPartElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        if (currentPart === totalParts) {
            setTimeout(() => {
                const moralSection = document.getElementById('moralSection');
                if (moralSection) {
                    moralSection.style.display = 'block';
                    moralSection.style.animation = 'fadeInUp 0.5s ease';
                    moralSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }
    }
}

function previousPart() {
    if (currentPart > 1) {
        const currentPartElement = document.querySelector(`.story-part:nth-child(${currentPart}) .story-part-content`);
        if (currentPartElement) currentPartElement.classList.remove('show');
        
        currentPart--;
        updatePartDisplay();
        
        const prevPartElement = document.querySelector(`.story-part:nth-child(${currentPart}) .story-part-content`);
        if (prevPartElement) {
            prevPartElement.classList.add('show');
            prevPartElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        const moralSection = document.getElementById('moralSection');
        if (moralSection) moralSection.style.display = 'none';
    }
}

function updatePartDisplay() {
    const indicator = document.getElementById('partIndicator');
    if (indicator) {
        indicator.textContent = `Part ${currentPart} of ${totalParts}`;
    }
    
    const parts = document.querySelectorAll('.story-part');
    parts.forEach((part, index) => {
        if (index + 1 === currentPart) {
            part.style.backgroundColor = '#f0f8ff';
            part.style.borderLeft = '4px solid var(--primary-color)';
        } else {
            part.style.backgroundColor = 'white';
            part.style.borderLeft = '4px solid transparent';
        }
    });
}

function showQuiz() {
    const quiz = document.getElementById('storyQuiz');
    if (quiz) {
        quiz.style.display = 'block';
        quiz.scrollIntoView({ behavior: 'smooth' });
    }
}

function checkQuizAnswer(answer) {
    const result = document.getElementById('quizResult');
    const options = document.querySelectorAll('.quiz-option');
    
    if (answer === 'lumo') {
        result.innerHTML = '<p style="color: green; font-weight: bold;">✓ Correct! The brave little seed was named Lumo.</p>';
        options.forEach(opt => {
            if (opt.textContent.includes('Lumo')) {
                opt.classList.add('correct');
                opt.style.backgroundColor = 'var(--success-color)';
                opt.style.color = 'white';
            }
        });
    } else {
        result.innerHTML = '<p style="color: red; font-weight: bold;">✗ Try again! Remember the name of our brave little seed.</p>';
        options.forEach(opt => {
            if (opt.textContent.toLowerCase().includes(answer)) {
                opt.classList.add('incorrect');
                opt.style.backgroundColor = 'var(--error-color)';
                opt.style.color = 'white';
            }
        });
    }
}

// ===== TOGGLE FUNCTIONS =====
function toggleCard(card) {
    const content = card.querySelector('.card-content');
    if (content) {
        content.classList.toggle('hidden');
        content.classList.toggle('show');
    }
}

function toggleSection(section) {
    const content = section.querySelector('.section-content');
    const icon = section.querySelector('.toggle-icon');
    
    if (content) {
        content.classList.toggle('show');
        if (icon) {
            icon.textContent = content.classList.contains('show') ? '▲' : '▼';
        }
    }
}

// ===== CONTACT FORM VALIDATION =====
function validateContactForm(event) {
    event.preventDefault();
    
    let isValid = true;
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    clearErrors();
    
    if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (subject.length < 3) {
        showError('subjectError', 'Subject must be at least 3 characters');
        isValid = false;
    }
    
    if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    if (isValid) {
        const successMsg = document.getElementById('formSuccess');
        successMsg.textContent = 'Message sent successfully!';
        successMsg.classList.remove('hidden');
        
        document.getElementById('contactForm').reset();
        
        setTimeout(() => {
            successMsg.classList.add('hidden');
        }, 5000);
    }
    
    return false;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
    });
}

// ===== PROJECT FUNCTIONS =====
function showProjectDetails(projectId) {
    const details = document.getElementById(projectId);
    if (details) {
        details.classList.toggle('hidden');
    }
}

function filterProjects(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
        if (category === 'all') {
            project.style.display = 'block';
        } else {
            const tech = project.querySelector('.project-tech').textContent.toLowerCase();
            if (tech.includes(category)) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        }
    });
}

// ===== BURGER MENU =====
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
    
    // Auto-show first part of story
    setTimeout(() => {
        const firstPart = document.querySelector('.story-part:first-child .story-part-content');
        if (firstPart) firstPart.classList.add('show');
    }, 500);
    
    // Check if user is logged in
    checkLoginStatus();
});

// ===== CHECK LOGIN STATUS =====
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (isLoggedIn && currentUser) {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Welcome, ' + currentUser.fullname.split(' ')[0];
            loginBtn.href = '#';
            loginBtn.onclick = function(e) {
                e.preventDefault();
                if (confirm('Logout?')) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('currentUser');
                    window.location.reload();
                }
            };
        }
    }
}

// ===== SCROLL TO TOP BUTTON =====
const scrollBtn = document.createElement('button');
scrollBtn.innerHTML = '↑';
scrollBtn.className = 'scroll-top-btn';
scrollBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    font-size: 24px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 999;
`;

document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});