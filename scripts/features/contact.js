// ==============================================
// USER SETTINGS & NEW USER FLAG
// ==============================================

// ==============================================
// CONTACTS DATA
// contacts: { username, unit, rate, type, message, reply, Title, Id, userId, Modified, Created }
// type options: רעיון חדש | תקלה | מוזיקה | בקשה אישית | אחר
// ==============================================
let contacts_library = [];

// ==============================================
// CONTACT SYSTEM
// ==============================================
let contactCurrentTab = 'new'; // 'new' | 'list'
let contactSelectedId = null;
let contactNewRating = 0;
let count_newcontacts = 0;

// ==============================================
// TEST PERMISSION BUTTONS
// ==============================================


function updateNotifBadge() {
    const perm = PREMISSIONS[userEmail];
    const badge = document.getElementById('contact-notif-badge');
    if (!badge) {
        return;
    }
    badge.style.display = count_newcontacts > 0 ? 'block' : 'none';
}

function renderContactTabs() {
    const tabsEl = document.getElementById('contact-tabs');
    const perm = PREMISSIONS[userEmail];
    let tabs = '';
    // regular: create + see their own
    // loyal: create + see ALL + open any
    // manager: see ALL + reply (no create)
 
        tabs += `<button class="contact-tab ${contactCurrentTab === 'new' ? 'active' : ''}" onclick="switchContactTab('new')"><i class="fas fa-plus-circle"></i> פנייה חדשה</button>`;
        const listLabel = perm === 'נאמן DJET' || perm === 'מנהל DJET'? 'כל הפניות' : 'הפניות שלי';
        tabs += `<button class="contact-tab ${contactCurrentTab === 'list' ? 'active' : ''}" onclick="switchContactTab('list')"><i class="fas fa-list"></i> ${listLabel}</button>`;
    
    tabsEl.innerHTML = tabs;
}

function switchContactTab(tab) {
    contactCurrentTab = tab;
    contactSelectedId = null;
    renderContactTabs();
    renderContactBody();
}

function renderContactBody() {
    const body = document.getElementById('contact-body');
    const perm = PREMISSIONS[userEmail];

    if (contactSelectedId) {
        renderContactDetail(body);
        return;
    }

    if (contactCurrentTab === 'new') {
        renderNewContactForm(body);
    } else {
        renderContactList(body);
    }
}

function renderNewContactForm(body) {
    body.innerHTML = `
                <div class="contact-form-group">
                    <label><i class="fas fa-id-card"></i> פרטי שולח</label>
                    <div style="display:flex;gap:10px;flex-wrap:wrap;">
                        <div class="readonly-field" style="flex:1;min-width:0;display:flex;align-items:center;gap:6px;">
                            <i class="fas fa-user" style="color:var(--secondary-color);font-size:0.8rem;"></i>
                            <span style="font-size:0.88rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user_details.username}</span>
                        </div>
                        <div class="readonly-field" style="flex:1;min-width:0;display:flex;align-items:center;gap:6px;">
                            <i class="fas fa-map-marker-alt" style="color:var(--primary-color);font-size:0.8rem;"></i>
                            <span style="font-size:0.88rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user_details.unit}</span>
                        </div>
                        <div class="readonly-field" style="flex:1.4;min-width:0;display:flex;align-items:center;gap:6px;">
                            <i class="fas fa-desktop" style="color:var(--chat-color);font-size:0.8rem;"></i>
                            <span style="font-size:0.88rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${userTitle}</span>
                        </div>
                    </div>
                </div>
                <div class="contact-form-group">
                    <label><i class="fas fa-layer-group"></i> סוג פנייה</label>
                    <select class="contact-select" id="new-contact-type" onchange="updateTypeHint()">
                        <option value="">-- בחר סוג --</option>
                        <option value="רעיון חדש">💡 רעיון חדש</option>
                        <option value="תקלה">🔧 תקלה</option>
                        <option value="מוזיקה">🎵 מוזיקה</option>
                        <option value="בקשה אישית">🙏 בקשה אישית</option>
                        <option value="אחר">📌 אחר</option>
                    </select>
                </div>
                <div class="contact-form-group">
                    <label style="display:block;margin-bottom:10px;"><i class="fas fa-star"></i> דירוג האתר (1–5)</label>
                    <div class="star-rating" id="star-rating">
                        <span class="star" onclick="setContactRating(1)">★</span>
                        <span class="star" onclick="setContactRating(2)">★</span>
                        <span class="star" onclick="setContactRating(3)">★</span>
                        <span class="star" onclick="setContactRating(4)">★</span>
                        <span class="star" onclick="setContactRating(5)">★</span>
                    </div>
                </div>
                <div class="contact-form-group">
                    <label><i class="fas fa-comment-alt"></i> הודעה</label>
                    <textarea class="contact-textarea" id="new-contact-message" placeholder="כתוב את הפנייה שלך כאן..."></textarea>
                    <div id="type-hint" style="display:none;margin-top:10px;padding:10px 14px;border-radius:10px;background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.2);color:#e0c060;font-size:0.85rem;line-height:1.6;direction:rtl;">
                    </div>
                </div>
                <button class="contact-submit" onclick="submitNewContact()">
                    <i class="fas fa-paper-plane"></i> שלח פנייה
                </button>
            `;
    contactNewRating = 0;
    updateStarUI();
}

function setContactRating(v) {
    contactNewRating = v;
    updateStarUI();
}

function updateStarUI() {
    const stars = document.querySelectorAll('#star-rating .star');
    stars.forEach((s, i) => {
        s.classList.toggle('active', i < contactNewRating);
    });
}

const TYPE_HINTS = {
    "רעיון חדש": "💡 כל רעיון יתקבל בברכה! נשמח לשמוע כיצד אפשר לשפר את המערכת.",
    "תקלה": "🔧 נסו לפרט מה קרה, באיזה משחק, ואם הבעיה חוזרת אחרי רענון. זה יעזור לנו לתקן מהר יותר.",
    "מוזיקה": "🎵 לא מבטיחים הלבנות של מוזיקה חדשה, מוזמנים להלבין אתם ונעלה.",
    "בקשה אישית": "🙏 נשתדל לענות לכל בקשה. שימו לב שחלק מהבקשות תלויות באישור גורמים נוספים.",
    "אחר": "📌 כל נושא אחר שאינו מתאים לקטגוריות האחרות. נקרא ונחזור אליכם."
};

function updateTypeHint() {
    const type = document.getElementById('new-contact-type').value;
    const hint = document.getElementById('type-hint');
    if (hint) {
        if (type && TYPE_HINTS[type]) {
            hint.textContent = TYPE_HINTS[type];
            hint.style.display = 'block';
        } else {
            hint.style.display = 'none';
        }
    }
}

function submitNewContact() {
    const type = document.getElementById('new-contact-type').value;
    const message = document.getElementById('new-contact-message').value.trim();
    if (!type || !message || !contactNewRating) {
        showSystemNotification("error", 'נא למלא את כל השדות ולבחור דירוג');
        return;
    }
    saveContactOnSP(message, type, contactNewRating);
    showSystemNotification("success", 'הפנייה נשלחה בהצלחה! 🎉');
    switchContactTab('list');
    closeContactModal();
}

function renderContactList(body) {
    const perm = PREMISSIONS[userEmail];
    let list;
    const canOpenAny = perm === 'נאמן DJET';
    const canReplyAny = perm === 'מנהל DJET';
    const canOpenOwn = !(canOpenAny || canReplyAny);

    if (canOpenOwn) {
        list = contacts_library.filter(c => c.AuthorId === userId);
    } else {
        // loyal and manager both see everything
        list = [...contacts_library];
    }

    if (list.length === 0) {
        body.innerHTML = `<div class="empty-contacts"><i class="fas fa-inbox"></i><p>אין פניות להצגה</p></div>`;
        return;
    }

    
    // loyal can open others' contacts (but can't edit/reply)
    // manager can reply to all but can't open their own as editable

    body.innerHTML = `<div class="contacts-list">${list.map(c => {
        const stars = '★'.repeat(c.rate) + '☆'.repeat(5 - c.rate);
        const canOpen = canOpenOwn ? (c.AuthorId === userId) : true;
        return `<div class="contact-item" onclick="${canOpen ? `openContactDetail(${c.Id})` : ''}">
                    <div class="contact-item-header">
                        <span class="contact-item-title">${c.Title}</span>
                    </div>
                    <div style="font-size:0.82rem;color:#8888cc;margin-bottom:6px;">
                        ${perm !== 'regular' ? `<strong>${c.username}</strong> · ${c.unit} · ` : ''} ${new Date(c.Created).toLocaleDateString('he-IL')}
                    </div>
                    <div class="contact-item-stars">${stars}</div>
                    <div class="contact-item-message" style="margin-top:8px;">${c.message.substring(0, 100)}${c.message.length > 100 ? '...' : ''}</div>
                    ${c.reply ? `<div class="contact-item-reply"><i class="fas fa-reply"></i> ${c.reply}</div>` : ''}
                </div>`;
    }).join('')}</div>`;
}

function openContactDetail(id) {
    contactSelectedId = id;
    // Mark as read
    const c = contacts_library.find(x => x.Id === id);
    renderContactBody();
}

function renderContactDetail(body) {
    const c = contacts_library.find(x => x.Id === contactSelectedId);
    if (!c) { contactSelectedId = null; renderContactBody(); return; }
    const perm = PREMISSIONS[userEmail];
    const stars = '★'.repeat(c.rate) + '☆'.repeat(5 - c.rate);

    const isOwn = c.AuthorId == userId;
    // regular: can edit own. loyal: read-only. manager: can reply to others
    const canEdit = isOwn;
    const canReply =  perm === 'מנהל DJET';

    body.innerHTML = `
                <button class="contact-back-btn" onclick="contactSelectedId=null;renderContactBody()">
                    <i class="fas fa-arrow-right"></i> חזרה לרשימה
                </button>
                <div class="contact-detail-box">
                    <div class="detail-row"><span class="detail-label">שולח:</span><span class="detail-value">${c.username} · ${c.unit}</span></div>
                    <div class="detail-row"><span class="detail-label">סוג:</span><span class="detail-value">${c.Title}</span></div>
                    <div class="detail-row"><span class="detail-label">דירוג:</span><span class="detail-value" style="color:var(--streak-color)">${stars}</span></div>
                    <div class="detail-row"><span class="detail-label">תאריך:</span><span class="detail-value">${new Date(c.Created).toLocaleDateString('he-IL')}</span></div>
                    <div class="contact-form-group" style="margin-top:14px;">
                        <label style="color:var(--secondary-color);font-weight:600;font-size:0.88rem;display:block;margin-bottom:8px;"><i class="fas fa-comment-alt"></i> הודעה</label>
                        ${canEdit
            ? `<textarea class="contact-textarea" id="edit-message">${c.message}</textarea>`
            : `<div class="readonly-field" style="line-height:1.7;">${c.message}</div>`
        }
                    </div>
                    ${c.reply ? `<div class="contact-item-reply" style="margin-top:0;"><strong>תגובת מנהל:</strong> ${c.reply}</div>` : ''}
                    ${canEdit ? `
                        <button class="contact-submit" style="margin-top:12px;" onclick="saveEditedContact(${c.Id})">
                            <i class="fas fa-save"></i> שמור שינויים ושלח מחדש
                        </button>` : ''}
                    ${canReply ? `
                        <div class="reply-textarea-wrap">
                            <label><i class="fas fa-reply"></i> תגובה למשתמש</label>
                            <textarea class="contact-textarea" id="reply-message" placeholder="כתוב תגובה...">${c.reply || ''}</textarea>
                            <button class="reply-send-btn" onclick="sendReply(${c.Id})">
                                <i class="fas fa-paper-plane"></i> שלח תגובה
                            </button>
                        </div>` : ''}
                </div>
            `;
}

function saveEditedContact(id) {
    const c = contacts_library.find(x => x.Id === id);
    if (!c) return;
    const newMsg = document.getElementById('edit-message').value.trim();
    if (!newMsg) { showSystemNotification("error", 'ההודעה לא יכולה להיות ריקה'); return; }
    c.message = newMsg;
    updateSPValueInList("Supports", "message", id, newMsg);
    c.Modified = new Date().toISOString();
    showSystemNotification("success", 'הפנייה עודכנה ונשלחה מחדש!');
    contactSelectedId = null;
    renderContactBody();
}

function sendReply(id) {
    const c = contacts_library.find(x => x.Id === id);
    if (!c) return;
    const replyText = document.getElementById('reply-message').value.trim();
    if (!replyText) { showSystemNotification("error", 'נא לכתוב תגובה'); return; }
    c.reply = replyText;
    c.Modified = new Date().toISOString();
    updateSPValueInList("Supports", "reply", id, replyText);
    showSystemNotification("success", 'התגובה נשלחה בהצלחה!');
    contactSelectedId = null;
    renderContactBody();
}

async function saveContactOnSP(message, title, rate) {
    addItemToList("Supports", {
        "username": user_details['username'],
        "unit": user_details['unit'],
        "Title": title,
        "rate": rate,
        "message": message,
    });
}

