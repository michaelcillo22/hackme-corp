document.addEventListener("DOMContentLoaded", () => {
    const paymentForm = document.getElementById("paymentForm");
  
    paymentForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const formData = {
        userId: document.getElementById("userId")?.value, 
        cardNumber: document.getElementById("cardNum").value,
        expirationDate: document.getElementById("expDate").value,
        cvv: document.getElementById("cvv").value,
        billingAddress: {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          state: document.getElementById("state").value,
          zip: document.getElementById("zip").value,
        },
      };
  
      fetch("/checkout/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            alert("Payment Successful! Your order has been placed.");
          } else {
            alert(`Error: ${result.error}`);
          }
        })
        .catch((error) => {
          console.error("Payment error:", error);
          alert("An error occurred while processing the payment.");
        });
    });
  });
