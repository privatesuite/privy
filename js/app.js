document.addEventListener("scroll", event => {
	
	var y = window.scrollY;

	if (y > 10) document.querySelector(".app__menu__brand").classList.add("minimized");
	else document.querySelector(".app__menu__brand").classList.remove("minimized");

});
