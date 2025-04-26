const paymentForm = document.getElementById("paymentForm");

if (!paymentForm) {
  throw "Oops! The checkout form isn't loading properly :(";
}

(async () => {
  try {
    const errOutput = document.getElementById("err_output");
    const discountInput = document.getElementById("discountCode");
    const totalAmount = document.getElementById("totalAmount");

    let discountValue = 0;

    // Validate card payment 
    function validateCardDetails() {
      const cardNum = document.getElementById("cardNum").value.replace(/\D/g, "");
      const expDate = document.getElementById("expDate").value;
      const cvv = document.getElementById("cvv").value;

      const cardRegex = /^\d{16}$/; 
      const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
      const cvvRegex = /^\d{3,4}$/; 

      if (!cardRegex.test(cardNum)) return "Invalid card number format.";
      if (!dateRegex.test(expDate)) return "Invalid expiration date format (MM/YYYY).";
      if (!cvvRegex.test(cvv)) return "Invalid CVV format.";

      return null;
    }

    // Apply discount
    discountInput.addEventListener("input", async () => {
      const discountCode = discountInput.value.trim();
      if (discountCode.length < 3) return;

      const response = await fetch(`/discounts/apply?code=${discountCode}`);
      const result = await response.json();

      if (response.ok) {
        discountValue = result.discountAmount;
        totalAmount.innerText = `$${result.newTotal.toFixed(2)}`;
      } else {
        discountValue = 0;
        totalAmount.innerText = `$${result.originalTotal.toFixed(2)}`;
      }
    });

    // Handle checkout
    paymentForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const validationError = validateCardDetails();
      if (validationError) {
        alert(validationError);
        return;
      }

      const paymentData = {
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
        discountCode: discountInput.value,
        discountApplied: discountValue
      };

      const response = await fetch("/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`Error: ${result.error || "Payment failed."}`);
      }

      alert("Payment Successful! Your order has been placed.");
    });

  } catch (error) {
    console.error("Payment Error:", error);
    errOutput.innerHTML += `<p>${error}</p>`;
  }
})();