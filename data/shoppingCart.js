const productContainer = document.querySelector("#productContainer");

function displayProducts() {
  products.forEach(product => {
    productContainer.innerHTML += `
      <div class="product">
        <img src=${product.image} alt=${product.name}>
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

displayProducts();

let cart = [];

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    cart.push(product);
    updateCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(product => product.id !== productId);
  updateCart();
}

function updateCart() {
  const cartContainer = document.querySelector("#cartContainer");
  cartContainer.innerHTML = "";

  cart.forEach(product => {
    cartContainer.innerHTML += `
      <div class="cart-item">
        <h4>${product.name}</h4>
        <p>$${product.price}</p>
        <button onclick="removeFromCart(${product.id})">Remove</button>
      </div>
    `;
  });
}
