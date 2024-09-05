let productsArray = []; /*  collects my fetch data thats converted to Json */
let cart = JSON.parse(localStorage.getItem('cart')) || {};

// Function to update the cart amount display when page is refreshed
function updateCartAmount() {
    const cartAmountElement = document.querySelector('.cartAmount'); /* cart icon in nav bar */
    const totalQuantity = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    cartAmountElement.textContent = totalQuantity;
}

// Function to save the cart to local storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

async function fetchData() {
    try {
        const response = await fetch('https://api.noroff.dev/api/v1/rainy-days');
        const data = await response.json();
        productsArray = data; // console.log('Fetched Products:', productsArray);
        displayOnSaleProducts(productsArray, 'productsContainerSale');
        displayProducts(productsArray, 'productsContainerGender');
        updateCartAmount();  // Function to update the cart amount display when page is refreshed
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Will generate/return a unique item in local storage with (id_size) data
function generateCartItemId(productId, size) {
    return `${productId}_${size}`;
}


// Displays products in DOM
// Increment and decrement btns in the DOM
function displayProducts(products, containerId) {
    const container = document.getElementById(containerId); /*  productsContainerSale or productsContainerGender */
    container.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('single-product');
        
        // Create unique IDs for each size
        const sizesOptions = product.sizes.map(size => {
            const cartItemId = generateCartItemId(product.id, size); /* Make unique IDs for sameproduct but diff sizes */
            const quantity = cart[cartItemId]?.quantity || 0;  // Retrieve quantity from cart

            return `<option value="${size}">${size} (${quantity})</option>`;
        }).join('');

        productElement.innerHTML = `
            <div class="img-container">
                ${product.onSale ? '<h2 class="sale-txt">SALE</h2>' : ''}
                <a href="../product/index.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.title}" />
                </a>
            </div>
            
            <a href="../product/index.html?id=${product.id}">${product.title}</a>
            <div class="price-size">
                <h3>Kr ${product.onSale ? product.discountedPrice : product.price}</h3>
                <div class="size-dropdown-container">
                    <div class="size-dropdown">
                        <select class="select-size" name"size">
                            ${sizesOptions}
                        </select>
                    </div>
                </div>
            </div>
            <div class="product-amount" data-id="${product.id}">
                <i class="fa-solid fa-minus"></i>
                <div class="quantity">${cart[generateCartItemId(product.id, product.sizes[0])]?.quantity || 0}</div>
                <i class="fa-solid fa-plus"></i>
            </div>
        `;
        container.appendChild(productElement); /* inserted the created child div to parent div */
    });

    //event listeners for increment and decrement buttons
    container.querySelectorAll('.fa-plus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.parentElement.getAttribute('data-id'); /* return the ID of specific product */
            const selectedSize = button.parentElement.previousElementSibling.querySelector('.select-size').value; /* return the selectedSize */
            const cartItemId = generateCartItemId(productId, selectedSize); /* took the value of productID, selectedSize to generate it to local storage when clickd */


            // Ensuring the product_size is in the cart or update
           // cartWithGeneratedID =  cartWithGeneratedID or match all the existing productsID if true add the quantity and selectedSize key and values
            cart[cartItemId] = cart[cartItemId] || { ...productsArray.find(p => p.id === productId), quantity: 0, selectedSize: selectedSize };
            cart[cartItemId].quantity++; /* after adding the quantity KeyboardEvent,,, add 1 to value of it */
            saveCart();                  /* then save it to local storage */
            updateCartAmount();         /* then update the amount in the shopping icon */
            button.previousElementSibling.textContent = cart[cartItemId].quantity; /* targets the elementsibling before this element */
        });
    });

    //event listeners for increment and decrement buttons
    container.querySelectorAll('.fa-minus').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.parentElement.getAttribute('data-id');
            const selectedSize = button.parentElement.previousElementSibling.querySelector('.select-size').value; /* took the value of productID, selectedSize to generate it to local storage when clickd */
            const cartItemId = generateCartItemId(productId, selectedSize);

            if (cart[cartItemId] && cart[cartItemId].quantity > 0) {
                cart[cartItemId].quantity--;
                if (cart[cartItemId].quantity === 0) {
                    delete cart[cartItemId]; // Remove product from cart if quantity is 0
                }
                saveCart();
                updateCartAmount();
                button.nextElementSibling.textContent = cart[cartItemId]?.quantity || 0; /* targets the elementsibling after this element */
            }
        });
    });
}

function displayOnSaleProducts(products, containerId) {
    const onSaleProducts = products.filter(product => product.onSale);
    displayProducts(onSaleProducts, containerId);
}

function filterByGender(gender) {
    let filteredProducts = productsArray;
 
    if (gender !== 'All') { /* "Male or "Female"  is not equal to "All" then filter my products */
        filteredProducts = productsArray.filter(product => product.gender === gender);
    }
    //  All prodcuts are displayed if gender condition aint met
    displayProducts(filteredProducts, 'productsContainerGender');
}

// Function to handle the active button
function setActiveButton(activeButton) {
    const buttons = document.querySelectorAll('.gender-buttons button');
    
    // Remove active class from all buttons
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Add active class to the clicked button
    activeButton.classList.add('active');
}

// Call fetchData and set default active button when the page loads
window.addEventListener('load', () => {
    fetchData();
    document.getElementById('allBtn').classList.add('active'); // Default active button to display my productlist
});

// Event listeners for buttons
document.getElementById('allBtn').addEventListener('click', function () {
    filterByGender('All'); /* All products are displayed if gender condition isn't met */
    setActiveButton(this); /* add active class to this allBtn id when clicked */
});
document.getElementById('maleBtn').addEventListener('click', function () {
    filterByGender('Male'); /* gender parameter is met to display filtered products */
    setActiveButton(this); /* add active class to this allBtn id when clicked */
});
document.getElementById('femaleBtn').addEventListener('click', function () {
    filterByGender('Female'); /* gender parameter is met to display filtered products */
    setActiveButton(this); /* add active class to this allBtn id when clicked */
});
