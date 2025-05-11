// Homepage functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get featured products container
    const featuredProductsContainer = document.getElementById('featuredProducts');
    
    // Display featured products (randomly selected from all products)
    function displayFeaturedProducts() {
        // Shuffle products array and select first 4
        const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
        const featuredProducts = shuffledProducts.slice(0, 4);
        
        // Create product elements and append to container
        featuredProducts.forEach(product => {
            const productElement = createProductElement(product);
            featuredProductsContainer.appendChild(productElement);
        });
    }
    
    displayFeaturedProducts();
}); 