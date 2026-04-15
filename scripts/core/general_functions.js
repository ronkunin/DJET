function formatDate(date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
        return 'היום';
    } else if (messageDate.getTime() === yesterday.getTime()) {
        return 'אתמול';
    } else {
        return date.toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

function formatTime(date) {

    return date.toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// TIME FORMATTING FUNCTION
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs <= 1) return 'כרגע';
    if (diffSecs <= 60) return `לפני ${diffSecs} שניות`;
    if (diffMins <= 60) return `לפני ${diffMins} דקות`;
    if (diffHours <= 25) return `לפני ${diffHours} שעות`;
    if (diffDays <= 8) return `לפני ${diffDays} ימים`;
    if (diffWeeks < 5) return `לפני ${diffWeeks} שבועות`;
    if (diffMonths <= 12) return `לפני ${diffMonths} חודשים`;
    return `לפני ${diffYears} שנים`;
}

function getDaysBetweenDates(date1, date2) {
    date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
    date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
    return Math.abs(Math.round(date2 - date1) / (1000 * 3600 * 24));
}


function hasBadWords(text) {
    if (!text) return false;

    const clean = text.toLowerCase()
    for(word of BAD_WORDS) {
        if(clean.includes(word.toLowerCase()))
            return true;
    }
}

function isGifUrl(text) {
    return text.toLowerCase().includes('.gif') && text.toLowerCase().includes('djet');
}


function fillNullsReturnFilled(data, map = {}) {
    const filled = {};
    for (const key in map) {
        if (data[key] === null || data[key] === undefined) {
            data[key] = map[key];
            filled[key] = map[key];
        }
    }
    return filled;
}

function arrToStr(arr) {
    let str = "";
    for (let i = 0; i < arr.length; i++) {
        str += arr[i] + ",";
    }
    return str.slice(0, -1);
}

function strToIntArr(str) {
    if (str == null || str == "") return [];
    return str.split(",").map(Number)
}

