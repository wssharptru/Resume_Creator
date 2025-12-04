// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyBvxW_wYvfhSFF0XAJHm_ZXeL4zGD1DWMQ",
  authDomain: "resume-creator-90b6d.firebaseapp.com",
  projectId: "resume-creator-90b6d",
  storageBucket: "resume-creator-90b6d.firebasestorage.app",
  messagingSenderId: "564993156564",
  appId: "1:564993156564:web:c74295831e111423186241",
  measurementId: "G-SYELY4FJX8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// --- Auth State Listener & Redirection ---
auth.onAuthStateChanged(user => {
    const path = window.location.pathname;
    const page = path.split("/").pop();

    if (user) {
        console.log("User is signed in:", user.email);
        // If on login page, redirect to index
        if (page === 'login.html') {
            window.location.href = 'index.html';
        }
        
        // Update UI if elements exist (for index.html)
        const userEmailDisplay = document.getElementById('userEmailDisplay');
        const userInfo = document.getElementById('userInfo');
        const signInLink = document.getElementById('signInLink');
        
        if (userEmailDisplay) userEmailDisplay.textContent = user.email;
        if (userInfo) userInfo.style.display = 'flex';
        if (signInLink) signInLink.style.display = 'none';

    } else {
        console.log("User is signed out");
        // If NOT on login page, redirect to login
        if (page !== 'login.html') {
            window.location.href = 'login.html';
        }
    }
});

// --- Auth Actions ---

function handleSignUp(email, password) {
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Redirect handled by onAuthStateChanged
        })
        .catch(error => {
            alert(`Error signing up: ${error.message}`);
        });
}

function handleSignIn(email, password) {
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Redirect handled by onAuthStateChanged
        })
        .catch(error => {
            alert(`Error signing in: ${error.message}`);
        });
}

function handleSignOut() {
    auth.signOut().then(() => {
        // Redirect handled by onAuthStateChanged
    }).catch(error => {
        console.error("Sign out error:", error);
    });
}

// Make functions globally available
window.handleSignUp = handleSignUp;
window.handleSignIn = handleSignIn;
window.handleSignOut = handleSignOut;
