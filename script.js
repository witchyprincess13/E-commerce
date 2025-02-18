document.addEventListener('DOMContentLoaded', () => {
    const menu = [
        { id: 1, name: 'Pizza', price: 10, image: 'assets/pizza.jpg' },
        { id: 2, name: 'Burger', price: 8, image: 'assets/burger.jpg' },
        { id: 3, name: 'Pasta', price: 12, image: 'assets/pasta.jpg' },
        { id: 4, name: 'Sushi', price: 15, image: 'assets/sushi.jpg' },
        { id: 5, name: 'Salad', price: 7, image: 'assets/salad.jpg' },
        { id: 6, name: 'Steak', price: 20, image: 'assets/steak.jpg' },
        { id: 7, name: 'Tacos', price: 9, image: 'assets/taco.jpg' },
        { id: 8, name: 'Ice Cream', price: 5, image: 'assets/ice cream.jpg' },
        { id: 9, name: 'Sandwich', price: 6, image: 'assets/sandwich.jpg' },
        { id: 10, name: 'Fries', price: 4, image: 'assets/fries.jpg' }
    ];

    const cart = [];
    const user = {
        name: 'Ottis',
        address: '123 Main Street'
    };
    const FREE_DELIVERY = 0;
    const GST_RATE = 0.05; // 5% GST

    const menuItemsContainer = document.getElementById('menu-items');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotals = document.getElementById('cart-totals');
    const placeOrderButton = document.getElementById('place-order-button');
    const sidebar = document.getElementById('sidebar');
    const cartSection = document.getElementById('cart');
    const checkoutSection = document.getElementById('checkout');
    const applyCouponButton = document.getElementById('apply-coupon');
    const couponInput = document.getElementById('coupon');
    const checkoutForm = document.getElementById('checkout-form');
    const progressSteps = document.querySelectorAll('.progress-step');

    // Autofill user information
    document.getElementById('name').value = user.name;
    document.getElementById('address').value = user.address;

    // Display menu items
    menu.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>Price: $${item.price}</p>
            <div class="quantity-controls">
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <span id="quantity-${item.id}">1</span>
                <button onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <button onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        menuItemsContainer.appendChild(menuItem);
    });

    // Increase quantity
    window.increaseQuantity = function (id) {
        const quantityElement = document.getElementById(`quantity-${id}`);
        let quantity = parseInt(quantityElement.textContent);
        quantity++;
        quantityElement.textContent = quantity;
    };

    // Decrease quantity
    window.decreaseQuantity = function (id) {
        const quantityElement = document.getElementById(`quantity-${id}`);
        let quantity = parseInt(quantityElement.textContent);
        if (quantity > 1) {
            quantity--;
        }
        quantityElement.textContent = quantity;
    };

    // Add item to cart
    window.addToCart = function (id) {
        const item = menu.find(menuItem => menuItem.id === id);
        const quantity = parseInt(document.getElementById(`quantity-${id}`).textContent);
        const cartItem = { ...item, quantity };
        const existingCartItem = cart.find(cartItem => cartItem.id === id);

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            cart.push(cartItem);
        }

        updateCartSummary();
        openSidebar();
    };

    // Remove item from cart
    window.removeFromCart = function (id) {
        const index = cart.findIndex(cartItem => cartItem.id === id);
        if (index !== -1) {
            cart.splice(index, 1);
        }
        updateCartSummary();
    };

    // Apply coupon
    applyCouponButton.addEventListener('click', () => {
        const couponCode = couponInput.value;
        // Add your coupon logic here
        // For simplicity, let's assume the coupon gives a 10% discount
        let discount = 0.1;

        const totalBeforeDiscount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const discountAmount = totalBeforeDiscount * discount;
        const totalAfterDiscount = totalBeforeDiscount - discountAmount;

        const gst = totalAfterDiscount * GST_RATE;
        const total = totalAfterDiscount + gst + FREE_DELIVERY;

        cartTotals.innerHTML = `
            <p>Subtotal: $${totalBeforeDiscount.toFixed(2)}</p>
            <p>Discount: -$${discountAmount.toFixed(2)}</p>
            <p>GST: $${gst.toFixed(2)}</p>
            <p>Delivery: $${FREE_DELIVERY.toFixed(2)}</p>
            <h3>Total: $${total.toFixed(2)}</h3>
        `;
    });

    // Update cart summary
    function updateCartSummary() {
        cartSummary.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price}</p>
                </div>
                <div class="cart-item-controls">
                    <span>Quantity: ${item.quantity}</span>
                    <button onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
            cartSummary.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        const gst = total * GST_RATE;
        const finalTotal = total + gst + FREE_DELIVERY;

        cartTotals.innerHTML = `
            <p>Subtotal: $${total.toFixed(2)}</p>
            <p>GST: $${gst.toFixed(2)}</p>
            <p>Delivery: $${FREE_DELIVERY.toFixed(2)}</p>
            <h3>Total: $${finalTotal.toFixed(2)}</h3>
        `;
    }

    // Open sidebar and show cart
    function openSidebar() {
        sidebar.style.display = 'block';
        cartSection.style.display = 'block';
        checkoutSection.style.display = 'none';
    }

    // Show checkout section when "Place Order" button is clicked
    placeOrderButton.addEventListener('click', () => {
        cartSection.style.display = 'none';
        checkoutSection.style.display = 'block';
        updateProgress('payment');
    });

    // Handle checkout form submission
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const payment = document.getElementById('payment').value;
        const tip = document.getElementById('tip').value;

        alert(`Your food is on the way. Thank you for ordering!\nName: ${name}\nAddress: ${address}\nPayment: ${payment}\nTip: $${tip}`);
        // You can add more actions here, such as sending the order to a server

        // Reset the progress indicator
        updateProgress('shipping');
    });

    // Update progress indicator
    function updateProgress(step) {
        progressSteps.forEach(progressStep => {
            progressStep.classList.remove('active');
            if (progressStep.id === `step-${step}`) {
                progressStep.classList.add('active');
            }
        });
    }
});
