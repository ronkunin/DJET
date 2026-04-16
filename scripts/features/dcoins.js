// ==============================================
// DCOINS TRANSFER FUNCTIONS
// ==============================================   

function searchUsers(query) {
    if (!query.trim()) {
        return library_users.filter(user =>
            user.username !== user_details.username
        );
    }

    return library_users.filter(user =>
        user.username.toLowerCase().includes(query.toLowerCase()) &&
        user.username !== user_details.username
    );
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = `
                    <div class="search-result-item" style="justify-content: center; color: #8888cc;">
                        לא נמצאו משתמשים
                    </div>
                `;
    } else {
        results.forEach(user => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                        <div class="result-avatar profile-icon-${user.profileColor}">
                            ${user.username.charAt(0).toUpperCase()}
                        </div>
                        <div class="result-info">
                            <span class="result-name">${user.username}</span>
                            <span class="result-group">${user.unit}</span>
                        </div>
                    `;

            resultItem.addEventListener('click', () => {
                document.getElementById('transfer-to').value = user.username;
                document.getElementById('transfer-to').dataset.value1 = user.Id;
                hideSearchResults();
            });

            resultsContainer.appendChild(resultItem);
        });
    }

    resultsContainer.classList.add('active');
}

function hideSearchResults() {
    document.getElementById('search-results').classList.remove('active');
}

function performTransfer() {
    const recipientName = document.getElementById('transfer-to').dataset.value1;
    const reason = document.getElementById('transfer-reason').value.trim();
    const amount = parseInt(document.getElementById('transfer-amount').value);

    // Validation
    if (!recipientName) {
        showSystemNotification('error', 'נא לבחור משתמש להעברה');
        return;
    }

    if (recipientName === user_details.Id) {
        showSystemNotification('error', 'לא ניתן להעביר לעצמך');
        return;
    }

    if (!amount || amount < 1) {
        showSystemNotification('error', 'נא להזין סכום תקין');
        return;
    }

    if (amount > user_details.dcoins) {
        showSystemNotification('error', 'אין לך מספיק DCoins להעברה');
        return;
    }
    if (reason && hasBadWords(reason)) {
        showSystemNotification("warning", "תכתוב יפה!");
        return;
    }

    const recipient = library_users.find(user => user.Id == recipientName);
    if (!recipient) {
        showSystemNotification('error', 'משתמש לא נמצא');
        return;
    }

    // Perform transfer
    user_details.dcoins -= amount;
    saveTransactionOnSP("transaction", user_details["Id"], user_details["username"], recipient["Id"], recipient["username"], amount, reason || 'ללא סיבה');
    updateSPValueInList("Users", "dcoins", user_details["Id"], user_details["dcoins"], true);
    //  transferHistory.unshift(transferRecord);
    // Update display
    animateMoneyChange(-amount);

    // Close modal
    closeTransferModal();
}


function animateMoneyChange(amount) {
    const dcoinsCounter = document.getElementById('dcoins-counter');
    if (!dcoinsCounter) return; // Element not found, skip animation
    const dcoinsAmount = document.getElementById('dcoins-amount');
    if (!dcoinsAmount) return;
    const isNegative = amount < 0;
    const className = isNegative ? 'negative-pulse' : 'pulse-animation';
    const color = isNegative ? '#ff4757' : '#00ff88';

    dcoinsCounter.classList.add(className);
    dcoinsAmount.style.cssText = `color: ${color}; transform: scale(1.3);`;

    createCoinAnimation(amount, color);

    setTimeout(() => {
        dcoinsCounter.classList.remove(className);
        dcoinsAmount.style.cssText = '';
        dcoinsAmount.textContent = user_details["dcoins"];
    }, 600);
}

function createCoinAnimation(amount, color) {
    const coin = document.createElement('div');
    coin.className = 'coin-animation';
    coin.textContent = `${amount > 0 ? '+' : ''}${amount}`;
    coin.style.cssText = `color: ${color}; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`;

    document.getElementById('dcoins-counter').appendChild(coin);
    setTimeout(() => coin.remove(), 1500);
}

function updateTransferHistory() {
    const historyList = document.getElementById('transfer-history-list');
    if (!historyList) return;

    const recentTransfers = library_transactions.slice(0, 5);

    if (recentTransfers.length === 0) {
        historyList.innerHTML = `
            <div style="padding: 10px; text-align: center; color: #8888cc; font-size: 0.9rem;">
                אין העברות עדיין
            </div>
        `;
        return;
    }

    historyList.innerHTML = recentTransfers.map(transfer => `
        <div class="transfer-item">
            <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; direction: ltr;">
                    <span class="transfer-amount" style="color: ${(transfer.reciver_id == user_details.Id && transfer.amount > 0) ? "var(--dcoin-color)" : "#ff4757"}">${transfer.amount} DCoins</span>
                    <span style="color: #8888cc;">⬅</span>
                    <span class="transfer-recipient">${(transfer.reciver_id == user_details.Id) ? transfer.sender_name : transfer.reciver_name}</span>
                </div>
                <div class="transfer-reason">${transfer.reason}</div>
            </div>
            <div class="transfer-time">
                ${formatTimeAgo(transfer.Created)}
            </div>
        </div>
    `).join('');
}



function saveTransactionOnSP(Title, sender_id, sender_name, reciver_id, reciver_name, amount, reason) {
    addItemToList("Transactions", {
        "Title": Title,
        "sender_id": sender_id,
        "sender_name": sender_name,
        "reciver_id": reciver_id,
        "reciver_name": reciver_name,
        "amount": amount,
        "reason": reason,
        "status": "Waiting",
    });
}

async function load_new_transactions() {
    if (!Array.isArray(library_transactions)) {
        library_transactions = [];
    }
    if (!user_details || !user_details['Id']) {
        return;
    }

    const existingTransaction = library_transactions.find(tx => tx && (tx.Id != null || tx.ID != null));
    const Id = existingTransaction ? (existingTransaction.Id ?? existingTransaction.ID) : 0;

    const loadedTransactions = await loadItemsFromSP("Transactions", {
        select: "ID,Title,sender_id,sender_name,reciver_id,reciver_name,Created,amount,reason,status",
        top: 20,
        orderBy: "Created desc",
        filter: `reciver_id eq ${user_details['Id']} or sender_id eq ${user_details['Id']}`
    });

    library_transactions = Array.isArray(loadedTransactions)
        ? loadedTransactions.filter(tx => tx && (tx.Id != null || tx.ID != null))
        : [];

    if (library_transactions.length > 0 && (Id === 0 || Id != (library_transactions[0].Id ?? library_transactions[0].ID))) {
        await scanTransactions();
        updateTransferHistory();
    }
}

async function scanTransactions() {
    if (!Array.isArray(library_transactions) || !user_details) {
        return;
    }

    let old_amount = user_details["dcoins"];
    for (const transaction of library_transactions) {
        if (!transaction || transaction.status !== "Waiting") {
            continue;
        }

        const transactionId = transaction.Id ?? transaction.ID;
        if (!transactionId) {
            continue;
        }

        if (user_details["Id"] == transaction.reciver_id) {
            user_details["dcoins"] += transaction.amount;
            await updateSPValueInList("Transactions", "status", transactionId, "Finished", true);
            animateMoneyChange(transaction.amount);
        }
    }

    if (old_amount != user_details["dcoins"]) {
        updateSPValueInList("Users", "dcoins", user_details["Id"], user_details["dcoins"], true);
    }
}
