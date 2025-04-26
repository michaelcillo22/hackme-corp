// Get cart elements
const cartForm = document.getElementById("shoppingCartForm");

if (!cartForm) {
  throw "Oh no! The cart form is having trouble loading :(";
}

(async () => {
  try {
    const errOutput = document.getElementById("err_output");

    // AJAX: Get items
    const cartResponse = await fetch('/cart/items');

    if (!cartResponse.ok) {
      throw new Error(`Error: ${cartResponse.statusText}`);
    }

    const cartItems = await cartResponse.json();
    const cartList = document.getElementById("cartList");
    const cartTotal = document.getElementById("cartTotal");

    // Update cart
    function updateCart() {
      cartList.innerHTML = ""; 
      let total = 0;

      cartItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.dataset.productId = item.productId;
        listItem.dataset.price = item.price;
        
        listItem.innerHTML = `
          ${item.name} - $${item.price} x 
          <span class="quantity">${item.quantity}</span>
          <button class="update-quantity" data-product-id="${item.productId}">Update</button>
          <button class="remove-item" data-product-id="${item.productId}">Remove</button>
        `;
        
        cartList.appendChild(listItem);
        total += item.price * item.quantity;
      });

      cartTotal.innerText = `$${total.toFixed(2)}`;
    }

    updateCart();

    // Event Listener for adding items to cart
    cartForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const productId = document.getElementById("product").value;
      const quantity = document.getElementById("quantity").value;
      const userId = '{{userId}}';

      const response = await fetch('/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart.");
      }

      alert("Item added successfully!");
      cartItems.push({ productId, quantity });
      updateCart();
    });

  } catch (error) {
    console.error("AJAX Error:", error);
    errOutput.innerHTML += `<p>${error}</p>`;
  }
})();