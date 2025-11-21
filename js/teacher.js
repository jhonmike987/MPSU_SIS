// MPSU Student Information System - Teacher Dashboard JavaScript
function initializeTeacherDashboard() {
    // Check if user is logged in and is teacher
    const loggedInUser = localStorage.getItem('mpsu_current_user');
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(loggedInUser);
    if (currentUser.role !== 'teacher') {
        window.location.href = 'login.html';
        return;
    }

    // Load data
    loadTeacherData();

    // Update UI
    document.getElementById('teacherName').textContent = currentUser.name;

    // Load dashboard statistics
    loadTeacherDashboardStats();

    // Load initial data
    loadMyCourses();
    loadMyStudents();
    loadGradesHistory();

    // Setup event listeners
    setupTeacherEventListeners();

    // Show dashboard by default
    showSection('dashboard');
}

// Load Teacher Data
function loadTeacherData() {
    users = JSON.parse(localStorage.getItem('mpsu_users')) || [];
    students = JSON.parse(localStorage.getItem('mpsu_students')) || [];
    teachers = JSON.parse(localStorage.getItem('mpsu_teachers')) || [];
    courses = JSON.parse(localStorage.getItem('mpsu_courses')) || [];
    grades = JSON.parse(localStorage.getItem('mpsu_grades')) || [];
    fees = JSON.parse(localStorage.getItem('mpsu_fees')) || [];
}

// Setup Teacher Event Listeners
function setupTeacherEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Course filter
    document.getElementById('courseFilter').addEventListener('change', filterStudentsByCourse);

    // Grade course selection
    document.getElementById('gradeCourseSelect').addEventListener('change', loadGradeEntryForm);

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

// Load Teacher Dashboard Statistics
function loadTeacherDashboardStats() {
    const teacherCourses = courses.filter(course => course.teacher === currentUser.name);
    const teacherStudents = getTeacherStudents();
    const teacherGrades = grades.filter(grade =>
        teacherCourses.some(course => course.code === grade.courseId)
    );

    // Update stats
    document.getElementById('coursesCount').textContent = teacherCourses.length;
    document.getElementById('studentsCount').textContent = teacherStudents.length;
    document.getElementById('gradesCount').textContent = teacherGrades.length;

    // Update sidebar stats
    document.getElementById('myCoursesCount').textContent = teacherCourses.length;
    document.getElementById('myStudentsCount').textContent = teacherStudents.length;

    // Calculate pending grades (students without final grades)
    const pendingGrades = teacherStudents.length - teacherGrades.filter(g => g.finalGrade).length;
    document.getElementById('pendingGradesCount').textContent = pendingGrades;

    // Load today's schedule
    loadTodaySchedule(teacherCourses);
}

// Get Students for Current Teacher
function getTeacherStudents() {
    const teacherCourses = courses.filter(course => course.teacher === currentUser.name);
    const studentIds = new Set();

    teacherCourses.forEach(course => {
        if (course.students) {
            course.students.forEach(studentId => studentIds.add(studentId));
        }
    });

    return students.filter(student => studentIds.has(student.id));
}

// Load My Courses
function loadMyCourses() {
    const teacherCourses = courses.filter(course => course.teacher === currentUser.name);
    const coursesList = document.getElementById('myCoursesList');
    const coursesGrid = document.getElementById('coursesGrid');

    // Dashboard courses list
    coursesList.innerHTML = '';
    if (teacherCourses.length === 0) {
        coursesList.innerHTML = '<p class="text-muted">No courses assigned yet.</p>';
    } else {
        teacherCourses.forEach(course => {
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
            coursesList.appendChild(courseCard);
        });
    }

    // Courses grid for courses section
    coursesGrid.innerHTML = '';
    teacherCourses.forEach(course => {
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
                            <strong>Schedule:</strong><br>
                            <span>${course.schedule}</span>
                        </div>
                        <div class="col-6">
                            <strong>Room:</strong><br>
                            <span>${course.room}</span>
                        </div>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between align-items-center">
                        <span><strong>Students:</strong> ${course.students ? course.students.length : 0}</span>
                        <button class="btn btn-sm btn-outline-primary" onclick="viewCourseStudents('${course.id}')">
                            <i class="fas fa-eye me-1"></i>View Students
                        </button>
                    </div>
                </div>
            </div>
        `;

        coursesGrid.appendChild(col);
    });

    // Load course filter options
    const courseFilter = document.getElementById('courseFilter');
    courseFilter.innerHTML = '<option value="">All Courses</option>';
    teacherCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = `${course.name} (${course.code})`;
        courseFilter.appendChild(option);
    });

    // Load grade course options
    const gradeCourseSelect = document.getElementById('gradeCourseSelect');
    gradeCourseSelect.innerHTML = '<option value="">Choose course</option>';
    teacherCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = `${course.name} (${course.code})`;
        gradeCourseSelect.appendChild(option);
    });
}

// Load Today Schedule
function loadTodaySchedule(teacherCourses) {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[today];

    const todaySchedule = document.getElementById('todaySchedule');
    todaySchedule.innerHTML = '';

    const todayClasses = teacherCourses.filter(course => {
        return course.schedule && course.schedule.toLowerCase().includes(todayName.toLowerCase().substring(0, 3));
    });

    if (todayClasses.length === 0) {
        todaySchedule.innerHTML = '<p class="text-muted">No classes scheduled for today</p>';
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
                        <small class="text-muted">${course.students ? course.students.length : 0} students</small>
                    </div>
                </div>
            `;
            todaySchedule.appendChild(scheduleItem);
        });
    }
}

// Load My Students
function loadMyStudents() {
    const teacherStudents = getTeacherStudents();
    const tableBody = document.getElementById('studentsTableBody');

    tableBody.innerHTML = '';

    teacherStudents.forEach(student => {
        // Get student's grade for current semester
        const studentGrade = grades.find(grade =>
            grade.studentId === student.id &&
            grade.semester === '1st Semester 2024'
        );

        const grade = studentGrade ? studentGrade.finalGrade || 'N/A' : 'N/A';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.year}</td>
            <td>${student.section}</td>
            <td>${student.email}</td>
            <td>${grade}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewStudentDetails('${student.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="viewStudentGrades('${student.id}')">
                    <i class="fas fa-chart-line"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Filter Students by Course
function filterStudentsByCourse() {
    const selectedCourseId = document.getElementById('courseFilter').value;
    const teacherStudents = getTeacherStudents();
    const tableBody = document.getElementById('studentsTableBody');

    tableBody.innerHTML = '';

    let filteredStudents = teacherStudents;

    if (selectedCourseId) {
        const course = courses.find(c => c.id === selectedCourseId);
        if (course && course.students) {
            filteredStudents = students.filter(student => course.students.includes(student.id));
        }
    }

    filteredStudents.forEach(student => {
        const studentGrade = grades.find(grade =>
            grade.studentId === student.id &&
            grade.semester === '1st Semester 2024'
        );

        const grade = studentGrade ? studentGrade.finalGrade || 'N/A' : 'N/A';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.year}</td>
            <td>${student.section}</td>
            <td>${student.email}</td>
            <td>${grade}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewStudentDetails('${student.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="viewStudentGrades('${student.id}')">
                    <i class="fas fa-chart-line"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load Grade Entry Form
function loadGradeEntryForm() {
    const courseId = document.getElementById('gradeCourseSelect').value;
    const gradeEntryForm = document.getElementById('gradeEntryForm');
    const gradeEntryTableBody = document.getElementById('gradeEntryTableBody');

    if (!courseId) {
        gradeEntryForm.style.display = 'none';
        return;
    }

    const course = courses.find(c => c.id === courseId);
    if (!course || !course.students) {
        gradeEntryForm.style.display = 'none';
        return;
    }

    gradeEntryTableBody.innerHTML = '';

    course.students.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        // Get existing grade
        const existingGrade = grades.find(grade =>
            grade.studentId === studentId &&
            grade.courseId === course.code &&
            grade.semester === document.getElementById('gradeSemesterSelect').value
        );

        const currentGrade = existingGrade ? existingGrade.prelim || existingGrade.midterm || existingGrade.finals || '' : '';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${currentGrade}</td>
            <td>
                <input type="number" class="form-control grade-input" data-student-id="${studentId}"
                       min="0" max="100" step="0.01" placeholder="Enter grade">
            </td>
            <td>
                <select class="form-select remarks-select" data-student-id="${studentId}">
                    <option value="">Select</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Satisfactory">Satisfactory</option>
                    <option value="Needs Improvement">Needs Improvement</option>
                </select>
            </td>
        `;
        gradeEntryTableBody.appendChild(row);
    });

    gradeEntryForm.style.display = 'block';
}

// Save Grades
function saveGrades() {
    const courseId = document.getElementById('gradeCourseSelect').value;
    const gradeType = document.getElementById('gradeTypeSelect').value;
    const semester = document.getElementById('gradeSemesterSelect').value;
    const course = courses.find(c => c.id === courseId);

    if (!course) {
        showNotification('Please select a course', 'error');
        return;
    }

    const gradeInputs = document.querySelectorAll('.grade-input');
    let gradesSaved = 0;

    gradeInputs.forEach(input => {
        const studentId = input.getAttribute('data-student-id');
        const gradeValue = parseFloat(input.value);

        if (!isNaN(gradeValue) && gradeValue >= 0 && gradeValue <= 100) {
            // Find or create grade record
            let gradeRecord = grades.find(grade =>
                grade.studentId === studentId &&
                grade.courseId === course.code &&
                grade.semester === semester
            );

            if (!gradeRecord) {
                gradeRecord = {
                    id: 'G' + Date.now() + Math.random().toString(36).substr(2, 5),
                    studentId: studentId,
                    courseId: course.code,
                    semester: semester,
                    prelim: 0,
                    midterm: 0,
                    finals: 0,
                    finalGrade: 0,
                    status: 'ongoing'
                };
                grades.push(gradeRecord);
            }

            // Update the appropriate grade component
            gradeRecord[gradeType] = gradeValue;

            // Calculate final grade (simple average for now)
            const prelim = gradeRecord.prelim || 0;
            const midterm = gradeRecord.midterm || 0;
            const finals = gradeRecord.finals || 0;

            if (prelim > 0 || midterm > 0 || finals > 0) {
                const components = [prelim, midterm, finals].filter(g => g > 0);
                gradeRecord.finalGrade = components.length > 0 ?
                    Math.round(components.reduce((a, b) => a + b, 0) / components.length * 100) / 100 : 0;

                // Determine status
                if (gradeRecord.finalGrade >= 75) {
                    gradeRecord.status = 'passed';
                } else if (gradeRecord.finalGrade > 0) {
                    gradeRecord.status = 'failed';
                }
            }

            gradesSaved++;
        }
    });

    // Save to localStorage
    localStorage.setItem('mpsu_grades', JSON.stringify(grades));

    if (gradesSaved > 0) {
        showNotification(`Grades saved successfully for ${gradesSaved} students`, 'success');
        loadGradesHistory();
        loadTeacherDashboardStats();
    } else {
        showNotification('No valid grades to save', 'warning');
    }
}

// Load Grades History
function loadGradesHistory() {
    const gradesHistoryTableBody = document.getElementById('gradesHistoryTableBody');
    gradesHistoryTableBody.innerHTML = '';

    const teacherCourses = courses.filter(course => course.teacher === currentUser.name);
    const teacherGrades = grades.filter(grade =>
        teacherCourses.some(course => course.code === grade.courseId)
    );

    teacherGrades.forEach(grade => {
        const student = students.find(s => s.id === grade.studentId);
        const course = courses.find(c => c.code === grade.courseId);

        if (student && course) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${course.name}</td>
                <td>${grade.semester}</td>
                <td>${grade.prelim || '-'}</td>
                <td>${grade.midterm || '-'}</td>
                <td>${grade.finals || '-'}</td>
                <td>${grade.finalGrade || '-'}</td>
                <td>
                    <span class="badge ${grade.status === 'passed' ? 'bg-success' : grade.status === 'failed' ? 'bg-danger' : 'bg-warning'}">
                        ${grade.status}
                    </span>
                </td>
            `;
            gradesHistoryTableBody.appendChild(row);
        }
    });
}

// Profile Management
function showProfileModal() {
    const teacher = teachers.find(t => t.userId === currentUser.id);
    if (teacher) {
        document.getElementById('modalTeacherName').textContent = teacher.name;
        document.getElementById('modalTeacherDepartment').textContent = teacher.department;
        document.getElementById('modalTeacherId').textContent = teacher.id;
        document.getElementById('modalTeacherEmail').textContent = teacher.email;
    }

    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

function updateProfile(e) {
    e.preventDefault();

    const firstName = document.getElementById('profileFirstName').value;
    const lastName = document.getElementById('profileLastName').value;
    const email = document.getElementById('profileEmail').value;

    if (!firstName || !lastName || !email) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Update teacher record
    const teacher = teachers.find(t => t.userId === currentUser.id);
    if (teacher) {
        teacher.name = `${firstName} ${lastName}`;
        teacher.email = email;

        // Update user record
        currentUser.name = teacher.name;
        currentUser.email = teacher.email;

        // Save to localStorage
        localStorage.setItem('mpsu_teachers', JSON.stringify(teachers));
        localStorage.setItem('mpsu_users', JSON.stringify(users));
        localStorage.setItem('mpsu_current_user', JSON.stringify(currentUser));

        // Update UI
        document.getElementById('teacherName').textContent = currentUser.name;

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
    const teacher = teachers.find(t => t.userId === currentUser.id);
    if (teacher) {
        const nameParts = teacher.name.split(' ');
        document.getElementById('profileFirstName').value = nameParts[0] || '';
        document.getElementById('profileLastName').value = nameParts.slice(1).join(' ') || '';
        document.getElementById('profileEmail').value = teacher.email;
        document.getElementById('profileDepartment').value = teacher.department;
        document.getElementById('profileEmployeeId').value = teacher.id;
        document.getElementById('profileSubjects').value = teacher.subjects ? teacher.subjects.join(', ') : '';
        document.getElementById('profileUsername').value = currentUser.username;
        document.getElementById('profileLastLogin').value = new Date().toLocaleString();
    }
}

// View Functions
function viewStudentDetails(studentId) {
    const student = students.find(s => s.id === studentId);
    if (student) {
        alert(`Student Details:\n\nName: ${student.name}\nID: ${student.id}\nEmail: ${student.email}\nCourse: ${student.course}\nYear: ${student.year}\nSection: ${student.section}\nStatus: ${student.status}`);
    }
}

function viewStudentGrades(studentId) {
    const student = students.find(s => s.id === studentId);
    const studentGrades = grades.filter(grade => grade.studentId === studentId);

    if (student && studentGrades.length > 0) {
        let gradesText = `Grades for ${student.name} (${student.id}):\n\n`;
        studentGrades.forEach(grade => {
            const course = courses.find(c => c.code === grade.courseId);
            gradesText += `${course ? course.name : grade.courseId}:\n`;
            gradesText += `  Semester: ${grade.semester}\n`;
            gradesText += `  Prelim: ${grade.prelim || 'N/A'}\n`;
            gradesText += `  Midterm: ${grade.midterm || 'N/A'}\n`;
            gradesText += `  Finals: ${grade.finals || 'N/A'}\n`;
            gradesText += `  Final Grade: ${grade.finalGrade || 'N/A'}\n`;
            gradesText += `  Status: ${grade.status}\n\n`;
        });
        alert(gradesText);
    } else {
        alert('No grades found for this student.');
    }
}

function viewCourseStudents(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course && course.students) {
        let studentsText = `Students in ${course.name}:\n\n`;
        course.students.forEach(studentId => {
            const student = students.find(s => s.id === studentId);
            if (student) {
                studentsText += `- ${student.name} (${student.id})\n`;
            }
        });
        alert(studentsText);
    } else {
        alert('No students enrolled in this course.');
    }
}

// Utility Functions
function logout() {
    localStorage.removeItem('mpsu_current_user');
    window.location.href = 'index.html';
}

function refreshCourses() {
    loadMyCourses();
    showNotification('Courses refreshed', 'success');
}

function exportStudentList() {
    const teacherStudents = getTeacherStudents();
    let csvContent = 'ID,Name,Course,Year,Section,Email\n';

    teacherStudents.forEach(student => {
        csvContent += `${student.id},${student.name},${student.course},${student.year},${student.section},${student.email}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${currentUser.name}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Student list exported successfully', 'success');
}

function showAddGradeModal() {
    const modal = new bootstrap.Modal(document.getElementById('addGradeModal'));
    modal.show();
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
