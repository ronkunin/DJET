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
            btn.textContent = 'جاري المعالجة...';
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
    const modalHTML = `
    <!-- Google Sign-In Modal -->
    <div class="welcome-modal" id="welcome-modal">
        <div class="welcome-container glass">
            <div class="welcome-header">
                <h2>🎧 ברוכים הבאים ל-DJET!</h2>
                <p>כדי להתחיל, עליך להתחבר עם חשבון Google</p>
            </div>
            <div class="welcome-content">
                <div style="text-align: center; padding: 20px 0;">
                    <p style="margin-bottom: 20px; font-size: 1.1em;">
                        ✅ התחברות עם Google תבטיח שפרופילך יישמר ויהיה זמין בכל מכשיר
                    </p>
                    <button class="welcome-button" id="google-signin-btn" onclick="signInWithGoogle();" style="font-size: 1.1em; padding: 12px 24px;">
                        🔐 התחבר עם Google
                    </button>
                </div>
                <p id="welcome-warning" style="text-align: center; margin-top: 20px;"></p>
            </div>
        </div>
    </div>
    `;
    
    const existingModal = document.getElementById('welcome-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('welcome-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
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
