// index.js
const axios = require('axios');

// Define the base URL for Open Food Facts API
const API_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

async function findFoodByLocation(location) {
    try {
        // Make a GET request to the Open Food Facts API with the location as search query
        const response = await axios.get(API_URL, {
            params: {
                search_terms: location,
                json: true,
            },
        });

        // Log the food data
        if (response.data.products && response.data.products.length > 0) {
            console.log(`Food items available in or related to '${location}':`);
            let data = [];

            response.data.products.forEach(item => {
                const productName = item.product_name || 'Unknown product';
                const brand = item.brands || 'Unknown brand';
                const image = item.image_url || 'No image';
                const quantity = item.quantity || 'Unknown quantity';
                const stores = item.stores || 'Unknown stores';
                const countries = item.countries_tags ? item.countries_tags.join(', ') : 'Unknown countries';
                
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
                        countries: countries
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

const location = 'Sacramento';
findFoodByLocation(location)
.then(data => {
    console.log(data);
});

