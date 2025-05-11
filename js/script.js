// Common JavaScript functionality for all pages

// Mobile menu toggle
function toggleMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
}

// Update cart count from localStorage
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartCount.textContent = cartItems.length;
}

// Products data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 3500,
        oldPrice: 5000,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        rating: 4.5,
        description: "Premium wireless headphones with noise cancellation and long battery life."
    },
    {
        id: 2,
        name: "Smart Watch with Fitness Tracker",
        price: 7000,
        oldPrice: 10000,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        rating: 4.2,
        description: "Track your fitness goals and stay connected with this feature-packed smartwatch."
    },
    {
        id: 3,
        name: "Men's Casual Shirt",
        price: 600,
        oldPrice: 1000,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573",
        rating: 4.0,
        description: "Comfortable and stylish casual shirt for everyday wear."
    },
    {
        id: 4,
        name: "Women's Summer Dress",
        price: 1200,
        oldPrice: 2000,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
        rating: 4.7,
        description: "Elegant and comfortable summer dress for any occasion."
    },
    {
        id: 5,
        name: "Modern Coffee Table",
        price: 3000,
        oldPrice: 4000,
        category: "home",
        image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0",
        rating: 4.3,
        description: "Stylish coffee table with modern design to enhance your living room."
    },
    {
        id: 6,
        name: "Fitness Yoga Mat",
        price: 450,
        oldPrice: 600,
        category: "sports",
        image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e",
        rating: 4.8,
        description: "High-quality yoga mat for comfortable home workouts."
    },
    {
        id: 7,
        name: "Portable Bluetooth Speaker",
        price: 1500,
        oldPrice: 2000,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
        rating: 4.4,
        description: "Compact and powerful Bluetooth speaker with impressive sound quality."
    },
    {
        id: 8,
        name: "Decorative Throw Pillows (Set of 2)",
        price: 500,
        oldPrice: 800,
        category: "home",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
        rating: 4.1,
        description: "Soft and stylish throw pillows to enhance your home decor."
    },
    {
        id: 9,
        name: "Basketball",
        price: 600,
        oldPrice: 900,
        category: "sports",
        image: "https://images.unsplash.com/photo-1519861531473-9200262188bf",
        rating: 4.6,
        description: "Professional quality basketball for indoor and outdoor play."
    },
    {
        id: 10,
        name: "Women's Running Shoes",
        price: 1800,
        oldPrice: 2500,
        category: "sports",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        rating: 4.7,
        description: "Comfortable and supportive running shoes for optimal performance."
    },
    {
        id: 11,
        name: "Men's Leather Wallet",
        price: 400,
        oldPrice: 600,
        category: "fashion",
        image: "https://img.tatacliq.com/images/i14/437Wx649H/MP000000020140495_437Wx649H_202311190057481.jpeg",
        rating: 4.3,
        description: "Genuine leather wallet with multiple card slots and sleek design."
    },
    {
        id: 12,
        name: "Smart Home Security Camera",
        price: 3200,
        oldPrice: 4000,
        category: "electronics",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStvoLvJhDemUUhda3c_IWGc_qz3ZOkqxM83w&s",
        rating: 4.4,
        description: "Keep your home secure with this easy-to-install smart security camera."
    }
];

// Helper function to create product elements
function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.innerHTML = `
        <div class="product-img">
            <img src="${product.image}" alt="${product.name}">
            ${product.oldPrice ? `<span class="product-label">Sale</span>` : ''}
        </div>
        <div class="product-details">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                <span class="price">₹${Math.round(product.price)}</span>
                ${product.oldPrice ? `<span class="old-price">₹${Math.round(product.oldPrice)}</span>` : ''}
            </div>
            <div class="product-rating">
                ${generateRatingStars(product.rating)}
            </div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    return productElement;
}

// Helper function to generate rating stars
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (existingItemIndex > -1) {
        // Increment quantity if product already in cart
        cartItems[existingItemIndex].quantity += 1;
    } else {
        // Add new product to cart
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart count
    updateCartCount();

    // Show confirmation message
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.textContent = 'Item added to cart!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 2000);
}

// Add event listener for Add to Cart buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        addToCart(productId);
    }
});

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
}); 