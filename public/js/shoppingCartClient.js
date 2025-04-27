document.addEventListener("DOMContentLoaded", async () => {
    const cartForm = document.getElementById("shoppingCartForm");
    const cartList = document.getElementById("cartList");
    const cartTotal = document.getElementById("cartTotal");
    const errOutput = document.getElementById("err_output");

    let cartItems = [];  
    let userId = null;  

    // Helper Functions
    const showError = (message) => {
        errOutput.innerHTML = `<p>${message}</p>`;
    };

    // Fetch the user ID 
    async function fetchUserId() {
        try {
            const response = await fetch('/api/user');
            if (response.ok) {
                const data = await response.json();
                userId = data.userId;  
                fetchCartData();  // Proceed to fetch the cart data after getting the user ID
            } else {
                console.error("User is not authenticated.");
                showError("Please log in to view your cart.");
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
            showError("Error authenticating user.");
        }
    }

    // Fetch cart data from the server
    async function fetchCartData() {
        if (!userId) {
            showError("User not authenticated.");
            return;
        }

        try {
            const response = await fetch(`/cart/${userId}`);
            if (response.ok) {
                const cartData = await response.json();
                cartItems = cartData.items;
                updateCart();
            } else {
                console.error("Error fetching cart data.");
                showError("Unable to load cart data.");
            }
        } catch (error) {
            console.error("Failed to fetch cart from server:", error);
            showError("Error fetching cart data.");
        }
    }

    fetchUserId();  

    // get products for the select dropdown
    async function fetchProducts() {
        try {
            const response = await fetch("/products");
            if (response.ok) {
                const products = await response.json();
                const productSelect = document.getElementById("product");

                if (products.length === 0) {
                    showError("No products available.");
                }

                products.forEach(product => {
                    const option = document.createElement("option");
                    option.value = product._id;
                    option.textContent = `${product.name} - $${product.price}`;
                    productSelect.appendChild(option);
                });
            } else {
                showError("Error fetching product data.");
            }
        } catch (error) {
            showError("Error fetching product data.");
            console.error("Error fetching products:", error);
        }
    }

    fetchProducts();

    // Update the cart display on the frontend
    const updateCart = () => {
        cartList.innerHTML = "";
        let total = 0;

        if (cartItems.length === 0) {
            cartList.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            cartItems.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
                cartList.appendChild(listItem);
                total += item.price * item.quantity;
            });
        }

        cartTotal.innerText = `$${total.toFixed(2)}`;
    };

    // Add item to cart
    cartForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const productId = document.getElementById("product").value;
        const quantity = Number(document.getElementById("quantity").value);

        if (!productId || isNaN(quantity) || quantity <= 0) {
            return showError("Please select a valid product and quantity.");
        }

        if (!userId) {
            return showError("User not authenticated.");
        }

        try {
            const response = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    productId: productId,
                    quantity: quantity,
                }),
            });

            if (response.ok) {
                const updatedCartData = await response.json();
                cartItems = updatedCartData.cartItems;
                updateCart();
            } else {
                showError("Error adding product to cart.");
            }
        } catch (error) {
            showError("Error adding product to cart.");
            console.error("Error adding product to cart:", error);
        }
    });
});