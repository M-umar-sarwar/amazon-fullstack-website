// ============================================
// AMAZON CLONE - FRONTEND JAVASCRIPT
// Connected to Vercel Backend + MongoDB
// ============================================

const API_URL =
    'https://amazon-fullstack-website-igxfcg7wo-umarsarwar736-3747.vercel.app/api/products';

// ============================================
// 1. FETCH PRODUCTS FROM MONGODB
// ============================================

async function fetchProducts() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Products API failed: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('API did not return a product list.');
        }

        window.appState.serverProducts = data.map(product => ({
            ...product,
            id: String(product._id ?? product.id),
            isServerProduct: Boolean(product._id),
            rating: Number(product.rating ?? 4.5),
            reviewsCount: Number(
                product.reviewsCount ?? product.reviews ?? 0
            ),
            isPrime: Boolean(product.isPrime)
        }));

        renderProducts();
    } catch (error) {
        console.error(
            'Backend se products load nahi huay:',
            error.message
        );
    }
}

// ============================================
// 2. CREATE PRODUCT THROUGH BACKEND API
// ============================================

async function handleProductSubmit(e) {
    e.preventDefault();

    const titleField = document.getElementById('prodTitle');
    const priceField = document.getElementById('prodPrice');
    const categoryField = document.getElementById('prodCategory');
    const imageField = document.getElementById('prodImageUrl');
    const descriptionField = document.getElementById('prodDesc');

    if (!titleField || !priceField || !categoryField) {
        console.error('Product form fields were not found.');
        return;
    }

    const newProduct = {
        title: titleField.value.trim(),
        price: Number(priceField.value),
        category: categoryField.value,
        image: imageField ? imageField.value.trim() : '',
        description: descriptionField
            ? descriptionField.value.trim()
            : ''
    };

    if (
        !newProduct.title ||
        !Number.isFinite(newProduct.price) ||
        newProduct.price <= 0
    ) {
        alert('Please enter a product title and valid price.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                result.error ||
                `Product save failed: ${response.status}`
            );
        }

        alert('Product MongoDB database mein save ho gaya!');

        await fetchProducts();
        e.target.reset?.();
    } catch (error) {
        console.error('Product save nahi hua:', error.message);

        alert(
            'Product save nahi hua. Backend connection check karein.'
        );
    }
}

// ============================================
// 3. DELETE PRODUCT FROM MONGODB
// ============================================

async function deleteProduct(productId) {
    if (!productId) return;

    if (
        !confirm(
            'Are you sure you want to delete this database product?'
        )
    ) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/${encodeURIComponent(productId)}`,
            {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json'
                }
            }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                result.error || `Delete failed: ${response.status}`
            );
        }

        window.appState.serverProducts =
            window.appState.serverProducts.filter(
                product => String(product.id) !== String(productId)
            );

        renderProducts();

        showToast('Product deleted from database.');
    } catch (error) {
        console.error('Product delete nahi hua:', error.message);

        alert(
            'Product delete nahi ho saka. Backend logs check karein.'
        );
    }
}

window.handleProductSubmit = handleProductSubmit;
window.deleteProduct = deleteProduct;

// ============================================
// 4. INITIAL DEMO PRODUCTS
// ============================================

const INITIAL_PRODUCTS = [
    {
        id: 'prod_1',
        title: 'Apple AirPods Pro (2nd Generation) Wireless Earbuds',
        category: 'Electronics',
        price: 199.99,
        rating: 4.8,
        reviewsCount: 12450,
        isPrime: true,
        image:
            'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
        description:
            'Up to 2x more Active Noise Cancellation. Adaptive Audio automatically tailors noise control for your environment.'
    },
    {
        id: 'prod_2',
        title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
        category: 'Electronics',
        price: 348.00,
        rating: 4.7,
        reviewsCount: 8920,
        isPrime: true,
        image:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        description:
            'Magnificent sound engineered to perfection with HD Noise Canceling Processor QN1.'
    },
    {
        id: 'prod_3',
        title: 'Minimalist Modern Ergonomic Desk Chair',
        category: 'Home & Kitchen',
        price: 129.50,
        rating: 4.4,
        reviewsCount: 3410,
        isPrime: true,
        image:
            'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&auto=format&fit=crop&q=80',
        description:
            'High-density breathable mesh back with lumbar support and 360-degree swivel smooth wheels.'
    },
    {
        id: 'prod_4',
        title: 'Nike Air Max Athletic Men Running Shoes',
        category: 'Fashion',
        price: 110.00,
        rating: 4.6,
        reviewsCount: 5612,
        isPrime: true,
        image:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        description:
            'Revolutionary Air technology cushioned sole with breathable mesh upper construction.'
    },
    {
        id: 'prod_5',
        title: 'PlayStation 5 DualSense Wireless Controller',
        category: 'Gaming',
        price: 69.99,
        rating: 4.9,
        reviewsCount: 18230,
        isPrime: true,
        image:
            'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
        description:
            'Discover a deeper gaming experience with haptic feedback and dynamic trigger effects.'
    },
    {
        id: 'prod_6',
        title: 'Stainless Steel Gooseneck Electric Coffee Kettle',
        category: 'Home & Kitchen',
        price: 49.99,
        rating: 4.5,
        reviewsCount: 2150,
        isPrime: false,
        image:
            'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
        description:
            'Precision pour gooseneck spout for optimal pour-over coffee temperature control.'
    },
    {
        id: 'prod_7',
        title: 'Atomic Habits by James Clear - Hardcover',
        category: 'Books',
        price: 14.99,
        rating: 4.9,
        reviewsCount: 94200,
        isPrime: true,
        image:
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        description:
            'An Easy & Proven Way to Build Good Habits & Break Bad Ones.'
    },
    {
        id: 'prod_8',
        title: 'Organic Hydrating Facial Serum & Vitamin C Glow',
        category: 'Beauty',
        price: 24.95,
        rating: 4.3,
        reviewsCount: 1890,
        isPrime: true,
        image:
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
        description:
            'Pure Botanical Hyaluronic Acid & Antioxidant formula for radiant skin texture.'
    }
];

// ============================================
// 5. GLOBAL APPLICATION STATE
// ============================================

window.appState = {
    customProducts: JSON.parse(
        localStorage.getItem('amz_custom_products') || '[]'
    ),

    serverProducts: [],

    cart: JSON.parse(
        localStorage.getItem('amz_cart') || '[]'
    ),

    orders: JSON.parse(
        localStorage.getItem('amz_orders') || '[]'
    ),

    selectedCategory: 'All',
    searchQuery: '',
    sortBy: 'featured'
};

// ============================================
// 6. SAVE STATE
// ============================================

function saveState() {
    localStorage.setItem(
        'amz_custom_products',
        JSON.stringify(window.appState.customProducts)
    );

    localStorage.setItem(
        'amz_cart',
        JSON.stringify(window.appState.cart)
    );

    localStorage.setItem(
        'amz_orders',
        JSON.stringify(window.appState.orders)
    );
}

// ============================================
// 7. GET ALL PRODUCTS
// ============================================

function getAllProducts() {
    return [
        ...window.appState.customProducts,
        ...window.appState.serverProducts,
        ...INITIAL_PRODUCTS
    ];
}

// ============================================
// 8. RENDER PRODUCT CARDS
// ============================================

function renderProducts() {
    const container = document.getElementById('productGrid');

    if (!container) return;

    let products = getAllProducts();

    // Category filter
    if (window.appState.selectedCategory !== 'All') {
        products = products.filter(
            p => p.category === window.appState.selectedCategory
        );
    }

    // Search filter
    if (window.appState.searchQuery.trim() !== '') {
        const query = window.appState.searchQuery.toLowerCase();

        products = products.filter(p =>
            (p.title || '').toLowerCase().includes(query) ||
            (p.description || '').toLowerCase().includes(query)
        );
    }

    // Sorting
    if (window.appState.sortBy === 'lowToHigh') {
        products.sort((a, b) => a.price - b.price);
    } else if (window.appState.sortBy === 'highToLow') {
        products.sort((a, b) => b.price - a.price);
    } else if (window.appState.sortBy === 'topRated') {
        products.sort((a, b) => b.rating - a.rating);
    }

    const countBadge = document.getElementById('productCountBadge');

    if (countBadge) {
        countBadge.textContent = `(${products.length} items found)`;
    }

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-span-full bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200">
                <i class="fa-solid fa-box-open text-4xl text-slate-300"></i>
                <p class="text-base font-bold text-slate-600">
                    No products matched your search or category.
                </p>
                <button
                    onclick="showCategory('All')"
                    class="px-4 py-2 bg-amzBtn font-bold text-xs rounded-xl hover:bg-amzBtnHover">
                    Reset All Filters
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(p => {
        const productId = String(p.id ?? '');
        const isCustom = productId.startsWith('custom_');
        const isServerProduct = p.isServerProduct === true;

        return `
            <div class="bg-white rounded-2xl border border-slate-200/80 hover:border-amzOrange shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between group">

                <div>
                    <div
                        onclick="openProductDetailModal('${productId}')"
                        class="w-full h-48 bg-gray-50 rounded-xl overflow-hidden mb-3 cursor-pointer flex items-center justify-center p-2 relative">

                        <img
                            src="${p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}"
                            alt="${p.title}"
                            class="h-full w-full object-contain group-hover:scale-105 transition">

                        ${p.isPrime ? `
                            <span class="absolute top-2 left-2 bg-sky-500 text-white font-black text-[9px] px-2 py-0.5 rounded shadow">
                                prime
                            </span>
                        ` : ''}

                        ${isCustom ? `
                            <button
                                onclick="event.stopPropagation(); deleteCustomProduct('${productId}')"
                                title="Delete Product"
                                class="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow hover:bg-rose-600 transition">
                                <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                        ` : isServerProduct ? `
                            <button
                                onclick="event.stopPropagation(); deleteProduct('${productId}')"
                                title="Delete Database Product"
                                class="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow hover:bg-rose-600 transition">
                                <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                        ` : ''}
                    </div>

                    <p class="text-[10px] font-bold text-amzOrange uppercase tracking-wider">
                        ${p.category || 'General'}
                    </p>

                    <h3
                        onclick="openProductDetailModal('${productId}')"
                        class="font-bold text-xs text-slate-800 line-clamp-2 hover:text-amzOrange cursor-pointer mb-1.5 leading-snug">
                        ${p.title}
                    </h3>

                    <div class="flex items-center space-x-1 mb-2 text-xs">
                        <div class="text-amzYellow text-[11px]">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star-half-stroke"></i>
                        </div>

                        <span class="font-bold text-slate-700 text-[11px]">
                            ${p.rating || 4.5}
                        </span>

                        <span class="text-slate-400 text-[10px]">
                            (${p.reviewsCount || 0})
                        </span>
                    </div>

                    <div class="mb-3">
                        <span class="text-xs align-top font-bold">$</span>
                        <span class="text-xl font-extrabold text-slate-900">
                            ${Math.floor(p.price)}
                        </span>
                        <span class="text-xs align-top font-bold">
                            ${(Number(p.price) % 1).toFixed(2).substring(1)}
                        </span>
                    </div>
                </div>

                <button
                    onclick="addToCart('${productId}')"
                    class="w-full py-2 bg-amzBtn hover:bg-amzBtnHover active:scale-95 text-slate-900 font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span>Add to Cart</span>
                </button>
            </div>
        `;
    }).join('');
}

// ============================================
// 9. ADD PRODUCT TO CART
// ============================================

window.addToCart = function(productId, qty = 1) {
    const product = getAllProducts().find(
        p => String(p.id) === String(productId)
    );

    if (!product) return;

    const existing = window.appState.cart.find(
        item => String(item.id) === String(productId)
    );

    if (existing) {
        existing.quantity += qty;
    } else {
        window.appState.cart.push({
            id: String(product.id),
            docId: 'cart_item_' + Date.now(),
            title: product.title,
            price: Number(product.price),
            image: product.image,
            isPrime: product.isPrime,
            quantity: qty
        });
    }

    saveState();
    updateCartUI();

    showToast(`Added "${product.title.substring(0, 22)}..." to Cart!`);
};

// ============================================
// 10. UPDATE CART QUANTITY
// ============================================

window.updateCartQty = function(docId, delta) {
    const itemIndex = window.appState.cart.findIndex(
        item => item.docId === docId
    );

    if (itemIndex === -1) return;

    const newQty = window.appState.cart[itemIndex].quantity + delta;

    if (newQty <= 0) {
        window.appState.cart.splice(itemIndex, 1);
    } else {
        window.appState.cart[itemIndex].quantity = newQty;
    }

    saveState();
    updateCartUI();
};

// ============================================
// 11. REMOVE CART ITEM
// ============================================

window.removeFromCart = function(docId) {
    window.appState.cart = window.appState.cart.filter(
        item => item.docId !== docId
    );

    saveState();
    updateCartUI();
};

// ============================================
// 12. UPDATE CART UI
// ============================================

function updateCartUI() {
    const cart = window.appState.cart;

    const totalCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const counterBadge = document.getElementById('cartCounterBadge');
    const drawerCount = document.getElementById('cartDrawerCount');
    const subtotalText = document.getElementById('cartSubtotalText');
    const grandTotalText = document.getElementById('cartGrandTotalText');

    if (counterBadge) counterBadge.textContent = totalCount;
    if (drawerCount) drawerCount.textContent = totalCount;

    if (subtotalText) {
        subtotalText.textContent = `$${subtotal.toFixed(2)}`;
    }

    if (grandTotalText) {
        grandTotalText.textContent = `$${subtotal.toFixed(2)}`;
    }

    const container = document.getElementById('cartItemsList');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 space-y-3">
                <i class="fa-solid fa-cart-flatbed text-4xl text-slate-300"></i>
                <p class="font-bold text-slate-500 text-sm">
                    Your Amazon Cart is empty.
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="flex space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs items-center">

            <img
                src="${item.image}"
                alt="${item.title}"
                class="w-16 h-16 object-contain rounded-xl bg-white p-1 border flex-shrink-0">

            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-slate-800 truncate">
                    ${item.title}
                </h4>

                <p class="font-black text-slate-900 text-sm mt-0.5">
                    $${(item.price * item.quantity).toFixed(2)}
                </p>

                <div class="flex items-center space-x-2 mt-2">
                    <div class="flex items-center border rounded-lg bg-white">
                        <button
                            onclick="updateCartQty('${item.docId}', -1)"
                            class="p-1 hover:bg-slate-100 text-slate-600">
                            <i class="fa-solid fa-minus text-[10px]"></i>
                        </button>

                        <span class="px-2 font-bold text-slate-800">
                            ${item.quantity}
                        </span>

                        <button
                            onclick="updateCartQty('${item.docId}', 1)"
                            class="p-1 hover:bg-slate-100 text-slate-600">
                            <i class="fa-solid fa-plus text-[10px]"></i>
                        </button>
                    </div>

                    <button
                        onclick="removeFromCart('${item.docId}')"
                        class="text-rose-500 hover:underline text-[11px] font-bold">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// 13. ADD PRODUCT FROM WEBSITE MODAL TO DATABASE
// ============================================

window.handleCreateProduct = async function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitProductBtn');
    const titleField = document.getElementById('newProdTitle');
    const categoryField = document.getElementById('newProdCategory');
    const priceField = document.getElementById('newProdPrice');
    const imageField = document.getElementById('newProdImage');
    const descField = document.getElementById('newProdDesc');

    if (!titleField || !categoryField || !priceField) {
        showToast('Product form fields are missing.');
        return;
    }

    const title = titleField.value.trim();
    const category = categoryField.value;
    const price = Number(priceField.value);

    const image = imageField
        ? imageField.value.trim() ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
        : '';

    const description = descField
        ? descField.value.trim() ||
          'Quality product available on the marketplace.'
        : '';

    if (!title || !Number.isFinite(price) || price <= 0) {
        showToast('Please enter a product title and valid price.');
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Publishing...';
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                title,
                category,
                price,
                image,
                description
            })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                result.error ||
                `Product could not be saved: ${response.status}`
            );
        }

        await fetchProducts();

        closeAddProductModal();
        showToast('Product saved to MongoDB successfully!');

        titleField.value = '';
        priceField.value = '';

        if (descField) descField.value = '';
        if (imageField) imageField.value = '';
    } catch (error) {
        console.error('Product save nahi hua:', error.message);
        showToast('Product save nahi hua. Backend connection check karein.');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;

            submitBtn.innerHTML =
                '<i class="fa-solid fa-cloud-arrow-up"></i><span>Publish Product to Amazon</span>';
        }
    }
};

// ============================================
// 14. DELETE LOCAL CUSTOM PRODUCT
// ============================================

window.deleteCustomProduct = function(id) {
    window.appState.customProducts =
        window.appState.customProducts.filter(
            product => product.id !== id
        );

    saveState();
    renderProducts();

    showToast('Product deleted from marketplace.');
};

// ============================================
// 15. PRESET PRODUCT IMAGE SELECTOR
// ============================================

window.selectPresetImage = function(url, elem) {
    const imageField = document.getElementById('newProdImage');

    if (imageField) {
        imageField.value = url;
    }

    document.querySelectorAll('.preset-img-btn').forEach(button => {
        button.classList.remove('border-amzOrange');
        button.classList.add('border-transparent');
    });

    if (elem) {
        elem.classList.remove('border-transparent');
        elem.classList.add('border-amzOrange');
    }
};

// ============================================
// 16. PLACE ORDER
// ============================================

window.handlePlaceOrder = function(e) {
    e.preventDefault();

    const cart = window.appState.cart;

    if (cart.length === 0) return;

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const orderData = {
        docId: 'order_' + Date.now(),
        orderId: 'AMZ-' + Math.floor(
            100000 + Math.random() * 900000
        ),
        items: [...cart],
        subtotal,
        total,

        shippingAddress: {
            name: document.getElementById('shipName').value,
            address: document.getElementById('shipAddress').value,
            city: document.getElementById('shipCity').value,
            zip: document.getElementById('shipZip').value
        },

        paymentMethod: document.getElementById('payMethod').value,
        status: 'Out for Delivery',
        createdAt: new Date().toISOString()
    };

    window.appState.orders.unshift(orderData);
    window.appState.cart = [];

    saveState();

    updateCartUI();
    updateOrdersUI();

    closeCheckoutModal();
    closeCartDrawer();

    switchView('orders');

    showToast('🎉 Order Placed Successfully!');
};

// ============================================
// 17. UPDATE ORDERS UI
// ============================================

function updateOrdersUI() {
    const orders = window.appState.orders;
    const ordersCountBadge = document.getElementById('ordersCountBadge');

    if (ordersCountBadge) {
        ordersCountBadge.textContent = orders.length;
    }

    const container = document.getElementById('ordersListContainer');

    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-10 rounded-2xl text-center space-y-3 border border-slate-200">
                <i class="fa-solid fa-box-archive text-4xl text-slate-300"></i>

                <p class="font-bold text-slate-600 text-sm">
                    You haven't placed any orders yet.
                </p>

                <button
                    onclick="switchView('shop')"
                    class="px-4 py-2 bg-amzBtn font-bold text-xs rounded-xl hover:bg-amzBtnHover">
                    Start Shopping Today
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

            <div class="bg-slate-50 p-3 sm:p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2 text-xs">

                <div>
                    <p class="text-[10px] text-slate-400 uppercase font-bold">
                        ORDER PLACED
                    </p>
                    <p class="font-bold text-slate-700">
                        ${new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div>
                    <p class="text-[10px] text-slate-400 uppercase font-bold">
                        TOTAL AMOUNT
                    </p>
                    <p class="font-extrabold text-slate-900">
                        $${Number(order.total).toFixed(2)}
                    </p>
                </div>

                <div>
                    <p class="text-[10px] text-slate-400 uppercase font-bold">
                        SHIP TO
                    </p>
                    <p class="font-bold text-slate-700">
                        ${order.shippingAddress?.name || ''}
                    </p>
                </div>

                <div class="text-right">
                    <p class="text-[10px] text-slate-400 uppercase font-bold">
                        ORDER # ${order.orderId}
                    </p>

                    <span class="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full mt-0.5">
                        ${order.status}
                    </span>
                </div>
            </div>

            <div class="p-4 space-y-3">
                ${order.items?.map(item => `
                    <div class="flex items-center space-x-3 text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">

                        <img
                            src="${item.image}"
                            alt="${item.title}"
                            class="w-14 h-14 object-contain rounded-lg bg-gray-50 p-1 border">

                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 line-clamp-1">
                                ${item.title}
                            </h4>

                            <p class="text-slate-400">
                                Qty: ${item.quantity} • $${Number(item.price).toFixed(2)} each
                            </p>
                        </div>

                        <button
                            onclick="addToCart('${item.id}')"
                            class="px-3 py-1.5 bg-amzYellow/30 hover:bg-amzYellow text-slate-800 font-bold rounded-lg transition">
                            Buy again
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ============================================
// 18. CATEGORY FILTER
// ============================================

window.showCategory = function(cat) {
    window.appState.selectedCategory = cat;

    const activeBadge = document.getElementById('activeCategoryBadge');

    if (activeBadge) {
        activeBadge.textContent =
            cat === 'All' ? 'All Departments' : cat;
    }

    switchView('shop');
    renderProducts();
};

window.handleCategoryFilterChange = function(cat) {
    showCategory(cat);
};

// ============================================
// 19. SEARCH PRODUCTS
// ============================================

window.filterProductsBySearch = function() {
    const searchInput = document.getElementById('searchInput');

    window.appState.searchQuery = searchInput
        ? searchInput.value
        : '';

    renderProducts();
};

// ============================================
// 20. SORT PRODUCTS
// ============================================

window.sortProducts = function() {
    const sortSelect = document.getElementById('sortBySelect');

    window.appState.sortBy = sortSelect
        ? sortSelect.value
        : 'featured';

    renderProducts();
};

// ============================================
// 21. PAGE NAVIGATION
// ============================================

window.switchView = function(view) {
    const shopView = document.getElementById('shopView');
    const ordersView = document.getElementById('ordersView');

    if (shopView) shopView.classList.add('hidden');
    if (ordersView) ordersView.classList.add('hidden');

    if (view === 'shop' && shopView) {
        shopView.classList.remove('hidden');
    }

    if (view === 'orders' && ordersView) {
        ordersView.classList.remove('hidden');
    }
};

// ============================================
// 22. CART DRAWER
// ============================================

window.openCartDrawer = function() {
    const drawer = document.getElementById('cartDrawer');

    if (!drawer) return;

    drawer.classList.remove('hidden');
    drawer.classList.add('flex');
};

window.closeCartDrawer = function() {
    const drawer = document.getElementById('cartDrawer');

    if (!drawer) return;

    drawer.classList.add('hidden');
    drawer.classList.remove('flex');
};

// ============================================
// 23. CHECKOUT MODAL
// ============================================

window.openCheckoutModal = function() {
    const subtotal = window.appState.cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const subtotalElement = document.getElementById('checkoutSubtotal');
    const taxElement = document.getElementById('checkoutTax');
    const totalElement = document.getElementById('checkoutGrandTotal');

    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    if (taxElement) {
        taxElement.textContent = `$${tax.toFixed(2)}`;
    }

    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    const modal = document.getElementById('checkoutModal');

    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeCheckoutModal = function() {
    const modal = document.getElementById('checkoutModal');

    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

// ============================================
// 24. ADD PRODUCT MODAL
// ============================================

window.openAddProductModal = function() {
    const modal = document.getElementById('addProductModal');

    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeAddProductModal = function() {
    const modal = document.getElementById('addProductModal');

    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

// ============================================
// 25. PRODUCT DETAILS MODAL
// ============================================

window.openProductDetailModal = function(id) {
    const product = getAllProducts().find(
        p => String(p.id) === String(id)
    );

    if (!product) return;

    const container = document.getElementById('productDetailContent');

    if (!container) return;

    container.innerHTML = `
        <div class="w-full h-64 bg-gray-50 rounded-2xl flex items-center justify-center p-4 border">
            <img
                src="${product.image}"
                alt="${product.title}"
                class="max-h-full object-contain">
        </div>

        <div class="space-y-3 flex flex-col justify-between">
            <div>
                <span class="font-bold text-amzOrange uppercase text-[10px]">
                    ${product.category}
                </span>

                <h2 class="text-base font-extrabold text-slate-900 mt-1">
                    ${product.title}
                </h2>

                <p class="text-xl font-black text-slate-900 my-2">
                    $${Number(product.price).toFixed(2)}
                </p>

                <p class="text-slate-600 leading-relaxed">
                    ${product.description || ''}
                </p>
            </div>

            <button
                onclick="addToCart('${product.id}'); closeProductDetailModal();"
                class="w-full py-2.5 bg-amzBtn hover:bg-amzBtnHover font-extrabold text-slate-900 rounded-xl shadow-sm transition">
                Add to Cart
            </button>
        </div>
    `;

    const modal = document.getElementById('productDetailModal');

    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.closeProductDetailModal = function() {
    const modal = document.getElementById('productDetailModal');

    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
};

// ============================================
// 26. TOAST NOTIFICATION
// ============================================

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');

    if (!toast || !toastText) {
        console.log(msg);
        return;
    }

    toastText.textContent = msg;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ============================================
// 27. INITIALIZE APPLICATION
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    updateOrdersUI();

    // Load live products from MongoDB after UI initialization.
    fetchProducts();
});
