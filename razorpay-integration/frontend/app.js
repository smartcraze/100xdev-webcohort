const API_URL = 'http://localhost:3000';
let currentUser = null;

// Show/Hide sections
function showLogin() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('signup-section').classList.add('hidden');
    document.getElementById('courses-section').classList.add('hidden');
    document.getElementById('my-courses-section').classList.add('hidden');
}

function showSignup() {
    document.getElementById('signup-section').classList.remove('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('courses-section').classList.add('hidden');
    document.getElementById('my-courses-section').classList.add('hidden');
}

function showCourses() {
    document.getElementById('courses-section').classList.remove('hidden');
    document.getElementById('my-courses-section').classList.remove('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('signup-section').classList.add('hidden');
    updateNavButtons();
    loadCourses();
    loadMyCourses();
}

function updateNavButtons() {
    const navButtons = document.getElementById('nav-buttons');
    if (currentUser) {
        navButtons.innerHTML = `
            <span style="margin-right: 15px;">${currentUser.email}</span>
            <button onclick="logout()">Logout</button>
        `;
    } else {
        navButtons.innerHTML = `
            <button onclick="showLogin()">Login</button>
            <button onclick="showSignup()">Signup</button>
        `;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    showLogin();
    updateNavButtons();
}

// Signup
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch(`${API_URL}/user/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Signup successful! Please login.');
            showLogin();
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userEmail', data.user.email);
            showCourses();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Load all courses
async function loadCourses() {
    try {
        const response = await fetch(`${API_URL}/course`);
        const data = await response.json();
        
        const coursesList = document.getElementById('courses-list');
        if (data.courses.length === 0) {
            coursesList.innerHTML = '<p>No courses available</p>';
            return;
        }

        coursesList.innerHTML = data.courses.map(course => `
            <div class="course-card">
                <h3>${course.title}</h3>
                <div class="plan-buttons">
                    <button class="monthly" onclick="buyCourse('${course.id}', 'MONTHLY')">
                        Buy Monthly - ₹999
                    </button>
                    <button class="yearly" onclick="buyCourse('${course.id}', 'YEARLY')">
                        Buy Yearly - ₹9,999
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Load user's courses
async function loadMyCourses() {
    try {
        const response = await fetch(`${API_URL}/courses/access`, {
            headers: {
                'x-user-id': localStorage.getItem('userId')
            }
        });

        const data = await response.json();
        
        const myCoursesList = document.getElementById('my-courses-list');
        if (data.courses.length === 0) {
            myCoursesList.innerHTML = '<p>You have no active courses</p>';
            return;
        }

        myCoursesList.innerHTML = data.courses.map(course => `
            <div class="course-card">
                <h3>${course.title}</h3>
                <div class="access-info">
                    ✓ Active until ${new Date(course.expiresAt).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading my courses:', error);
    }
}

// Buy course with Razorpay
async function buyCourse(courseId, plan) {
    try {
        console.log("=== Starting Course Purchase ===");
        console.log("Course ID:", courseId);
        console.log("Plan:", plan);

        // Initialize payment
        const response = await fetch(`${API_URL}/billing/init`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': localStorage.getItem('userId')
            },
            body: JSON.stringify({ courseId, plan })
        });
        console.log(response);
        
        const data = await response.json();
        console.log("Payment init response:", data);

        if (!response.ok) {
            alert(data.error || 'Failed to initialize payment');
            return;
        }


        // Open Razorpay checkout
        const options = {
            key: data.key,
            amount: data.amount,
            currency: data.currency,
            name: 'Course Platform',
            description: data.courseTitle,
            order_id: data.orderId,
            handler: async function (response) {
                console.log("=== Payment Success Response from Razorpay ===");
                console.log("Razorpay Order ID:", response.razorpay_order_id);
                console.log("Razorpay Payment ID:", response.razorpay_payment_id);
                console.log("Razorpay Signature:", response.razorpay_signature);

                // Verify payment on backend
                try {
                    console.log("Sending verification request to backend...");
                    const verifyResponse = await fetch(`${API_URL}/billing/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-user-id': localStorage.getItem('userId')
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyResponse.json();
                    console.log("Verification response:", verifyData);

                    if (verifyResponse.ok) {
                        console.log("✅ Payment verified successfully!");
                        console.log("Access expires at:", verifyData.expiresAt);
                        alert('Payment successful! Course access granted.');
                        loadMyCourses(); // Refresh my courses
                    } else {
                        console.log("❌ Payment verification failed!");
                        alert('Payment verification failed: ' + verifyData.error);
                    }
                } catch (error) {
                    console.error("❌ Verification error:", error);
                    alert('Error verifying payment: ' + error.message);
                }
            },
            prefill: {
                email: localStorage.getItem('userEmail')
            },
            theme: {
                color: '#4a90e2'
            }
        };

        console.log("Opening Razorpay checkout...");
        const razorpay = new Razorpay(options);
        razorpay.open();
    } catch (error) {
        console.error("❌ Error:", error);
        alert('Error: ' + error.message);
    }
}

// Check if user is logged in on page load
window.addEventListener('load', () => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userId && userEmail) {
        currentUser = { id: userId, email: userEmail };
        showCourses();
    } else {
        showLogin();
    }
});
