// Retrieve order details from local storage
document.addEventListener('DOMContentLoaded', () => {
    displayOrderDetails();
    updateCartAmount(); // Update cart amount in nav (should be 0 after order)
});

// Function to display order details
function displayOrderDetails() {
    // Get the saved order from local storage
    const orderDetails = JSON.parse(localStorage.getItem('lastOrder'));
    
    // If no order details exist, show a message
    if (!orderDetails || !orderDetails.items || orderDetails.items.length === 0) {
        displayNoOrderMessage();
        return;
    }
    
    // Create the order summary section
    const orderSummarySection = createOrderSummarySection(orderDetails);
    
    // Insert the order summary after the "Check Out for More!" link
    const checkoutLink = document.querySelector('.confirm-hero a');
    if (checkoutLink) {
        checkoutLink.insertAdjacentElement('afterend', orderSummarySection);
    }
}

// Create the order summary section with items
function createOrderSummarySection(orderDetails) {
    const orderSummary = document.createElement('section');
    orderSummary.className = 'order-summary';
    
    // Create the heading
    const heading = document.createElement('h2');
    heading.textContent = 'Your Order Summary';
    orderSummary.appendChild(heading);
    
    // Create the items container
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'order-items';
    
    // Add each item to the container
    orderDetails.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        
        // Create the item content
        itemElement.innerHTML = `
            <div class="order-item-image">
                ${item.onSale ? '<span class="order-item-sale">SALE</span>' : ''}
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="order-item-details">
                <h3>${item.title}</h3>
                <p>S: ${item.selectedSize}</p>
                <p>Q: ${item.quantity}</p>
                <p>Pr: Kr ${(item.onSale ? item.discountedPrice : item.price).toFixed(2)}</p>
            </div>
        `;
        
        itemsContainer.appendChild(itemElement);
    });
    
    orderSummary.appendChild(itemsContainer);
    
    // Add order total
    const totalElement = document.createElement('div');
    totalElement.className = 'order-total';
    totalElement.innerHTML = `
        <p><strong>Total Items:</strong> ${orderDetails.totalQuantity}</p>
        <p><strong>Order Total:</strong> Kr ${orderDetails.totalAmount.toFixed(2)}</p>
    `;
    
    orderSummary.appendChild(totalElement);
    
    return orderSummary;
}

// Display message if no order details found
function displayNoOrderMessage() {
    const confirmHero = document.querySelector('.confirm-hero');
    if (confirmHero) {
        const message = document.createElement('p');
        message.className = 'no-order-message';
        message.textContent = 'No order details available.';
        confirmHero.appendChild(message);
    }
}

// Function to update cart amount in the navigation bar (from nav.js)
function updateCartAmount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const cartAmountElement = document.querySelector(".cartAmount");
    const totalQuantity = Object.values(cart).reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    cartAmountElement.textContent = totalQuantity;
}