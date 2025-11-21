// MPSU Student Information System - Main JavaScript File

// Initialize the system
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    setupEventListeners();
});

// Initialize System
function initializeSystem() {
    // Check if this is first run and create default admin
    if (users.length === 0) {
        createDefaultData();
    }

    // Check if user is logged in
    const loggedInUser = localStorage.getItem('mpsu_current_user');
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
        redirectToDashboard();
    }

    // Initialize particles if on home page
    if (document.querySelector('.hero-section')) {
        createParticles();
    }

    // Setup smooth scrolling
    setupSmoothScrolling();

    // Setup navbar scroll effect
    setupNavbarScroll();
}

// Create Default Data
function createDefaultData() {
    // Default Admin User
    const adminUser = {
        id: 'admin001',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'System Administrator',
        email: 'admin@mpsu.edu.ph',
        createdAt: new Date().toISOString()
    };

    // Sample Students
    const sampleStudents = [
        {
            id: '2024001',
            userId: 'stud001',
            name: 'Juan Dela Cruz',
            email: 'juan.delacruz@mpsu.edu.ph',
            course: 'BS Information Technology',
            year: '3rd Year',
            section: 'A',
            status: 'active',
            enrollmentDate: '2024-01-15'
        },
        {
            id: '2024002',
            userId: 'stud002',
            name: 'Maria Santos',
            email: 'maria.santos@mpsu.edu.ph',
            course: 'BS Computer Science',
            year: '2nd Year',
            section: 'B',
            status: 'active',
            enrollmentDate: '2024-01-15'
        }
    ];

    // Sample Teachers
    const sampleTeachers = [
        {
            id: 'T001',
            userId: 'teach001',
            name: 'Dr. Ana Reyes',
            email: 'ana.reyes@mpsu.edu.ph',
            department: 'College of Information Technology',
            subjects: ['Programming 1', 'Data Structures'],
            status: 'active',
            hireDate: '2020-06-01'
        }
    ];

    // Sample Courses
    const sampleCourses = [
        {
            id: 'CS101',
            name: 'Introduction to Programming',
            code: 'CS101',
            teacher: 'Dr. Ana Reyes',
            schedule: 'MWF 9:00-10:30',
            room: 'IT101',
            students: ['2024001', '2024002']
        }
    ];

    // Sample Grades
    const sampleGrades = [
        {
            id: 'G001',
            studentId: '2024001',
            courseId: 'CS101',
            semester: '1st Semester 2024',
            prelim: 85,
            midterm: 88,
            finals: 90,
            finalGrade: 88,
            status: 'passed'
        }
    ];

    // Sample Fees
    const sampleFees = [
        {
            id: 'F001',
            studentId: '2024001',
            semester: '1st Semester 2024',
            tuition: 12000,
            misc: 2000,
            lab: 1500,
            total: 15500,
            paid: 15500,
            balance: 0,
            dueDate: '2024-02-15',
            status: 'paid'
        }
    ];

    // Save to localStorage
    users.push(adminUser);
    students.push(...sampleStudents);
    teachers.push(...sampleTeachers);
    courses.push(...sampleCourses);
    grades.push(...sampleGrades);
    fees.push(...sampleFees);

    localStorage.setItem('mpsu_users', JSON.stringify(users));
    localStorage.setItem('mpsu_students', JSON.stringify(students));
    localStorage.setItem('mpsu_teachers', JSON.stringify(teachers));
    localStorage.setItem('mpsu_courses', JSON.stringify(courses));
    localStorage.setItem('mpsu_grades', JSON.stringify(grades));
    localStorage.setItem('mpsu_fees', JSON.stringify(fees));
}

// Setup Event Listeners
function setupEventListeners() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Registration Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Handle Contact Form
function handleContactForm(e) {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    if (name && email && message) {
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        this.reset();
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('mpsu_current_user', JSON.stringify(user));
        showNotification('Login successful! Redirecting...', 'success');

        setTimeout(() => {
            redirectToDashboard();
        }, 1500);
    } else {
        showNotification('Invalid username or password', 'error');
    }
}

// Handle Registration
function handleRegistration(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);

    // Check if username already exists
    if (users.find(u => u.username === userData.username)) {
        showNotification('Username already exists', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: generateId(),
        username: userData.username,
        password: userData.password,
        role: userData.role,
        name: userData.name,
        email: userData.email,
        createdAt: new Date().toISOString()
    };

    // Add role-specific data
    if (userData.role === 'student') {
        const newStudent = {
            id: generateStudentId(),
            userId: newUser.id,
            name: userData.name,
            email: userData.email,
            course: userData.course,
            year: userData.year,
            section: userData.section,
            status: 'active',
            enrollmentDate: new Date().toISOString().split('T')[0]
        };
        students.push(newStudent);
        localStorage.setItem('mpsu_students', JSON.stringify(students));
    } else if (userData.role === 'teacher') {
        const newTeacher = {
            id: generateTeacherId(),
            userId: newUser.id,
            name: userData.name,
            email: userData.email,
            department: userData.department,
            subjects: [],
            status: 'active',
            hireDate: new Date().toISOString().split('T')[0]
        };
        teachers.push(newTeacher);
        localStorage.setItem('mpsu_teachers', JSON.stringify(teachers));
    }

    users.push(newUser);
    localStorage.setItem('mpsu_users', JSON.stringify(users));

    showNotification('Registration successful! You can now login.', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Handle Logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('mpsu_current_user');
    window.location.href = 'index.html';
}

// Redirect to Dashboard
function redirectToDashboard() {
    if (!currentUser) return;

    switch (currentUser.role) {
        case 'admin':
            window.location.href = 'admin-dashboard.html';
            break;
        case 'teacher':
            window.location.href = 'teacher-dashboard.html';
            break;
        case 'student':
            window.location.href = 'student-dashboard.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

// Utility Functions
function generateId() {
    return 'usr' + Date.now() + Math.random().toString(36).substr(2, 5);
}

function generateStudentId() {
    const year = new Date().getFullYear();
    const count = students.length + 1;
    return `${year}${count.toString().padStart(3, '0')}`;
}

function generateTeacherId() {
    return 'T' + (teachers.length + 1).toString().padStart(3, '0');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span>${message}</span>`;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    container.id = 'particles-container';
    document.body.appendChild(container);

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = Math.random() > 0.5 ? 'var(--deep-green)' : 'var(--lime-green)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.opacity = Math.random() * 0.5 + 0.2;

        const duration = Math.random() * 20 + 10;
        particle.style.animation = `float ${duration}s linear infinite`;

        container.appendChild(particle);
    }
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });

                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Data Management Functions
function saveData() {
    localStorage.setItem('mpsu_users', JSON.stringify(users));
    localStorage.setItem('mpsu_students', JSON.stringify(students));
    localStorage.setItem('mpsu_teachers', JSON.stringify(teachers));
    localStorage.setItem('mpsu_courses', JSON.stringify(courses));
    localStorage.setItem('mpsu_grades', JSON.stringify(grades));
    localStorage.setItem('mpsu_fees', JSON.stringify(fees));
}

function loadData() {
    users = JSON.parse(localStorage.getItem('mpsu_users')) || [];
    students = JSON.parse(localStorage.getItem('mpsu_students')) || [];
    teachers = JSON.parse(localStorage.getItem('mpsu_teachers')) || [];
    courses = JSON.parse(localStorage.getItem('mpsu_courses')) || [];
    grades = JSON.parse(localStorage.getItem('mpsu_grades')) || [];
    fees = JSON.parse(localStorage.getItem('mpsu_fees')) || [];
}

// Export functions for use in other files
window.MPSU = {
    currentUser,
    users,
    students,
    teachers,
    courses,
    grades,
    fees,
    saveData,
    loadData,
    showNotification,
    generateId,
    generateStudentId,
    generateTeacherId
};
