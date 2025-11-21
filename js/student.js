// MPSU Student Information System - Student Dashboard JavaScript
function initializeStudentDashboard() {
    // Check if user is logged in and is student
    const loggedInUser = localStorage.getItem('mpsu_current_user');
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(loggedInUser);
    if (currentUser.role !== 'student') {
        window.location.href = 'login.html';
        return;
    }

    // Load data
    loadStudentData();

    // Update UI
    document.getElementById('studentName').textContent = currentUser.name;

    // Load dashboard statistics
    loadStudentDashboardStats();

    // Load initial data
    loadCurrentCourses();
    loadStudentGrades();
    loadStudentFees();

    // Setup event listeners
    setupStudentEventListeners();

    // Show dashboard by default
    showSection('dashboard');
}

// Load Student Data
function loadStudentData() {
    users = JSON.parse(localStorage.getItem('mpsu_users')) || [];
    students = JSON.parse(localStorage.getItem('mpsu_students')) || [];
    teachers = JSON.parse(localStorage.getItem('mpsu_teachers')) || [];
    courses = JSON.parse(localStorage.getItem('mpsu_courses')) || [];
    grades = JSON.parse(localStorage.getItem('mpsu_grades')) || [];
    fees = JSON.parse(localStorage.getItem('mpsu_fees')) || [];
}

// Setup Student Event Listeners
function setupStudentEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Grade semester filter
    document.getElementById('gradeSemesterFilter').addEventListener('change', loadStudentGrades);

    // Profile form
    document.getElementById('profileForm').addEventListener('submit', updateProfile);
}

// Show Section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');

    // Remove active class from nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    // Show selected section
    document.getElementById(sectionName + '-section').style.display = 'block';

    // Add active class to current nav link
    const currentLink = document.querySelector(`[href="#${sectionName}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

// Load Student Dashboard Statistics
function loadStudentDashboardStats() {
    const student = students.find(s => s.userId === currentUser.id);
    if (!student) return;

    // Update sidebar info
    document.getElementById('studentId').textContent = student.id;

    // Get enrolled courses
    const enrolledCourses = getStudentEnrolledCourses();
    document.getElementById('enrolledCourses').textContent = enrolledCourses.length;

    // Calculate GPA
    const studentGPA = calculateStudentGPA();
    document.getElementById('studentGPA').textContent = studentGPA.toFixed(2);

    // Get pending fees
    const studentFees = fees.filter(f => f.studentId === student.id);
    let pendingAmount = 0;
    studentFees.forEach(fee => {
        if (fee.status === 'pending' || fee.status === 'overdue') {
            pendingAmount += fee.balance;
        }
    });
    document.getElementById('pendingFees').textContent = '₱' + pendingAmount.toLocaleString();

    // Count today's classes
    const todayClasses = getTodayClasses();
    document.getElementById('todayClasses').textContent = todayClasses.length;

    // Update sidebar GPA
    document.getElementById('studentGPA').textContent = studentGPA.toFixed(2);
}

// Get Student Enrolled Courses
function getStudentEnrolledCourses() {
    const student = students.find(s => s.userId === currentUser.id);
    if (!student) return [];

    return courses.filter(course => course.students && course.students.includes(student.id));
}

// Calculate Student GPA
function calculateStudentGPA() {
    const student = students.find(s => s.userId === currentUser.id);
    if (!student) return 0;

    const studentGrades = grades.filter(grade => grade.studentId === student.id && grade.finalGrade);
    if (studentGrades.length === 0) return 0;

    const totalPoints = studentGrades.reduce((sum, grade) => sum + grade.finalGrade, 0);
    return totalPoints / studentGrades.length;
}

// Get Today Classes
function getTodayClasses() {
    const enrolledCourses = getStudentEnrolledCourses();
    const today = new Date().getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[today];

    return enrolledCourses.filter(course => {
        return course.schedule && course.schedule.toLowerCase().includes(todayName.toLowerCase().substring(0, 3));
    });
}

// Load Current Courses
function loadCurrentCourses() {
    const enrolledCourses = getStudentEnrolledCourses();
    const currentCoursesDiv = document.getElementById('currentCourses');
    const enrolledCoursesGrid = document.getElementById('enrolledCoursesGrid');

    // Dashboard courses list
    currentCoursesDiv.innerHTML = '';
    if (enrolledCourses.length === 0) {
        currentCoursesDiv.innerHTML = '<p class="text-muted">No courses enrolled for this semester.</p>';
    } else {
        enrolledCourses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'mb-3 p-3 border rounded';
            courseCard.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="neon-text mb-1">${course.name}</h6>
                        <small class="text-muted">${course.code} • ${course.schedule} • ${course.room}</small>
                    </div>
                    <div class="text-end">
                        <div class="badge bg-primary">${course.students ? course.students.length : 0} students</div>
                    </div>
                </div>
            `;
            currentCoursesDiv.appendChild(courseCard);
        });
    }

    // Courses grid for courses section
    enrolledCoursesGrid.innerHTML = '';
    enrolledCourses.forEach(course => {
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-4';

        col.innerHTML = `
            <div class="card dashboard-card h-100">
                <div class="card-header">
                    <h5 class="neon-text mb-0">${course.name}</h5>
                    <small class="text-muted">${course.code}</small>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-6">
                            <strong>Teacher:</strong><br>
                            <span>${course.teacher}</span>
                        </div>
                        <div class="col-6">
                            <strong>Schedule:</strong><br>
                            <span>${course.schedule}</span>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-6">
                            <strong>Room:</strong><br>
                            <span>${course.room}</span>
                        </div>
                        <div class="col-6">
                            <strong>Students:</strong><br>
                            <span>${course.students ? course.students.length : 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        enrolledCoursesGrid.appendChild(col);
    });

    // Load today's schedule
    loadTodaySchedule();
}

// Load Today Schedule
function loadTodaySchedule() {
    const todayClasses = getTodayClasses();
    const todayScheduleDiv = document.getElementById('todaySchedule');

    todayScheduleDiv.innerHTML = '';

    if (todayClasses.length === 0) {
        todayScheduleDiv.innerHTML = '<p class="text-muted">No classes scheduled for today</p>';
    } else {
        todayClasses.forEach(course => {
            const scheduleItem = document.createElement('div');
            scheduleItem.className = 'mb-3 p-2 border rounded';
            scheduleItem.innerHTML = `
                <div class="d-flex justify-content-between">
                    <div>
                        <strong>${course.name}</strong><br>
                        <small class="text-muted">${course.schedule} • ${course.room}</small>
                    </div>
                    <div class="text-end">
                        <small class="text-muted">${course.teacher}</small>
                    </div>
                </div>
            `;
            todayScheduleDiv.appendChild(scheduleItem);
        });
    }
}

// Load Student Grades
function loadStudentGrades() {
    const student = students.find(s => s.userId === currentUser.id);
    if (!student) return;

    const selectedSemester = document.getElementById('gradeSemesterFilter').value;
    const studentGrades = grades.filter(grade =>
        grade.studentId === student.id &&
        grade.semester === selectedSemester
    );

    const gradesTableBody = document.getElementById('gradesTableBody');
    gradesTableBody.innerHTML = '';

    let totalGradePoints = 0;
    let passedSubjects = 0;
    let failedSubjects = 0;
    let totalCredits = 0;

    studentGrades.forEach(grade => {
        const course = courses.find(c => c.code === grade.courseId);
        const teacher = course ? course.teacher : 'N/A';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${grade.courseId}</td>
            <td>${course ? course.name : 'Unknown Course'}</td>
            <td>${teacher}</td>
            <td>${grade.prelim || '-'}</td>
            <td>${grade.midterm || '-'}</td>
            <td>${grade.finals || '-'}</td>
            <td>${grade.finalGrade || '-'}</td>
            <td>
                <span class="badge ${grade.status === 'passed' ? 'bg-success' : grade.status === 'failed' ? 'bg-danger' : 'bg-warning'}">
                    ${grade.status || 'ongoing'}
                </span>
            </td>
            <td>${getGradeRemarks(grade.finalGrade)}</td>
        `;
        gradesTableBody.appendChild(row);

        if (grade.finalGrade) {
            totalGradePoints += grade.finalGrade;
            totalCredits += 3; // Assuming 3 credits per course

            if (grade.status === 'passed') {
                passedSubjects++;
            } else if (grade.status === 'failed') {
                failedSubjects++;
            }
        }
    });

    // Update grade statistics
    const currentGPA = studentGrades.length > 0 ? totalGradePoints / studentGrades.length : 0;
    document.getElementById('currentGPA').textContent = currentGPA.toFixed(2);
    document.getElementById('passedSubjects').textContent = passedSubjects;
    document.getElementById('failedSubjects').textContent = failedSubjects;
    document.getElementById('totalCredits').textContent = totalCredits;
}

// Helper function for grade remarks
function getGradeRemarks(finalGrade) {
    if (!finalGrade) return 'N/A';
    if (finalGrade >= 95) return 'Excellent';
    if (finalGrade >= 90) return 'Very Good';
    if (finalGrade >= 85) return 'Good';
    if (finalGrade >= 80) return 'Satisfactory';
    if (finalGrade >= 75) return 'Passed';
    return 'Failed';
}

// Load Student Fees
function loadStudentFees() {
    const student = students.find(s => s.userId === currentUser.id);
    if (!student) return;

    const studentFees = fees.filter(f => f.studentId === student.id);

    let totalAmount = 0;
    let amountPaid = 0;
    let remainingBalance = 0;

    studentFees.forEach(fee => {
        totalAmount += fee.total;
        amountPaid += fee.paid;
        remainingBalance += fee.balance;
    });

    // Update fee statistics
    document.getElementById('totalFeeAmount').textContent = '₱' + totalAmount.toLocaleString();
    document.getElementById('amountPaid').textContent = '₱' + amountPaid.toLocaleString();
    document.getElementById('remainingBalance').textContent = '₱' + remainingBalance.toLocaleString();

    // Load fee breakdown
    loadFeeBreakdown(studentFees);
}

// Load Fee Breakdown
function loadFeeBreakdown(studentFees) {
    const feeBreakdownDiv = document.getElementById('feeBreakdown');

    if (studentFees.length === 0) {
        feeBreakdownDiv.innerHTML = '<p class="text-muted">No fee information available.</p>';
        return;
    }

    let breakdownHTML = '<div class="row">';

    studentFees.forEach(fee => {
        breakdownHTML += `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">${fee.semester}</h6>
                        <div class="row">
                            <div class="col-6">
                                <small class="text-muted">Total:</small><br>
                                <strong>₱${fee.total.toLocaleString()}</strong>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">Paid:</small><br>
                                <strong>₱${fee.paid.toLocaleString()}</strong>
                            </div>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between">
                            <span>Balance:</span>
                            <span class="${fee.balance > 0 ? 'text-danger' : 'text-success'}">
                                ₱${fee.balance.toLocaleString()}
                            </span>
                        </div>
                        <div class="mt-2">
                            <span class="badge ${getFeeStatusColor(fee.status)}">${fee.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    breakdownHTML += '</div>';
    feeBreakdownDiv.innerHTML = breakdownHTML;
}

// Helper function for fee status colors
function getFeeStatusColor(status) {
    switch (status) {
        case 'paid': return 'bg-success';
        case 'pending': return 'bg-warning';
        case 'overdue': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

// Profile Management
function showProfileModal() {
    const student = students.find(s => s.userId === currentUser.id);
    if (student) {
        document.getElementById('modalStudentName').textContent = student.name;
        document.getElementById('modalStudentCourse').textContent = student.course;
        document.getElementById('modalStudentId').textContent = student.id;
        document.getElementById('modalStudentEmail').textContent = student.email;
        document.getElementById('modalStudentYear').textContent = student.year;
        document.getElementById('modalStudentSection').textContent = student.section;
    }

    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

function updateProfile(e) {
    e.preventDefault();

    const firstName = document.getElementById('profileFirstName').value;
    const lastName = document.getElementById('profileLastName').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;

    if (!firstName || !lastName || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Update student record
    const student = students.find(s => s.userId === currentUser.id);
    if (student) {
        student.name = `${firstName} ${lastName}`;
        student.email = email;
        student.phone = phone;

        // Update user record
        currentUser.name = student.name;
        currentUser.email = student.email;

        // Save to localStorage
        localStorage.setItem('mpsu_students', JSON.stringify(students));
        localStorage.setItem('mpsu_users', JSON.stringify(users));
        localStorage.setItem('mpsu_current_user', JSON.stringify(currentUser));

        // Update UI
        document.getElementById('studentName').textContent = currentUser.name;

        showNotification('Profile updated successfully', 'success');
    }
}

function showChangePasswordModal() {
    const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
    modal.show();
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (currentPassword !== currentUser.password) {
        showNotification('Current password is incorrect', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showNotification('New password must be at least 6 characters long', 'error');
        return;
    }

    // Update password
    currentUser.password = newPassword;
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('mpsu_users', JSON.stringify(users));
        localStorage.setItem('mpsu_current_user', JSON.stringify(currentUser));
    }

    bootstrap.Modal.getInstance(document.getElementById('changePasswordModal')).hide();
    document.getElementById('changePasswordForm').reset();

    showNotification('Password changed successfully', 'success');
}

// Load Profile Data
function loadProfileData() {
    const student = students.find(s => s.userId === currentUser.id);
    if (student) {
        const nameParts = student.name.split(' ');
        document.getElementById('profileFirstName').value = nameParts[0] || '';
        document.getElementById('profileLastName').value = nameParts.slice(1).join(' ') || '';
        document.getElementById('profileEmail').value = student.email;
        document.getElementById('profilePhone').value = student.phone || '';
        document.getElementById('profileCourse').value = student.course;
        document.getElementById('profileYear').value = student.year;
        document.getElementById('profileSection').value = student.section;
        document.getElementById('profileStudentId').value = student.id;
        document.getElementById('profileUsername').value = currentUser.username;
        document.getElementById('profileLastLogin').value = new Date().toLocaleString();
    }
}

// Utility Functions
function logout() {
    localStorage.removeItem('mpsu_current_user');
    window.location.href = 'index.html';
}

function refreshCourses() {
    loadCurrentCourses();
    showNotification('Courses refreshed', 'success');
}

function downloadGradeReport() {
    const student = students.find(s => s.userId === currentUser.id);
    if (!student) return;

    const selectedSemester = document.getElementById('gradeSemesterFilter').value;
    const studentGrades = grades.filter(grade =>
        grade.studentId === student.id &&
        grade.semester === selectedSemester
    );

    let csvContent = `Grade Report for ${student.name} (${student.id})\n`;
    csvContent += `Semester: ${selectedSemester}\n\n`;
    csvContent += 'Course Code,Course Name,Teacher,Prelim,Midterm,Finals,Final Grade,Status\n';

    studentGrades.forEach(grade => {
        const course = courses.find(c => c.code === grade.courseId);
        csvContent += `${grade.courseId},${course ? course.name : 'Unknown'},${course ? course.teacher : 'N/A'},${grade.prelim || ''},${grade.midterm || ''},${grade.finals || ''},${grade.finalGrade || ''},${grade.status || ''}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades_${student.id}_${selectedSemester.replace(' ', '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Grade report downloaded successfully', 'success');
}

function downloadFeeReceipt() {
    const student = students.find(s => s.userId === currentUser.id);
    if (!student) return;

    const studentFees = fees.filter(f => f.studentId === student.id);

    let receiptContent = `Fee Receipt for ${student.name}\n`;
    receiptContent += `Student ID: ${student.id}\n`;
    receiptContent += `Date: ${new Date().toLocaleDateString()}\n\n`;

    studentFees.forEach(fee => {
        receiptContent += `Semester: ${fee.semester}\n`;
        receiptContent += `Total Amount: ₱${fee.total.toLocaleString()}\n`;
        receiptContent += `Amount Paid: ₱${fee.paid.toLocaleString()}\n`;
        receiptContent += `Balance: ₱${fee.balance.toLocaleString()}\n`;
        receiptContent += `Status: ${fee.status}\n\n`;
    });

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fee_receipt_${student.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Fee receipt downloaded successfully', 'success');
}

// Initialize profile data when profile section is shown
document.addEventListener('click', function(e) {
    if (e.target.getAttribute('href') === '#profile') {
        setTimeout(loadProfileData, 100);
    }
});

// Notification function
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
