let medicineData = [];

// ၁။ ဒေတာစတင်ယူဆောင်ခြင်း
async function init() {
    try {
        const response = await fetch('data.json');
        medicineData = await response.json();
        console.log("Data loaded successfully");
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
        item.word.toLowerCase().includes(query)
    );

    filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = "result-item";
        div.innerHTML = `<strong>${item.word}</strong><p>${item.definition.substring(0, 60)}...</p>`;
        div.onclick = () => openDetail(item);
        resultsDiv.appendChild(div);
    });
}

// ၃။ အသေးစိတ်ပြသခြင်းနှင့် Recent သိမ်းခြင်း
function openDetail(item) {
    // Modal ပြခြင်း
    document.getElementById('modalTitle').innerText = item.word;
    document.getElementById('modalBody').innerText = item.definition;
    document.getElementById('detailModal').style.display = "block";

    // Recent ထဲထည့်ခြင်း
    let recent = JSON.parse(localStorage.getItem('recent_medicine')) || [];
    recent = recent.filter(r => r.word !== item.word); // ပုံစံတူဖယ်
    recent.unshift(item); // အသစ်ကို ထိပ်ဆုံးပို့
    localStorage.setItem('recent_medicine', JSON.stringify(recent.slice(0, 20))); // ၂၀ ခုပဲသိမ်း
}

// ၄။ Modal ပိတ်ခြင်း
function closeModal() {
    document.getElementById('detailModal').style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById('detailModal')) closeModal();
}

// ၅။ Page Switching
function showPage(pageId, title) {
    // Pages ဖျောက်/ပြ
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    
    // Title ပြောင်း
    document.getElementById('pageTitle').innerText = title;

    // Nav Active Style
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.getElementById('nav-' + pageId).classList.add('active');

    if (pageId === 'recent') loadRecent();
}

// ၆။ Recent List ကိုပြခြင်း
function loadRecent() {
    const listDiv = document.getElementById('recentList');
    const recent = JSON.parse(localStorage.getItem('recent_medicine')) || [];
    
    if (recent.length === 0) {
        listDiv.innerHTML = "<p style='text-align:center; padding:50px; color:#999;'>ရှာဖွေမှုမှတ်တမ်း မရှိသေးပါ။</p>";
        return;
    }

    listDiv.innerHTML = "";
    recent.forEach(item => {
        const div = document.createElement('div');
        div.className = "result-item";
        div.innerHTML = `<strong>${item.word}</strong>`;
        div.onclick = () => openDetail(item);
        listDiv.appendChild(div);
    });
}

// စတင်ပွင့်လာချိန်မှာ run ရန်
init();
