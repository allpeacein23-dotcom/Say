let medicineData = [];

// ၁။ ဒေတာစတင်ယူဆောင်ခြင်း
async function init() {
    try {
        const response = await fetch('./data.json');
        medicineData = await response.json();
        console.log("Data loaded successfully:", medicineData.length);
    } catch (err) {
        console.error("Error loading JSON:", err);
    }
}

// ၂။ ရှာဖွေမှုပြုလုပ်ခြင်း (Key နာမည်များကို disease နှင့် treatment သို့ ပြောင်းထားသည်)
function searchData() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";

    if (query === "") return;

    // မင်းရဲ့ JSON structure အရ 'disease' ကို ရှာခိုင်းထားပါတယ်
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
        // disease ကို ခေါင်းစဉ်တပ်ပြီး treatment ကို အကျဉ်းပြမယ်
        const brief = item.treatment ? item.treatment.substring(0, 60) + "..." : "";
        div.innerHTML = `<strong>${item.disease}</strong><p>${brief}</p>`;
        div.onclick = () => openDetail(item);
        resultsDiv.appendChild(div);
    });
}

// ၃။ အသေးစိတ်ပြသခြင်း (Modal ထဲတွင် ပေါ်မည့်စာသားများ)
function openDetail(item) {
    document.getElementById('modalTitle').innerText = item.disease;
    
    // Treatment နဲ့ Warning ကို ပေါင်းပြပေးပါမယ်
    let fullText = `【ဆေးနည်း】\n${item.treatment}`;
    if(item.warning) {
        fullText += `\n\n【သတိပြုရန်】\n${item.warning}`;
    }
    
    document.getElementById('modalBody').innerText = fullText;
    document.getElementById('detailModal').style.display = "block";

    // Recent ထဲထည့်ခြင်း
    saveToRecent(item);
}

// ၄။ Recent သိမ်းဆည်းခြင်း
function saveToRecent(item) {
    let recent = JSON.parse(localStorage.getItem('recent_medicine')) || [];
    recent = recent.filter(r => r.id !== item.id); // ID နဲ့ စစ်ပြီး ပုံစံတူဖယ်
    recent.unshift(item);
    localStorage.setItem('recent_medicine', JSON.stringify(recent.slice(0, 20)));
}

// ၅။ Recent List ကို ပြန်ပြခြင်း (Recent Tab နှိပ်သည့်အခါ)
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
        div.innerHTML = `<strong>${item.disease}</strong>`;
        div.onclick = () => openDetail(item);
        listDiv.appendChild(div);
    });
}

// အခြား modal ပိတ်ခြင်းနှင့် page switching logic များက အရင်အတိုင်းပဲ ထားနိုင်ပါတယ်
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
