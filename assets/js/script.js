var $categorySelect = document.querySelector("#category-select"); //refers to the select form element

$.ajax({
  //we dont need any special parameters to get categories
  url: "https://api.spotify.com/v1/browse/categories",
  headers: {
    //for authorizing logged in user
    'Authorization': 'Bearer ' + access_token
  }
}).then(function (categoriesResponse) {
  //console.log(categoriesResponse);
  var categoriesList = categoriesResponse.categories.items;
  //console.log(categoriesResponse.categories.items);

  categoriesList.forEach(function (category) {
    //for each category we create an option and add it to the category select form element
    var $categoryOption = document.createElement("option");
    $categoryOption.textContent = category.name;
    //console.log(categoriesList.name);
    $categoryOption.setAttribute("data-id", category.id);

    //append to select
    $categorySelect.appendChild($categoryOption);
  });

});