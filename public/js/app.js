function animateMenu() {
  const menu = document.getElementsByClassName("nav-bar");
  return Array.from(menu).forEach(item => {
    item.classList.toggle("change");
    // See if container or individual bars need to have class name changed
  });
  // dropMenu()
}

$(".viewDetails").click(function(e) {
  e.preventDefault();
  $("#bookDetails").removeClass("hideMe");
  $("#book").addClass("hideMe");
});

$(".update-details-button").click(function(e) {
  e.preventDefault();
  // $("#book").addClass("hideMe");
  $("#bookForm").removeClass("hideMe");
});

// $("#viewDetails").click(function() {
//   $("#book").addClass("hideMe");
// });

document
  .getElementById("menu-icon-container")
  .addEventListener("click", animateMenu);
