// Google Authentication Module
// Handles sign-in, sign-out, and user persistence

let currentGoogleUser = null;

/**
 * Initialize Google authentication on page load
 * Check if user is already authenticated via local storage or Firebase session
 */
async function initializeGoogleAuth() {
    // Wait for Firebase to be ready
    await window.firebaseReadyPromise;
    
    // Check if user was previously authenticated
    const storedGoogleUid = window.getStoredDjetGoogleUid();
    
    if (storedGoogleUid) {
        // User was previously logged in with Google
        // Set up listener for real-time Firebase auth state
        window.firebaseRTDB.onAuthStateChanged(window.firebaseRTDB.auth, (user) => {
            if (user) {
                // User is still authenticated
                currentGoogleUser = user;
                window.storeGoogleAuthData(user);
                resumeLoadingAfterAuth(user);
            } else {
                // Session expired, require re-authentication
                showGoogleSignInPrompt();
            }
        });
    }
}

/**
 * Prompt user to sign in with Google
 */
async function signInWithGoogle() {
    try {
        // Show loading state
        const btn = document.getElementById('google-signin-btn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'טוען...';
        }

        // Create Google provider and sign in
        const provider = new window.firebaseRTDB.GoogleAuthProvider();
        const result = await window.firebaseRTDB.signInWithPopup(
            window.firebaseRTDB.auth,
            provider
        );

        currentGoogleUser = result.user;
        
        // Store Google auth data in local storage
        window.storeGoogleAuthData(currentGoogleUser);
        
        // Hide sign-in prompt and proceed with profile setup
        hideGoogleSignInPrompt();
        resumeLoadingAfterAuth(currentGoogleUser);

        return currentGoogleUser;
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        const welcomeWarningEl = document.getElementById('welcome-warning');
        if (welcomeWarningEl) {
            welcomeWarningEl.textContent = `⚠️ שגיאה בהתחברות: ${error.message}`;
        }
        
        // Re-enable button
        const btn = document.getElementById('google-signin-btn');
        if (btn) {
            btn.disabled = false;
            btn.textContent = '🔐 התחבר עם Google';
        }
    }
}

/**
 * Sign out the current user
 */
async function googleSignOut() {
    try {
        await window.firebaseRTDB.signOut(window.firebaseRTDB.auth);
        
        // Clear stored auth data
        window.storeGoogleAuthData(null);
        currentGoogleUser = null;
        
        // Clear user profile data
        window.localStorage.removeItem('djet_user_id');
        window.localStorage.removeItem('djet_user_name');
        window.localStorage.removeItem('djet_user_unit');
        
        window.location.reload();
    } catch (error) {
        console.error('Sign-out Error:', error);
    }
}

/**
 * Resume application loading after successful Google authentication
 */
function resumeLoadingAfterAuth(googleUser) {
    // Show welcome modal for profile setup if needed
    if (!window.getStoredDjetUserName() || !window.getStoredDjetUserUnit()) {
        hideLoadingScreen();
        updateWelcomeModalView();
        showWelcomeModal();
    } else {
        // User already has profile set up, proceed with loading
        load_user_details();
    }
}

/**
 * Show Google sign-in prompt in welcome modal
 */
function showGoogleSignInPrompt() {
    hideLoadingScreen();
    const welcomeModal = document.getElementById('welcome-modal');
    if (welcomeModal) {
        updateWelcomeModalView();
        welcomeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const warning = document.getElementById('welcome-warning');
        if (warning) {
            warning.textContent = '';
        }
        const btn = document.getElementById('google-signin-btn');
        if (btn) {
            btn.disabled = false;
            btn.textContent = '🔐 התחבר עם Google';
        }
        return;
    }

    hideLoadingScreen();
}

/**
 * Hide Google sign-in prompt
 */
function hideGoogleSignInPrompt() {
    const modal = document.getElementById('welcome-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = 'auto';
}

/**
 * Update welcome modal to include Google authentication step
 */
function updateWelcomeModalForGoogle() {
    const welcomeModal = document.getElementById('welcome-modal');
    if (welcomeModal && currentGoogleUser) {
        // Modal is already showing, keep current implementation
    }
}

/**
 * Get current Google user information
 */
function getCurrentGoogleUser() {
    return currentGoogleUser || {
        uid: window.getStoredDjetGoogleUid(),
        email: window.getStoredDjetGoogleEmail(),
        displayName: window.getStoredDjetGoogleDisplayName()
    };
}
