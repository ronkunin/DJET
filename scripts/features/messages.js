// ==============================================
// CHAT VARIABLES
// ==============================================
let unreadMessages = 0;
let chatOpen = true;
let lastReadTime = new Date();

// ==============================================
// CHAT FUNCTIONS (with date grouping)
// ==============================================

function initializeChat() {
    // Desktop event listeners
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const sendGifButton = document.getElementById('send-gif-button');
    const closeGifPicker = document.getElementById('close-gif-picker');

    if (sendButton) {
        sendButton.addEventListener('click', function () {
            const input = messageInput;
            const message = input.value.trim();

            if (message) {
                addNewMessage(message);
                input.value = '';

                // Switch to chat tab when sending message
                switchTab('chat');
            }
        });
    }

    if (sendGifButton) {
        sendGifButton.addEventListener('click', function () {
            const isPickerOpen = document.getElementById('gif-picker').classList.contains('active');
            toggleGifPicker(!isPickerOpen);
        });
    }

    if (closeGifPicker) {
        closeGifPicker.addEventListener('click', function () {
            toggleGifPicker(false);
        });
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendButton.click();
            }
        });
    }

    // Mobile event listeners
    const sendButtonMobile = document.getElementById('send-button-mobile');
    const messageInputMobile = document.getElementById('message-input-mobile');
    const sendGifButtonMobile = document.getElementById('send-gif-button-mobile');
    const closeGifPickerMobile = document.getElementById('close-gif-picker-mobile');

    if (sendButtonMobile) {
        sendButtonMobile.addEventListener('click', function () {
            const input = messageInputMobile;
            const message = input.value.trim();

            if (message) {
                addNewMessage(message);
                input.value = '';

                // Switch to chat display on mobile
                if (typeof switchMobileDisplay === 'function') {
                    switchMobileDisplay('mobile-chat-display');
                }
            }
        });
    }

    if (sendGifButtonMobile) {
        sendGifButtonMobile.addEventListener('click', function () {
            const isPickerOpen = document.getElementById('gif-picker-mobile').classList.contains('active');
            toggleGifPickerMobile(!isPickerOpen);
        });
    }

    if (closeGifPickerMobile) {
        closeGifPickerMobile.addEventListener('click', function () {
            toggleGifPickerMobile(false);
        });
    }

    if (messageInputMobile) {
        messageInputMobile.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendButtonMobile.click();
            }
        });
    }
}
function toggleGifPicker(show = true) {
    const gifPicker = document.getElementById('gif-picker');
    const gifButton = document.getElementById('send-gif-button');

    if (show) {
        gifPicker.classList.add('active');
        gifButton.classList.add('active');
    } else {
        gifPicker.classList.remove('active');
        gifButton.classList.remove('active');
    }
}

function toggleGifPickerMobile(show = true) {
    const gifPicker = document.getElementById('gif-picker-mobile');
    const gifButton = document.getElementById('send-gif-button-mobile');

    if (show) {
        gifPicker.classList.add('active');
        gifButton.classList.add('active');
    } else {
        gifPicker.classList.remove('active');
        gifButton.classList.remove('active');
    }
}
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
function loadChatMessages() {
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatMessagesMobile = document.getElementById('chat-messages-mobile');
    
    // Function to load into a container
    const loadIntoContainer = (container) => {
        container.innerHTML = '';

        if (library_messages.length === 0) {
            container.innerHTML = `
                <div class="chat-empty">
                    <i class="fas fa-comment-slash"></i>
                    <p>אין הודעות עדיין. תהיה הראשון שיגיד שלום!</p>
                </div>
            `;
            return;
        }

        let lastDate = null;
        let lastSender = null;
        let lastMessageTime = null;
        let messageGroup = null;
        let messageGroupContent = null;

        library_messages.forEach((msg, index) => {
            msg.Created = new Date(msg.Created);
            // Check if we need a new date separator
            const currentDate = formatDate(msg.Created);
            if (currentDate !== lastDate) {
                const dateSeparator = document.createElement('div');
                dateSeparator.className = 'date-separator';
                dateSeparator.innerHTML = `<span class="date-label">${currentDate}</span>`;
                container.appendChild(dateSeparator);
                lastDate = currentDate;

                // Reset grouping when date changes
                lastSender = null;
                lastMessageTime = null;
                messageGroup = null;
                messageGroupContent = null;
            }

            // Check if we need a new message group
            const isSameSender = lastSender === msg.name;
            const isSameType = lastSender && msg.AuthorId === library_messages[index - 1].AuthorId;
            const timeDiff = lastMessageTime ? (msg.Created - lastMessageTime) / 1000 / 60 : null; // minutes

            // Start a new group if:
            // 1. Different sender
            // 2. Different message type (user vs system)
            // 3. More than 5 minutes passed
            // 4. Message contains GIF (GIFs always start new group)
            // 5. First message of the day
            const containsGif = isGifUrl(msg.text);

            if (!isSameSender || !isSameType || (timeDiff && timeDiff > 120) || containsGif || !messageGroup) {
                // Create new message group
                messageGroup = document.createElement('div');
                let groupClass = msg.AuthorId == userId ? 'current-user' : 'other-user';
                if (msg.type === 'system') groupClass += ' system';
                if (msg.verified != 'n') groupClass += ' verified';

                messageGroup.className = `message-group-container ${groupClass}`;
                messageGroup.style.animationDelay = `${index * 0.05}s`;

                // Create avatar (only if not consecutive)
                const avatar = document.createElement('div');
                avatar.style.background = nameToColor(msg.unit);
                avatar.style.borderColor = nameToColor(msg.unit);
                avatar.className = 'message-avatar';
                avatar.textContent = msg.name.charAt(0).toUpperCase();;
                messageGroup.appendChild(avatar);

                // Create message container
                messageGroupContent = document.createElement('div');
                messageGroupContent.className = 'message-group-content';

                // Create message header (only for first message in group)
                const messageHeader = document.createElement('div');
                messageHeader.className = 'message-header';

                const senderName = document.createElement('span');
                senderName.className = 'sender-name';
                senderName.textContent = msg.name;

                const senderGroup = document.createElement('span');
                senderGroup.className = 'sender-group';

                senderGroup.textContent = msg.unit;

                const messageTime = document.createElement('span');
                messageTime.className = 'message-time';
                messageTime.textContent = formatTime(msg.Created);

                messageHeader.appendChild(senderName);

                if (msg.verified != 'n') {
                    if (msg.verified != 'p') {
                        const verifiedBadge = document.createElement('i');
                        verifiedBadge.className = `fas fa-check-circle verified-badge-${msg.verified}`;
                        verifiedBadge.title = 'שחקן מאומת';
                        messageHeader.appendChild(verifiedBadge);
                    }
                    else {
                        const verifiedBadge = document.createElement('i');
                        verifiedBadge.className = `fas fa-hand-fist verified-badge-l`;
                        verifiedBadge.style.opacity = 0.6;
                        verifiedBadge.title = 'שחקן פז"מ';
                        messageHeader.appendChild(verifiedBadge);
                        if (!msg.isCurrentUser && msg.unit && msg.type !== 'system') {
                            messageHeader.appendChild(senderGroup);
                        }
                    }
                }
                else
                    if (!msg.isCurrentUser && msg.unit && msg.type !== 'system') {
                        messageHeader.appendChild(senderGroup);
                    }
                if(!timeDiff || timeDiff > 2 || index == library_messages.length - 1)
                    messageHeader.appendChild(messageTime);

                messageGroupContent.appendChild(messageHeader);
                messageGroup.appendChild(messageGroupContent);
                container.appendChild(messageGroup);

            } else {
                // Consecutive message from same sender
                messageGroup.classList.add('consecutive');
            }

            // Create message bubble
            const messageBubble = document.createElement('div');
            messageBubble.className = 'message-bubble';

            // Check if message contains GIF URL
            if (containsGif) {
                const gifUrl = msg.text;
                const gifHTML = `
                    <div class="chat-gif-container">
                        <img src="${gifUrl}" class="chat-gif" alt="GIF111" oncontextmenu="return false;" draggable="false">
                    </div>
                `;
                messageBubble.innerHTML = gifHTML;
            } else {
                // Regular text message
                messageBubble.textContent = msg.text;
            }

            messageGroupContent.appendChild(messageBubble);

            // Update tracking variables
            lastSender = msg.name;
            lastMessageTime = msg.Created;
        });

        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    };

    if (chatMessagesContainer) loadIntoContainer(chatMessagesContainer);
    if (chatMessagesMobile) loadIntoContainer(chatMessagesMobile);
}



function addNewMessage(message) {
    if (hasBadWords(message)) {
        showSystemNotification("warning", "דבר יפה!");
        return;
    }
    let gifCount = untilNextGif();
    if (gifCount != 0 && isGifUrl(message)) {
        showSystemNotification("warning", `יש לחכות ${gifCount} דקות!`);
        return;
    }
    if (!untilNextMessage()) {
        showSystemNotification("warning", `לא ניתן לשלוח מעל 10 הודעות בדקה!`);
        return;
    }
    const now = new Date();
    const newMessage = {
        name: user_details["username"],
        unit: user_details["unit"],
        text: message,
        verified: (PREMISSIONS[userEmail] === "משתמש DJET") ? 'n' : 'm',
        Created: now,
        AuthorId: userId,
    };

    library_messages.push(newMessage);
    loadChatMessages();
    saveMessageOnSP(message);


    return newMessage;
}

function untilNextGif(min = 15) {
    for (const msg of library_messages) {
        if (msg.AuthorId == userId && isGifUrl(msg.text)) {
            msg.Created = new Date(msg.Created);
            const now = new Date();
            const timeDiff = (now - msg.Created) / 1000 / 60; // minutes
            if (timeDiff < min)
                return min - Math.floor(timeDiff);
        }
    }
    return 0
}
function untilNextMessage(max = 10, min = 1) {
    let count = 0;
    for (const msg of library_messages) {
        if (msg.AuthorId == userId) {
            msg.Created = new Date(msg.Created);
            const now = new Date();
            const timeDiff = (now - msg.Created) / 1000 / 60; // minutes
            if (timeDiff < min)
                count++;
        }
    }
    if (count >= max)
        return false;
    return true;
}

async function load_new_messages() {
    let Id = (library_messages.length > 0) ? library_messages[library_messages.length - 1].Id : 0;
    library_messages = await loadItemsFromSP("Messages", { select: "ID,AuthorId,name,text,verified,Created,unit", top: 100, orderBy: "Created desc" });
    library_messages.reverse();
    if (library_messages.length > 1 && Id != library_messages[library_messages.length - 1].Id) {
        loadChatMessages();
        if (unreadMessages < 5 && library_messages[library_messages.length - 1].AuthorId != userId)
            showNotification(library_messages[library_messages.length - 1].name, library_messages[library_messages.length - 1].text);
    }
}

async function saveMessageOnSP(message) {
    let pr = PREMISSIONS[userEmail]
    addItemToList("Messages", {
        "name": user_details['username'],
        "unit": user_details['unit'],
        "text": message,
        "verified": (pr === "משתמש DJET") ? (getDaysBetweenDates(user_details.Created, user_details.Modified) > 365 ? 'p' : 'n') : ((pr === "נאמן DJET") ? 'l' : 'm'),
    });
}

