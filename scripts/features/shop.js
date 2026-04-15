
let selectedGif = null;
let activeGifCard = null;
let currentFilter2 = 'daily';
let timerInterval = null;

// Enhanced GIF data with titles and categories


// ==============================================
// TIMER FUNCTIONS (RED COUNTDOWN TO MIDNIGHT)
// ==============================================
function startTimer() {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
    setTimeout(hideDailyTimer, 2 * 60 * 1000); // Hide timer after 2 minutes
}

function updateTimer() {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - now;

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const updateElements = (prefix) => {
        const hoursEl = document.getElementById(`${prefix}timer-hours`);
        const minutesEl = document.getElementById(`${prefix}timer-minutes`);
        const secondsEl = document.getElementById(`${prefix}timer-seconds`);
        
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    };

    updateElements('');
    updateElements('timer-');
}

function hideDailyTimer() {
    const dailyTimer = document.getElementById('daily-timer');
    if (dailyTimer) {
        dailyTimer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        dailyTimer.style.opacity = '0';
        dailyTimer.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            dailyTimer.style.display = 'none';
        }, 500); // Wait for the animation to complete
    }
}

// ==============================================
// DSHOP FUNCTIONS - ENHANCED
// ==============================================
function shuffleBySeed(array, seed) {
    let x = seed | 0;

    // avalanche the seed
    x ^= x >>> 16;
    x = Math.imul(x, 0x7feb352d);
    x ^= x >>> 15;
    x = Math.imul(x, 0x846ca68b);
    x ^= x >>> 16;

    // PRNG state
    let state = x >>> 0;

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        // mulberry32 step
        state += 0x6D2B79F5;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;

        const j = Math.floor(r * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function loadAllGIFs() {
    const allGifsContainer = document.getElementById('all-gifs');
    const allGifsMobile = document.getElementById('all-gifs_mobile');
    const dshoptitle = document.getElementById('dshoptitle');
    const dshoptitleMobile = document.getElementById('dshoptitle_mobile');
    
    const loadIntoContainer = (container, titleElement) => {
        if (!container) return;
        const today = new Date();
        const seed = 3 * (today.getFullYear() + today.getMonth() + today.getDate()) + 4;
        const dailyGIFs = [library_gifs[seed % library_gifs.length], library_gifs[(seed + 1) % library_gifs.length], library_gifs[(seed + 2) % library_gifs.length]]

        container.innerHTML = '';

        let filteredGIFs = library_gifs.filter(gif => {
            const isOwned = user_details.items && user_details.items.includes(gif.Id);
            const canAfford = user_details.dcoins >= gif.price;

            switch (currentFilter2) {
                case 'owned':
                    if (titleElement) titleElement.textContent = 'הפריטים שבבעלותך';
                    return isOwned;
                case 'affordable':
                    if (titleElement) titleElement.textContent = 'הפריטים שאתה יכול להרשות לעצמך';
                    return !isOwned && canAfford;
                case 'daily':
                    if (titleElement) titleElement.textContent = 'החנות היומית';
                    return dailyGIFs.some(dailyGif => dailyGif.Id === gif.Id);
                default:
                    if (titleElement) titleElement.textContent = 'האוסף המלא';
                    return true;
            }
        });
        filteredGIFs = shuffleBySeed(filteredGIFs, 3 * (today.getFullYear() + today.getMonth() + today.getDate())); // Shuffle with a fixed seed for consistency
        filteredGIFs.forEach(gif => {
            if(!gif.isPublic) return;
            const isOwned = user_details.items && user_details.items.includes(gif.Id);
            const canAfford = user_details.dcoins >= gif.price;
            const isDaily = dailyGIFs.some(dailyGif => dailyGif.Id === gif.Id);
            const isWeekend = today.getDay() === 5 || today.getDay() === 6; // Friday (5) or Saturday (6)
            const hasDiscount = isDaily && isWeekend;
            const discountedPrice = hasDiscount ? Math.floor(gif.price * 0.8) : gif.price;

            const gifCard = document.createElement('div');
            gifCard.className = 'gif-card';
            gifCard.dataset.gifId = gif.Id;

            let imgCon = "";
            if (!isDaily && !isOwned)
                imgCon = `<div class="gif-image-container"><i class="fas fa-question" style="
                font-size: 200px;
                filter: blur(20px);
            "></i></div>`;
            else
                imgCon = `<div class="gif-image-container">
                                <img src="${gif.FileRef}" oncontextmenu="return false;" draggable="false" class="gif-image" loading="lazy" style="${!isDaily && !isOwned ? 'filter: blur(20px) grayscale(100%);' : ''}">
                                ${hasDiscount && currentFilter2 != 'owned' ? '<div class="discount-badge">20% הנחה</div>' : ''}
                            </div>`
            gifCard.innerHTML = `
                        ${imgCon}
                        <div class="gif-info">
                            <div class="gif-stats">
                            ${isDaily && currentFilter2 == 'daily' ? `
                                <div class="gif-price">
                                    <i class="fas fa-coins"></i>
                                    ${hasDiscount ? `<span style="text-decoration: line-through; color: #888;">${gif.price}</span> ${discountedPrice}` : gif.price}
                                </div>` : ``}
                                <div class="gif-sales">
                                    <i class="fas fa-shopping-bag"></i>
                                    ${gif.buyers_num} רכישות
                                </div>
                            </div>
                            <button class="buy-button ${isOwned ? 'owned' : ''}"
                    ${imgCon}
                    <div class="gif-info">
                        <div class="gif-stats">
                        ${isDaily && currentFilter2 == 'daily' ? `
                            <div class="gif-price">
                                <i class="fas fa-coins"></i>
                                ${hasDiscount ? `<span style="text-decoration: line-through; color: #888;">${gif.price}</span> ${discountedPrice}` : gif.price}
                            </div>` : ``}
                            <div class="gif-sales">
                                <i class="fas fa-shopping-bag"></i>
                                ${gif.buyers_num} רכישות
                            </div>
                        </div>
                        <button class="buy-button ${isOwned ? 'owned' : ''}" 
                                    ${isOwned ? 'disabled' : !canAfford || !isDaily ? 'disabled' : ''}>
                                ${isOwned ? '<i class="fas fa-check"></i> בבעלותך' :
                    !isDaily ? '<i class="fas fa-clock"></i> לא זמין כרגע' :
                        !canAfford ? '<i class="fas fa-lock"></i> יתרה לא מספקת' :
                            '<i class="fas fa-shopping-cart"></i> קנה עכשיו'}
                            </button>
                        </div>
                    `;

            // Add click event for selection
            gifCard.addEventListener('click', function (e) {
                if (!e.target.closest('.buy-button')) {
                    selectGifCard(gifCard, gif);
                }
            });

            if (!isOwned && canAfford) {
                const buyBtn = gifCard.querySelector('.buy-button');
                buyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectGifCard(gifCard, gif);
                    showPurchaseModal(gif, discountedPrice);
                });
            }

            container.appendChild(gifCard);
            gifCard.style.animation = 'fadeInScale 0.5s ease forwards';
        });
    };
    
    loadIntoContainer(allGifsContainer, dshoptitle);
    loadIntoContainer(allGifsMobile, dshoptitleMobile);

function selectGifCard(cardElement, gif) {
    // Remove active class from all cards
    document.querySelectorAll('.gif-card').forEach(card => {
        card.classList.remove('active');
    });

    // Add active class to selected card
    cardElement.classList.add('active');
    activeGifCard = cardElement;
    selectedGif = gif;

    // Scroll to center the card in carousel
    if (cardElement.parentElement.classList.contains('carousel-container')) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

async function logBuy(id, amount = 1) {
    let buyers_num = await getSPValue("gifs", "buyers_num", id);
    updateSPValueInLibrary("gifs", "buyers_num", id, buyers_num + amount, true);
}

function purchaseGIF(gif, discountedPrice = null) {
    if (!gif) return;

    const today = new Date();
    const isWeekend = today.getDay() === 5 || today.getDay() === 6; // Friday (5) or Saturday (6)
    const hasDiscount = isWeekend;
    const price = hasDiscount ? Math.floor(gif.price * 0.8) : gif.price;


    if (user_details.items && user_details.items.includes(gif.Id)) {
        showSystemNotification('error', 'רכישה נכשלה', 'כבר יש לך את הדמות הזאת!');
        hidePurchaseModal();
        return;
    }

    if (user_details.dcoins < price) {
        showSystemNotification('error', 'יתרה לא מספקת', 'אין לך מספיק DCoins לקנייה זו!');
        hidePurchaseModal();
        return;
    }
    gif.buyers_num += 1;
    //updateSPValueInList("gifs", "price", gif.Id, gif.buyers_num, true);

    //user_details.dcoins -= price;
    let myitems = strToIntArr(user_details.items);
    myitems.push(gif.Id);
    user_details.items = arrToStr(myitems);
    updateSPValueInList2("Users", "items", "dcoins", user_details["Id"], arrToStr(myitems), user_details["dcoins"], true);
    //saveTransactionOnSP("transaction", user_details["Id"], user_details["name"], 0, "DBank", price, "רכישת מוצר ב-DShop");
    saveTransactionOnSP("transaction", 0, "DBank", user_details["Id"], user_details["username"], -1 * price, "רכישת מוצר ב-DShop");
    animateMoneyChange(-price);

    //  transferHistory.unshift(transferRecord);
    // Update display

    // Animate purchased card
    if (activeGifCard) {
        activeGifCard.classList.add('purchased');
        setTimeout(() => {
            activeGifCard.classList.remove('purchased');
        }, 800);
    }

    loadAllGIFs();
    loadOwnedGifs();

    // Show success notification
    showSystemNotification('success', 'רכישה הושלמה');

    // Send chat message about the purchase with GIF
    // const gifMessage = gif.src;
    // addNewMessage(gifMessage, false, true, user_details.unit, "user");

    hidePurchaseModal();
}



// ==============================================
// REDESIGNED CHAT FUNCTIONS WITH GROUPED MESSAGES
// ==============================================

function nameToColor(name) {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += value.toString(16).padStart(2, "0");
    }

    return color;
}


// ==============================================
// OWNED GIFS MANAGEMENT
// ==============================================
function loadOwnedGifs() {
    const ownedGifsGrid = document.getElementById('owned-gifs-grid');
    if (!ownedGifsGrid) return;

    ownedGifsGrid.innerHTML = '';

    if ((!user_details.items) || user_details.items.length === 0) {
        ownedGifsGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #8888cc;">
                        <i class="fas fa-image" style="font-size: 1.5rem; opacity: 0.5; margin-bottom: 10px;"></i>
                        <p style="font-size: 0.8rem;">אין לך דמויות עדיין. קנה דמויות מהחנות!</p>
                    </div>
                `;
        return;
    }
    let myitems = strToIntArr(user_details.items);
    myitems.forEach(gifId => {
        const gif = library_gifs.find(g => g.Id === gifId);
        if (gif) {
            const gifItem = document.createElement('div');
            gifItem.className = 'owned-gif-item';
            gifItem.innerHTML = `<img oncontextmenu="return false;" draggable="false" src="${gif.FileRef}">`;
            gifItem.addEventListener('click', () => { addNewMessage(gif.FileRef); toggleGifPicker(false); });
            ownedGifsGrid.appendChild(gifItem);
        }
    });
}