
/* ============================================
   AMAZON CLONE — FRONTEND JAVASCRIPT
   Vercel API + MongoDB
   ============================================ */

const API_URL = "https://amazon-fullstack-website-igxfcg7wo-umarsarwar736-3747.vercel.app/api/products";

// ============================================
// 1. DEMO PRODUCTS
// ============================================

const INITIAL_PRODUCTS = [
    {
        id: "prod_1",
        title: "Apple AirPods Pro (2nd Generation) Wireless Earbuds",
        category: "Electronics",
        price: 199.99,
        rating: 4.8,
        reviewsCount: 12450,
        isPrime: true,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
        description: "Wireless earbuds with active noise cancellation."
    },
    {
        id: "prod_2",
        title: "Sony WH-1000XM5 Wireless Headphones",
        category: "Electronics",
        price: 348.00,
        rating: 4.7,
        reviewsCount: 8920,
        isPrime: true,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        description: "Wireless headphones with noise cancellation."
    },
    {
        id: "prod_3",
        title: "Minimalist Modern Ergonomic Desk Chair",
        category: "Home & Kitchen",
        price: 129.50,
        rating: 4.4,
        reviewsCount: 3410,
        isPrime: true,
        image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&auto=format&fit=crop&q=80",
        description: "Comfortable ergonomic office chair."
    },
    {
        id: "prod_4",
        title: "Nike Air Max Running Shoes",
        category: "Fashion",
        price: 110.00,
        rating: 4.6,
        reviewsCount: 5612,
        isPrime: true,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        description: "Athletic running shoes with cushioned soles."
    },
    {
        id: "prod_5",
        title: "PlayStation 5 DualSense Controller",
        category: "Gaming",
        price: 69.99,
        rating: 4.9,
        reviewsCount: 18230,
        isPrime: true,
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
        description: "Wireless gaming controller."
    },
    {
        id: "prod_6",
        title: "Electric Coffee Kettle",
        category: "Home & Kitchen",
        price: 49.99,
        rating: 4.5,
        reviewsCount: 2150,
        isPrime: false,
        image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80",
        description: "Modern kettle for coffee preparation."
    },
    {
        id: "prod_7",
        title: "Atomic Habits Hardcover Book",
        category: "Books",
        price: 14.99,
        rating: 4.9,
        reviewsCount: 94200,
        isPrime: true,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
        description: "A book about building better habits."
    },
    {
        id: "prod_8",
        title: "Hydrating Facial Serum",
        category: "Beauty",
        price: 24.95,
        rating: 4.3,
        reviewsCount: 1890,
        isPrime: true,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
        description: "Hydrating skincare serum."
    }
];

// ============================================
// 2. SAFE LOCAL STORAGE
// ============================================

function readStorage(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
    } catch (error) {
        console.error("Local storage read error:", error.message);
        return [];
    }
}

// ============================================
// 3. GLOBAL APPLICATION STATE
// ============================================

window.appState = {
    customProducts: readStorage("amz_custom_products"),
    serverProducts: [],
    cart: readStorage("amz_cart"),
    orders: readStorage("amz_orders"),
    selectedCategory: "All",
    searchQuery: "",
    sortBy: "featured"
};

// ============================================
// 4. SAVE LOCAL STATE
// ============================================

function saveState() {
    try {
        localStorage.setItem(
            "amz_custom_products",
            JSON.stringify(window.appState.customProducts)
        );

        localStorage.setItem(
            "amz_cart",
            JSON.stringify(window.appState.cart)
        );

        localStorage.setItem(
            "amz_orders",
            JSON.stringify(window.appState.orders)
        );
    } catch (error) {
        console.error("Could not save local state:", error.message);
    }
}

// ============================================
// 5. FETCH PRODUCTS FROM MONGODB
// ============================================

async function fetchProducts() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Products API error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("The API did not return a product array.");
        }

        window.appState.serverProducts = data.map(product => ({
            ...product,
            id: String(product._id || product.id),
            isServerProduct: Boolean(product._id),
            rating: Number(product.rating ?? 4.5),
            reviewsCount: Number(
                product.reviewsCount ?? product.reviews ?? 0
            ),
            isPrime: Boolean(product.isPrime)
        }));

        renderProducts();
    } catch (error) {
        console.error("MongoDB products could not load:", error.message);
    }
}

window.fetchProducts = fetchProducts;

// ============================================
// 6. GET ALL PRODUCTS
// ============================================

function getAllProducts() {
    return [
        ...window.appState.serverProducts,
        ...window.appState.customProducts,
        ...INITIAL_PRODUCTS
    ];
}

window.getAllProducts = getAllProducts;

// ============================================
// 7. RENDER PRODUCT CARDS
// ============================================

function renderProducts() {
    const container = document.getElementById("productGrid");

    if (!container) {
        console.error("Product grid element was not found.");
        return;
    }

    let products = getAllProducts();

    // Category filter
    if (window.appState.selectedCategory !== "All") {
        products = products.filter(
            product =>
                product.category === window.appState.selectedCategory
        );
    }

    // Search filter
    const query = window.appState.searchQuery.trim().toLowerCase();

    if (query) {
        products = products.filter(product =>
            (product.title || "").toLowerCase().includes(query) ||
            (product.description || "").toLowerCase().includes(query)
        );
    }

    // Sorting
    if (window.appState.sortBy === "lowToHigh") {
        products.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (window.appState.sortBy === "highToLow") {
        products.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (window.appState.sortBy === "topRated") {
        products.sort((a, b) => Number(b.rating) - Number(a.rating));
    }

    const countBadge = document.getElementById("productCountBadge");

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

    container.innerHTML = products.map(product => {
        const id = String(product.id || "");
        const isCustom = id.startsWith("custom_");
        const isServerProduct = product.isServerProduct === true;

        return `
            <div class="bg-white rounded-2xl border border-slate-200/80 hover:border-amzOrange shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between group">
                <div>
                    <div
                        onclick="openProductDetailModal('${id}')"
                        class="w-full h-48 bg-gray-50 rounded-xl overflow-hidden mb-3 cursor-pointer flex items-center justify-center p-2 relative">

                        <img
                            src="${product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"}"
                            alt="${product.title || "Product"}"
                            class="h-full w-full object-contain group-hover:scale-105 transition">

                        ${product.isPrime ? `
                            <span class="absolute top-2 left-2 bg-sky-500 text-white font-black text-[9px] px-2 py-0.5 rounded shadow">
                                prime
                            </span>
                        ` : ""}

                        ${isCustom ? `
                            <button
                                onclick="event.stopPropagation(); deleteCustomProduct('${id}')"
                                title="Delete local product"
                                class="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow">
                                <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                        ` : isServerProduct ? `
                            <button
                                onclick="event.stopPropagation(); deleteProduct('${id}')"
                                title="Delete database product"
                                class="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow">
                                <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                        ` : ""}
                    </div>

                    <p class="text-[10px] font-bold text-amzOrange uppercase tracking-wider">
                        ${product.category || "General"}
                    </p>

                    <h3
                        onclick="openProductDetailModal('${id}')"
                        class="font-bold text-xs text-slate-800 line-clamp-2 hover:text-amzOrange cursor-pointer mb-1.5 leading-snug">
                        ${product.title || "Untitled Product"}
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
                            ${Number(product.rating || 4.5).toFixed(1)}
                        </span>

                        <span class="text-slate-400 text-[10px]">
                            (${Number(product.reviewsCount || 0)})
                        </span>
                    </div>

                    <div class="mb-3">
                        <span class="text-xs align-top font-bold">$</span>
                        <span class="text-xl font-extrabold text-slate-900">
                            ${Math.floor(Number(product.price) || 0)}
                        </span>
                        <span class="text-xs align-top font-bold">
                            ${((Number(product.price) || 0) % 1).toFixed(2).substring(1)}
                        </span>
                    </div>
                </div>

                <button
                    onclick="addToCart('${id}')"
                    class="w-full py-2 bg-amzBtn hover:bg-amzBtnHover active:scale-95 text-slate-900 font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span>Add to Cart</span>
                </button>
            </div>
        `;
    }).join("");
}

window.renderProducts = renderProducts;

// ============================================
// 8. ADD PRODUCT TO CART
// ============================================

window.addToCart = function(productId, quantity = 1) {
    const product = getAllProducts().find(
        item => String(item.id) === String(productId)
    );

    if (!product) {
        showToast("Product could not be found.");
        return;
    }

    const existing = window.appState.cart.find(
        item => String(item.id) === String(productId)
    );

    if (existing) {
        existing.quantity += quantity;
    } else {
        window.appState.cart.push({
            id: String(product.id),
            docId: "cart_item_" + Date.now(),
            title: product.title,
            price: Number(product.price),
            image: product.image,
            isPrime: product.isPrime,
            quantity
        });
    }

    saveState();
    updateCartUI();

    showToast(`Added "${product.title.substring(0, 22)}" to cart.`);
};

// ============================================
// 9. UPDATE CART QUANTITY
// ============================================

window.updateCartQty = function(docId, change) {
    const index = window.appState.cart.findIndex(
        item => item.docId === docId
    );

    if (index === -1) return;

    const newQuantity =
        window.appState.cart[index].quantity + change;

    if (newQuantity <= 0) {
        window.appState.cart.splice(index, 1);
    } else {
        window.appState.cart[index].quantity = newQuantity;
    }

    saveState();
    updateCartUI();
};

// ============================================
// 10. REMOVE ITEM FROM CART
// ============================================

window.removeFromCart = function(docId) {
    window.appState.cart = window.appState.cart.filter(
        item => item.docId !== docId
    );

    saveState();
    updateCartUI();
};

// ============================================
// 11. UPDATE CART UI
// ============================================

function updateCartUI() {
    const cart = window.appState.cart;

    const count = cart.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    const subtotal = cart.reduce(
        (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
    );

    const counter = document.getElementById("cartCounterBadge");
    const drawerCount = document.getElementById("cartDrawerCount");
    const subtotalText = document.getElementById("cartSubtotalText");
    const grandTotalText = document.getElementById("cartGrandTotalText");

    if (counter) counter.textContent = count;
    if (drawerCount) drawerCount.textContent = count;
    if (subtotalText) subtotalText.textContent = `$${subtotal.toFixed(2)}`;
    if (grandTotalText) grandTotalText.textContent = `$${subtotal.toFixed(2)}`;

    const container = document.getElementById("cartItemsList");

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
                src="${item.image || ""}"
                alt="${item.title}"
                class="w-16 h-16 object-contain rounded-xl bg-white p-1 border flex-shrink-0">

            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-slate-800 truncate">
                    ${item.title}
                </h4>

                <p class="font-black text-slate-900 text-sm mt-0.5">
                    $${(Number(item.price) * Number(item.quantity)).toFixed(2)}
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
    `).join("");
}

window.updateCartUI = updateCartUI;

// ============================================
// 12. ADD PRODUCT FROM THE WEBSITE FORM
// ============================================

window.handleCreateProduct = async function(event) {
    event.preventDefault();

    const submitButton = document.getElementById("submitProductBtn");
    const titleField = document.getElementById("newProdTitle");
    const categoryField = document.getElementById("newProdCategory");
    const priceField = document.getElementById("newProdPrice");
    const imageField = document.getElementById("newProdImage");
    const descriptionField = document.getElementById("newProdDesc");

    if (!titleField || !categoryField || !priceField) {
        showToast("Product form fields were not found.");
        return;
    }

    const newProduct = {
        title: titleField.value.trim(),
        category: categoryField.value,
        price: Number(priceField.value),
        image: imageField
            ? imageField.value.trim()
            : "",
        description: descriptionField
            ? descriptionField.value.trim()
            : ""
    };

    if (
        !newProduct.title ||
        !Number.isFinite(newProduct.price) ||
        newProduct.price <= 0
    ) {
        showToast("Enter a valid product title and price.");
        return;
    }

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Publishing...";
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(newProduct)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                result.error || `Product save failed: ${response.status}`
            );
        }

        await fetchProducts();

        closeAddProductModal();
        showToast("Product saved to MongoDB.");

        if (titleField) titleField.value = "";
        if (priceField) priceField.value = "";
        if (imageField) imageField.value = "";
        if (descriptionField) descriptionField.value = "";
    } catch (error) {
        console.error("Could not save product:", error.message);
        showToast("Product save failed. Check backend connection.");
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML =
                '<i class="fa-solid fa-cloud-arrow-up"></i><span>Publish Product to Amazon</span>';
        }
    }
};

// Support an older form if index.html uses handleProductSubmit.
window.handleProductSubmit = async function(event) {
    event.preventDefault();

    const titleField = document.getElementById("prodTitle");
    const priceField = document.getElementById("prodPrice");
    const categoryField = document.getElementById("prodCategory");
    const imageField = document.getElementById("prodImageUrl");
    const descriptionField = document.getElementById("prodDesc");

    if (!titleField || !priceField || !categoryField) {
        showToast("Product form fields were not found.");
        return;
    }

    const product = {
        title: titleField.value.trim(),
        price: Number(priceField.value),
        category: categoryField.value,
        image: imageField ? imageField.value.trim() : "",
        description: descriptionField ? descriptionField.value.trim() : ""
    };

    if (!product.title || !Number.isFinite(product.price) || product.price <= 0) {
        showToast("Enter a valid product title and price.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error(`Product save failed: ${response.status}`);
        }

        await fetchProducts();
        event.target.reset();
        showToast("Product saved to MongoDB.");
    } catch (error) {
        console.error(error);
        showToast("Could not save product.");
    }
};

// ============================================
// 13. DELETE DATABASE PRODUCT
// ============================================

window.deleteProduct = async function(productId) {
    if (!productId) return;

    if (!confirm("Delete this database product?")) return;

    try {
        const response = await fetch(
            `${API_URL}/${encodeURIComponent(productId)}`,
            { method: "DELETE" }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.error || `Delete failed: ${response.status}`);
        }

        window.appState.serverProducts =
            window.appState.serverProducts.filter(
                product => String(product.id) !== String(productId)
            );

        renderProducts();
        showToast("Database product deleted.");
    } catch (error) {
        console.error("Delete failed:", error.message);
        showToast("Could not delete product.");
    }
};

// ============================================
// 14. DELETE LOCAL CUSTOM PRODUCT
// ============================================

window.deleteCustomProduct = function(id) {
    window.appState.customProducts =
        window.appState.customProducts.filter(
            product => String(product.id) !== String(id)
        );

    saveState();
    renderProducts();
    showToast("Local product deleted.");
};

// ============================================
// 15. PRESET IMAGE SELECTOR
// ============================================

window.selectPresetImage = function(url, element) {
    const imageField = document.getElementById("newProdImage");

    if (imageField) imageField.value = url;

    document.querySelectorAll(".preset-img-btn").forEach(button => {
        button.classList.remove("border-amzOrange");
        button.classList.add("border-transparent");
    });

    if (element) {
        element.classList.remove("border-transparent");
        element.classList.add("border-amzOrange");
    }
};

// ============================================
// 16. PLACE ORDER
// ============================================

window.handlePlaceOrder = function(event) {
    event.preventDefault();

    const cart = window.appState.cart;

    if (cart.length === 0) {
        showToast("Your cart is empty.");
        return;
    }

    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const getValue = id => {
        const element = document.getElementById(id);
        return element ? element.value : "";
    };

    const order = {
        docId: "order_" + Date.now(),
        orderId: "AMZ-" + Math.floor(100000 + Math.random() * 900000),
        items: [...cart],
        subtotal,
        total,
        shippingAddress: {
            name: getValue("shipName"),
            address: getValue("shipAddress"),
            city: getValue("shipCity"),
            zip: getValue("shipZip")
        },
        paymentMethod: getValue("payMethod"),
        status: "Order Placed (Demo)",
        createdAt: new Date().toISOString()
    };

    window.appState.orders.unshift(order);
    window.appState.cart = [];

    saveState();
    updateCartUI();
    updateOrdersUI();

    closeCheckoutModal();
    closeCartDrawer();
    switchView("orders");

    showToast("Demo order placed successfully.");
};

// ============================================
// 17. RENDER ORDER HISTORY
// ============================================

function updateOrdersUI() {
    const orders = window.appState.orders;
    const countBadge = document.getElementById("ordersCountBadge");
    const container = document.getElementById("ordersListContainer");

    if (countBadge) countBadge.textContent = orders.length;
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
                    <p class="text-[10px] text-slate-400 uppercase font-bold">ORDER PLACED</p>
                    <p class="font-bold text-slate-700">
                        ${new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div>
                    <p class="text-[10px] text-slate-400 uppercase font-bold">TOTAL AMOUNT</p>
                    <p class="font-extrabold text-slate-900">
                        $${Number(order.total || 0).toFixed(2)}
                    </p>
                </div>

                <div>
                    <p class="text-[10px] text-slate-400 uppercase font-bold">SHIP TO</p>
                    <p class="font-bold text-slate-700">
                        ${order.shippingAddress?.name || ""}
                    </p>
                </div>

                <div class="text-right">
                    <p class="text-[10px] text-slate-400 uppercase font-bold">
                        ORDER # ${order.orderId}
                    </p>
                    <span class="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full mt-0.5">
                        ${order.status || "Order Placed"}
                    </span>
                </div>
            </div>

            <div class="p-4 space-y-3">
                ${(order.items || []).map(item => `
                    <div class="flex items-center space-x-3 text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                        <img
                            src="${item.image || ""}"
                            alt="${item.title || "Product"}"
                            class="w-14 h-14 object-contain rounded-lg bg-gray-50 p-1 border">

                        <div class="flex-1">
                            <h4 class="font-bold text-slate-800 line-clamp-1">
                                ${item.title || ""}
                            </h4>
                            <p class="text-slate-400">
                                Qty: ${item.quantity} • $${Number(item.price || 0).toFixed(2)} each
                            </p>
                        </div>

                        <button
                            onclick="addToCart('${item.id}')"
                            class="px-3 py-1.5 bg-amzYellow/30 hover:bg-amzYellow text-slate-800 font-bold rounded-lg transition">
                            Buy again
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
    `).join("");
}

window.updateOrdersUI = updateOrdersUI;

// ============================================
// 18. CATEGORY FILTER
// ============================================

window.showCategory = function(category) {
    window.appState.selectedCategory = category;

    const badge = document.getElementById("activeCategoryBadge");

    if (badge) {
        badge.textContent =
            category === "All" ? "All Departments" : category;
    }

    switchView("shop");
    renderProducts();
};

window.handleCategoryFilterChange = function(category) {
    showCategory(category);
};

// ============================================
// 19. SEARCH
// ============================================

window.filterProductsBySearch = function() {
    const searchInput = document.getElementById("searchInput");

    window.appState.searchQuery = searchInput
        ? searchInput.value
        : "";

    renderProducts();
};

// ============================================
// 20. SORT
// ============================================

window.sortProducts = function() {
    const select = document.getElementById("sortBySelect");

    window.appState.sortBy = select
        ? select.value
        : "featured";

    renderProducts();
};

// ============================================
// 21. VIEW NAVIGATION
// ============================================

window.switchView = function(view) {
    const shopView = document.getElementById("shopView");
    const ordersView = document.getElementById("ordersView");

    if (shopView) shopView.classList.add("hidden");
    if (ordersView) ordersView.classList.add("hidden");

    if (view === "shop" && shopView) {
        shopView.classList.remove("hidden");
    }

    if (view === "orders" && ordersView) {
        ordersView.classList.remove("hidden");
    }
};

// ============================================
// 22. CART DRAWER
// ============================================

window.openCartDrawer = function() {
    const drawer = document.getElementById("cartDrawer");
    if (!drawer) return;

    drawer.classList.remove("hidden");
    drawer.classList.add("flex");
};

window.closeCartDrawer = function() {
    const drawer = document.getElementById("cartDrawer");
    if (!drawer) return;

    drawer.classList.add("hidden");
    drawer.classList.remove("flex");
};

// ============================================
// 23. CHECKOUT MODAL
// ============================================

window.openCheckoutModal = function() {
    const subtotal = window.appState.cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const subtotalElement = document.getElementById("checkoutSubtotal");
    const taxElement = document.getElementById("checkoutTax");
    const totalElement = document.getElementById("checkoutGrandTotal");

    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

    const modal = document.getElementById("checkoutModal");
    if (!modal) return;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
};

window.closeCheckoutModal = function() {
    const modal = document.getElementById("checkoutModal");
    if (!modal) return;

    modal.classList.add("hidden");
    modal.classList.remove("flex");
};

// ============================================
// 24. ADD PRODUCT MODAL
// ============================================

window.openAddProductModal = function() {
    const modal = document.getElementById("addProductModal");
    if (!modal) return;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
};

window.closeAddProductModal = function() {
    const modal = document.getElementById("addProductModal");
    if (!modal) return;

    modal.classList.add("hidden");
    modal.classList.remove("flex");
};

// ============================================
// 25. PRODUCT DETAILS MODAL
// ============================================

window.openProductDetailModal = function(id) {
    const product = getAllProducts().find(
        item => String(item.id) === String(id)
    );

    if (!product) return;

    const container = document.getElementById("productDetailContent");
    const modal = document.getElementById("productDetailModal");

    if (!container || !modal) return;

    container.innerHTML = `
        <div class="w-full h-64 bg-gray-50 rounded-2xl flex items-center justify-center p-4 border">
            <img
                src="${product.image || ""}"
                alt="${product.title || "Product"}"
                class="max-h-full object-contain">
        </div>

        <div class="space-y-3 flex flex-col justify-between">
            <div>
                <span class="font-bold text-amzOrange uppercase text-[10px]">
                    ${product.category || "General"}
                </span>

                <h2 class="text-base font-extrabold text-slate-900 mt-1">
                    ${product.title || ""}
                </h2>

                <p class="text-xl font-black text-slate-900 my-2">
                    $${Number(product.price || 0).toFixed(2)}
                </p>

                <p class="text-slate-600 leading-relaxed">
                    ${product.description || ""}
                </p>
            </div>

            <button
                onclick="addToCart('${product.id}'); closeProductDetailModal();"
                class="w-full py-2.5 bg-amzBtn hover:bg-amzBtnHover font-extrabold text-slate-900 rounded-xl shadow-sm transition">
                Add to Cart
            </button>
        </div>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
};

window.closeProductDetailModal = function() {
    const modal = document.getElementById("productDetailModal");
    if (!modal) return;

    modal.classList.add("hidden");
    modal.classList.remove("flex");
};

// ============================================
// 26. TOAST NOTIFICATION
// ============================================

window.showToast = function(message) {
    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");

    if (!toast || !toastText) {
        console.log(message);
        return;
    }

    toastText.textContent = message;
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
};

// ============================================
// 27. INITIALIZE APPLICATION
// ============================================

function initializeApp() {
    renderProducts();
    updateCartUI();
    updateOrdersUI();

    // Load MongoDB products and render them with the demo products.
    fetchProducts();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
} else {
    initializeApp();
}
