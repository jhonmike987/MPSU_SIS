// MPSU Student Information System - Admin Dashboard JavaScript
function initializeAdminDashboard() {
    // Check if user is logged in and is admin
    const loggedInUser = localStorage.getItem('mpsu_current_user');
    if (!loggedInUser) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(loggedInUser);
    if (currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Load data
    loadAdminData();

    // Update UI
    document.getElementById('adminName').textContent = currentUser.name;

    // Load dashboard statistics
    loadDashboardStats();

    // Load initial data for tables
    loadStudentsTable();
    loadTeachersTable();
    loadCoursesTable();
    loadFeesTable();

    // Setup event listeners
    setupAdminEventListeners();

    // Show dashboard by default
    showSection('dashboard');
}

// Load Admin Data
function loadAdminData() {
    users = JSON.parse(localStorage.getItem('mpsu_users')) || [];
    students = JSON.parse(localStorage.getItem('mpsu_students')) || [];
    teachers = JSON.parse(localStorage.getItem('mpsu_teachers')) || [];
    courses = JSON.parse(localStorage.getItem('mpsu_courses')) || [];
    grades = JSON.parse(localStorage.getItem('mpsu_grades')) || [];
    fees = JSON.parse(localStorage.getItem('mpsu_fees')) || [];
}

// Setup Admin Event Listeners
function setupAdminEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Search and filter
    document.getElementById('studentSearch').addEventListener('input', filterStudents);
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

// Load Dashboard Statistics
function loadDashboardStats() {
    // Update counts
    document.getElementById('studentsCount').textContent = students.length;
    document.getElementById('teachersCount').textContent = teachers.length;
    document.getElementById('coursesCount').textContent = courses.length;

    // Calculate total revenue
    let totalRevenue = 0;
    fees.forEach(fee => {
        if (fee.status === 'paid') {
            totalRevenue += fee.paid;
        }
    });
    document.getElementById('revenueCount').textContent = '₱' + totalRevenue.toLocaleString();

    // Update sidebar stats
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalTeachers').textContent = teachers.length;
    document.getElementById('totalCourses').textContent = courses.length;

    // Load fee statistics
    loadFeeStats();
}

// Load Fee Statistics
function loadFeeStats() {
    let totalFees = 0;
    let pendingFees = 0;
    let overdueFees = 0;
    let paidStudents = 0;

    fees.forEach(fee => {
        totalFees += fee.paid;
        if (fee.status === 'paid') {
            paidStudents++;
        } else if (fee.status === 'pending') {
            pendingFees += fee.balance;
        } else if (fee.status === 'overdue') {
            overdueFees += fee.balance;
        }
    });

    document.getElementById('totalFees').textContent = '₱' + totalFees.toLocaleString();
    document.getElementById('pendingFees').textContent = '₱' + pendingFees.toLocaleString();
    document.getElementById('overdueFees').textContent = '₱' + overdueFees.toLocaleString();
    document.getElementById('paidStudents').textContent = paidStudents;
}

// Load Students Table
function loadStudentsTable() {
    const tableBody = document.getElementById('studentsTableBody');
    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.year}</td>
            <td>${student.section}</td>
            <td>
                <span class="badge ${student.status === 'active' ? 'bg-success' : 'bg-danger'}">
                    ${student.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewStudent('${student.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning me-1" onclick="editStudent('${student.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load Teachers Table
function loadTeachersTable() {
    const tableBody = document.getElementById('teachersTableBody');
    tableBody.innerHTML = '';

    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${teacher.id}</td>
            <td>${teacher.name}</td>
            <td>${teacher.email}</td>
            <td>${teacher.department}</td>
            <td>${teacher.subjects ? teacher.subjects.join(', ') : 'N/A'}</td>
            <td>
                <span class="badge ${teacher.status === 'active' ? 'bg-success' : 'bg-danger'}">
                    ${teacher.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewTeacher('${teacher.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning me-1" onclick="editTeacher('${teacher.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTeacher('${teacher.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load Courses Table
function loadCoursesTable() {
    const tableBody = document.getElementById('coursesTableBody');
    tableBody.innerHTML = '';

    courses.forEach(course => {
        const studentCount = course.students ? course.students.length : 0;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>${course.teacher}</td>
            <td>${course.schedule}</td>
            <td>${course.room}</td>
            <td>${studentCount}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewCourse('${course.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning me-1" onclick="editCourse('${course.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteCourse('${course.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load Fees Table
function loadFeesTable() {
    const tableBody = document.getElementById('feesTableBody');
    tableBody.innerHTML = '';

    fees.forEach(fee => {
        const student = students.find(s => s.id === fee.studentId);
        const studentName = student ? student.name : 'Unknown Student';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${fee.studentId}</td>
            <td>${studentName}</td>
            <td>${fee.semester}</td>
            <td>₱${fee.total.toLocaleString()}</td>
            <td>₱${fee.paid.toLocaleString()}</td>
            <td>₱${fee.balance.toLocaleString()}</td>
            <td>
                <span class="badge ${getFeeStatusColor(fee.status)}">
                    ${fee.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewFee('${fee.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="markFeePaid('${fee.id}')">
                    <i class="fas fa-check"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
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

// Modal Functions
function showAddStudentModal() {
    const modal = new bootstrap.Modal(document.getElementById('addStudentModal'));
    modal.show();
}

function showAddTeacherModal() {
    const modal = new bootstrap.Modal(document.getElementById('addTeacherModal'));
    modal.show();
}

function showAddCourseModal() {
    // Load teachers for course assignment
    const teacherSelect = document.getElementById('courseTeacher');
    teacherSelect.innerHTML = '<option value="">Select Teacher</option>';

    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.name;
        option.textContent = teacher.name;
        teacherSelect.appendChild(option);
    });

    const modal = new bootstrap.Modal(document.getElementById('addCourseModal'));
    modal.show();
}

function showProfileModal() {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileUsername').value = currentUser.username;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profileLastLogin').value = new Date().toLocaleString();

    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

// CRUD Operations
function addStudent() {
    const firstName = document.getElementById('studentFirstName').value;
    const lastName = document.getElementById('studentLastName').value;
    const email = document.getElementById('studentEmail').value;
    const studentId = document.getElementById('studentId').value;
    const course = document.getElementById('studentCourse').value;
    const year = document.getElementById('studentYear').value;
    const section = document.getElementById('studentSection').value;

    if (!firstName || !lastName || !email || !studentId || !course || !year || !section) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Check if student ID already exists
    if (students.find(s => s.id === studentId)) {
        showNotification('Student ID already exists', 'error');
        return;
    }

    const newStudent = {
        id: studentId,
        userId: 'usr' + Date.now(),
        name: `${firstName} ${lastName}`,
        email: email,
        course: course,
        year: year,
        section: section,
        status: 'active',
        enrollmentDate: new Date().toISOString().split('T')[0]
    };

    students.push(newStudent);
    localStorage.setItem('mpsu_students', JSON.stringify(students));

    // Create user account
    const newUser = {
        id: newStudent.userId,
        username: studentId.toLowerCase(),
        password: 'student123', // Default password
        role: 'student',
        name: newStudent.name,
        email: newStudent.email,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('mpsu_users', JSON.stringify(users));

    // Close modal and refresh
    bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
    document.getElementById('addStudentForm').reset();
    loadStudentsTable();
    loadDashboardStats();

    showNotification('Student added successfully', 'success');
}

function addTeacher() {
    const firstName = document.getElementById('teacherFirstName').value;
    const lastName = document.getElementById('teacherLastName').value;
    const email = document.getElementById('teacherEmail').value;
    const department = document.getElementById('teacherDepartment').value;
    const subjects = document.getElementById('teacherSubjects').value;

    if (!firstName || !lastName || !email || !department) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const teacherId = 'T' + (teachers.length + 1).toString().padStart(3, '0');

    const newTeacher = {
        id: teacherId,
        userId: 'usr' + Date.now(),
        name: `${firstName} ${lastName}`,
        email: email,
        department: department,
        subjects: subjects ? subjects.split(',').map(s => s.trim()) : [],
        status: 'active',
        hireDate: new Date().toISOString().split('T')[0]
    };

    teachers.push(newTeacher);
    localStorage.setItem('mpsu_teachers', JSON.stringify(teachers));

    // Create user account
    const newUser = {
        id: newTeacher.userId,
        username: teacherId.toLowerCase(),
        password: 'teacher123', // Default password
        role: 'teacher',
        name: newTeacher.name,
        email: newTeacher.email,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('mpsu_users', JSON.stringify(users));

    // Close modal and refresh
    bootstrap.Modal.getInstance(document.getElementById('addTeacherModal')).hide();
    document.getElementById('addTeacherForm').reset();
    loadTeachersTable();
    loadDashboardStats();

    showNotification('Teacher added successfully', 'success');
}

function addCourse() {
    const code = document.getElementById('courseCode').value;
    const name = document.getElementById('courseName').value;
    const teacher = document.getElementById('courseTeacher').value;
    const schedule = document.getElementById('courseSchedule').value;
    const room = document.getElementById('courseRoom').value;
    const maxStudents = document.getElementById('courseMaxStudents').value;

    if (!code || !name || !teacher || !schedule || !room) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Check if course code already exists
    if (courses.find(c => c.code === code)) {
        showNotification('Course code already exists', 'error');
        return;
    }

    const newCourse = {
        id: 'course_' + Date.now(),
        code: code,
        name: name,
        teacher: teacher,
        schedule: schedule,
        room: room,
        maxStudents: parseInt(maxStudents),
        students: []
    };

    courses.push(newCourse);
    localStorage.setItem('mpsu_courses', JSON.stringify(courses));

    // Close modal and refresh
    bootstrap.Modal.getInstance(document.getElementById('addCourseModal')).hide();
    document.getElementById('addCourseForm').reset();
    loadCoursesTable();
    loadDashboardStats();

    showNotification('Course added successfully', 'success');
}

// Delete Functions
function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        // Remove student
        students = students.filter(s => s.id !== studentId);
        localStorage.setItem('mpsu_students', JSON.stringify(students));

        // Remove associated user
        const student = students.find(s => s.id === studentId);
        if (student) {
            users = users.filter(u => u.id !== student.userId);
            localStorage.setItem('mpsu_users', JSON.stringify(users));
        }

        loadStudentsTable();
        loadDashboardStats();
        showNotification('Student deleted successfully', 'success');
    }
}

function deleteTeacher(teacherId) {
    if (confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
        // Remove teacher
        teachers = teachers.filter(t => t.id !== teacherId);
        localStorage.setItem('mpsu_teachers', JSON.stringify(teachers));

        // Remove associated user
        const teacher = teachers.find(t => t.id === teacherId);
        if (teacher) {
            users = users.filter(u => u.id !== teacher.userId);
            localStorage.setItem('mpsu_users', JSON.stringify(users));
        }

        loadTeachersTable();
        loadDashboardStats();
        showNotification('Teacher deleted successfully', 'success');
    }
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
        courses = courses.filter(c => c.id !== courseId);
        localStorage.setItem('mpsu_courses', JSON.stringify(courses));

        loadCoursesTable();
        loadDashboardStats();
        showNotification('Course deleted successfully', 'success');
    }
}

// View Functions (placeholders for now)
function viewStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (student) {
        alert(`Student Details:\n\nName: ${student.name}\nID: ${student.id}\nEmail: ${student.email}\nCourse: ${student.course}\nYear: ${student.year}\nSection: ${student.section}\nStatus: ${student.status}`);
    }
}

function viewTeacher(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
        alert(`Teacher Details:\n\nName: ${teacher.name}\nID: ${teacher.id}\nEmail: ${teacher.email}\nDepartment: ${teacher.department}\nSubjects: ${teacher.subjects ? teacher.subjects.join(', ') : 'N/A'}\nStatus: ${teacher.status}`);
    }
}

function viewCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        alert(`Course Details:\n\nCode: ${course.code}\nName: ${course.name}\nTeacher: ${course.teacher}\nSchedule: ${course.schedule}\nRoom: ${course.room}\nStudents: ${course.students ? course.students.length : 0}`);
    }
}

function viewFee(feeId) {
    const fee = fees.find(f => f.id === feeId);
    if (fee) {
        const student = students.find(s => s.id === fee.studentId);
        alert(`Fee Details:\n\nStudent: ${student ? student.name : 'Unknown'}\nSemester: ${fee.semester}\nTotal: ₱${fee.total}\nPaid: ₱${fee.paid}\nBalance: ₱${fee.balance}\nStatus: ${fee.status}`);
    }
}

// Edit Functions (placeholders for now)
function editStudent(studentId) {
    showNotification('Edit student functionality coming soon', 'info');
}

function editTeacher(teacherId) {
    showNotification('Edit teacher functionality coming soon', 'info');
}

function editCourse(courseId) {
    showNotification('Edit course functionality coming soon', 'info');
}

// Fee Management
function markFeePaid(feeId) {
    const fee = fees.find(f => f.id === feeId);
    if (fee) {
        fee.status = 'paid';
        fee.paid = fee.total;
        fee.balance = 0;

        localStorage.setItem('mpsu_fees', JSON.stringify(fees));
        loadFeesTable();
        loadDashboardStats();
        showNotification('Fee marked as paid', 'success');
    }
}

// Filter Functions
function filterStudents() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    const courseFilter = document.getElementById('studentCourseFilter').value;
    const yearFilter = document.getElementById('studentYearFilter').value;

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm) ||
                             student.id.toLowerCase().includes(searchTerm) ||
                             student.email.toLowerCase().includes(searchTerm);
        const matchesCourse = !courseFilter || student.course === courseFilter;
        const matchesYear = !yearFilter || student.year === yearFilter;

        return matchesSearch && matchesCourse && matchesYear;
    });

    displayFilteredStudents(filteredStudents);
}

function clearStudentFilters() {
    document.getElementById('studentSearch').value = '';
    document.getElementById('studentCourseFilter').value = '';
    document.getElementById('studentYearFilter').value = '';
    loadStudentsTable();
}

function displayFilteredStudents(filteredStudents) {
    const tableBody = document.getElementById('studentsTableBody');
    tableBody.innerHTML = '';

    filteredStudents.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.year}</td>
            <td>${student.section}</td>
            <td>
                <span class="badge ${student.status === 'active' ? 'bg-success' : 'bg-danger'}">
                    ${student.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewStudent('${student.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning me-1" onclick="editStudent('${student.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent('${student.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Settings Functions
function saveGeneralSettings() {
    const schoolName = document.getElementById('schoolName').value;
    const schoolAddress = document.getElementById('schoolAddress').value;
    const academicYear = document.getElementById('academicYear').value;

    // Save to localStorage (you can expand this to save to a settings object)
    localStorage.setItem('mpsu_school_name', schoolName);
    localStorage.setItem('mpsu_school_address', schoolAddress);
    localStorage.setItem('mpsu_academic_year', academicYear);

    showNotification('General settings saved successfully', 'success');
}

function saveFeeSettings() {
    const tuitionFee = document.getElementById('tuitionFee').value;
    const miscFee = document.getElementById('miscFee').value;
    const labFee = document.getElementById('labFee').value;

    localStorage.setItem('mpsu_tuition_fee', tuitionFee);
    localStorage.setItem('mpsu_misc_fee', miscFee);
    localStorage.setItem('mpsu_lab_fee', labFee);

    showNotification('Fee settings updated successfully', 'success');
}

// Utility Functions
function logout() {
    localStorage.removeItem('mpsu_current_user');
    window.location.href = 'index.html';
}

function exportData() {
    const data = {
        users: users,
        students: students,
        teachers: teachers,
        courses: courses,
        grades: grades,
        fees: fees,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mpsu_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Data exported successfully', 'success');
}

function backupData() {
    exportData();
}

function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone!')) {
        localStorage.clear();
        location.reload();
    }
}

function resetToDefaults() {
    if (confirm('Are you sure you want to reset to default data?')) {
        // Clear current data
        localStorage.clear();

        // Reinitialize with default data
        location.reload();
    }
}

function generateFeeReport() {
    showNotification('Fee report generation coming soon', 'info');
}

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
