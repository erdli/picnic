// Data Store
const products = [
    {
        id: 1,
        name: "오션 레트로 세트",
        price: 25000,
        desc: "레트로 감성의 체크 돗자리와 라탄 바구니, 감성 가득한 송도 바다 피크닉",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "노을 랜턴 세트",
        price: 28000,
        desc: "해질녘 송도의 로맨틱한 분위기를 완성해 줄 빈티지 랜턴과 와인잔 세트",
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "베이직 우드 세트",
        price: 20000,
        desc: "깔끔한 우드 테이블과 화이트 매트로 구성된 심플 피크닉",
        image: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
];

const addons = [
    { id: 'a1', name: '블루투스 스피커', price: 5000 },
    { id: 'a2', name: '하트 선글라스', price: 2000 },
    { id: 'a3', name: '보드게임 (할리갈리)', price: 3000 }
];

// App State
let appState = {
    selectedDate: '',
    selectedProduct: null,
    selectedAddons: [],
    totalPrice: 0
};

// Router
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`page-${pageId}`).classList.add('active');
    window.scrollTo(0,0);
}

// Format Currency
function formatPrice(price) {
    return price.toLocaleString('ko-KR') + '원';
}

// 1. Home logic
document.getElementById('btn-go-products').addEventListener('click', () => {
    const dateInput = document.getElementById('booking-date').value;
    if (!dateInput) {
        alert('대여 날짜를 선택해주세요!');
        return;
    }
    appState.selectedDate = dateInput;
    renderProducts();
    navigate('products');
});

// Set today's date as default
document.getElementById('booking-date').valueAsDate = new Date();

// 2. Products List logic
function renderProducts() {
    const container = document.getElementById('product-list-container');
    container.innerHTML = '';
    
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openProductDetails(p.id);
        
        card.innerHTML = `
            <div class="product-img" style="background-image: url('${p.image}')"></div>
            <div class="product-info">
                <div class="product-title">${p.name}</div>
                <div class="product-price">${formatPrice(p.price)}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3. Product Details logic
function openProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    appState.selectedProduct = product;
    appState.selectedAddons = [];
    updateTotalPrice();
    
    const container = document.getElementById('product-details-container');
    
    // Build Addons HTML
    const addonsHtml = addons.map(addon => `
        <div class="option-item">
            <div>
                <div style="font-weight:600">${addon.name}</div>
                <div style="color:var(--text-secondary); font-size:0.9rem">+${formatPrice(addon.price)}</div>
            </div>
            <input type="checkbox" onchange="toggleAddon('${addon.id}', this.checked)" style="transform: scale(1.5);">
        </div>
    `).join('');

    container.innerHTML = `
        <div class="details-hero" style="background-image: url('${product.image}')"></div>
        <div class="details-info">
            <h2>${product.name}</h2>
            <p style="color:var(--text-secondary); margin-bottom:20px">${product.desc}</p>
            
            <div class="options-section">
                <h3>추가 옵션</h3>
                ${addonsHtml}
            </div>
        </div>
        
        <div class="bottom-bar">
            <div>
                <div style="font-size:0.85rem; color:var(--text-secondary)">총 결제 금액</div>
                <div class="total-price" id="detail-total-price">${formatPrice(product.price)}</div>
            </div>
            <button onclick="navigate('checkout')" class="btn-primary">예약하기</button>
        </div>
    `;
    
    // Add extra padding to body so bottom bar doesn't overlap content
    container.style.paddingBottom = "100px"; 
    
    navigate('details');
}

function toggleAddon(addonId, isChecked) {
    if (isChecked) {
        appState.selectedAddons.push(addonId);
    } else {
        appState.selectedAddons = appState.selectedAddons.filter(id => id !== addonId);
    }
    updateTotalPrice();
}

function updateTotalPrice() {
    let total = appState.selectedProduct ? appState.selectedProduct.price : 0;
    appState.selectedAddons.forEach(id => {
        const addon = addons.find(a => a.id === id);
        if(addon) total += addon.price;
    });
    appState.totalPrice = total;
    
    const priceEl = document.getElementById('detail-total-price');
    if(priceEl) priceEl.innerText = formatPrice(total);
    
    renderCheckoutSummary();
}

// 4. Checkout logic
function renderCheckoutSummary() {
    if(!appState.selectedProduct) return;
    
    const container = document.getElementById('checkout-summary');
    let addonsText = appState.selectedAddons.length > 0 
        ? `<br><small style="color:var(--text-secondary)">+ 추가 옵션 ${appState.selectedAddons.length}개</small>`
        : '';

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-top:12px;">
            <span>${appState.selectedProduct.name} ${addonsText}</span>
            <span style="font-weight:700; color:var(--ocean-blue)">${formatPrice(appState.totalPrice)}</span>
        </div>
        <hr style="border:0; border-top:1px solid #eee; margin:12px 0;">
        <div style="display:flex; justify-content:space-between; font-weight:700; font-size:1.1rem">
            <span>최종 결제</span>
            <span style="color:var(--ocean-blue)">${formatPrice(appState.totalPrice)}</span>
        </div>
    `;
}

document.getElementById('btn-pay').addEventListener('click', () => {
    const name = document.getElementById('user-name').value;
    const phone = document.getElementById('user-phone').value;
    
    if(!name || !phone) {
        alert('예약자 정보를 모두 입력해주세요!');
        return;
    }
    
    // Generate mock booking ID
    const bookingId = 'SGP-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('booking-id').innerText = bookingId;
    
    navigate('success');
});
