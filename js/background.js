var elem = document.querySelector(".background");
var params = {width: "100%", height: "100%"}
var two = new Two(params).appendTo(elem);

var x_am = 15;
var y_am = 15;
var interval = 30;

var total = 0;

var mouse_x = 0;
var mouse_y = 0;

var circles = [];

for (let y = 0; y < y_am; y++) {
	
	for (let x = 0; x < x_am; x++) {
	
		let shape = two.makeRectangle(x_am + x * interval, y_am + y * interval, 10, 10);

		shape.fill = `rgb(${x / x_am * 255}, 0, ${y / y_am * 255})`;
		shape.stroke = "none";

		// console.log(shape.fill)

		circles.push({
			
			x,
			y,

			shape
		
		});

	}

}

window.addEventListener("mousemove", e => {

	mouse_x = e.pageX;
	mouse_y = e.pageY;

});

function anim () {

	for (const c of circles) {

		let circle = c.shape;

		circle.translation.add((mouse_x - circle.translation.x) * 0.01 + c.x - x_am / 2 + (Math.random() * 0.01), (mouse_y - circle.translation.y) * 0.01 + c.y - y_am / 2 + (Math.random() * 0.01));
		circle.fill = `rgb(${(c.x / x_am * 255 + total) % 255}, 0, ${(c.y / y_am * 255 + total) % 255})`;

		circle.rotation += c.x * c.y;

	}

	two.update();
	total += 0.25;

	requestAnimationFrame(anim);

}

anim();

two.update();