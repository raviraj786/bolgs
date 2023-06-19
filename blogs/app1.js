const search = () => {
	const searchbox = document.getElementById("search-item").value.toUpperCase();
	const blogitem = document.getElementById("course-list")
	const blogitem1 = document.querySelectorAll(".zbv-blog-04-post")
	const searchby	= document.getElementsByTagName("h3")
	
	for (var i=0; i< searchby.length; i++){
		let match = blogitem1[i].getElementsByTagName('h3')[0];
		
		if(match){
			let textvalue = match.textContent || match.innerHTML
			
			if(textvalue.toUpperCase().indexOf(searchbox) > -1){
				blogitem1[i].style.display = "";
			}
			else {
				blogitem1[i].style.display = "none";
			}
		}
	}
}


//slectedbox


// const categorySelect = document.getElementById('categorySelect').value.toUpperCase();
// const blogList = document.getElementById('course-list');
// const blogitem1 = document.querySelectorAll(".zbv-blog-04-post")
// const blogItems = document.getElementsByTagName('h3');

// categorySelect.addEventListener('change', () => {
//   filterBlogPosts();
// });
// console.log(filterBlogPosts)




// function filterBlogPosts() {
// 	const selectedCategory = categorySelect.value;
// 	console.log(selectedCategory ,categorySelect.value)
 
// for (var i=0; i< blogItems.length; i++){
	
// 	let match = blogitem1[i].getElementsByTagName('h3')[0];
// 	console.log(blogitem1[i])


	
// 	if(match){
// 		let textvalue = match.textContent || match.innerHTML
		
// 		if(textvalue.toUpperCase().indexOf(categorySelect) > -1){
// 			blogitem1[i].style.display = "";
// 		}
// 		else {
// 			blogitem1[i].style.display = "none";
// 		}
// 	}
// }
// }





function getSelectedOption() {
	var selectElement = document.getElementById("categorySelect");
	var selectedOption = selectElement.options[selectElement.selectedIndex];
	
	if (selectedOption.textContent.startsWith("A")) {
	  var optionValue = selectedOption.value;
	  var optionText = selectedOption.textContent;
	  
	  
	  // Display the option value and text in the h3 tag
	  var detailsElement = document.getElementById("course-list");
	  detailsElement.innerHTML = "<h3>" + optionText + "</h3>";
	}
  }


//   <select id="mySelect" onchange="getSelectedOption()">
//   <option value="" disabled selected>Select an option</option>
//   <option value="1">Apple</option>
//   <option value="2">Banana</option>
//   <option value="3">Orange</option>
// </select>

// <div id="details">
//   <h3></h3>
// </div>