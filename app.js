function animateMenu() {
  const menu = document.getElementsByClassName("nav-bar");
  return Array.from(menu).forEach(item => {
    console.log(item);
    item.classList.toggle("change");
    // See if container or individual bars need to have class name changed
  });
  // dropMenu()
}

// function dropMenu() {
//   const menu = document.getElementById("drop-down-menu");
//   console.log(menu);
//   menu.classList.toggle("active-menu");
// }

document
  .getElementById("menu-icon-container")
  .addEventListener("click", animateMenu);
