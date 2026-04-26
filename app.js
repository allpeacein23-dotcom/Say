let medicineData = [];

// ၁။ ဒေတာစတင်ယူဆောင်ခြင်း
async function init() {
    try {
        const response = await fetch('./data.json');
        medicineData = await response.json();
    } catch (err) {
        console.error("Error loading JSON:", err);
    }
}

// ၂။ ရှာဖွေမှုပြုလုပ်ခြင်း
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

// ၃။ အသေးစိတ်ပြသခြင်း
function openDetail(item) {
    document.getElementById('modalTitle').innerText = item.disease;
    let fullText = `【ဆေးနည်း】\n${item.treatment}`;
    if(item.warning) {
        fullText += `\n\n【သတိပြုရန်】\n${item.warning}`;
    }
    document.getElementById('modalBody').innerText = fullText;
    document.getElementById('detailModal').style.display = "block";

    saveToRecent(item);
}

// ၄။ Recent သိမ်းဆည်းခြင်း
function saveToRecent(item) {
    let recent = JSON.parse(localStorage.getItem('recent_medicine')) || [];
    recent = recent.filter(r => r.id !== item.id);
    recent.unshift(item);
    localStorage.setItem('recent_medicine', JSON.stringify(recent.slice(0, 20)));
}

// ၅။ Recent List ပြသခြင်း
function loadRecent() {
    const listDiv = document.getElementById('recentList');
    const clearBtn = document.getElementById('clearBtn');
    const recent = JSON.parse(localStorage.getItem('recent_medicine')) || [];
    
    if (recent.length === 0) {
        listDiv.innerHTML = "<p style='text-align:center; padding:50px; color:#999;'>ရှာဖွေမှုမှတ်တမ်း မရှိသေးပါ။</p>";
        if(clearBtn) clearBtn.style.display = "none";
        return;
    }

    if(clearBtn) clearBtn.style.display = "block";
    listDiv.innerHTML = "";
    recent.forEach(item => {
        const div = document.createElement('div');
        div.className = "result-item";
        div.innerHTML = `<strong>${item.disease}</strong><p>${item.treatment.substring(0, 50)}...</p>`;
        div.onclick = () => openDetail(item);
        listDiv.appendChild(div);
    });
}

function removeFromRecent(i) {
    let recent = JSON.parse(localStorage.getItem('recent_medicine')) || [];
    recent.splice(i, 1);
    localStorage.setItem('recent_medicine', JSON.stringify(recent));
    updateRecentUI();
}
    localStorage.setItem('recent_medicine', JSON.stringify(recentItems));

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
    document.getElementById('nav-' + pageId).classList.add('active');

    if (pageId === 'recent') loadRecent();
}

init();

