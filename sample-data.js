// MPSU Student Information System - Sample Data Generator

// Initialize sample data for the system
function initializeSampleData() {
    // Check if data already exists
    if (localStorage.getItem('mpsu_users') ||
        localStorage.getItem('mpsu_students') ||
        localStorage.getItem('mpsu_teachers') ||
        localStorage.getItem('mpsu_courses') ||
        localStorage.getItem('mpsu_grades') ||
        localStorage.getItem('mpsu_fees')) {
        console.log('Sample data already exists. Skipping initialization.');
        return;
    }

    console.log('Initializing sample data...');

    // Sample Users
    const sampleUsers = [
        {
            id: 'usr_admin_001',
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            name: 'System Administrator',
            email: 'admin@mpsu.edu.ph',
            createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'usr_teacher_001',
            username: 't001',
            password: 'teacher123',
            role: 'teacher',
            name: 'Dr. Maria Santos',
            email: 'maria.santos@mpsu.edu.ph',
            createdAt: '2024-01-15T00:00:00.000Z'
        },
        {
            id: 'usr_teacher_002',
            username: 't002',
            password: 'teacher123',
            role: 'teacher',
            name: 'Prof. Juan dela Cruz',
            email: 'juan.delacruz@mpsu.edu.ph',
            createdAt: '2024-01-15T00:00:00.000Z'
        },
        {
            id: 'usr_student_001',
            username: '2024001',
            password: 'student123',
            role: 'student',
            name: 'Ana Garcia',
            email: 'ana.garcia@mpsu.edu.ph',
            createdAt: '2024-02-01T00:00:00.000Z'
        },
        {
            id: 'usr_student_002',
            username: '2024002',
            password: 'student123',
            role: 'student',
            name: 'Miguel Reyes',
            email: 'miguel.reyes@mpsu.edu.ph',
            createdAt: '2024-02-01T00:00:00.000Z'
        },
        {
            id: 'usr_student_003',
            username: '2024003',
            password: 'student123',
            role: 'student',
            name: 'Sofia Lopez',
            email: 'sofia.lopez@mpsu.edu.ph',
            createdAt: '2024-02-01T00:00:00.000Z'
        }
    ];

    // Sample Students
    const sampleStudents = [
        {
            id: '2024001',
            userId: 'usr_student_001',
            name: 'Ana Garcia',
            email: 'ana.garcia@mpsu.edu.ph',
            course: 'BS Information Technology',
            year: '3rd Year',
            section: 'A',
            status: 'active',
            enrollmentDate: '2024-02-01'
        },
        {
            id: '2024002',
            userId: 'usr_student_002',
            name: 'Miguel Reyes',
            email: 'miguel.reyes@mpsu.edu.ph',
            course: 'BS Computer Science',
            year: '2nd Year',
            section: 'B',
            status: 'active',
            enrollmentDate: '2024-02-01'
        },
        {
            id: '2024003',
            userId: 'usr_student_003',
            name: 'Sofia Lopez',
            email: 'sofia.lopez@mpsu.edu.ph',
            course: 'BS Information Technology',
            year: '3rd Year',
            section: 'A',
            status: 'active',
            enrollmentDate: '2024-02-01'
        }
    ];

    // Sample Teachers
    const sampleTeachers = [
        {
            id: 'T001',
            userId: 'usr_teacher_001',
            name: 'Dr. Maria Santos',
            email: 'maria.santos@mpsu.edu.ph',
            department: 'College of Information Technology',
            subjects: ['Programming Fundamentals', 'Data Structures', 'Web Development'],
            status: 'active',
            hireDate: '2020-06-01'
        },
        {
            id: 'T002',
            userId: 'usr_teacher_002',
            name: 'Prof. Juan dela Cruz',
            email: 'juan.delacruz@mpsu.edu.ph',
            department: 'College of Information Technology',
            subjects: ['Database Management', 'Software Engineering', 'Computer Networks'],
            status: 'active',
            hireDate: '2019-08-15'
        }
    ];

    // Sample Courses
    const sampleCourses = [
        {
            id: 'course_it101',
            code: 'IT101',
            name: 'Programming Fundamentals',
            teacher: 'Dr. Maria Santos',
            schedule: 'MWF 9:00-10:30',
            room: 'IT101',
            maxStudents: 40,
            students: ['2024001', '2024003']
        },
        {
            id: 'course_it102',
            code: 'IT102',
            name: 'Data Structures and Algorithms',
            teacher: 'Dr. Maria Santos',
            schedule: 'TTH 10:00-11:30',
            room: 'IT102',
            maxStudents: 35,
            students: ['2024001', '2024003']
        },
        {
            id: 'course_cs201',
            code: 'CS201',
            name: 'Database Management Systems',
            teacher: 'Prof. Juan dela Cruz',
            schedule: 'MWF 1:00-2:30',
            room: 'CS201',
            maxStudents: 30,
            students: ['2024002']
        },
        {
            id: 'course_cs202',
            code: 'CS202',
            name: 'Software Engineering',
            teacher: 'Prof. Juan dela Cruz',
            schedule: 'TTH 2:00-3:30',
            room: 'CS202',
            maxStudents: 25,
            students: ['2024002']
        }
    ];

    // Sample Grades
    const sampleGrades = [
        {
            id: 'G001',
            studentId: '2024001',
            courseId: 'IT101',
            semester: '1st Semester 2024',
            prelim: 85,
            midterm: 88,
            finals: 90,
            finalGrade: 87.67,
            status: 'passed'
        },
        {
            id: 'G002',
            studentId: '2024001',
            courseId: 'IT102',
            semester: '1st Semester 2024',
            prelim: 92,
            midterm: 89,
            finals: 91,
            finalGrade: 90.67,
            status: 'passed'
        },
        {
            id: 'G003',
            studentId: '2024002',
            courseId: 'CS201',
            semester: '1st Semester 2024',
            prelim: 78,
            midterm: 82,
            finals: 85,
            finalGrade: 81.67,
            status: 'passed'
        },
        {
            id: 'G004',
            studentId: '2024003',
            courseId: 'IT101',
            semester: '1st Semester 2024',
            prelim: 95,
            midterm: 93,
            finals: 96,
            finalGrade: 94.67,
            status: 'passed'
        }
    ];

    // Sample Fees
    const sampleFees = [
        {
            id: 'F001',
            studentId: '2024001',
            semester: '1st Semester 2024',
            total: 15000,
            paid: 15000,
            balance: 0,
            status: 'paid',
            dueDate: '2024-08-31'
        },
        {
            id: 'F002',
            studentId: '2024002',
            semester: '1st Semester 2024',
            total: 15000,
            paid: 12000,
            balance: 3000,
            status: 'pending',
            dueDate: '2024-08-31'
        },
        {
            id: 'F003',
            studentId: '2024003',
            semester: '1st Semester 2024',
            total: 15000,
            paid: 10000,
            balance: 5000,
            status: 'overdue',
            dueDate: '2024-08-31'
        }
    ];

    // Save sample data to localStorage
    localStorage.setItem('mpsu_users', JSON.stringify(sampleUsers));
    localStorage.setItem('mpsu_students', JSON.stringify(sampleStudents));
    localStorage.setItem('mpsu_teachers', JSON.stringify(sampleTeachers));
    localStorage.setItem('mpsu_courses', JSON.stringify(sampleCourses));
    localStorage.setItem('mpsu_grades', JSON.stringify(sampleGrades));
    localStorage.setItem('mpsu_fees', JSON.stringify(sampleFees));

    // Save system settings
    localStorage.setItem('mpsu_school_name', 'Mountain Province State University');
    localStorage.setItem('mpsu_school_address', 'Bontoc, Mountain Province, Philippines');
    localStorage.setItem('mpsu_academic_year', '2024-2025');
    localStorage.setItem('mpsu_tuition_fee', '1200');
    localStorage.setItem('mpsu_misc_fee', '2000');
    localStorage.setItem('mpsu_lab_fee', '1500');

    console.log('Sample data initialized successfully!');
    console.log('Login credentials:');
    console.log('Admin: admin / admin123');
    console.log('Teacher: t001 / teacher123 or t002 / teacher123');
    console.log('Students: 2024001 / student123, 2024002 / student123, 2024003 / student123');
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone!')) {
        localStorage.clear();
        alert('All data has been cleared. The page will reload.');
        location.reload();
    }
}

// Reset to sample data
function resetToSampleData() {
    if (confirm('Are you sure you want to reset to sample data? All current data will be lost!')) {
        localStorage.clear();
        initializeSampleData();
        alert('Data has been reset to sample data. The page will reload.');
        location.reload();
    }
}

// Export current data
function exportCurrentData() {
    const data = {
        users: JSON.parse(localStorage.getItem('mpsu_users')) || [],
        students: JSON.parse(localStorage.getItem('mpsu_students')) || [],
        teachers: JSON.parse(localStorage.getItem('mpsu_teachers')) || [],
        courses: JSON.parse(localStorage.getItem('mpsu_courses')) || [],
        grades: JSON.parse(localStorage.getItem('mpsu_grades')) || [],
        fees: JSON.parse(localStorage.getItem('mpsu_fees')) || [],
        settings: {
            schoolName: localStorage.getItem('mpsu_school_name'),
            schoolAddress: localStorage.getItem('mpsu_school_address'),
            academicYear: localStorage.getItem('mpsu_academic_year'),
            tuitionFee: localStorage.getItem('mpsu_tuition_fee'),
            miscFee: localStorage.getItem('mpsu_misc_fee'),
            labFee: localStorage.getItem('mpsu_lab_fee')
        },
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

    alert('Data exported successfully!');
}

// Auto-initialize sample data if no data exists
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on the main pages
    if (window.location.pathname.includes('index.html') ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/')) {
        initializeSampleData();
    }
});
