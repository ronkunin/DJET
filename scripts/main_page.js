// ==============================================
// SIDEBAR FUNCTIONS
// ==============================================
function switchTab(tabId) {
    // Update tabs
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.sidebar-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${tabId}-section`).classList.add('active');

    // If switching to chat, mark messages as read
    if (tabId === 'chat') {
        chatOpen = true;
        unreadMessages = 0;
        updateUnreadIndicator();
        lastReadTime = new Date();
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
    } else {
        chatOpen = false;
    }
    if (tabId === "activity") {
        loadActivities();
    }
}

function updateUnreadIndicator() {
    const chatTabElement = document.querySelector('[data-tab="chat"]');
    if (unreadMessages > 0) {
        chatTabElement.classList.add('has-unread');
    } else {
        chatTabElement.classList.remove('has-unread');
    }
}
