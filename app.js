
let medicineData = [];

// 1. Load Data
async function init() {
    try {
        const response = await fetch('./data.json');
        medicineData = await response.json();
        updateRecentUI();
    } catch (err) {
        console.error("Error loading JSON:", err);
    }
}

// 2. Search Function
function searchData() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";

    if (query === "") return;

    const filtered = medicineData.filter(item => 
        item.disease && item.disease.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        resultsDiv.innerHTML = "<p style='padding:20px; color:#999; text-align:center;'>ရှာမတွေ့ပါ</p>";
        return;
    }

    filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = "result-item";
        const brief = item.treatment ? item.treatment.substring(0, 60) + "..." : "";
        div.innerHTML = `<strong>${item.disease}</strong><p>${brief}</p>`;
        div.onclick = () => openDetail(item);
        resultsDiv.appendChild(div);
    });
}

// 3. Open Detail Modal
function openDetail(item) {
    document.getElementById('modalTitle').innerText = item.disease;
    let fullText = `【ဆေးနည်း】\n${item.treatment}\n\n【သတိပြုရန်】\n${item.warning || 'မရှိပါ'}`;
    document.getElementById('modalBody').innerText = fullText;
    document.getElementById('detailModal').style.display = "block";

    // Add to recent
    addToRecent(item);
}

// 4. Recent History Logic
function addToRecent(item) {
    let recent = JSON.parse(localStorage.getItem('recent_medicine')) || [];
    // Remove if already exists to avoid duplicates
    recent = recent.filter(r => r.disease !== item.disease);
    recent.unshift(item); // Add to top
    if (recent.length > 20) recent.pop(); // Limit to 20
    localStorage.setItem('recent_medicine', JSON.stringify(recent));
    updateRecentUI();
}

function updateRecentUI() {
    const listDiv = document.getElementById('recentList');
    const clearBtn = document.getElementById('clearBtn'); // HTML has id="clearBtn"
    let recent = JSON.parse(localStorage.getItem('recent_medicine')) || [];
    
    if (!listDiv) return;

    if (recent.length === 0) {
        listDiv.innerHTML = "<p style='text-align:center; padding:50px; color:#999;'>ရှာဖွေမှုမှတ်တမ်း မရှိသေးပါ။</p>";
        if(clearBtn) clearBtn.style.display = "none";
        return;
    }

    if(clearBtn) clearBtn.style.display = "block";
    listDiv.innerHTML = "";
    
    recent.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = "result-item";
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                <div onclick='openDetailFromRecent(${i})' style="flex:1; cursor:pointer;">
                    <strong>${item.disease}</strong>
                    <p style="margin:5px 0 0 0; font-size:0.9em; color:#666;">${item.treatment.substring(0, 50)}...</p>
                </div>
                <span onclick="removeFromRecent(${i}); event.stopPropagation();" 
                      style="color:#ff4d4d; cursor:pointer; padding:10px; font-weight:bold; font-size:20px;">✕</span>
            </div>
        `;
        listDiv.appendChild(div);
    });
}

function openDetailFromRecent(i) {
    let recent = JSON.parse(localStorage.getItem('recent_medicine')) || [];
    if(recent[i]) {
        document.getElementById('modalTitle').innerText = recent[i].disease;
        let fullText = `【ဆေးနည်း】\n${recent[i].treatment}\n\n【သတိပြုရန်】\n${recent[i].warning || 'မရှိပါ'}`;
        document.getElementById('modalBody').innerText = fullText;
        document.getElementById('detailModal').style.display = "block";
    }
}

function removeFromRecent(i) {
    let recent = JSON.parse(localStorage.getItem('recent_medicine')) || [];
    recent.splice(i, 1);
    localStorage.setItem('recent_medicine', JSON.stringify(recent));
    updateRecentUI();
}

function clearRecent() {
    if(confirm("မှတ်တမ်းအားလုံးကို ဖျက်မှာ သေချာပါသလား?")) {
        localStorage.removeItem('recent_medicine');
        updateRecentUI();
    }
}

// 5. Navigation & UI
function closeModal() {
    document.getElementById('detailModal').style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById('detailModal')) closeModal();
}

function showPage(pageId, title) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    document.getElementById('pageTitle').innerText = title;

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if (pageId === 'home') document.getElementById('nav-home').classList.add('active');
    if (pageId === 'recent') {
        document.getElementById('nav-recent').classList.add('active');
        updateRecentUI();
    }
    if (pageId === 'about') document.getElementById('nav-about').classList.add('active');
}

// Start
init();
