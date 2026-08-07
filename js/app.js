// मनोज मोबाल्स - Manoj Mobiles Frontend Application Logic

// --- APPLICATION STATE ---
const AppState = {
  activeView: 'home',
  selectedProductId: 'm1',
  filters: {
    search: '',
    category: 'All',
    brand: 'All',
    maxPrice: 200000,
    ram: 'All',
    sort: 'popularity'
  },
  cart: JSON.parse(localStorage.getItem('mm_cart')) || [
    { productId: 'm1', qty: 1, color: 'Natural Titanium', storage: '256GB' },
    { productId: 'ap2', qty: 1, color: 'White', storage: 'Standard' }
  ],
  wishlist: JSON.parse(localStorage.getItem('mm_wishlist')) || ['m2', 'w1'],
  user: JSON.parse(localStorage.getItem('mm_user')) || {
    loggedIn: false,
    name: 'Anubhab Sharma',
    email: 'anubhab@manojmobiles.com',
    phone: '+91 98765 43210'
  },
  aiWizard: {
    step: 1,
    budget: 80000,
    useCase: 'Camera',
    brand: 'All',
    storage: '256GB'
  },
  appliedCoupon: null,
  activeVideoUrl: null
};

// Save to LocalStorage
function saveState() {
  localStorage.setItem('mm_cart', JSON.stringify(AppState.cart));
  localStorage.setItem('mm_wishlist', JSON.stringify(AppState.wishlist));
  localStorage.setItem('mm_user', JSON.stringify(AppState.user));
}

// --- HELPER FUNCTIONS ---
function formatINR(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

function showToast(message, icon = 'check-circle') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- ROUTING & VIEW NAVIGATION ---
function navigateTo(view, params = {}) {
  AppState.activeView = view;
  if (params.productId) AppState.selectedProductId = params.productId;
  if (params.category) AppState.filters.category = params.category;
  if (params.brand) AppState.filters.brand = params.brand;
  if (params.search) AppState.filters.search = params.search;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

// --- CART & WISHLIST ACTIONS ---
function addToCart(productId, qty = 1, color = null, storage = null) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const selectedColor = color || (product.colors ? product.colors[0] : 'Standard');
  const selectedStorage = storage || (product.storageOptions ? product.storageOptions[0] : 'Standard');

  const existingIndex = AppState.cart.findIndex(
    item => item.productId === productId && item.color === selectedColor && item.storage === selectedStorage
  );

  if (existingIndex > -1) {
    AppState.cart[existingIndex].qty += qty;
  } else {
    AppState.cart.push({ productId, qty, color: selectedColor, storage: selectedStorage });
  }

  saveState();
  updateCounters();
  showToast(`Added ${product.name} to Cart! 🛒`);
}

function updateCartQty(index, delta) {
  if (AppState.cart[index]) {
    AppState.cart[index].qty += delta;
    if (AppState.cart[index].qty <= 0) {
      AppState.cart.splice(index, 1);
    }
    saveState();
    updateCounters();
    renderApp();
  }
}

function removeFromCart(index) {
  AppState.cart.splice(index, 1);
  saveState();
  updateCounters();
  renderApp();
  showToast('Item removed from cart');
}

function toggleWishlist(productId) {
  const index = AppState.wishlist.indexOf(productId);
  const product = PRODUCTS_DATA.find(p => p.id === productId);

  if (index > -1) {
    AppState.wishlist.splice(index, 1);
    showToast(`Removed from Wishlist`);
  } else {
    AppState.wishlist.push(productId);
    showToast(`Saved ${product.name} to Wishlist! ❤️`);
  }

  saveState();
  updateCounters();
  renderApp();
}

function updateCounters() {
  const cartBadge = document.getElementById('cart-badge');
  const wishlistBadge = document.getElementById('wishlist-badge');

  const totalCartCount = AppState.cart.reduce((sum, item) => sum + item.qty, 0);

  if (cartBadge) cartBadge.innerText = totalCartCount;
  if (wishlistBadge) wishlistBadge.innerText = AppState.wishlist.length;
}

// --- RENDER APP ENGINE ---
function renderApp() {
  updateCounters();
  const mainContent = document.getElementById('app-content');
  if (!mainContent) return;

  switch (AppState.activeView) {
    case 'home':
      mainContent.innerHTML = renderHomeView();
      initHeroCarousel();
      initCountdownTimer();
      break;
    case 'products':
      mainContent.innerHTML = renderProductsView();
      break;
    case 'product-detail':
      mainContent.innerHTML = renderProductDetailView();
      break;
    case 'cart':
      mainContent.innerHTML = renderCartView();
      break;
    case 'wishlist':
      mainContent.innerHTML = renderWishlistView();
      break;
    case 'checkout':
      mainContent.innerHTML = renderCheckoutView();
      break;
    case 'order-confirmation':
      mainContent.innerHTML = renderOrderConfirmationView();
      break;
    case 'track-order':
      mainContent.innerHTML = renderTrackOrderView();
      break;
    case 'store-locator':
      mainContent.innerHTML = renderStoreLocatorView();
      break;
    case 'account':
      mainContent.innerHTML = renderAccountView();
      break;
    default:
      mainContent.innerHTML = renderHomeView();
  }

  lucide.createIcons();
}

// --- PRODUCT CARD COMPONENT RENDERER ---
function renderProductCard(p) {
  const isWishlisted = AppState.wishlist.includes(p.id);

  return `
    <div class="product-card">
      <div class="card-image-wrapper">
        ${p.badge ? `<span class="badge badge-solid card-badge-top">${p.badge}</span>` : ''}
        <button class="wishlist-btn-overlay ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${p.id}')">
          <i data-lucide="heart" ${isWishlisted ? 'fill="#EF4444"' : ''}></i>
        </button>
        <img src="${p.image}" alt="${p.name}" class="card-img" onclick="navigateTo('product-detail', {productId: '${p.id}'})">
      </div>
      <div class="card-body">
        <span class="card-brand">${p.brand}</span>
        <h3 class="card-title" onclick="navigateTo('product-detail', {productId: '${p.id}'})">${p.name}</h3>
        <div class="card-rating-row">
          <div class="rating-stars">
            ${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}
          </div>
          <span class="rating-text">${p.rating} (${p.reviewsCount})</span>
        </div>
        <div class="card-price-row">
          <span class="price-current">${formatINR(p.price)}</span>
          <span class="price-original">${formatINR(p.originalPrice)}</span>
          <span class="price-discount-tag">${p.discount}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary btn-sm" onclick="addToCart('${p.id}')">
            <i data-lucide="shopping-bag"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

// --- VIEW 1: HOMEPAGE ---
function renderHomeView() {
  const dailyDeals = PRODUCTS_DATA.filter(p => p.isDeal).slice(0, 8);
  const trendingProducts = PRODUCTS_DATA.filter(p => p.isTrending).slice(0, 6);
  const appleProducts = PRODUCTS_DATA.filter(p => p.isAppleSpotlight);
  const picks = PRODUCTS_DATA.slice(0, 2);

  return `
    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-grid">
          <!-- Main Banner Carousel -->
          <div class="hero-carousel" id="hero-carousel">
            <div class="carousel-slide active">
              <img src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop&q=80" class="slide-bg-img" alt="iPhone 15 Pro">
              <div class="slide-content">
                <span class="slide-tag">NEW LAUNCH EXCLUSIVE</span>
                <h1 class="slide-title">iPhone 15 Pro Max Titanium</h1>
                <p class="slide-subtitle">Get Flat ₹10,000 Instant Cashback on HDFC Bank Cards + No Cost EMI up to 24 Months.</p>
                <button class="btn btn-primary btn-lg" onclick="navigateTo('product-detail', {productId: 'm1'})">
                  Shop Now <i data-lucide="arrow-right"></i>
                </button>
              </div>
            </div>

            <div class="carousel-slide">
              <img src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&auto=format&fit=crop&q=80" class="slide-bg-img" alt="Galaxy S24 Ultra">
              <div class="slide-content">
                <span class="slide-tag">GALAXY AI IS HERE</span>
                <h1 class="slide-title">Samsung S24 Ultra 5G</h1>
                <p class="slide-subtitle">Unleash whole new levels of mobile creativity. Exchange bonus up to ₹12,000!</p>
                <button class="btn btn-primary btn-lg" onclick="navigateTo('product-detail', {productId: 'm2'})">
                  Explore Galaxy AI <i data-lucide="arrow-right"></i>
                </button>
              </div>
            </div>

            <div class="carousel-slide">
              <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&auto=format&fit=crop&q=80" class="slide-bg-img" alt="Sound Festival">
              <div class="slide-content">
                <span class="slide-tag">MONSOON GADGET FEST</span>
                <h1 class="slide-title">Up to 70% OFF Audio & Wearables</h1>
                <p class="slide-subtitle">Sony, boAt, Apple AirPods & Smartwatches at guaranteed lowest prices.</p>
                <button class="btn btn-primary btn-lg" onclick="navigateTo('products', {category: 'Audio'})">
                  View Deals <i data-lucide="arrow-right"></i>
                </button>
              </div>
            </div>

            <div class="carousel-dots">
              <span class="dot active" onclick="setSlide(0)"></span>
              <span class="dot" onclick="setSlide(1)"></span>
              <span class="dot" onclick="setSlide(2)"></span>
            </div>
          </div>

          <!-- Today's 2 Best Picks Widget -->
          <div class="best-picks-widget">
            <div class="best-picks-header">
              <span class="best-picks-title"><i data-lucide="zap" fill="#F59E0B"></i> Today's 2 Best Picks</span>
              <span class="badge badge-discount">Editor's Pick</span>
            </div>

            ${picks.map(p => `
              <div class="pick-card">
                <img src="${p.image}" class="pick-img" alt="${p.name}">
                <div class="pick-details">
                  <h4 class="pick-name">${p.name}</h4>
                  <div class="pick-price-row">
                    <span class="pick-price">${formatINR(p.price)}</span>
                    <span class="pick-orig-price">${formatINR(p.originalPrice)}</span>
                  </div>
                  <button class="btn btn-outline btn-sm pick-btn" onclick="addToCart('${p.id}')">
                    Buy Now
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- SHOP BY CATEGORY -->
    <section class="category-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <h2 class="section-title"><i data-lucide="grid" color="#0056D2"></i> Shop by Category</h2>
            <p class="section-subtitle">Explore 1,000+ authentic electronics across premier categories</p>
          </div>
        </div>

        <div class="category-grid">
          <div class="category-card" onclick="navigateTo('products', {category: 'Mobiles'})">
            <div class="category-icon-wrapper"><i data-lucide="smartphone"></i></div>
            <h3 class="category-title">Mobiles</h3>
            <span class="category-subtitle">240+ Flagships & 5G</span>
          </div>

          <div class="category-card" onclick="navigateTo('products', {category: 'Apple'})">
            <div class="category-icon-wrapper"><i data-lucide="apple"></i></div>
            <h3 class="category-title">Apple Zone</h3>
            <span class="category-subtitle">iPhones, iPad & Mac</span>
          </div>

          <div class="category-card" onclick="navigateTo('products', {category: 'Wearables'})">
            <div class="category-icon-wrapper"><i data-lucide="watch"></i></div>
            <h3 class="category-title">Smartwatches</h3>
            <span class="category-subtitle">110+ Models & Bands</span>
          </div>

          <div class="category-card" onclick="navigateTo('products', {category: 'Audio'})">
            <div class="category-icon-wrapper"><i data-lucide="headphones"></i></div>
            <h3 class="category-title">Audio & TWS</h3>
            <span class="category-subtitle">180+ Earbuds & ANC</span>
          </div>

          <div class="category-card" onclick="navigateTo('products', {category: 'Chargers & Cables'})">
            <div class="category-icon-wrapper"><i data-lucide="battery-charging"></i></div>
            <h3 class="category-title">Fast Chargers</h3>
            <span class="category-subtitle">95+ GaN & MagSafe</span>
          </div>

          <div class="category-card" onclick="navigateTo('products', {category: 'Accessories'})">
            <div class="category-icon-wrapper"><i data-lucide="shield-check"></i></div>
            <h3 class="category-title">Accessories</h3>
            <span class="category-subtitle">350+ Cases & Guards</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SHOP BY BRAND STRIP -->
    <section class="brands-section">
      <div class="container">
        <div class="section-heading" style="margin-bottom: 1rem;">
          <h2 class="section-title"><i data-lucide="award" color="#0056D2"></i> Authorised Brand Store</h2>
        </div>
        <div class="brands-grid">
          ${BRANDS_DATA.map(b => `
            <div class="brand-chip" onclick="navigateTo('products', {brand: '${b.name}'})">
              ${b.logoText}
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- DAILY DEALS SECTION -->
    <section class="deals-section">
      <div class="container">
        <div class="deal-header-box">
          <div class="deal-header-title">
            <i data-lucide="flame" color="#FDE047"></i> Today's Super Saver Deals
          </div>
          <div class="countdown-box">
            <span>Deals End In:</span>
            <span class="timer-num" id="timer-hrs">08</span>h :
            <span class="timer-num" id="timer-mins">42</span>m :
            <span class="timer-num" id="timer-secs">15</span>s
          </div>
        </div>

        <div class="products-grid">
          ${dailyDeals.map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    </section>

    <!-- AI MOBILE FINDER WIZARD -->
    <section class="ai-finder-section" id="ai-finder">
      <div class="container">
        <div class="ai-finder-card">
          <div class="ai-finder-header">
            <span class="badge badge-blue" style="margin-bottom: 0.5rem;"><i data-lucide="sparkles"></i> AI Powered Assistant</span>
            <h2 class="ai-finder-title">Find Your Perfect Smartphone</h2>
            <p class="ai-finder-subtitle">Answer 4 quick questions to get personalized recommendations tailored to your exact budget & needs.</p>
          </div>

          <!-- Wizard Progress Steps -->
          <div class="wizard-progress-bar">
            <div class="wizard-progress-line">
              <div class="wizard-progress-fill" id="wizard-progress-fill" style="width: ${(AppState.aiWizard.step - 1) * 33.3}%;"></div>
            </div>
            <div class="step-bubble ${AppState.aiWizard.step >= 1 ? 'active' : ''}">1</div>
            <div class="step-bubble ${AppState.aiWizard.step >= 2 ? 'active' : ''}">2</div>
            <div class="step-bubble ${AppState.aiWizard.step >= 3 ? 'active' : ''}">3</div>
            <div class="step-bubble ${AppState.aiWizard.step >= 4 ? 'active' : ''}">4</div>
          </div>

          <!-- Step 1: Budget -->
          <div class="wizard-step-content ${AppState.aiWizard.step === 1 ? 'active' : ''}">
            <h3 class="wizard-question">1. What is your budget range?</h3>
            <div class="chips-grid">
              <div class="option-chip-card ${AppState.aiWizard.budget === 20000 ? 'selected' : ''}" onclick="setAiBudget(20000)">
                <span class="option-icon">💰</span>
                <span class="option-label">Under ₹20,000</span>
              </div>
              <div class="option-chip-card ${AppState.aiWizard.budget === 40000 ? 'selected' : ''}" onclick="setAiBudget(40000)">
                <span class="option-icon">💳</span>
                <span class="option-label">₹20,000 - ₹40,000</span>
              </div>
              <div class="option-chip-card ${AppState.aiWizard.budget === 80000 ? 'selected' : ''}" onclick="setAiBudget(80000)">
                <span class="option-icon">🌟</span>
                <span class="option-label">₹40,000 - ₹80,000</span>
              </div>
              <div class="option-chip-card ${AppState.aiWizard.budget === 150000 ? 'selected' : ''}" onclick="setAiBudget(150000)">
                <span class="option-icon">👑</span>
                <span class="option-label">Above ₹80,000</span>
              </div>
            </div>
          </div>

          <!-- Step 2: Primary Use -->
          <div class="wizard-step-content ${AppState.aiWizard.step === 2 ? 'active' : ''}">
            <h3 class="wizard-question">2. What is your primary priority?</h3>
            <div class="chips-grid">
              <div class="option-chip-card ${AppState.aiWizard.useCase === 'Camera' ? 'selected' : ''}" onclick="setAiUseCase('Camera')">
                <span class="option-icon">📸</span>
                <span class="option-label">Pro Photography</span>
              </div>
              <div class="option-chip-card ${AppState.aiWizard.useCase === 'Gaming' ? 'selected' : ''}" onclick="setAiUseCase('Gaming')">
                <span class="option-icon">🎮</span>
                <span class="option-label">Heavy Gaming</span>
              </div>
              <div class="option-chip-card ${AppState.aiWizard.useCase === 'Battery life' ? 'selected' : ''}" onclick="setAiUseCase('Battery life')">
                <span class="option-icon">🔋</span>
                <span class="option-label">Long Battery Life</span>
              </div>
              <div class="option-chip-card ${AppState.aiWizard.useCase === 'Everyday use' ? 'selected' : ''}" onclick="setAiUseCase('Everyday use')">
                <span class="option-icon">📱</span>
                <span class="option-label">Everyday Use</span>
              </div>
            </div>
          </div>

          <!-- Step 3: Brand Preference -->
          <div class="wizard-step-content ${AppState.aiWizard.step === 3 ? 'active' : ''}">
            <h3 class="wizard-question">3. Do you have a preferred brand?</h3>
            <div class="chips-grid">
              <div class="option-chip-card ${AppState.aiWizard.brand === 'All' ? 'selected' : ''}" onclick="setAiBrand('All')">
                <span class="option-icon">🌐</span>
                <span class="option-label">Any Brand</span>
              </div>
              <div class="option-chip-card ${AppState.aiWizard.brand === 'Apple' ? 'selected' : ''}" onclick="setAiBrand('Apple')">
                <span class="option-icon">🍎</span>
                <span class="option-label">Apple</span>
              </div>
              <div class="option-chip-card ${AppState.aiWizard.brand === 'Samsung' ? 'selected' : ''}" onclick="setAiBrand('Samsung')">
                <span class="option-icon">🌌</span>
                <span class="option-label">Samsung</span>
              </div>
              <div class="option-chip-card ${AppState.aiWizard.brand === 'OnePlus' ? 'selected' : ''}" onclick="setAiBrand('OnePlus')">
                <span class="option-icon">⚡</span>
                <span class="option-label">OnePlus</span>
              </div>
            </div>
          </div>

          <!-- Step 4: Storage & Results -->
          <div class="wizard-step-content ${AppState.aiWizard.step === 4 ? 'active' : ''}">
            <h3 class="wizard-question">✨ Recommended Smartphones For You</h3>
            ${renderAiResults()}
          </div>

          <!-- Wizard Navigation -->
          <div class="wizard-nav-btns">
            ${AppState.aiWizard.step > 1 ? `
              <button class="btn btn-secondary" onclick="moveAiStep(-1)"><i data-lucide="arrow-left"></i> Previous</button>
            ` : '<div></div>'}
            
            ${AppState.aiWizard.step < 4 ? `
              <button class="btn btn-primary" onclick="moveAiStep(1)">Next Step <i data-lucide="arrow-right"></i></button>
            ` : `
              <button class="btn btn-outline" onclick="resetAiWizard()"><i data-lucide="refresh-cw"></i> Start Over</button>
            `}
          </div>
        </div>
      </div>
    </section>

    <!-- PROMOTIONAL VIDEO SECTION -->
    <section class="video-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <h2 class="section-title"><i data-lucide="play-circle" color="#0056D2"></i> Watch & Explore</h2>
            <p class="section-subtitle">Real unboxings, camera tests & store walkthroughs by Manoj Mobiles experts</p>
          </div>
        </div>

        <div class="video-carousel-wrapper">
          ${VIDEOS_DATA.map(v => `
            <div class="video-card" onclick="openVideoModal('${v.title}', '${v.youtubeUrl}')">
              <img src="${v.thumbnail}" class="video-thumb" alt="${v.title}">
              <div class="video-overlay">
                <span class="badge badge-solid" style="width: fit-content;">${v.duration}</span>
                <div class="video-play-btn"><i data-lucide="play" fill="#FFFFFF"></i></div>
                <div>
                  <h4 class="video-info-title">${v.title}</h4>
                  <span class="video-info-meta">👀 ${v.views} views</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- TRENDING PRODUCTS SECTION -->
    <section class="deals-section" style="background: #FFFFFF;">
      <div class="container">
        <div class="section-heading">
          <div>
            <h2 class="section-title"><i data-lucide="trending-up" color="#0056D2"></i> Trending Electronics</h2>
            <p class="section-subtitle">Most popular picks bought by tech enthusiasts this week</p>
          </div>
          <a class="view-all-link" onclick="navigateTo('products')">View All Products <i data-lucide="chevron-right"></i></a>
        </div>

        <div class="products-grid">
          ${trendingProducts.map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    </section>

    <!-- APPLE SPOTLIGHT SECTION -->
    <section class="apple-spotlight-section">
      <div class="container">
        <div class="apple-header">
          <span class="apple-logo-badge"> Authorized Ecosystem</span>
          <h2 class="apple-title">The Complete Apple Experience</h2>
          <p class="apple-subtitle">Explore genuine iPhones, Apple Watch, AirPods and iPad with Official India Warranty.</p>
        </div>

        <div class="apple-grid">
          ${appleProducts.map(p => `
            <div class="apple-card">
              <img src="${p.image}" class="apple-card-img" alt="${p.name}">
              <h3 class="apple-card-name">${p.name}</h3>
              <p class="apple-card-price">${formatINR(p.price)}</p>
              <button class="btn btn-outline btn-sm" style="color: #FFFFFF; border-color: #60A5FA; width: 100%;" onclick="navigateTo('product-detail', {productId: '${p.id}'})">
                View Specs & Buy
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- WHY CHOOSE MANOJ MOBILES (TRUST BADGES) -->
    <section class="trust-section">
      <div class="container">
        <div class="trust-grid">
          <div class="trust-item">
            <div class="trust-icon"><i data-lucide="check-circle-2"></i></div>
            <div>
              <h4 class="trust-title">100% Genuine</h4>
              <p class="trust-desc">Sealed boxes with official brand warranty</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon"><i data-lucide="truck"></i></div>
            <div>
              <h4 class="trust-title">Free Delivery</h4>
              <p class="trust-desc">Same day delivery across metro cities</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon"><i data-lucide="refresh-cw"></i></div>
            <div>
              <h4 class="trust-title">7-Day Return</h4>
              <p class="trust-desc">Hassle-free replacement policy</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon"><i data-lucide="credit-card"></i></div>
            <div>
              <h4 class="trust-title">No Cost EMI</h4>
              <p class="trust-desc">0% Interest on major bank credit cards</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon"><i data-lucide="store"></i></div>
            <div>
              <h4 class="trust-title">50+ Physical Stores</h4>
              <p class="trust-desc">Try & buy experience near you</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CUSTOMER TESTIMONIALS -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <h2 class="section-title"><i data-lucide="heart" color="#0056D2"></i> Customer Testimonials</h2>
            <p class="section-subtitle">Over 1,00,000+ satisfied tech buyers across India</p>
          </div>
        </div>

        <div class="testimonials-grid">
          ${TESTIMONIALS_DATA.map(t => `
            <div class="testimonial-card">
              <div class="testimonial-header">
                <img src="${t.avatar}" class="user-avatar" alt="${t.name}">
                <div>
                  <h4 class="user-name">${t.name}</h4>
                  <span class="user-city">📍 ${t.city} • Verified Purchase</span>
                </div>
              </div>
              <div class="rating-stars" style="margin-bottom: 0.5rem;">
                ${'★'.repeat(t.rating)}
              </div>
              <p class="testimonial-text">"${t.comment}"</p>
              <span class="badge badge-blue" style="margin-top: 0.8rem;">Item: ${t.verifiedProduct}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- NEWSLETTER SIGNUP BAND -->
    <section class="container">
      <div class="newsletter-band">
        <h2 class="newsletter-title">Get ₹500 OFF On Your First Purchase</h2>
        <p class="newsletter-sub">Subscribe to Manoj Mobiles VIP Club for secret deals, flash sales & tech launches!</p>
        <form class="newsletter-form" onsubmit="handleNewsletter(event)">
          <input type="email" class="newsletter-input" placeholder="Enter your email address..." required>
          <button type="submit" class="btn btn-primary">Subscribe</button>
        </form>
      </div>
    </section>
  `;
}

// --- WIZARD CONTROL FUNCTIONS ---
function moveAiStep(delta) {
  AppState.aiWizard.step += delta;
  if (AppState.aiWizard.step < 1) AppState.aiWizard.step = 1;
  if (AppState.aiWizard.step > 4) AppState.aiWizard.step = 4;
  renderApp();
}

function setAiBudget(val) {
  AppState.aiWizard.budget = val;
  moveAiStep(1);
}

function setAiUseCase(val) {
  AppState.aiWizard.useCase = val;
  moveAiStep(1);
}

function setAiBrand(val) {
  AppState.aiWizard.brand = val;
  moveAiStep(1);
}

function resetAiWizard() {
  AppState.aiWizard = { step: 1, budget: 80000, useCase: 'Camera', brand: 'All', storage: '256GB' };
  renderApp();
}

function renderAiResults() {
  const matches = PRODUCTS_DATA.filter(p => {
    const brandMatch = AppState.aiWizard.brand === 'All' || p.brand === AppState.aiWizard.brand;
    const priceMatch = p.price <= (AppState.aiWizard.budget * 1.25);
    return brandMatch && priceMatch;
  }).slice(0, 2);

  const bestMatch = matches[0] || PRODUCTS_DATA[0];

  return `
    <div class="ai-results-box">
      <div class="ai-recommend-reason">
        🎯 <strong>AI Recommendation Rationale:</strong> We matched ${bestMatch.name} for you because it delivers top tier ${AppState.aiWizard.useCase} performance within your target budget of ${formatINR(AppState.aiWizard.budget)}.
      </div>
      <div class="products-grid">
        ${matches.map(p => renderProductCard(p)).join('')}
      </div>
    </div>
  `;
}

// --- VIEW 2: PRODUCT LISTING PAGE ---
function renderProductsView() {
  let filtered = PRODUCTS_DATA.filter(p => {
    const matchCat = AppState.filters.category === 'All' || p.category === AppState.filters.category || (AppState.filters.category === 'Apple' && p.subCategory === 'Apple');
    const matchBrand = AppState.filters.brand === 'All' || p.brand === AppState.filters.brand;
    const matchSearch = !AppState.filters.search || p.name.toLowerCase().includes(AppState.filters.search.toLowerCase()) || p.brand.toLowerCase().includes(AppState.filters.search.toLowerCase());
    const matchPrice = p.price <= AppState.filters.maxPrice;
    return matchCat && matchBrand && matchSearch && matchPrice;
  });

  if (AppState.filters.sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  if (AppState.filters.sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  if (AppState.filters.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  return `
    <div class="container">
      <div class="listing-layout">
        <!-- Filter Sidebar -->
        <aside class="filter-sidebar">
          <div class="filter-group">
            <h3 class="filter-title">Category</h3>
            <div class="filter-checkbox-list">
              ${['All', 'Mobiles', 'Apple', 'Wearables', 'Audio', 'Chargers & Cables', 'Accessories'].map(c => `
                <label class="filter-checkbox-item">
                  <input type="radio" name="catFilter" ${AppState.filters.category === c ? 'checked' : ''} onchange="setFilter('category', '${c}')">
                  ${c}
                </label>
              `).join('')}
            </div>
          </div>

          <div class="filter-group">
            <h3 class="filter-title">Brand</h3>
            <div class="filter-checkbox-list">
              ${['All', 'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'Google', 'boAt'].map(b => `
                <label class="filter-checkbox-item">
                  <input type="radio" name="brandFilter" ${AppState.filters.brand === b ? 'checked' : ''} onchange="setFilter('brand', '${b}')">
                  ${b}
                </label>
              `).join('')}
            </div>
          </div>

          <div class="filter-group">
            <h3 class="filter-title">Max Price: ${formatINR(AppState.filters.maxPrice)}</h3>
            <input type="range" min="2000" max="200000" step="5000" value="${AppState.filters.maxPrice}" style="width: 100%;" onchange="setFilter('maxPrice', this.value)">
          </div>

          <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="resetFilters()">Reset All Filters</button>
        </aside>

        <!-- Listing Content -->
        <main>
          <div class="listing-header">
            <div>
              <h2 style="font-weight: 800; font-size: 1.25rem;">Showing ${filtered.length} Products</h2>
              ${AppState.filters.search ? `<span class="badge badge-blue">Search: "${AppState.filters.search}"</span>` : ''}
            </div>

            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <label style="font-size: 0.85rem; font-weight: 700;">Sort By:</label>
              <select class="sort-select" onchange="setFilter('sort', this.value)">
                <option value="popularity" ${AppState.filters.sort === 'popularity' ? 'selected' : ''}>Popularity</option>
                <option value="price-low" ${AppState.filters.sort === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-high" ${AppState.filters.sort === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
                <option value="rating" ${AppState.filters.sort === 'rating' ? 'selected' : ''}>Customer Rating</option>
              </select>
            </div>
          </div>

          ${filtered.length > 0 ? `
            <div class="products-grid">
              ${filtered.map(p => renderProductCard(p)).join('')}
            </div>
          ` : `
            <div style="text-align: center; padding: 4rem; background: #FFFFFF; border-radius: var(--radius-lg);">
              <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 1rem;"></i>
              <h3>No products matched your selected filters</h3>
              <p style="color: var(--text-muted); margin-bottom: 1rem;">Try clearing your search query or adjusting price parameters.</p>
              <button class="btn btn-primary" onclick="resetFilters()">Reset Filters</button>
            </div>
          `}
        </main>
      </div>
    </div>
  `;
}

function setFilter(key, val) {
  AppState.filters[key] = val;
  renderApp();
}

function resetFilters() {
  AppState.filters = { search: '', category: 'All', brand: 'All', maxPrice: 200000, ram: 'All', sort: 'popularity' };
  renderApp();
}

// --- VIEW 3: PRODUCT DETAIL PAGE ---
function renderProductDetailView() {
  const p = PRODUCTS_DATA.find(item => item.id === AppState.selectedProductId) || PRODUCTS_DATA[0];
  const related = PRODUCTS_DATA.filter(item => item.category === p.category && item.id !== p.id).slice(0, 4);

  return `
    <div class="container">
      <div class="detail-layout">
        <!-- Gallery -->
        <div>
          <img src="${p.image}" class="gallery-main-img" id="detail-main-img" alt="${p.name}">
          <div class="gallery-thumbs">
            ${(p.thumbnails || [p.image]).map((img, idx) => `
              <img src="${img}" class="thumb-img ${idx === 0 ? 'active' : ''}" onclick="setDetailImg(this, '${img}')" alt="${p.name}">
            `).join('')}
          </div>
        </div>

        <!-- Details Info -->
        <div class="detail-info">
          <span class="badge badge-blue" style="width: fit-content; margin-bottom: 0.5rem;">${p.brand} Official</span>
          <h1 class="detail-title">${p.name}</h1>

          <div class="card-rating-row" style="margin-bottom: 1rem;">
            <div class="rating-stars">${'★'.repeat(Math.floor(p.rating))}</div>
            <span class="rating-text">${p.rating} (${p.reviewsCount} customer reviews)</span>
          </div>

          <div class="detail-price-box">
            <div class="price-current">${formatINR(p.price)}</div>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
              <span class="price-original">${formatINR(p.originalPrice)}</span>
              <span class="price-discount-tag">${p.discount}</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--secondary-blue); margin-top: 0.5rem; font-weight: 700;">
              💳 EMI starts at ${formatINR(Math.round(p.price / 12))}/month. 0% No Cost EMI available.
            </p>
          </div>

          <!-- Color Selector -->
          ${p.colors ? `
            <div class="variant-selector">
              <label class="variant-label">Color Variant:</label>
              <div class="variant-options">
                ${p.colors.map((c, idx) => `
                  <button class="variant-btn ${idx === 0 ? 'active' : ''}" onclick="selectVariant(this)">${c}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Storage Selector -->
          ${p.storageOptions ? `
            <div class="variant-selector">
              <label class="variant-label">Storage Capacity:</label>
              <div class="variant-options">
                ${p.storageOptions.map((s, idx) => `
                  <button class="variant-btn ${idx === 0 ? 'active' : ''}" onclick="selectVariant(this)">${s}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Action Buttons -->
          <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            <button class="btn btn-primary btn-lg" style="flex: 1;" onclick="addToCart('${p.id}')">
              <i data-lucide="shopping-bag"></i> Add to Cart
            </button>
            <button class="btn btn-outline btn-lg" onclick="toggleWishlist('${p.id}')">
              <i data-lucide="heart"></i> Wishlist
            </button>
          </div>

          <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-light); font-size: 0.85rem; color: var(--text-muted);">
            <p>✅ <strong>In Stock:</strong> Ready for immediate dispatch from Dadar Warehouse.</p>
            <p style="margin-top: 0.25rem;">🚚 Free Express Delivery by tomorrow with live tracking.</p>
          </div>
        </div>
      </div>

      <!-- Specs & Tabs -->
      <div class="detail-tabs-wrapper">
        <div class="tab-nav">
          <button class="tab-btn active">Technical Specifications</button>
        </div>
        <table class="spec-table">
          <tr><td>Brand</td><td>${p.brand}</td></tr>
          <tr><td>Model</td><td>${p.name}</td></tr>
          <tr><td>Screen Display</td><td>${p.screenSize || 'N/A'}</td></tr>
          <tr><td>Processor</td><td>${p.processor || 'N/A'}</td></tr>
          <tr><td>Camera System</td><td>${p.camera || 'N/A'}</td></tr>
          <tr><td>Battery</td><td>${p.battery || 'N/A'}</td></tr>
          <tr><td>Warranty</td><td>1 Year Brand Warranty in India</td></tr>
        </table>
      </div>

      <!-- Related Products -->
      ${related.length > 0 ? `
        <section class="deals-section" style="padding-top: 0;">
          <h2 class="section-title" style="margin-bottom: 1.5rem;">Related Products You Might Like</h2>
          <div class="products-grid">
            ${related.map(rel => renderProductCard(rel)).join('')}
          </div>
        </section>
      ` : ''}
    </div>
  `;
}

function setDetailImg(el, src) {
  document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('detail-main-img').src = src;
}

function selectVariant(el) {
  el.parentElement.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

// --- VIEW 4: CART PAGE ---
function renderCartView() {
  if (AppState.cart.length === 0) {
    return `
      <div class="container" style="padding: 4rem 1.25rem; text-align: center;">
        <div style="background: #FFFFFF; border-radius: var(--radius-lg); padding: 3rem; max-width: 500px; margin: 0 auto; border: 1px solid var(--border-light);">
          <i data-lucide="shopping-cart" style="width: 64px; height: 64px; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h2>Your Cart is Empty</h2>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Explore top smartphones and tech deals to fill your cart!</p>
          <button class="btn btn-primary" onclick="navigateTo('products')">Start Shopping Now</button>
        </div>
      </div>
    `;
  }

  let subtotal = 0;
  const itemsHtml = AppState.cart.map((item, idx) => {
    const p = PRODUCTS_DATA.find(prod => prod.id === item.productId);
    if (!p) return '';
    const itemTotal = p.price * item.qty;
    subtotal += itemTotal;

    return `
      <div class="cart-item-row">
        <img src="${p.image}" class="cart-item-img" alt="${p.name}">
        <div style="flex: 1;">
          <h4 style="font-weight: 700; font-size: 0.95rem;">${p.name}</h4>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Variant: ${item.color} | ${item.storage}</span>
          <div style="font-weight: 800; color: var(--primary); margin-top: 0.25rem;">${formatINR(p.price)}</div>
        </div>
        
        <div class="qty-control">
          <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
        </div>

        <div style="text-align: right; min-width: 90px;">
          <div style="font-weight: 800; font-size: 1.05rem;">${formatINR(itemTotal)}</div>
          <button style="color: #EF4444; font-size: 0.75rem; font-weight: 700; margin-top: 0.25rem;" onclick="removeFromCart(${idx})">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  const discount = AppState.appliedCoupon ? (subtotal * 0.10) : 0;
  const total = subtotal - discount;

  return `
    <div class="container">
      <h1 class="section-title" style="margin: 2rem 0 1rem;">Shopping Cart (${AppState.cart.length} items)</h1>
      <div class="cart-layout">
        <div class="cart-items-box">
          ${itemsHtml}
        </div>

        <div class="order-summary-box">
          <h3 style="font-weight: 800; margin-bottom: 1rem;">Order Summary</h3>
          <div class="summary-row"><span>Subtotal:</span> <span>${formatINR(subtotal)}</span></div>
          <div class="summary-row"><span>Discount:</span> <span style="color: #10B981;">-${formatINR(discount)}</span></div>
          <div class="summary-row"><span>Delivery Fee:</span> <span style="color: #10B981;">FREE</span></div>
          
          <div class="summary-total summary-row">
            <span>Total Payable:</span> <span>${formatINR(total)}</span>
          </div>

          <div style="margin: 1.25rem 0;">
            <input type="text" id="coupon-input" placeholder="Coupon Code (e.g. MANOJ10)" style="padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-dark); width: 65%;">
            <button class="btn btn-outline btn-sm" onclick="applyCoupon()">Apply</button>
          </div>

          <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="navigateTo('checkout')">
            Proceed to Checkout <i data-lucide="arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function applyCoupon() {
  const val = document.getElementById('coupon-input').value.toUpperCase().trim();
  if (val === 'MANOJ10') {
    AppState.appliedCoupon = 'MANOJ10';
    showToast('Applied 10% Discount Coupon! 🎉');
    renderApp();
  } else {
    showToast('Invalid Coupon Code. Try "MANOJ10"', 'alert-circle');
  }
}

// --- VIEW 5: WISHLIST PAGE ---
function renderWishlistView() {
  const list = PRODUCTS_DATA.filter(p => AppState.wishlist.includes(p.id));

  return `
    <div class="container" style="padding: 2rem 1.25rem;">
      <h1 class="section-title" style="margin-bottom: 1.5rem;">My Saved Wishlist (${list.length})</h1>
      ${list.length > 0 ? `
        <div class="products-grid">
          ${list.map(p => renderProductCard(p)).join('')}
        </div>
      ` : `
        <div style="text-align: center; padding: 4rem; background: #FFFFFF; border-radius: var(--radius-lg);">
          <i data-lucide="heart-off" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h3>Your wishlist is empty</h3>
          <p style="color: var(--text-muted); margin-bottom: 1rem;">Save items you love by tapping the heart icon on product cards.</p>
          <button class="btn btn-primary" onclick="navigateTo('products')">Explore Products</button>
        </div>
      `}
    </div>
  `;
}

// --- VIEW 6: CHECKOUT PAGE ---
function renderCheckoutView() {
  return `
    <div class="container" style="padding: 2rem 1.25rem;">
      <h1 class="section-title" style="margin-bottom: 1.5rem;">Checkout</h1>
      <div class="cart-layout">
        <div class="cart-items-box">
          <h3 style="font-weight: 800; margin-bottom: 1rem;">1. Shipping & Contact Info</h3>
          <form id="checkout-form" onsubmit="handlePlaceOrder(event)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label style="font-size: 0.85rem; font-weight: 700;">Full Name</label>
                <input type="text" required value="${AppState.user.name}" style="width: 100%; padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-dark);">
              </div>
              <div>
                <label style="font-size: 0.85rem; font-weight: 700;">Mobile Number</label>
                <input type="tel" required value="${AppState.user.phone}" style="width: 100%; padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-dark);">
              </div>
            </div>

            <div style="margin-bottom: 1rem;">
              <label style="font-size: 0.85rem; font-weight: 700;">Delivery Address</label>
              <textarea required rows="3" style="width: 100%; padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-dark);">102, Blue Horizon Towers, FC Road, Dadar West, Mumbai - 400028</textarea>
            </div>

            <h3 style="font-weight: 800; margin: 1.5rem 0 1rem;">2. Select Payment Method</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border-dark); padding: 0.8rem; border-radius: var(--radius-md);">
                <input type="radio" name="payment" checked> 📱 UPI / Google Pay / PhonePe (Instant Cashback)
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border-dark); padding: 0.8rem; border-radius: var(--radius-md);">
                <input type="radio" name="payment"> 💳 Credit / Debit Card (No Cost EMI)
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border-dark); padding: 0.8rem; border-radius: var(--radius-md);">
                <input type="radio" name="payment"> 💵 Cash on Delivery (COD)
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 1.5rem;">
              Place Order & Pay <i data-lucide="check-circle"></i>
            </button>
          </form>
        </div>

        <div class="order-summary-box">
          <h3 style="font-weight: 800; margin-bottom: 1rem;">Order Items</h3>
          ${AppState.cart.map(item => {
            const p = PRODUCTS_DATA.find(prod => prod.id === item.productId);
            return `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem;"><span>${item.qty}x ${p.name}</span> <strong>${formatINR(p.price * item.qty)}</strong></div>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function handlePlaceOrder(e) {
  e.preventDefault();
  AppState.cart = [];
  saveState();
  updateCounters();
  navigateTo('order-confirmation');
}

// --- VIEW 7: ORDER CONFIRMATION ---
function renderOrderConfirmationView() {
  return `
    <div class="container" style="padding: 4rem 1.25rem; text-align: center;">
      <div style="background: #FFFFFF; border-radius: var(--radius-lg); padding: 3rem; max-width: 600px; margin: 0 auto; border: 1px solid var(--border-light); box-shadow: var(--shadow-lg);">
        <div style="width: 72px; height: 72px; background: #D1FAE5; color: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem;">
          <i data-lucide="check-circle-2"></i>
        </div>
        <h1 style="color: var(--secondary-blue); font-weight: 800;">Order Confirmed!</h1>
        <p style="color: var(--text-muted); margin: 0.5rem 0 1.5rem;">Thank you for shopping with Manoj Mobiles. Your order reference ID is <strong>#MM-89421</strong>.</p>
        <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); text-align: left; font-size: 0.9rem; margin-bottom: 1.5rem;">
          <p>🚚 <strong>Estimated Delivery:</strong> Tomorrow by 5:00 PM</p>
          <p>📍 <strong>Deliver to:</strong> Dadar West, Mumbai - 400028</p>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-primary" onclick="navigateTo('track-order')">Track Order Status</button>
          <button class="btn btn-outline" onclick="navigateTo('home')">Return to Home</button>
        </div>
      </div>
    </div>
  `;
}

// --- VIEW 8: TRACK ORDER PAGE ---
function renderTrackOrderView() {
  return `
    <div class="container" style="padding: 2.5rem 1.25rem;">
      <div style="max-width: 750px; margin: 0 auto; background: #FFFFFF; border-radius: var(--radius-lg); padding: 2rem; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm);">
        <h2 style="font-weight: 800; color: var(--secondary-blue); margin-bottom: 1rem;">Track Your Order</h2>
        <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem;">
          <input type="text" value="#MM-89421" placeholder="Enter Order ID" style="flex: 1; padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-dark);">
          <button class="btn btn-primary">Track</button>
        </div>

        <h3 style="font-weight: 700; font-size: 1rem;">Order Status: <span style="color: #10B981;">Dispatched & In Transit</span></h3>
        <div class="tracker-timeline">
          <div class="tracker-line"><div class="tracker-line-progress"></div></div>
          <div class="tracker-node completed">✓</div>
          <div class="tracker-node completed">✓</div>
          <div class="tracker-node completed">✓</div>
          <div class="tracker-node">4</div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">
          <div>Order Placed<br><span style="font-weight: 400;">Aug 6, 10:00 AM</span></div>
          <div>Packed at Store<br><span style="font-weight: 400;">Aug 6, 11:30 AM</span></div>
          <div>Out for Delivery<br><span style="font-weight: 400;">Aug 6, 02:15 PM</span></div>
          <div>Delivered<br><span style="font-weight: 400;">Pending</span></div>
        </div>
      </div>
    </div>
  `;
}

// --- VIEW 9: STORE LOCATOR PAGE ---
function renderStoreLocatorView() {
  return `
    <div class="container" style="padding: 2rem 1.25rem;">
      <div class="section-heading">
        <div>
          <h1 class="section-title"><i data-lucide="map-pin" color="#0056D2"></i> Manoj Mobiles Store Locator</h1>
          <p class="section-subtitle">Visit any of our 50+ flagship stores for hands-on experience & instant repairs</p>
        </div>
      </div>

      <div class="store-grid">
        ${STORES_DATA.map(s => `
          <div class="store-card">
            <span class="badge badge-blue" style="margin-bottom: 0.5rem;">${s.tag}</span>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--secondary-blue);">${s.name}</h3>
            <p style="font-size: 0.88rem; color: var(--text-dark); margin: 0.5rem 0;">📍 ${s.address}</p>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Landmark: ${s.landmark}</p>
            <p style="font-size: 0.8rem; color: var(--text-muted);">📞 Phone: ${s.phone}</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">⏰ Hours: ${s.hours}</p>
            <a href="https://maps.google.com/?q=${encodeURIComponent(s.mapQuery)}" target="_blank" class="btn btn-outline btn-sm" style="width: 100%;">
              <i data-lucide="navigation"></i> Get Directions on Google Maps
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// --- VIEW 10: USER ACCOUNT VIEW ---
function renderAccountView() {
  if (!AppState.user.loggedIn) {
    return `
      <div class="container" style="padding: 3rem 1.25rem;">
        <div style="max-width: 440px; margin: 0 auto; background: #FFFFFF; border-radius: var(--radius-lg); padding: 2.5rem; border: 1px solid var(--border-light); box-shadow: var(--shadow-lg);">
          <h2 style="font-weight: 800; color: var(--secondary-blue); text-align: center; margin-bottom: 1.5rem;">Login / Sign Up</h2>
          <form onsubmit="handleLogin(event)">
            <div style="margin-bottom: 1rem;">
              <label style="font-size: 0.85rem; font-weight: 700;">Mobile Number or Email</label>
              <input type="text" required value="anubhab@manojmobiles.com" style="width: 100%; padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-dark);">
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="font-size: 0.85rem; font-weight: 700;">Password</label>
              <input type="password" required value="••••••••" style="width: 100%; padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-dark);">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Login to Account</button>
          </form>
        </div>
      </div>
    `;
  }

  return `
    <div class="container" style="padding: 2.5rem 1.25rem;">
      <div style="background: #FFFFFF; border-radius: var(--radius-lg); padding: 2rem; border: 1px solid var(--border-light);">
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light);">
          <div>
            <h1 style="font-weight: 800;">My Account</h1>
            <p style="color: var(--text-muted);">${AppState.user.name} (${AppState.user.email})</p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="handleLogout()">Logout</button>
        </div>

        <h3 style="font-weight: 800; margin: 1.5rem 0 1rem;">Order History</h3>
        <div style="border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1rem; background: var(--bg-subtle);">
          <div style="display: flex; justify-content: space-between; font-weight: 700;">
            <span>Order #MM-89421</span>
            <span style="color: #10B981;">Dispatched</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">iPhone 15 Pro Max • ₹1,48,900</p>
        </div>
      </div>
    </div>
  `;
}

function handleLogin(e) {
  e.preventDefault();
  AppState.user.loggedIn = true;
  saveState();
  showToast('Logged in successfully!');
  renderApp();
}

function handleLogout() {
  AppState.user.loggedIn = false;
  saveState();
  showToast('Logged out');
  renderApp();
}

// --- AUTOSUGGEST SEARCH HANDLER ---
function setupSearchAutosuggest() {
  const input = document.getElementById('search-input');
  const dropdown = document.getElementById('autosuggest-dropdown');

  if (!input || !dropdown) return;

  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) {
      dropdown.classList.remove('active');
      return;
    }

    const matches = PRODUCTS_DATA.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)).slice(0, 5);

    if (matches.length > 0) {
      dropdown.innerHTML = matches.map(m => `
        <div class="autosuggest-item" onclick="navigateTo('product-detail', {productId: '${m.id}'})">
          <img src="${m.image}" class="autosuggest-img" alt="${m.name}">
          <div class="autosuggest-info">
            <div class="autosuggest-title">${m.name}</div>
            <div class="autosuggest-price">${formatINR(m.price)}</div>
          </div>
        </div>
      `).join('');
      dropdown.classList.add('active');
    } else {
      dropdown.classList.remove('active');
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      dropdown.classList.remove('active');
    }
  });
}

// --- VIDEO PLAYER MODAL ---
function openVideoModal(title, url) {
  const modal = document.getElementById('video-modal');
  const frame = document.getElementById('modal-video-frame');
  const modalTitle = document.getElementById('modal-video-title');
  if (modal && frame) {
    modalTitle.innerText = title;
    frame.src = url;
    modal.style.display = 'flex';
  }
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const frame = document.getElementById('modal-video-frame');
  if (modal && frame) {
    frame.src = '';
    modal.style.display = 'none';
  }
}

// --- HERO CAROUSEL AUTO-PLAY ---
let carouselTimer = null;
let currentSlideIdx = 0;

function initHeroCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  if (!slides.length) return;

  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    currentSlideIdx = (currentSlideIdx + 1) % slides.length;
    setSlide(currentSlideIdx);
  }, 5000);
}

function setSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  currentSlideIdx = index;
}

// --- COUNTDOWN TIMER ---
function initCountdownTimer() {
  let seconds = 8 * 3600 + 42 * 60 + 15;
  setInterval(() => {
    seconds--;
    if (seconds <= 0) seconds = 8 * 3600;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const hEl = document.getElementById('timer-hrs');
    const mEl = document.getElementById('timer-mins');
    const sEl = document.getElementById('timer-secs');
    if (hEl) hEl.innerText = String(h).padStart(2, '0');
    if (mEl) mEl.innerText = String(m).padStart(2, '0');
    if (sEl) sEl.innerText = String(s).padStart(2, '0');
  }, 1000);
}

function handleNewsletter(e) {
  e.preventDefault();
  showToast('Subscribed! Discount code MM500 sent to your email.');
  e.target.reset();
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  setupSearchAutosuggest();
});
