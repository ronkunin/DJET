// ==============================================
// ENHANCED NOTIFICATION FUNCTIONS WITH SYSTEM NOTIFICATIONS
// ==============================================
function showSystemNotification(type, title, message = "") {
    const notificationContainer = document.getElementById('notification-container');

    // Remove old notifications if there are too many
    const notifications = notificationContainer.querySelectorAll('.regular-notification, .gif-notification, .system-notification');
    if (notifications.length >= 3) {
        notifications[0].classList.add('hiding');
        setTimeout(() => {
            notifications[0].remove();
        }, 1000);
    }

    const notification = document.createElement('div');
    notification.className = `system-notification ${type}`;
    notification.dataset.id = `notification-${Date.now()}`;

    // Choose icon based on type
    let iconClass = 'fas fa-info-circle';
    if (type === 'success') iconClass = 'fas fa-check-circle';
    if (type === 'error') iconClass = 'fas fa-times-circle';
    if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';
    if (type === 'info') iconClass = 'fas fa-info-circle';


    notification.innerHTML = `
                <i class="${iconClass}" style="font-size: 1.5rem;"></i>
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 0.95rem;">${title}</div>
                    <div style="font-size: 0.85rem; opacity: 0.9;">${message}</div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                    <button class="notification-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

    notificationContainer.appendChild(notification);

    // Add close button event
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.onclick = function (e) {
        e.stopPropagation();
        removeNotification(notification.dataset.id);
    };

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification.dataset.id);
    }, 5000);
}

function showNotification(sender, message) {
    const notificationContainer = document.getElementById('notification-container');

    // Remove old notifications if there are too many
    const notifications = notificationContainer.querySelectorAll('.regular-notification, .gif-notification, .system-notification');
    if (notifications.length >= 3) {
        notifications[0].classList.add('hiding');
        setTimeout(() => {
            notifications[0].remove();
        }, 1000);
    }

    if (isGifUrl(message)) {
        // Create GIF notification
        const gifUrl = message;
        const notification = document.createElement('div');
        notification.className = 'gif-notification';
        notification.dataset.id = `notification-${Date.now()}`;

        notification.innerHTML = `
                    <div class="gif-notification-header">
                        <div class="gif-notification-sender">
                            <div class="avatar">${sender.charAt(0).toUpperCase()}</div>
                            <span>${sender}</span>
                        </div>
                        <button class="notification-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="gif-notification-body">
                        <div class="gif-notification-preview">
                            <img src="${gifUrl}" alt="GIF" oncontextmenu="return false;" draggable="false">
                        </div>
                    </div>
                `;

        notificationContainer.appendChild(notification);

        // Add click event
        notification.onclick = function () {
            switchTab('chat');
            removeNotification(notification.dataset.id);
            setTimeout(() => {
                const chatMessagesContainer = document.getElementById('chat-messages') || document.getElementById('chat-messages-mobile');
                if (chatMessagesContainer) {
                    chatMessagesContainer.scrollTo({
                        top: chatMessagesContainer.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        };

        // Add close button event
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.onclick = function (e) {
            e.stopPropagation();
            removeNotification(notification.dataset.id);
        };

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(notification.dataset.id);
        }, 5000);

    } else {
        // Create regular notification
        const notification = document.createElement('div');
        notification.className = 'regular-notification';
        notification.dataset.id = `notification-${Date.now()}`;


        // Clean message from HTML tags and extract text
        const cleanMessage = message.replace(/<[^>]*>/g, '').substring(0, 15);

        notification.innerHTML = `
                    <div class="avatar">${sender.charAt(0).toUpperCase()}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; font-size: 0.95rem;">${sender}</div>
                        <div style="font-size: 0.85rem; opacity: 0.9;">${cleanMessage}${cleanMessage.length >= 15 ? '...' : ''}</div>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                        <button class="notification-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;

        notificationContainer.appendChild(notification);

        // Add click event
        notification.onclick = function () {
            switchTab('chat');
            removeNotification(notification.dataset.id);
            setTimeout(() => {
                const chatMessagesContainer = document.getElementById('chat-messages') || document.getElementById('chat-messages-mobile');
                if (chatMessagesContainer) {
                    chatMessagesContainer.scrollTo({
                        top: chatMessagesContainer.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        };

        // Add close button event
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.onclick = function (e) {
            e.stopPropagation();
            removeNotification(notification.dataset.id);
        };

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(notification.dataset.id);
        }, 5000);
    }

    if (!chatOpen) {
        unreadMessages++;
        updateUnreadIndicator();
    }
}

function removeNotification(id) {
    const notification = document.querySelector(`[data-id="${id}"]`);
    if (notification) {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }
}