console.log('index.js test');
var MAX_HOME_ITEMS = 6;
var categoryArray = [];

$(document).ready(function(){
	initialize();
    // $.ajax({
    //     url: BASE_URL + CATEGORIES
    // }).then(function(data) {
    // 	 populateCategories(data.categories);
    // });
});


function initialize(){
//a
}



function populateCategories(list){
  console.log(list);
  for(var i=0;i<list.length;i++){
    if(list[i].id != -1){
      var category = new Category(list[i].id, list[i].name, list[i].included, list[i].addons);
      categoryArray.push(category);
    }
  }

  for(var j=0;j<categoryArray.length;j++){
  	console.log('add');
    if(j >= MAX_HOME_ITEMS){
      return;
    }
    var $currentRow;
    if(j % 3 == 0){
      var $row = $('<div>', {class: "row"});
      $('#category-container').append($row);
      $currentRow = $row;
    }

    // closures
    (function () {
      var obj = categoryArray[j];
      includedArray = categoryArray[j].included;
      var $category = $('<div>', {class: "home-section one-third column"});
      $category.id = obj.id;
      $category.append($('<div>', {class: "home-section-image-container"}));
      $category.append("<img class='home-section-image' src='img/box.png'>" );
      $category.append("<h3 class='section-title home-section-title'>" + obj.name + "</h3>");
      $currentRow.append($category);
        $category.click(function(){
          window.location= "/order?category=" + $category.id;
        });
    }()); 
  }
}