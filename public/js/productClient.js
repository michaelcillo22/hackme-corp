// Get our product-form
const productForm = document.getElementById("createProductForm");

if (productForm) {

  // Store references to our elements as stated in assignment
  const errOutput = document.getElementById("err_output");

  // Add our event listener
  productForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    // Log our current status
    console.log("Woohoo! Serve route is processing :D");

    // Clear the error message if any
    errOutput.innerHTML = "";

    // Utilize FormData to obtain product info input
    const productFormData = new FormData(productForm)
    const productData = {
      category: productFormData.get('category'),
      vendor: productFormData.get('vendor'),
      name: productFormData.get('name'),
      description: productFormData.get('description'),
      price: productFormData.get('price'),
      // Assume photos are entered as a comma-separated list
      photos: productFormData.get('photos').split(',').map(url => url.trim()),
      condition: productFormData.get('condition'),
      status: productFormData.get('status')
    }

    try {

      // AJAX: Send POST to server route for createProduct
      const productResponse = await fetch('/products/createproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      // Store our result
      const productResult = await productResponse.json();

      // Now we update the page with result or handle errors
      const resultDiv = document.getElementById('productResult');
      
      // If product could not be created, throw error
      if (!productResponse.ok) {
        resultDiv.innerText = "Error: " + productResult.error;
      } else {

        // Redirect to home product page
        window.location.href = "/products";

        // Ensure to reset form upon analysis completion
        productForm.reset();
      }

    } catch (error) {
      console.error("AJAX Error:", error);
      errOutput.innerHTML += `<p>${error}</p>`;
      
      // Ensure to reset form upon analysis completion
      productForm.reset();
    }
  });
}