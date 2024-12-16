
let cart = [];
let favorites = {};

// Function to add items to the cart
function addToCart(item, price, quantity) {
  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) {
    alert("Please enter a valid quantity!");
    return;
  }

  const existingItem = cart.find(product => product.name === item);
  if (existingItem) {
    existingItem.quantity += qty;
  }
  else {
    cart.push({name: item, price, quantity: qty});
  }
  updateCart();

  // Reset quantity input back to 1 after adding to cart
  const quantityInput = document.getElementById(`quantity-${item.split(' ')[0].toLowerCase()}`);
  quantityInput.value = 1;

  alert(`${item} added to the cart successfully!`);
}

// Function to update the cart display
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalPrice = document.getElementById('total-price');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((product, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>
        <input type="number" min="1" value="${product.quantity}" 
               onchange="updateQuantity(${index}, this.value)">
      </td>
      <td>${(product.price * product.quantity).toFixed(2)}</td>
      <td>
        <button onclick="removeItem(${index})">Remove</button>
      </td>
    `;
    cartItems.appendChild(row);
    total += product.price * product.quantity;
  });

  totalPrice.textContent = `Rs. ${total.toFixed(2)}`;
}

// Function to update the quantity of an item
function updateQuantity(index, newQuantity) {
  const quantity = parseInt(newQuantity, 10);
  if (quantity > 0) {
    cart[index].quantity = quantity;
    updateCart();
  } else {
    alert("Quantity must be at least 1");
    updateCart();
  }
}

// Function to remove an item from the cart
function removeItem(index) {
  cart.splice(index, 1); // Remove the item at the given index
  updateCart();
}

// Proceed to the order page
function proceedToOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty. Add items to proceed.");
    return;
  }
  // Save cart to local storage for the order page
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.href = 'Order.html'; // Navigate to the order page
}

// Load cart details on the order page
function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cart = JSON.parse(storedCart);
      displayOrder();
    }
}
  
function displayOrder() {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    orderItems.innerHTML = '';
    let total = 0;
  
    cart.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>${product.price * product.quantity}</td>
      `;
      orderItems.appendChild(row);
      total += product.price * product.quantity;
    });
  
    orderTotal.textContent = `Rs. ${total.toFixed(2)}`;
}

// Save current order to favorites
function addToFavorites() {
    localStorage.setItem('favorites', JSON.stringify(cart));
    alert('Favorites saved!');
}
  
// Apply favorites to current order
function applyFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      cart = JSON.parse(savedFavorites);
      displayOrder();
    } else {
      alert('No favorites found!');
    }
}

function handlePayment(event) {
    event.preventDefault();
  
    const fullName = document.getElementById("full-name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const postalCode = document.getElementById("postal-code").value.trim();
    const country = document.getElementById("city").value.trim();
    const cardType = document.getElementById("card-type").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();
    const expireMonth = parseInt(document.getElementById("expire-month").value, 10);
    const expireYear = parseInt(document.getElementById("expire-year").value, 10);
    const cvv = document.getElementById("cvv").value.trim();
  
    if (!fullName || !phone || !email || !address || !postalCode || !city || !cardType || !cardNumber || !expireMonth || !expireYear || !cvv) {
      showAlert("Please complete all fields!", "error");
      return;
    }
  
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      showAlert("Invalid phone number!", "error");
      return;
    }
  
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      showAlert("Invalid card number!", "error");
      return;
    }
  
    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
      showAlert("Invalid CVV!", "error");
      return;
    }
  
    if (expireMonth < 1 || expireMonth > 12 || expireYear < new Date().getFullYear()) {
      showAlert("Invalid expiration date!", "error");
      return;
    }
  
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const formattedDate = deliveryDate.toLocaleDateString();
  
    showAlert(`Thank you, ${fullName}! Your order will arrive on ${formattedDate}. A confirmation with your delivery details have been sent to your email (${email}).`, "success");

    // Hide the form
    const formSection = document.getElementById("order-form");
    formSection.style.display = "none";

    // Display confirmation message
    const confirmationMessage = document.createElement("div");
    confirmationMessage.className = "confirmation";
    confirmationMessage.innerHTML = `
    <p>Your order has been placed successfully.</p>
    <p>We appreciate you choosing us and look forward to serving you again!</p>
    `;
    const footer = document.querySelector("footer"); 
    document.body.insertBefore(confirmationMessage, footer);
}
  
function showAlert(message, type) {
    const alertBox = document.createElement("div");
    alertBox.className = `alert ${type}`;
    alertBox.innerText = message;
    document.body.appendChild(alertBox);
  
    setTimeout(() => {
      alertBox.remove();
    }, 4000);
}
  
  
// Load cart on order page
document.addEventListener('DOMContentLoaded', loadCartFromStorage);
  