document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.getElementById("cartList");
  const cartTotal = document.getElementById("cartTotal");
  const cartForm = document.getElementById("shoppingCartForm");
  const errOutput = document.getElementById("err-output");

  let cartItems = []; // Initialize cart items

  function updateCart() {
      try {
          cartList.innerHTML = ""; 
          let total = 0;

          cartItems.forEach(({ productId, name, price, quantity }) => {
              const listItem = document.createElement("li");
              listItem.dataset.productId = productId;
              listItem.dataset.price = price;

              listItem.innerHTML = `
                  ${name} - $${price} x 
                  <span class="quantity">${quantity}</span>
                  <button class="update-quantity" data-product-id="${productId}">Update</button>
                  <button class="remove-item" data-product-id="${productId}">Remove</button>
              `;

              cartList.appendChild(listItem);
              total += price * quantity;
          });

          cartTotal.innerText = `$${total.toFixed(2)}`;
      } catch (error) {
          console.error("Error updating cart:", error);
          errOutput.innerHTML += `<p>${error.message}</p>`;
      }
  }

  // Event Listener for Adding Items to Cart
  cartForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      try {
          const productId = document.getElementById("product").value;
          const quantity = Number(document.getElementById("quantity").value);
          const userId = document.getElementById("user-id").value; // Handlebars variable should be injected correctly

          const response = await fetch('/cart/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, productId, quantity }),
          });

          if (!response.ok) {
              throw new Error("Failed to add item to cart.");
          }

          alert("Item added successfully!");
          cartItems.push({ productId, price: 0, quantity }); // Consider fetching actual price
          updateCart();
      } catch (error) {
          console.error("AJAX Error:", error);
          errOutput.innerHTML += `<p>${error.message}</p>`;
      }
  });

  // Initial cart update on page load
  updateCart();
});