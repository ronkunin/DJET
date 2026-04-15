// ==============================================
//  ACTIVITY FUNCTIONS
// ==============================================
// mapping of types -> icons and colors (colors match CSS theme)
const typeIcons = {
    "streak": "fas fa-fire",
    "level_up": "fas fa-trophy",
    "group_join": "fas fa-users",
    "online": "fas fa-door-open",
    "new_account": "fas fa-user-plus",
    "counter": "fas fa-clock",
    "medal": "fas fa-medal",
    "crown": "fas fa-crown",
};

const typeColors = {
    "streak": "#ffa300",      // gold
    "level_up": "#b86bff",    // purple (primary)
    "group_join": "#00b894",  // green
    "online": "#00b894",  // green
    "new_account": "#00d4ff",  // cyan
    "counter": "#ffd700", // yellow
    "medal": "#ffb328",
    "crown": "#ff6b6b",
};

function loadActivities() {
    const activityList = document.getElementById('activity-list');
    const activityListMobile = document.getElementById('activity-list-mobile');
    
    // Function to load into a list
    const loadIntoList = (list) => {
        list.innerHTML = '';

        if (library_activity.length === 0) {
            list.innerHTML = `
                <div style="padding: 30px 15px; text-align: center; color: #8888cc;">
                <i class="fas fa-bolt" style="font-size: 1.5rem; opacity: 0.5; margin-bottom: 10px;"></i>
                <p style="font-size: 0.9rem;">אין פעילות אחרונה עדיין</p>
                </div>
            `;
            return;
        }

        for (let i = 0, len = Math.min(35, library_activity.length); i < len && (i < library_activity.length); i++) {
            const activity = library_activity[i];
            const index = i;
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.style.animationDelay = `${index * 0.1}s`;
            const icon = typeIcons[activity.type] || 'fas fa-bolt';
            const color = typeColors[activity.type] || '#8888cc';

            const timeAgo = activity.Created ? formatTimeAgo(new Date(activity.Created)) : "כרגע";

            activityItem.innerHTML = `
                <div class="activity-icon" style="color: ${color};">
                <i class="${icon}"></i>
                </div>
                <div class="activity-content">
                <div class="activity-text">
                    <span class="activity-user" style="color: ${color}; font-weight:600;">${activity.name}</span> 
                    <span class="activity-group"> מ${activity.unit}</span>
                    <span class="activity-message"> ${activity.message}</span>
                </div>
                <div class="activity-time">${timeAgo}</div>
                </div>
            `;
            if(activity.type != "online" || new Date() - new Date(activity.Created) <= 5 * 60 * 1000)
                list.appendChild(activityItem);
            else
                len++;
        }
        // Scroll to top
        list.scrollTop = 0;
    };

    if (activityList) loadIntoList(activityList);
    if (activityListMobile) loadIntoList(activityListMobile);
}

async function load_new_activity() {
    if (!user_details) return;
    
    let Id = (library_activity.length > 0) ? library_activity[0].Id : 0;
    library_activity = await loadItemsFromSP("Activity", { select: "ID,name,unit,Created,type,message", top: 30, orderBy: "Created desc" });
    if (library_activity.length > 1 && Id != library_activity[0].Id) {
        loadActivities();
        if (library_activity[0].name == user_details['username'] && library_activity[0].type != "online") {
            switchTab("activity");
        }
    }
}

function saveActivityOnSP(message, type) {
    //if(!user_details['username']) return;
    addItemToList("Activity", {
        "name": user_details['username']? user_details['username']:"חייל",
        "unit": user_details['unit']? user_details['unit']:"בסיס",
        "message": message,
        "type": type,
    });
}

