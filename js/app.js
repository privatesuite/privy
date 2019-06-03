nunjucks.configure({
	
	autoescape: false

});

const proxy = "https://cors-anywhere.herokuapp.com/"
var initialLoad = true;

const URLMap = {

	"/": "index",
	"/issues": "issue",
	"/read": "read"

}

const CategoryMap = {

	2: "features",
	3: "fiction",
	6: "poetry",
	4: "issues",
	5: "news",
	7: "reviews",
	8: "medium",
	9: "physical",
	1: "uncategorized"

}

var posts = [];
var pages = [];
var featured = {};

var footer = "";

function url () {

	if (location.hash.replace("#", "").trim().length === 0) location.hash = "/";
	
	return location.hash.replace("#", "");

}

function path (obj) {

	return new URL(obj.link).pathname;

}

function getPostType (obj) {

	return path(obj).split("/")[1];

}

async function render (file, ctx = {}) {

	if (!footer && file !== "footer") footer = await render("footer");

	return nunjucks.renderString(await (await fetch(`views/${file}.njk`)).text(), {

		include: render, getPostType, path, ...ctx, footer, url

	});

}

async function loadData () {

	if (posts.length === 0) posts = await (await fetch(`${proxy}https://privatesuitemag.com/wp-json/wp/v2/posts`)).json();
	if (pages.length === 0) {
		
		pages = await (await fetch(`${proxy}https://privatesuitemag.com/wp-json/wp/v2/pages`)).json();

		var issues = [];

		for (const page of pages) {

			if (getPostType(page) === "issues" && path(page) !== "/issues/") {

				var issue = document.createElement("a");

				issue.href = `#${path(page)}`;
				issue.innerText = page.title.rendered;

				issues.push({page, issue});

			}

		}

		issues = issues.sort((a, b) => parseInt(path(a.page).split("-")[1]) - parseInt(path(b.page).split("-")[1]));

		for (const is of issues) {
				
			document.querySelector(".app__menu__issues").appendChild(is.issue);

		}

	}

	for (const article of [...pages, ...posts]) {
		
		if (article.acf.featured) featured = article;

	}

}

async function scriptify (el) {

	for (const child of el.children) {

		if (child.tagName.toLowerCase() === "script") {

			var clone = child.cloneNode();
			child.remove();
			
			var script = await (await fetch(clone.src)).text();
			eval(script);

		} else {

			if (child.children.length !== 0) scriptify(child);

		}

	}

}

async function load () {

	document.querySelector(".app__menu").style.display = "none";
	const u = URLMap["/" + url().split("/")[1]];

	console.log(`Loading ${url()}`);

	await loadData();

	if (!u) {
		
		location.hash = "/";
		load();

		return;

	}

	var data = await render(u, {

		posts,
		pages,
		featured,

		issue: u === "issue" ? pages.find(p => p.link.endsWith(url().split("/").slice(1)[1] + "/")) : undefined,
		post: u === "read" ? posts.find(p => p.link.endsWith(url().split("/").slice(1)[1] + "/")) : undefined

	});

	if (initialLoad) {

		// setTimeout(() => {

			document.querySelector(".loading").classList.add("loaded");

			setTimeout(() => {

				document.querySelector(".styling").remove();
				document.querySelector(".loading").remove();

			}, 750);

		// }, 1000);

		initialLoad = !initialLoad;

	}

	document.querySelector(".app").innerHTML = data;

	scriptify(document.querySelector(".app"));

}

load();

window.addEventListener("hashchange", load);

document.addEventListener("scroll", event => {
	
	var y = window.scrollY;

	if (y > 10) document.querySelector(".app__menu__brand").classList.add("minimized");
	else document.querySelector(".app__menu__brand").classList.remove("minimized");

});

document.querySelector(".app__menu__opener").addEventListener("click", () => {

	if (document.querySelector(".app__menu").style.display === "block") document.querySelector(".app__menu").style.display = "none";
	else document.querySelector(".app__menu").style.display = "block";

});
