const colorSchemes = [
    { // 10-20: Classic Orange (Ignition)
        color: "#ff6b00",
        glowColor: "rgba(255, 107, 0, 0.6)",
        background: "rgba(255, 107, 0, 0.15)",
        border: "rgba(255, 107, 0, 0.4)",
        sparkleColor: "#ffa040",
    },

    { // 20-30: Solar Yellow (Building Heat)
        color: "#ffca3a",
        glowColor: "rgba(255, 202, 58, 0.6)",
        background: "rgba(255, 202, 58, 0.15)",
        border: "rgba(255, 202, 58, 0.4)",
        sparkleColor: "#ffecb3",
    },

    { // 30-40: Lime/Sulfur (Chemical Reaction)
        color: "#1982c4",
        glowColor: "rgba(25, 130, 196, 0.6)",
        background: "rgba(25, 130, 196, 0.15)",
        border: "rgba(25, 130, 196, 0.4)",
        sparkleColor: "#70d6ff",
    },

    { // 40-50: Deep Sea/Cyan (Oxygen Rich)
        color: "#8ac926",
        glowColor: "rgba(138, 201, 38, 0.6)",
        background: "rgba(138, 201, 38, 0.15)",
        border: "rgba(138, 201, 38, 0.4)",
        sparkleColor: "#c7ff70",
    },

    {  // 50-60: Electric Blue (High Energy)
        color: "#4361ee",
        glowColor: "rgba(67, 97, 238, 0.6)",
        background: "rgba(67, 97, 238, 0.15)",
        border: "rgba(67, 97, 238, 0.4)",
        sparkleColor: "#b3c2ff",
    },

    {  // 60-70: Royal Violet (Plasma)
        color: "#7209b7",
        glowColor: "rgba(114, 9, 183, 0.6)",
        background: "rgba(114, 9, 183, 0.15)",
        border: "rgba(114, 9, 183, 0.4)",
        sparkleColor: "#c17aff",
    },

    { // 70-80: Hot Magenta (Superheated)
        color: "#f72585",
        glowColor: "rgba(247, 37, 133, 0.6)",
        background: "rgba(247, 37, 133, 0.15)",
        border: "rgba(247, 37, 133, 0.4)",
        sparkleColor: "#ff70a6",
    },

    { // 0-10: Ember Red (The Start)
        color: "#e63946",
        glowColor: "rgba(230, 57, 70, 0.6)",
        background: "rgba(230, 57, 70, 0.15)",
        border: "rgba(230, 57, 70, 0.4)",
        sparkleColor: "#ff4d4d",
    },

    { // 80-90: Pure White (Maximum Thermal)
        color: "#ffffff",
        glowColor: "rgba(255, 255, 255, 0.7)",
        background: "rgba(255, 255, 255, 0.2)",
        border: "rgba(255, 255, 255, 0.5)",
        sparkleColor: "#e0e0e0",
    },

    {   // 90-100: Obsidian & Gold (The Singularity/Mastery)
        color: "#ffd700", // Gold text/icon
        glowColor: "rgba(255, 215, 0, 0.8)",
        background: "rgba(0, 0, 0, 0.8)", // Darker, prestigious background
        border: "rgba(255, 215, 0, 0.6)",
        sparkleColor: "#ffffff",
    }
];

// Get color scheme based on streak count
function getColorScheme(streak) {
    const cycleIndex = Math.floor((streak) / 10) % colorSchemes.length;
    return colorSchemes[cycleIndex];
}

// Apply color scheme to streak counter
function applyColorScheme(streak) {
    const scheme = getColorScheme(streak);
    const streaker = document.getElementById('streak-counter');
    if (!streaker) return; // Element not yet created
    const streakIcon = document.getElementById('streak-icon');
    const streakDays = document.getElementById('streak-days');
    const streakLabel = document.getElementById('streak-label');
    const streakDetails = document.getElementById('streak-details');

    // Apply colors using CSS custom properties
    streaker.style.cssText = `
                --current-color: ${scheme.color};
                --current-glow-color: ${scheme.glowColor};
                background: ${scheme.background};
                border-color: ${scheme.border};
            `;

    // Apply direct styles
    streakIcon.style.color = scheme.color;
    streakDays.style.color = scheme.color;
    streakLabel.style.color = scheme.glowColor;
    streakDetails.style.borderColor = scheme.border;

}


// Create sparkle particles
function createSparkles(element, count = 12) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let scheme = getColorScheme(user_details.LogInStreak);


    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        // Random position around the element
        const angle = (i / count) * Math.PI * 2;
        const distance = Math.random() * 40 + 30;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        sparkle.style.left = `${centerX + x - 4}px`;
        sparkle.style.top = `${centerY + y - 4}px`;
        sparkle.style.backgroundColor = scheme.sparkleColor;
        sparkle.style.boxShadow = `0 0 10px ${scheme.sparkleColor}`;
        sparkle.style.setProperty('--sparkle-x', `${x * 2}px`);
        sparkle.style.setProperty('--sparkle-y', `${y - 80}px`);
        sparkle.style.animation = `sparkleFloat 1.2s ease-out forwards`;
        sparkle.style.zIndex = '9999';

        document.body.appendChild(sparkle);

        // Remove sparkle after animation
        setTimeout(() => {
            sparkle.remove();
        }, 1200);
    }
}
// Create confetti effect
function createConfetti(count = 50) {

    const colors = ['#ff4500', '#ff8c00', '#ffd700', '#ff6347', '#ff1493', '#9b30ff', '#00bfff', '#00ff7f'];

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Random position at top
        const startX = Math.random() * window.innerWidth;
        confetti.style.left = `${startX}px`;
        confetti.style.top = '-10px';

        // Random rotation and animation delay
        const rotation = Math.random() * 720;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 1.5;
        confetti.style.animation = `confettiFall ${duration}s ease-out ${delay}s forwards`;
        confetti.style.transform = `rotate(${rotation}deg)`;

        document.body.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, (duration + delay) * 1000);
    }
}

// Streak animation function
function triggerStreakAnimation() {
    const streaker = document.getElementById('streak-counter');
    const streakDays = document.getElementById('streak-days');
    const streakIcon = document.getElementById('streak-icon');
    const currentStreak = document.getElementById('current-streak');

    if (!streaker || !streakDays || !streakIcon) {
        return;
    }

    // Remove any existing animations
    streaker.classList.remove('streak-pop', 'streak-bounce', 'streak-glow',
        'milestone-celebration', 'major-milestone');
    streakDays.classList.remove('number-increment', 'number-explosion');
    streakIcon.classList.remove('fire-burn');

    // Trigger reflow
    void streaker.offsetWidth;
    void streakDays.offsetWidth;
    void streakIcon.offsetWidth;

    // Get new color scheme after potential streak change
    //user_details.LogInStreak = newStreak;

    // Check for milestone achievement
    const isMilestone = user_details.LogInStreak % 10 === 0 && user_details.LogInStreak >= 10;

    if (isMilestone) {
        streaker.classList.add('milestone-celebration');
        if (user_details.LogInStreak >= 30) streaker.classList.add('major-milestone');
        streakDays.classList.add('number-explosion');
        streakIcon.classList.add('fire-burn');

        // Create multiple flame effects for milestones
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createSparkles(streaker, 10);
                if (i === 0) createConfetti(30);
            }, i * 300);
        }
    }
    else {
        streaker.classList.add('streak-pop');
        streakDays.classList.add('number-increment');
        streakIcon.classList.add('fire-burn');
        createSparkles(streaker, 15);
    }
    // Update display after a short delay
    setTimeout(() => {
        //document.getElementById('streak-days').textContent = user_details.LogInStreak;
        if (currentStreak) {
            currentStreak.textContent = `${user_details.LogInStreak} ימים`;
        }
        applyColorScheme(user_details.LogInStreak);


        // Keep glow for milestone numbers
        if (isMilestone) {
            streaker.classList.add('streak-glow');
            streaker.style.animation = 'streakGlow 2s infinite alternate';
        }

    }, 300);

    // Remove animation classes after they complete/*
    setTimeout(() => {
        streaker.classList.remove('streak-pop', 'streak-bounce', 'streak-glow');
        streakDays.classList.remove('number-increment');
        streakIcon.classList.remove('fire-burn');
        streaker.classList.remove('milestone-celebration', 'major-milestone');
        streakDays.classList.remove('number-explosion');

    }, isMilestone ? 2600 : 2000);
}

function updateStreakDisplay() {
    const today = new Date();
    const currentStreak = user_details["LogInStreak"];
    const daysSinceLastLog = getDaysBetweenDates(user_details["Modified"], today);

    const streakDaysEl = document.getElementById('streak-days');
    if (streakDaysEl) streakDaysEl.textContent = currentStreak;
    // Removed lines for non-existent elements
    // const currentStreakEl = document.getElementById('current-streak');
    // if (currentStreakEl) currentStreakEl.textContent = `${currentStreak} ${currentStreak === 1 ? 'יום' : 'ימים'}`;
    // const firstLogDateEl = document.getElementById('first-log-date');
    // if (firstLogDateEl) firstLogDateEl.textContent = user_details["Created"].toLocaleDateString('he-IL', {
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric'
    // });

    const streakCounter = document.getElementById('streak-counter');
    const streakTitle = document.getElementById('streak-title');
    const streakStatus = document.getElementById('streak-status');
    const streakWarning = document.getElementById('streak-warning');

    streakWarning.style.display = 'block';
    streakWarning.textContent = `(50+ ימים = איפוס)⚠️`;
    if (daysSinceLastLog < 50) {
        streakCounter.classList.remove('frozen');
        streakCounter.classList.add('active');
        streakTitle.textContent = " רצף פעיל!🔥";

        if (daysSinceLastLog === 0) {
            streakStatus.textContent = "שיחקת היום!";
        } else {
            if (daysSinceLastLog === 1) {
                streakStatus.textContent = 'שיחקת אתמול!';
            } else {
                streakStatus.textContent = `שיחקת לאחרונה לפני ${daysSinceLastLog} ימים!`;
            }
        }

    } else {
        streakCounter.classList.remove('active');
        streakCounter.classList.add('frozen');
        streakTitle.textContent = "💥 הרצף אופס";
        streakStatus.textContent = `לא שיחקת במשך ${daysSinceLastLog} ${daysSinceLastLog === 1 ? 'יום' : 'ימים'}!`;
    }
}