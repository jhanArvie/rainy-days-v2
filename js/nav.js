// Home and about button functionality-------------------------------------------------------------
// called my nav>ul
const menu = document.querySelector("#menu");
// called my 3dots menu button
const menuButton = document.querySelector(".menu-button");

// function to add an "open" class to #menu when .menu-button is clicked
menuButton.addEventListener("click", function() {
    menu.classList.toggle("open");
});

// Cart functionality------------------------------------------------------------------------------
// Function to retrieve the cart from local storage or create an empty cart
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || {};
}

// Function to save cart to local storage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartAmount(cart);  // Ensure cartAmount is updated whenever the cart is saved
}

// Function to update cart amount in the navigation bar
function updateCartAmount(cart) {
    const cartAmountElement = document.querySelector('.cartAmount');
    // Iterate over the array then calculate the .quantity, initial value 0
    const totalQuantity = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    cartAmountElement.textContent = totalQuantity;
}

// Initialize cart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const cart = getCart();
    updateCartAmount(cart);  // Update cart amount when the page loads
});
