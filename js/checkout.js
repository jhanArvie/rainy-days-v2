// Retrieve cart data from local storage
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let arrayCart = Object.values(cart);

// Calculate the total quantity of items in the cart
function getTotalQuantity() {
    return arrayCart.reduce((sum, item) => sum + item.quantity, 0);
}

// Calculate the total price of all items in the cart
function getTotalPrice() {
    return arrayCart.reduce((sum, item) => {
        const price = item.onSale ? item.discountedPrice : item.price;
        return sum + (price * item.quantity);
    }, 0);
}

// Display the total quantity of items in the basket
function displayTotalQuantity() {
    const basketItemsElement = document.getElementById('basketItems');
    const totalQuantity = getTotalQuantity();
    basketItemsElement.textContent = `${totalQuantity} item${totalQuantity !== 1 ? 's' : ''}`; // 1 item or 2+ items
}

// Display the total quantity of items in the nav cart
function updateNavCartQuantity() {
    const navCartQuantityElement = document.querySelector('.cartAmount');
    const totalQuantity = getTotalQuantity();
    navCartQuantityElement.textContent = totalQuantity;
}

// Update the total price in the summary section
function updateTotalPrice() {
    const totalPrice = getTotalPrice();
    const basketTotalElement = document.getElementById('basketTotal');
    basketTotalElement.textContent = totalPrice.toFixed(2);
    updateTaxTotal(); // Call this to update the tax total when the price is updated
}

// Show or hide the empty cart notice
function updateEmptyCartNotice() {
    const emptyCartNotice = document.querySelector('.empty-cart-notice');
    const totalQuantity = getTotalQuantity();
    emptyCartNotice.style.display = totalQuantity === 0 ? 'block' : 'none';
}

// Update the cart in local storage
function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update the product in the cart based on the product key
function updateCartProduct(productKey, quantityChange) {
    if (cart[productKey]) {
        cart[productKey].quantity += quantityChange;
        
        if (cart[productKey].quantity <= 0) {
            delete cart[productKey];
        }

        updateLocalStorage();
        arrayCart = Object.values(cart); // Update arrayCart after modification
    }
}

// Update the tax total in the summary section
function updateTaxTotal() {
    const taxPercentageElement = document.getElementById('taxPercentage');
    const basketTotalElement = document.getElementById('basketTotal');
    const taxTotalElement = document.getElementById('taxTotal');

    // Get the tax percentage and basket total
    const taxPercentage = parseFloat(taxPercentageElement.textContent.replace('%', '')) / 100;
    const basketTotal = parseFloat(basketTotalElement.textContent);

    // Calculate the tax total
    const taxTotal = basketTotal * taxPercentage;

    // Update the tax total element
    taxTotalElement.textContent = taxTotal.toFixed(2);
}

// Product in cart DOM ----------------------------------------------------------------------------
function cartDisplayDOM() {
    const cartDOM = document.getElementById("cartDOM");
    cartDOM.innerHTML = ''; // Clear previous content

    arrayCart.forEach((product) => {
        const cartContainer = document.createElement('div');
        cartContainer.classList.add('product-container-checkout');

        // Determine the correct price depending on whether the product is on sale
        const price = product.onSale ? product.discountedPrice : product.price;
        // Calculate the total by multiplying the price by the quantity
        const total = price * product.quantity;
        let productKey = product.id + "_" + product.selectedSize;

        cartContainer.innerHTML = `
            <div class="prod-details-checkout" id="${productKey}">
                <div class="prod-img-checkout">
                    ${product.onSale ? '<h2 class="cart-sale-text">SALE</h2>' : ''}
                    <img src="${product.image}" alt="${product.title}" />
                </div>
                <div class="product-details">
                    <h3>${product.title}</h3>
                    <p>Size - <span id="sizeCheckout">${product.selectedSize}</span></p>
                    <p>${product.gender}</p>
                </div>
            </div>
            <div class="item-price">Kr ${price.toFixed(2)}</div>
            <div class="item-quantity" id="amountCheckout">
                <button class="minu-cart">-</button>
                <span id="perProductQuantity">${product.quantity}</span>
                <button class="add-cart">+</button>
            </div>
            <div class="item-total" id="productSum">Kr ${total.toFixed(2)}</div>
        `;

        cartDOM.appendChild(cartContainer);

        // Event listeners for decrementing and incrementing quantity
        cartContainer.querySelector('.minu-cart').addEventListener('click', () => {
            updateCartProduct(productKey, -1);
            refreshCartDisplay();
        });

        cartContainer.querySelector('.add-cart').addEventListener('click', () => {
            updateCartProduct(productKey, 1);
            refreshCartDisplay();
        });
    });
}

// Function to calculate and update the payment total
function updatePaymentTotal() {
    const basketTotalElement = document.getElementById('basketTotal');
    const shippingCostElement = document.getElementById('shippingCost');
    const taxTotalElement = document.getElementById('taxTotal');
    const paymentTotalElement = document.getElementById('paymentTotal');

    // Set shipping cost based on cart items
    const totalQuantity = getTotalQuantity();
    const shippingCost = totalQuantity > 0 ? 100.00 : 0.00;
    shippingCostElement.textContent = shippingCost.toFixed(2);

    // Get the basket total and tax total
    const basketTotal = parseFloat(basketTotalElement.textContent);
    const taxTotal = parseFloat(taxTotalElement.textContent);

    // Calculate the payment total
    const paymentTotal = basketTotal + shippingCost + taxTotal;

    // Update the payment total element
    paymentTotalElement.textContent = paymentTotal.toFixed(2);

    // Enable or disable the confirm button based on cart status
    const confirmCartBtn = document.getElementById('confirmCartBtn');
    confirmCartBtn.style.pointerEvents = totalQuantity > 0 ? 'auto' : 'none';
    confirmCartBtn.style.opacity = totalQuantity > 0 ? '1' : '0.5';
}

// Update the total price and payment total when the cart is refreshed
function refreshCartDisplay() {
    displayTotalQuantity();
    updateNavCartQuantity();
    updateTotalPrice(); // Update the total price when the cart is refreshed
    updateEmptyCartNotice();
    cartDisplayDOM();
    updatePaymentTotal(); // Update the payment total when the cart is refreshed
}

// Clear the cart in local storage after confirming the order
function clearCartAfterConfirmation() {
    const confirmCartBtn = document.getElementById('confirmCartBtn');
    confirmCartBtn.addEventListener('click', () => {
        cart = {}; // Clear the cart object
        updateLocalStorage(); // Update the local storage
        refreshCartDisplay(); // Refresh the display
    });
}

// Call functions to update the basket items count, empty cart notice, and payment total when the page loads
window.addEventListener('load', () => {
    refreshCartDisplay();
    clearCartAfterConfirmation(); // Set up the event listener for clearing the cart
});
