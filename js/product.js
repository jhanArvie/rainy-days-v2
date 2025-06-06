// Fetch and display the product based on ID
async function fetchAndDisplayProduct(productId) {
    try {
        const response = await fetch(`https://api.noroff.dev/api/v1/rainy-days/${productId}`);
        
        if (!response.ok) {
            throw new Error('Product not found'); // Handle non-200 responses
        }
        
        const product = await response.json();
        displayProduct(product);
    } catch (error) {
        displayErrorMessage("Failed to load product. Please check your internet connection or try again later.");
    }
}

// Display the product details in the DOM
function displayProduct(product) {
    const productImage = document.querySelector('.product-img-container img');
    const saleText = document.querySelector('.sale-txt');
    const productTitle = document.querySelector('.product-information h1');
    const productPrice = document.querySelector('.product-information h2');
    const sizeDropdown = document.querySelector('.select-size');
    const productQuantity = document.querySelector('.quantity');
    const productDescription = document.querySelector('.description');
    const baseColorElement = document.querySelector('.base-color span');
    const tagsElement = document.querySelector('.tag-product span');

    productImage.src = product.image;
    productImage.alt = product.title;
    //easiest way to add a sale display if product is on sale from api or not 
    saleText.style.display = product.onSale ? 'block' : 'none'; 
    productTitle.textContent = product.title;
    //other way that if else for displaying product price if onSale
    productPrice.textContent = `Kr ${product.onSale ? product.discountedPrice : product.price}`;
    productDescription.textContent = product.description;

    baseColorElement.textContent = product.baseColor;
    tagsElement.textContent = product.tags.join(', '); //.join('') is to convert array into a single string, with each element separated by a ,space.

    sizeDropdown.innerHTML = product.sizes.map(size => `<option value="${size}">${size}</option>`).join('');

    const cart = getCart();  //Funtion from nav.js - Get the cart from local storage
    const cartItemId = generateCartItemId(product.id, sizeDropdown.value);
    //productQuantity.textContent = localstorage[key]?.value
    // ? - chaining operator that checks if localstorage[key] exist.. if yes return the value if not the return undefine || if undefined then return 0
    productQuantity.textContent = cart[cartItemId]?.quantity || 0;

    addIncrementDecrementListeners(product, cart);
}

// Generate unique cart item ID
function generateCartItemId(productId, size) {
    return `${productId}_${size}`;
}

// Add event listeners for increment and decrement buttons
function addIncrementDecrementListeners(product, cart) {
    const incrementButton = document.querySelector('.fa-plus');
    const decrementButton = document.querySelector('.fa-minus');
    const sizeDropdown = document.querySelector('.select-size');
    const productQuantity = document.querySelector('.quantity');

    incrementButton.addEventListener('click', () => {
        const selectedSize = sizeDropdown.value;// will return the selected value in select element
        const cartItemId = generateCartItemId(product.id, selectedSize);

        //localstorage key[value] = key[value] or {}  If the entry doesn't already exist, it creates a new one with initial values.
        cart[cartItemId] = cart[cartItemId] || { ...product, quantity: 0, selectedSize: selectedSize };
        /* after adding the quantity value ,,, add 1 */
        cart[cartItemId].quantity++;
        saveCart(cart);  // Save cart and update cartAmount
        productQuantity.textContent = cart[cartItemId].quantity;
    });

    decrementButton.addEventListener('click', () => {
        const selectedSize = sizeDropdown.value;
        const cartItemId = generateCartItemId(product.id, selectedSize);

        if (cart[cartItemId] && cart[cartItemId].quantity > 0) {
            cart[cartItemId].quantity--;
            if (cart[cartItemId].quantity === 0) {
                delete cart[cartItemId]; // Remove product from cart if quantity is 0
            }
            saveCart(cart);  // Save cart and update cartAmount
            productQuantity.textContent = cart[cartItemId]?.quantity || 0;
        }
    });
        //Update the displayed quantity of a product based on the size selected by the user.
    sizeDropdown.addEventListener('change', () => {
        const selectedSize = sizeDropdown.value;
        const cartItemId = generateCartItemId(product.id, selectedSize);
        productQuantity.textContent = cart[cartItemId]?.quantity || 0;
    });
}

// Display an error message in the DOM
function displayErrorMessage(message) {
    const productContainer = document.querySelector('.product-container-message');
    productContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

// Fetch and display the product when the page loads
window.addEventListener('load', () => {
    const queryParams = new URLSearchParams(window.location.search);
    const productId = queryParams.get('id');

    if (productId) {
        fetchAndDisplayProduct(productId);
    } else {
        displayErrorMessage("No product selected. Please select a product from the homepage.");
    }
});
