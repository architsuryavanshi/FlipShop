// Cart page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const cartSummary = document.getElementById('cartSummary');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeModal = document.querySelector('.close-modal');
    const checkoutForm = document.getElementById('checkoutForm');
    const promoCodeInput = document.getElementById('promoCode');
    const applyPromoBtn = document.getElementById('applyPromo');
    
    // Constants
    const SHIPPING_THRESHOLD = 5000; // Free shipping for orders over ₹5000
    const SHIPPING_COST = 200; // ₹200 shipping cost
    const TAX_RATE = 0.18; // 18% GST
    
    // Promo codes
    const promoCodes = {
        'DISCOUNT20': 0.2, // 20% off
        'SAVE10': 0.1,     // 10% off
        'FREESHIP': 'free-shipping'
    };
    
    // State
    let cartState = {
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        discount: 0,
        discountType: null,
        promoCode: null
    };
    
    // Initialize cart
    initializeCart();
    
    // Event delegation for cart item actions
    cartItemsContainer.addEventListener('click', function(e) {
        // Handle quantity increase/decrease
        if (e.target.classList.contains('quantity-decrease')) {
            const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
            updateItemQuantity(itemId, -1);
        } else if (e.target.classList.contains('quantity-increase')) {
            const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
            updateItemQuantity(itemId, 1);
        } else if (e.target.classList.contains('remove-item')) {
            const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
            removeItem(itemId);
        }
    });
    
    // Event listeners
    continueShoppingBtn.addEventListener('click', () => {
        window.location.href = 'products.html';
    });
    
    checkoutBtn.addEventListener('click', () => {
        // Show checkout modal if cart has items
        if (cartState.items.length > 0) {
            checkoutModal.style.display = 'block';
        }
    });
    
    closeModal.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processOrder();
    });
    
    applyPromoBtn.addEventListener('click', applyPromoCode);
    
    // Initialize cart
    function initializeCart() {
        // Load cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartState.items = cartItems;
        
        // Update cart UI
        updateCartUI();
    }
    
    // Update cart UI
    function updateCartUI() {
        if (cartState.items.length === 0) {
            // Show empty cart message
            emptyCart.style.display = 'block';
            cartItemsContainer.innerHTML = '';
            cartSummary.style.opacity = '0.5';
            checkoutBtn.disabled = true;
        } else {
            // Hide empty cart message and render items
            emptyCart.style.display = 'none';
            renderCartItems();
            cartSummary.style.opacity = '1';
            checkoutBtn.disabled = false;
        }
        
        // Calculate and update cart totals
        calculateCartTotals();
        updateCartTotals();
    }
    
    // Render cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        cartState.items.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.dataset.id = item.id;
            
            cartItemEl.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">₹${Math.round(item.price)}</p>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-decrease">-</button>
                            <input type="text" value="${item.quantity}" readonly>
                            <button class="quantity-increase">+</button>
                        </div>
                        <span class="remove-item"><i class="fas fa-trash"></i> Remove</span>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemEl);
        });
    }
    
    // Calculate cart totals
    function calculateCartTotals() {
        // Calculate subtotal
        cartState.subtotal = cartState.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Apply discount if promo code is active
        if (cartState.promoCode && promoCodes[cartState.promoCode]) {
            const discount = promoCodes[cartState.promoCode];
            
            if (discount === 'free-shipping') {
                cartState.discountType = 'free-shipping';
                cartState.discount = 0; // No direct discount on subtotal
            } else {
                cartState.discountType = 'percentage';
                cartState.discount = cartState.subtotal * discount;
                cartState.subtotal -= cartState.discount;
            }
        }
        
        // Calculate shipping
        if (cartState.subtotal >= SHIPPING_THRESHOLD || cartState.discountType === 'free-shipping') {
            cartState.shipping = 0; // Free shipping
        } else {
            cartState.shipping = SHIPPING_COST;
        }
        
        // Calculate tax
        cartState.tax = cartState.subtotal * TAX_RATE;
        
        // Calculate total
        cartState.total = cartState.subtotal + cartState.shipping + cartState.tax;
    }
    
    // Update cart totals in UI
    function updateCartTotals() {
        subtotalEl.textContent = `₹${Math.round(cartState.subtotal)}`;
        shippingEl.textContent = cartState.shipping === 0 ? 'Free' : `₹${Math.round(cartState.shipping)}`;
        taxEl.textContent = `₹${Math.round(cartState.tax)}`;
        totalEl.textContent = `₹${Math.round(cartState.total)}`;
    }
    
    // Update item quantity
    function updateItemQuantity(itemId, change) {
        const itemIndex = cartState.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        const newQuantity = cartState.items[itemIndex].quantity + change;
        
        if (newQuantity <= 0) {
            // If quantity becomes 0 or negative, remove the item
            removeItem(itemId);
        } else {
            // Update quantity
            cartState.items[itemIndex].quantity = newQuantity;
            
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartState.items));
            
            // Update cart UI
            updateCartUI();
        }
    }
    
    // Remove item from cart
    function removeItem(itemId) {
        cartState.items = cartState.items.filter(item => item.id !== itemId);
        
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartState.items));
        
        // Update cart count
        updateCartCount();
        
        // Update cart UI
        updateCartUI();
    }
    
    // Apply promo code
    function applyPromoCode() {
        const promoCode = promoCodeInput.value.trim().toUpperCase();
        
        if (!promoCode) {
            showMessage('Please enter a promo code.', 'error');
            return;
        }
        
        if (promoCodes[promoCode]) {
            cartState.promoCode = promoCode;
            
            // Update cart UI
            updateCartUI();
            
            // Show success message
            const discountType = promoCodes[promoCode] === 'free-shipping' ? 'free shipping' : `${promoCodes[promoCode] * 100}% discount`;
            showMessage(`Promo code applied! You got ${discountType}.`, 'success');
            
            // Disable input and button
            promoCodeInput.disabled = true;
            applyPromoBtn.disabled = true;
        } else {
            showMessage('Invalid promo code. Please try again.', 'error');
        }
    }
    
    // Process order
    function processOrder() {
        // In a real app, this would submit the order to a backend
        // For this demo, we'll just clear the cart and show confirmation
        
        // Clear cart
        cartState.items = [];
        localStorage.setItem('cartItems', JSON.stringify(cartState.items));
        
        // Update cart count
        updateCartCount();
        
        // Hide modal
        checkoutModal.style.display = 'none';
        
        // Show order confirmation message
        const message = document.createElement('div');
        message.className = 'order-confirmation';
        message.innerHTML = `
            <div class="order-confirmation-content">
                <i class="fas fa-check-circle"></i>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your purchase.</p>
                <p>Your order will be processed shortly.</p>
                <a href="index.html" class="btn">Continue Shopping</a>
            </div>
        `;
        document.body.appendChild(message);
        
        // Update cart UI
        updateCartUI();
    }
    
    // Show message
    function showMessage(text, type) {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }
}); 