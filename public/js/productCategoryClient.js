(async () => {

  // Used for errors
  const errOutput = document.getElementById('err_output');
  // Get our categories and subcategories for products
  const productForm = document.getElementById("createProductForm") || document.getElementById("editProductForm");

  try {

    // Get our category container
    let categoryContainer = document.getElementById('categoryContainer');

    // If the container won't catch
    if (!categoryContainer) {
      throw "Oh no! The container is having trouble loading :(";
    }

    // If the form won't catch
    if (!productForm) {
      throw "Oh no! The form is having trouble loading :(";
    }

    // AJAX: Send GET to server route for getting categories
    const productCategory = await fetch('/categories');

    // Now we update the page with result or handle errors
    const resultDiv = document.getElementById('productResult');
  
    // If categories could not be fetched, throw error
    if (!productCategory.ok) {
      resultDiv.innerText = "Error: Categories could not be loaded :(";
    }

    // Store our category results
    const categoryResult = await productCategory.json();

    // Build our child categories
    let childCat = {};
    for (let cat of categoryResult) {

      // Ensure the category and subcategories are differentiated and exists
      if (cat.parentCategory && cat.parentCategory.id) {
        let parentId = cat.parentCategory.id;
        childCat[parentId] = childCat[parentId] || [];
        childCat[parentId].push(cat);
      }
    }

    // This is needed for auto populating categories
    function autoCategoryDropdown(catOptions, catPlaceholder) {
      let catSelection = document.createElement('select');
      catSelection.name = 'category';
      catSelection.innerHTML = `<option value="">— ${catPlaceholder} —</option>`;
      
      // Add category options
      for (let opt of catOptions) {
          catSelection.add(new Option(opt.categoryName, opt._id));
      }
      return catSelection;
    }

    // Detects if there is a subcategory of a category chosen
    function autoPopulate(cat) {

      // Track our next category dropdown selection
      while ((cat.target.nextSibling)) {
        cat.target.nextSibling.remove();
      }

      const selectedId = childCat[cat.target.value];

      if (!selectedId) {
        throw "Oh no! Invalid category :(";
      }

      // Call our autoCategoryDropdown function
      const childCatSelections = autoCategoryDropdown(selectedId, 'Select Sub-Category');
      
      childCatSelections.addEventListener('change', autoPopulate);

      // Ensure to append childCatSelections
      categoryContainer.appendChild(childCatSelections);
    }

    // Get our parent categories as first dropdown
    let parentCats = categoryResult.filter(
      cat => !cat.parentCategory
    );

    let parentCatSelections = autoCategoryDropdown(parentCats, 'Select Category');

    parentCatSelections.addEventListener('change', autoPopulate);

    categoryContainer.appendChild(parentCatSelections);
  } catch (error) {
      // console.error("AJAX Error:", error);
      errOutput.innerHTML += `<p>${error}</p>`;
      
      // Ensure to reset form upon analysis completion
      productForm.reset();
  } 
})();