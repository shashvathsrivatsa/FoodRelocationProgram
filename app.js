// Define the base URL for Open Food Facts API
const API_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

async function findFoodByLocation(location) {
    try {
        // Make a GET request to the Open Food Facts API with the location as search query
        let response = await fetch(`${API_URL}?search_terms=${encodeURIComponent(location)}&json=true`, {
            method: 'GET'
        });

        response = await response.json();

        // Log the food data
        if (response.products && response.products.length > 0) {
            console.log(response);
            let data = [];

            response.products.forEach(item => {
                const productName = item.product_name || 'Unknown product';
                const brand = item.brands || 'Unknown brand';
                const image = item.image_url || 'no-image.png';
                const quantity = item.quantity || 'Unknown quantity';
                const stores = item.stores || 'Unknown stores';
                const countries = item.countries_tags ? item.countries_tags.join(', ') : 'Unknown countries';
                const url = item.url || '';
                
                if (countries.includes("united-states")) {
                    // console.log(`\n- ${productName} by ${brand} (${quantity})`);
                    // console.log(`  Available in stores: ${stores}`);
                    // console.log(`  image: ${image}`);
                    // console.log(`  Found in countries: ${countries}`);stores

                    data.push({
                        productName: productName,
                        brand: brand,
                        image: image,
                        quantity: quantity,
                        stores: stores,
                        countries: countries,
                        url: url,
                    });
                }
            });

            return data;

        } else {
            console.log(`No food items found related to '${location}'.`);
        }
    } catch (error) {
        console.error('Error fetching food data:', error.message);
    }
}

// Sample data
// const data = [
//   {
//     productName: 'Sourdough Round',
//     brand: 'Sacramento Baking Company',
//     image: 'https://images.openfoodfacts.org/images/products/009/816/300/1200/front_en.3.400.jpg',
//     quantity: '24 oz',
//     stores: 'Unknown stores',
//     countries: 'en:united-states, en:world'
//   },
//   {
//     productName: 'Whole Grain Bread',
//     brand: 'Healthy Life',
//     image: 'https://images.openfoodfacts.org/images/products/009/123/456/789/front_en.3.400.jpg',
//     quantity: '16 oz',
//     stores: 'Walmart, Target',
//     countries: 'en:united-states'
//   }
//   // Add more product objects here
// ];

// Function to display search results
function displayProducts() {
    // let location = location.search.split('=')[1];
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('query');

    findFoodByLocation(location).then(data => {

        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query')?.toLowerCase() || '';

        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = ''; // Clear previous results

        // Filter products based on the search query
        const filteredData = data.filter(product => 
            product.productName.toLowerCase().includes(query) || 
            product.brand.toLowerCase().includes(query)
        );

        // Display the filtered products
        filteredData.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.productName}">
                <h2>${product.productName}</h2>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Quantity:</strong> ${product.quantity}</p>
                <p><strong>Stores:</strong> ${product.stores}</p>
                <p><strong>Countries:</strong> ${product.countries}</p>
            `;

            // Add click event listener to the card
            productCard.addEventListener('click', () => {
                window.location.href = product.url;  // Redirect to the product's URL
            });

            resultsContainer.appendChild(productCard);
        });

        // If no results found
        if (filteredData.length === 0) {
            resultsContainer.innerHTML = '<p>No products found.</p>';
        }
    });
}

// Call the function to display products when the page loads
window.onload = displayProducts;
