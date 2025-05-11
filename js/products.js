// Products page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const productGrid = document.getElementById('productGrid');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const sortSelect = document.getElementById('sort');
    const ratingCheckboxes = document.querySelectorAll('.rating-filter input');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    
    // State
    let currentFilters = {
        category: 'all',
        maxPrice: 10000,
        ratings: [],
        sort: 'default',
        page: 1
    };
    
    const PRODUCTS_PER_PAGE = 6;
    
    // Initialize the products grid
    initializeProducts();
    
    // Event listeners
    categoryFilter.addEventListener('click', handleCategoryFilter);
    priceRange.addEventListener('input', handlePriceFilter);
    sortSelect.addEventListener('change', handleSortChange);
    ratingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleRatingFilter);
    });
    prevPageBtn.addEventListener('click', () => changePage(currentFilters.page - 1));
    nextPageBtn.addEventListener('click', () => changePage(currentFilters.page + 1));
    
    // Initialize products grid
    function initializeProducts() {
        applyFiltersAndSort();
    }
    
    // Handle category filter clicks
    function handleCategoryFilter(e) {
        if (e.target.tagName === 'LI') {
            // Remove active class from all categories
            const categories = categoryFilter.querySelectorAll('li');
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category
            e.target.classList.add('active');
            
            // Update filter state
            currentFilters.category = e.target.getAttribute('data-category');
            currentFilters.page = 1;
            
            applyFiltersAndSort();
        }
    }
    
    // Handle price filter changes
    function handlePriceFilter() {
        const value = priceRange.value;
        priceValue.textContent = `₹${Math.round(value)}`;
        
        currentFilters.maxPrice = parseInt(value);
        currentFilters.page = 1;
        
        applyFiltersAndSort();
    }
    
    // Handle sort changes
    function handleSortChange() {
        currentFilters.sort = sortSelect.value;
        applyFiltersAndSort();
    }
    
    // Handle rating filter changes
    function handleRatingFilter() {
        const checkedRatings = [];
        
        if (document.getElementById('5-star').checked) checkedRatings.push(5);
        if (document.getElementById('4-star').checked) checkedRatings.push(4);
        if (document.getElementById('3-star').checked) checkedRatings.push(3);
        
        currentFilters.ratings = checkedRatings;
        currentFilters.page = 1;
        
        applyFiltersAndSort();
    }
    
    // Change page
    function changePage(pageNum) {
        currentFilters.page = pageNum;
        applyFiltersAndSort();
        
        // Scroll to top of products
        document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Apply filters and sort
    function applyFiltersAndSort() {
        // Filter products
        let filteredProducts = filterProducts();
        
        // Sort products
        filteredProducts = sortProducts(filteredProducts);
        
        // Update pagination
        updatePagination(filteredProducts.length);
        
        // Paginate products
        const paginatedProducts = paginateProducts(filteredProducts);
        
        // Render products
        renderProducts(paginatedProducts);
    }
    
    // Filter products based on current filters
    function filterProducts() {
        return products.filter(product => {
            // Category filter
            if (currentFilters.category !== 'all' && product.category !== currentFilters.category) {
                return false;
            }
            
            // Price filter
            if (product.price > currentFilters.maxPrice) {
                return false;
            }
            
            // Rating filter
            if (currentFilters.ratings.length > 0) {
                const productRating = Math.floor(product.rating);
                if (!currentFilters.ratings.includes(productRating)) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    // Sort products based on current sort option
    function sortProducts(products) {
        const sortedProducts = [...products];
        
        switch (currentFilters.sort) {
            case 'price-low':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Default sorting (recommended)
                break;
        }
        
        return sortedProducts;
    }
    
    // Paginate products
    function paginateProducts(products) {
        const startIndex = (currentFilters.page - 1) * PRODUCTS_PER_PAGE;
        return products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    }
    
    // Update pagination UI
    function updatePagination(totalProducts) {
        const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
        
        // Update prev and next buttons
        prevPageBtn.disabled = currentFilters.page <= 1;
        nextPageBtn.disabled = currentFilters.page >= totalPages;
        
        // Generate page numbers
        pageNumbers.innerHTML = '';
        
        // If there are no products, show page 1
        if (totalPages === 0) {
            const span = document.createElement('span');
            span.className = 'active';
            span.textContent = '1';
            pageNumbers.appendChild(span);
            return;
        }
        
        // Generate page numbers with proper display logic (show first, last, and around current page)
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // First page
                i === totalPages || // Last page
                (i >= currentFilters.page - 1 && i <= currentFilters.page + 1) // Pages around current
            ) {
                const span = document.createElement('span');
                span.textContent = i;
                if (i === currentFilters.page) {
                    span.className = 'active';
                }
                
                span.addEventListener('click', () => changePage(i));
                pageNumbers.appendChild(span);
            } else if (
                (i === currentFilters.page - 2 && currentFilters.page > 3) ||
                (i === currentFilters.page + 2 && currentFilters.page < totalPages - 2)
            ) {
                // Add ellipsis
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'ellipsis';
                pageNumbers.appendChild(ellipsis);
            }
        }
    }
    
    // Render products to the grid
    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';
        
        if (productsToRender.length === 0) {
            const noProducts = document.createElement('div');
            noProducts.className = 'no-products';
            noProducts.innerHTML = `
                <p>No products match your filter criteria.</p>
                <button id="resetFilters" class="btn">Reset Filters</button>
            `;
            productGrid.appendChild(noProducts);
            
            // Add event listener to reset button
            document.getElementById('resetFilters').addEventListener('click', resetFilters);
            return;
        }
        
        productsToRender.forEach(product => {
            const productElement = createProductElement(product);
            productGrid.appendChild(productElement);
        });
    }
    
    // Reset all filters
    function resetFilters() {
        // Reset category
        const categories = categoryFilter.querySelectorAll('li');
        categories.forEach(cat => cat.classList.remove('active'));
        categories[0].classList.add('active'); // Select "All Products"
        
        // Reset price
        priceRange.value = 10000;
        priceValue.textContent = '₹10000';
        
        // Reset rating checkboxes
        ratingCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset sort
        sortSelect.value = 'default';
        
        // Reset filter state
        currentFilters = {
            category: 'all',
            maxPrice: 10000,
            ratings: [],
            sort: 'default',
            page: 1
        };
        
        applyFiltersAndSort();
    }
}); 