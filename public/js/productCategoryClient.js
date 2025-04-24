// Get our categories and subcategories for products
const productForm = document.getElementById("createProductForm");

// If the form won't catch
if (!productForm) {
  throw "Oh no! The form is having trouble loading :(";
}

(async () => {f
  try {
    // Store references to our elements as stated in assignment
    const errOutput = document.getElementById("err_output");

    // AJAX: Send GET to server route for getting categories
    const productCategory = await fetch('/categories');

    // Now we update the page with result or handle errors
    const resultDiv = document.getElementById('productResult');
    
    // Store our category results
    const categoryResult = await productCategory.json();

    // If categories could not be fetched, throw error
    if (!productCategory.ok) {
      resultDiv.innerText = "Error: " + categoryResult.error;
    }

    // Get our cat and subcat
    let parentCategories = document.getElementById('category');
    let childCategories = document.getElementById('subCategory');

    // Store our main categories
    let mainCats = []
    for (let cat of categoryResult) {
      if (!cat.parentCategory) {
        mainCats.push(cat);
      }
    }

    // Get our parent categories
    for (let cat of mainCats) {
      parentCategories.append(new Option(cat.categoryName, cat._id));
    }

    // Once the parent category is put, auto change the subcategory selections if any
    parentCategories.addEventListener("change", () => {

      // Set the subcategories inner HTML to the optiond
      childCategories.innerHTML = '<option value="">— Choose Sub-Category —</option>';  

      const parentId = parentCategories.value;

      // If parentCategory is null, meaning no subcategory
      if (!parentId) {
        return childCategories.setAttribute("disabled", "");
      }
  
      // Now filter the matches for subcategories
      for (let child of categoryResult) {
        if (child.parentCategory && child.parentCategory.id === parentId) {
          childCategories.append(new Option(child.categoryName, child._id));
        }
      }

      // Ensure to remove the disabled attribute
      childCategories.removeAttribute("disabled");
    });

  } catch (error) {
      console.error("AJAX Error:", error);
      errOutput.innerHTML += `<p>${error}</p>`;
      
      // Ensure to reset form upon analysis completion
      productForm.reset();
  } 
})();