// Local Development URL
const API_URL = 'http://localhost:5000/api/products';

// 1. GET ALL PRODUCTS
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    renderProducts(data);
  } catch (error) {
    console.error("Backend se data load nahi ho saka:", error);
  }
}

// 2. CREATE NEW PRODUCT
async function handleProductSubmit(e) {
  e.preventDefault();

  const newProduct = {
    title: document.getElementById("prodTitle").value,
    price: parseFloat(document.getElementById("prodPrice").value),
    category: document.getElementById("prodCategory").value,
    image: document.getElementById("prodImageUrl").value,
    description: document.getElementById("prodDesc").value
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });

    if (response.ok) {
      alert("Product MongoDB Database mein save ho gaya!");
      fetchProducts();
    }
  } catch (error) {
    console.error("Product save nahi hua:", error);
  }
}

// 3. DELETE PRODUCT
async function deleteProduct(productId) {
  try {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert("Product Delete ho gaya!");
      fetchProducts();
    }
  } catch (error) {
    console.error("Delete mein error aya:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchProducts);
const INITIAL_PRODUCTS = [
            {
                id: 'prod_1',
                title: 'Apple AirPods Pro (2nd Generation) Wireless Earbuds',
                category: 'Electronics',
                price: 199.99,
                rating: 4.8,
                reviewsCount: 12450,
                isPrime: true,
                image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
                description: 'Up to 2x more Active Noise Cancellation. Adaptive Audio automatically tailors noise control for your environment.'
            },
            {
                id: 'prod_2',
                title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
                category: 'Electronics',
                price: 348.00,
                rating: 4.7,
                reviewsCount: 8920,
                isPrime: true,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
                description: 'Magnificent sound engineered to perfection with HD Noise Canceling Processor QN1.'
            },
            {
                id: 'prod_3',
                title: 'Minimalist Modern Ergonomic Desk Chair',
                category: 'Home & Kitchen',
                price: 129.50,
                rating: 4.4,
                reviewsCount: 3410,
                isPrime: true,
                image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&auto=format&fit=crop&q=80',
                description: 'High-density breathable mesh back with lumbar support and 360-degree swivel smooth wheels.'
            },
            {
                id: 'prod_4',
                title: 'Nike Air Max Athletic Men Running Shoes',
                category: 'Fashion',
                price: 110.00,
                rating: 4.6,
                reviewsCount: 5612,
                isPrime: true,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
                description: 'Revolutionary Air technology cushioned sole with breathable mesh upper construction.'
            },
            {
                id: 'prod_5',
                title: 'PlayStation 5 DualSense Wireless Controller',
                category: 'Gaming',
                price: 69.99,
                rating: 4.9,
                reviewsCount: 18230,
                isPrime: true,
                image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
                description: 'Discover a deeper gaming experience with haptic feedback and dynamic trigger effects.'
            },
            {
                id: 'prod_6',
                title: 'Stainless Steel Gooseneck Electric Coffee Kettle',
                category: 'Home & Kitchen',
                price: 49.99,
                rating: 4.5,
                reviewsCount: 2150,
                isPrime: false,
                image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
                description: 'Precision pour gooseneck spout for optimal pour-over coffee temperature control.'
            },
            {
                id: 'prod_7',
                title: 'Atomic Habits by James Clear - Hardcover',
                category: 'Books',
                price: 14.99,
                rating: 4.9,
                reviewsCount: 94200,
                isPrime: true,
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
                description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.'
            },
            {
                id: 'prod_8',
                title: 'Organic Hydrating Facial Serum & Vitamin C Glow',
                category: 'Beauty',
                price: 24.95,
                rating: 4.3,
                reviewsCount: 1890,
                isPrime: true,
                image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
                description: 'Pure Botanical Hyaluronic Acid & Antioxidant formula for radiant skin texture.'
            }
        ];

        // Global State
        window.appState = {
            customProducts: JSON.parse(localStorage.getItem('amz_custom_products') || '[]'),
            cart: JSON.parse(localStorage.getItem('amz_cart') || '[]'),
            orders: JSON.parse(localStorage.getItem('amz_orders') || '[]'),
            selectedCategory: 'All',
            searchQuery: '',
            sortBy: 'featured'
        };

        function saveState() {
            localStorage.setItem('amz_custom_products', JSON.stringify(window.appState.customProducts));
            localStorage.setItem('amz_cart', JSON.stringify(window.appState.cart));
            localStorage.setItem('amz_orders', JSON.stringify(window.appState.orders));
        }

        function getAllProducts() {
            return [...window.appState.customProducts, ...INITIAL_PRODUCTS];
        }

        // Render Product Cards Grid
        function renderProducts() {
            const container = document.getElementById('productGrid');
            if (!container) return;

            let products = getAllProducts();

            // Filter Category
            if (window.appState.selectedCategory !== 'All') {
                products = products.filter(p => p.category === window.appState.selectedCategory);
            }

            // Filter Search Query
            if (window.appState.searchQuery.trim() !== '') {
                const q = window.appState.searchQuery.toLowerCase();
                products = products.filter(p => 
                    p.title.toLowerCase().includes(q) || 
                    (p.description && p.description.toLowerCase().includes(q))
                );
            }

            // Sort Products
            if (window.appState.sortBy === 'lowToHigh') {
                products.sort((a, b) => a.price - b.price);
            } else if (window.appState.sortBy === 'highToLow') {
                products.sort((a, b) => b.price - a.price);
            } else if (window.appState.sortBy === 'topRated') {
                products.sort((a, b) => b.rating - a.rating);
            }

            document.getElementById('productCountBadge').textContent = `(${products.length} items found)`;

            if (products.length === 0) {
                container.innerHTML = `
                    <div class="col-span-full bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200">
                        <i class="fa-solid fa-box-open text-4xl text-slate-300"></i>
                        <p class="text-base font-bold text-slate-600">No products matched your search or category.</p>
                        <button onclick="showCategory('All')" class="px-4 py-2 bg-amzBtn font-bold text-xs rounded-xl hover:bg-amzBtnHover">
                            Reset All Filters
                        </button>
                    </div>
                `;
                return;
            }

            container.innerHTML = products.map(p => {
                const isCustom = p.id.startsWith('custom_');
                return `
                    <div class="bg-white rounded-2xl border border-slate-200/80 hover:border-amzOrange shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between group">
                        <div>
                            <!-- Product Image -->
                            <div onclick="openProductDetailModal('${p.id}')" class="w-full h-48 bg-gray-50 rounded-xl overflow-hidden mb-3 cursor-pointer flex items-center justify-center p-2 relative">
                                <img src="${p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}" alt="${p.title}" class="h-full w-full object-contain group-hover:scale-105 transition">
                                ${p.isPrime ? `<span class="absolute top-2 left-2 bg-sky-500 text-white font-black text-[9px] px-2 py-0.5 rounded shadow">prime</span>` : ''}
                                ${isCustom ? `
                                    <button onclick="event.stopPropagation(); deleteCustomProduct('${p.id}')" title="Delete Product" class="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow hover:bg-rose-600 transition">
                                        <i class="fa-solid fa-trash-can text-xs"></i>
                                    </button>
                                ` : ''}
                            </div>

                            <!-- Category & Title -->
                            <p class="text-[10px] font-bold text-amzOrange uppercase tracking-wider">${p.category}</p>
                            <h3 onclick="openProductDetailModal('${p.id}')" class="font-bold text-xs text-slate-800 line-clamp-2 hover:text-amzOrange cursor-pointer mb-1.5 leading-snug">
                                ${p.title}
                            </h3>

                            <!-- Rating -->
                            <div class="flex items-center space-x-1 mb-2 text-xs">
                                <div class="text-amzYellow text-[11px]">
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star"></i>
                                    <i class="fa-solid fa-star-half-stroke"></i>
                                </div>
                                <span class="font-bold text-slate-700 text-[11px]">${p.rating || 4.5}</span>
                                <span class="text-slate-400 text-[10px]">(${p.reviewsCount || 100})</span>
                            </div>

                            <!-- Price -->
                            <div class="mb-3">
                                <span class="text-xs align-top font-bold">$</span>
                                <span class="text-xl font-extrabold text-slate-900">${Math.floor(p.price)}</span>
                                <span class="text-xs align-top font-bold">${(p.price % 1).toFixed(2).substring(1)}</span>
                            </div>
                        </div>

                        <!-- Add to Cart Button -->
                        <button onclick="addToCart('${p.id}')" class="w-full py-2 bg-amzBtn hover:bg-amzBtnHover active:scale-95 text-slate-900 font-extrabold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5">
                            <i class="fa-solid fa-cart-shopping"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                `;
            }).join('');
        }

        // Add Product To Cart
        window.addToCart = function(productId, qty = 1) {
            const product = getAllProducts().find(p => p.id === productId);
            if (!product) return;

            const existing = window.appState.cart.find(item => item.id === productId);
            if (existing) {
                existing.quantity += qty;
            } else {
                window.appState.cart.push({
                    id: product.id,
                    docId: 'cart_item_' + Date.now(),
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    isPrime: product.isPrime,
                    quantity: qty
                });
            }

            saveState();
            updateCartUI();
            showToast(`Added "${product.title.substring(0, 22)}..." to Cart!`);
        };

        // Update Cart Item Quantity
        window.updateCartQty = function(docId, delta) {
            const itemIndex = window.appState.cart.findIndex(i => i.docId === docId);
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

        // Delete Cart Item
        window.removeFromCart = function(docId) {
            window.appState.cart = window.appState.cart.filter(i => i.docId !== docId);
            saveState();
            updateCartUI();
        };

        // Update UI for Shopping Cart
        function updateCartUI() {
            const cart = window.appState.cart;
            const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            document.getElementById('cartCounterBadge').textContent = totalCount;
            document.getElementById('cartDrawerCount').textContent = totalCount;
            document.getElementById('cartSubtotalText').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('cartGrandTotalText').textContent = `$${subtotal.toFixed(2)}`;

            const container = document.getElementById('cartItemsList');
            if (!container) return;

            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12 space-y-3">
                        <i class="fa-solid fa-cart-flatbed text-4xl text-slate-300"></i>
                        <p class="font-bold text-slate-500 text-sm">Your Amazon Cart is empty.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = cart.map(item => `
                <div class="flex space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs items-center">
                    <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain rounded-xl bg-white p-1 border flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-slate-800 truncate">${item.title}</h4>
                        <p class="font-black text-slate-900 text-sm mt-0.5">$${(item.price * item.quantity).toFixed(2)}</p>
                        
                        <div class="flex items-center space-x-2 mt-2">
                            <div class="flex items-center border rounded-lg bg-white">
                                <button onclick="updateCartQty('${item.docId}', -1)" class="p-1 hover:bg-slate-100 text-slate-600">
                                    <i class="fa-solid fa-minus text-[10px]"></i>
                                </button>
                                <span class="px-2 font-bold text-slate-800">${item.quantity}</span>
                                <button onclick="updateCartQty('${item.docId}', 1)" class="p-1 hover:bg-slate-100 text-slate-600">
                                    <i class="fa-solid fa-plus text-[10px]"></i>
                                </button>
                            </div>
                            <button onclick="removeFromCart('${item.docId}')" class="text-rose-500 hover:underline text-[11px] font-bold">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Add Custom Product Function (Guaranteed 100% Reliable Execution)
        window.handleCreateProduct = function(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitProductBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Publishing...`;

            const title = document.getElementById('newProdTitle').value.trim();
            const category = document.getElementById('newProdCategory').value;
            const price = parseFloat(document.getElementById('newProdPrice').value) || 29.99;
            const image = document.getElementById('newProdImage').value.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
            const desc = document.getElementById('newProdDesc').value.trim() || 'Quality product available on Amazon Marketplace.';

            const newProductObj = {
                id: 'custom_' + Date.now(),
                title: title,
                category: category,
                price: price,
                rating: 4.8,
                reviewsCount: Math.floor(Math.random() * 200) + 15,
                isPrime: true,
                image: image,
                description: desc,
                createdAt: new Date().toISOString()
            };

            // Add to state and render immediately
            window.appState.customProducts.unshift(newProductObj);
            saveState();
            renderProducts();

            closeAddProductModal();
            showToast("🎉 Product published successfully!");

            // Reset form
            document.getElementById('newProdTitle').value = '';
            document.getElementById('newProdPrice').value = '';
            document.getElementById('newProdDesc').value = '';

            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i><span>Publish Product to Amazon</span>`;
        };

        // Delete Custom Product
        window.deleteCustomProduct = function(id) {
            window.appState.customProducts = window.appState.customProducts.filter(p => p.id !== id);
            saveState();
            renderProducts();
            showToast("Product deleted from marketplace");
        };

        // Select Preset Image Helper
        window.selectPresetImage = function(url, elem) {
            document.getElementById('newProdImage').value = url;
            document.querySelectorAll('.preset-img-btn').forEach(btn => {
                btn.classList.remove('border-amzOrange');
                btn.classList.add('border-transparent');
            });
            elem.classList.remove('border-transparent');
            elem.classList.add('border-amzOrange');
        };

        // Place Order Flow
        window.handlePlaceOrder = function(e) {
            e.preventDefault();
            const cart = window.appState.cart;
            if (cart.length === 0) return;

            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.08;
            const total = subtotal + tax;

            const orderData = {
                docId: 'order_' + Date.now(),
                orderId: 'AMZ-' + Math.floor(100000 + Math.random() * 900000),
                items: [...cart],
                subtotal: subtotal,
                total: total,
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
            window.appState.cart = []; // Empty cart
            saveState();

            updateCartUI();
            updateOrdersUI();

            closeCheckoutModal();
            closeCartDrawer();
            switchView('orders');
            showToast("🎉 Order Placed Successfully!");
        };

        // Render Orders History UI
        function updateOrdersUI() {
            const orders = window.appState.orders;
            document.getElementById('ordersCountBadge').textContent = orders.length;

            const container = document.getElementById('ordersListContainer');
            if (!container) return;

            if (orders.length === 0) {
                container.innerHTML = `
                    <div class="bg-white p-10 rounded-2xl text-center space-y-3 border border-slate-200">
                        <i class="fa-solid fa-box-archive text-4xl text-slate-300"></i>
                        <p class="font-bold text-slate-600 text-sm">You haven't placed any orders yet.</p>
                        <button onclick="switchView('shop')" class="px-4 py-2 bg-amzBtn font-bold text-xs rounded-xl hover:bg-amzBtnHover">
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
                            <p class="font-bold text-slate-700">${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p class="text-[10px] text-slate-400 uppercase font-bold">TOTAL AMOUNT</p>
                            <p class="font-extrabold text-slate-900">$${order.total?.toFixed(2)}</p>
                        </div>
                        <div>
                            <p class="text-[10px] text-slate-400 uppercase font-bold">SHIP TO</p>
                            <p class="font-bold text-slate-700">${order.shippingAddress?.name}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] text-slate-400 uppercase font-bold">ORDER # ${order.orderId}</p>
                            <span class="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full mt-0.5">
                                ${order.status}
                            </span>
                        </div>
                    </div>

                    <div class="p-4 space-y-3">
                        ${order.items?.map(item => `
                            <div class="flex items-center space-x-3 text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                <img src="${item.image}" alt="${item.title}" class="w-14 h-14 object-contain rounded-lg bg-gray-50 p-1 border">
                                <div class="flex-1">
                                    <h4 class="font-bold text-slate-800 line-clamp-1">${item.title}</h4>
                                    <p class="text-slate-400">Qty: ${item.quantity} • $${item.price?.toFixed(2)} each</p>
                                </div>
                                <button onclick="addToCart('${item.id}')" class="px-3 py-1.5 bg-amzYellow/30 hover:bg-amzYellow text-slate-800 font-bold rounded-lg transition">
                                    Buy again
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        // Navigation & Modal Helpers
        window.showCategory = function(cat) {
            window.appState.selectedCategory = cat;
            document.getElementById('activeCategoryBadge').textContent = cat === 'All' ? 'All Departments' : cat;
            switchView('shop');
            renderProducts();
        };

        window.handleCategoryFilterChange = function(cat) {
            showCategory(cat);
        };

        window.filterProductsBySearch = function() {
            window.appState.searchQuery = document.getElementById('searchInput').value;
            renderProducts();
        };

        window.sortProducts = function() {
            window.appState.sortBy = document.getElementById('sortBySelect').value;
            renderProducts();
        };

        window.switchView = function(view) {
            document.getElementById('shopView').classList.add('hidden');
            document.getElementById('ordersView').classList.add('hidden');
            if (view === 'shop') document.getElementById('shopView').classList.remove('hidden');
            if (view === 'orders') document.getElementById('ordersView').classList.remove('hidden');
        };

        window.openCartDrawer = function() {
            document.getElementById('cartDrawer').classList.remove('hidden');
            document.getElementById('cartDrawer').classList.add('flex');
        };

        window.closeCartDrawer = function() {
            document.getElementById('cartDrawer').classList.add('hidden');
            document.getElementById('cartDrawer').classList.remove('flex');
        };

        window.openCheckoutModal = function() {
            const subtotal = window.appState.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
            const tax = subtotal * 0.08;
            const total = subtotal + tax;

            document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
            document.getElementById('checkoutGrandTotal').textContent = `$${total.toFixed(2)}`;

            document.getElementById('checkoutModal').classList.remove('hidden');
            document.getElementById('checkoutModal').classList.add('flex');
        };

        window.closeCheckoutModal = function() {
            document.getElementById('checkoutModal').classList.add('hidden');
            document.getElementById('checkoutModal').classList.remove('flex');
        };

        window.openAddProductModal = function() {
            document.getElementById('addProductModal').classList.remove('hidden');
            document.getElementById('addProductModal').classList.add('flex');
        };

        window.closeAddProductModal = function() {
            document.getElementById('addProductModal').classList.add('hidden');
            document.getElementById('addProductModal').classList.remove('flex');
        };

        window.openProductDetailModal = function(id) {
            const product = getAllProducts().find(p => p.id === id);
            if (!product) return;

            const container = document.getElementById('productDetailContent');
            container.innerHTML = `
                <div class="w-full h-64 bg-gray-50 rounded-2xl flex items-center justify-center p-4 border">
                    <img src="${product.image}" alt="${product.title}" class="max-h-full object-contain">
                </div>
                <div class="space-y-3 flex flex-col justify-between">
                    <div>
                        <span class="font-bold text-amzOrange uppercase text-[10px]">${product.category}</span>
                        <h2 class="text-base font-extrabold text-slate-900 mt-1">${product.title}</h2>
                        <p class="text-xl font-black text-slate-900 my-2">$${product.price?.toFixed(2)}</p>
                        <p class="text-slate-600 leading-relaxed">${product.description}</p>
                    </div>
                    <button onclick="addToCart('${product.id}'); closeProductDetailModal();" class="w-full py-2.5 bg-amzBtn hover:bg-amzBtnHover font-extrabold text-slate-900 rounded-xl shadow-sm transition">
                        Add to Cart
                    </button>
                </div>
            `;

            document.getElementById('productDetailModal').classList.remove('hidden');
            document.getElementById('productDetailModal').classList.add('flex');
        };

        window.closeProductDetailModal = function() {
            document.getElementById('productDetailModal').classList.add('hidden');
            document.getElementById('productDetailModal').classList.remove('flex');
        };

        function showToast(msg) {
            const toast = document.getElementById('toast');
            document.getElementById('toastText').textContent = msg;
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3000);
        }

        // Initialize App on DOM ready
        window.addEventListener('DOMContentLoaded', () => {
            renderProducts();
            updateCartUI();
            updateOrdersUI();
        });