// ==============================================
// LOADING SCREEN FUNCTIONS
// ==============================================

function addLoadingScreen() {
    const loadingHTML = `
        <div class="loading-screen hidden" id="loading-screen">
            <div class="loading-logo">
                <i class="fas fa-gamepad" aria-hidden="true" style="color: var(--icon-color);  filter: drop-shadow(0 0 8px rgb(154, 140, 255)); "></i>
                <span style=" background-clip:text; color:transparent; font-weight:800;">DJET</span>
            </div>
            <div class="loading-bar">
                <div class="loading-progress" id="loading-progress"></div>
            </div>
            <div class="loading-text">...טוען את החוויה הכי שווה בשירות שלך</div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', loadingHTML);
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.getElementById('loading-progress');
    loadingProgress.style.width = '0%';
    loadingScreen.classList.remove('hidden');
    document.body.style.overflowY = 'hidden';

    // simple progress animation
    setTimeout(() => {
        loadingProgress.style.width = '100%';
    }, 200);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.getElementById('loading-progress');
    loadingScreen.classList.add('hidden');


    const streakCounter = document.getElementById('streak-counter');
    streakCounter.style.transform = 'scale(1.2)';
    setTimeout(() => {
        streakCounter.style.transform = 'scale(1)';
        document.body.style.overflowY = 'scroll';
    }, 300);
}
