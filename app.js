const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const searchBox = document.getElementById("search");
const spinner = document.getElementById("spinner");
const selectedCounterContainer = document.getElementById("selected-img-container");
const selectedImageCounter = document.getElementById("selected-num");
const searchAgain = document.getElementById("search-again");
let selectedImage = 0;
// Adding enter button feature
const enterClicked = (key, clickThis) => {
	if(key === "Enter"){
		clickThis.click();
	}
}
searchBox.addEventListener("keypress", (event) => {
	enterClicked(event.key, searchBtn);
});
document.getElementById("duration").addEventListener("keypress", (event) => {
	enterClicked(event.key, sliderBtn);
})
// Reload page if create again clicked
searchAgain.addEventListener("click", () => {
	window.location.reload();
})
// adding go to top button
const goToTopBtn = document.getElementsByClassName("goto-top")[0];
const goToTopClicked = () => {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}
goToTopBtn.addEventListener("click", goToTopClicked);
// when to show the button
const showGoTopBtn = () => {
	if(document.body.scrollTop > 200 || document.documentElement.scrollTop > 200){

		goToTopBtn.classList.add("showtopbtn");
	}
	else{
		goToTopBtn.classList.remove("showtopbtn");
	}
}
window.onscroll = showGoTopBtn;
// when user clicks on the button


// selected image
const sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images
const showImages = (images) => {
	imagesArea.style.display = 'block';
	gallery.innerHTML = '';
	galleryHeader.style.display = 'flex';
	// show an image-not-found message if image not found
	if(images.length === 0){
		document.getElementById("options").style.display = "none";
		gallery.style.cssText =
			"display:flex; flex-flow: column nowrap; justify-content : center; align-items : center;";
		gallery.innerHTML =
			`
			<div class = "image-not-found">
				<h1> IMAGE NOT FOUND! </h1>
			<div class = "not-found-image">
			<img class = "img-fluid" src  ="images/image-not-found.png" alt= "error-message">
			</div>
			</div>
			`
	}
	// show gallery title
	else{
		images.forEach(image => {
			const div = document.createElement('div');
			div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
			div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
			gallery.appendChild(div);
			selectedCounterContainer.classList.remove("d-none");
		})
	}

	spinner.classList.toggle("d-none");
}

const getImages = (query) => {
	spinner.classList.toggle("d-none");
	fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
		.then(response => response.json())
		.then(data => showImages(data.hits)) // bug(1)
		.catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
	const element = event.target;
	element.classList.toggle('added');

	const item = sliders.indexOf(img);
	if (item === -1) {
		sliders.push(img);
		selectedImage +=1;
		document.getElementsByClassName("selected-count-border")[0].style.border = "5px solid white";

	} else {
		sliders.splice(item, 1);
		selectedImage -=1;
		document.getElementsByClassName("selected-count-border")[0].style.border = "0px solid";
	}
	selectedImageCounter.innerHTML = `${selectedImage}`;
}
let timer
const createSlider = () => {
	// check slider image length
	if (sliders.length < 2) {
		alert('Select at least 2 image.')
		return;
	}
	// crate slider previous next area
	imagesArea.style.display = 'none';
	sliderContainer.innerHTML = '';
	const prevNext = document.createElement('div');
	prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
	prevNext.innerHTML = `
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

	sliderContainer.appendChild(prevNext)
	document.querySelector('.main').style.display = 'block';
	// hide image area
	let duration = document.getElementById('duration').value || 1000;
	duration = Number(duration) < 0 ? duration = "1000" : duration;
	sliders.forEach(slide => {
		const item = document.createElement('div')
		item.className = "slider-item";
		item.innerHTML = `<img class="w-100"
	src="${slide}"
	alt="">`;
		sliderContainer.appendChild(item)
	})
	changeSlide(0)
	timer = setInterval(() => {
		slideIndex++;
		changeSlide(slideIndex);
	}, duration);
	spinner.classList.toggle("d-none");
}

// change slider index
const changeItem = index => {
	changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

	const items = document.querySelectorAll('.slider-item');
	if (index < 0) {
		slideIndex = items.length - 1
		index = slideIndex;
	};

	if (index >= items.length) {
		index = 0;
		slideIndex = 0;
	}

	items.forEach(item => {
		item.style.display = "none"
	})

	items[index].style.display = "block"
}

searchBtn.addEventListener('click', () => {
	document.querySelector('.main').style.display = 'none';
	clearInterval(timer);
	getImages(search.value)
	sliders.length = 0;
})

sliderBtn.addEventListener('click', () => {
	setTimeout(() => {
		createSlider();
		searchAgain.classList.remove("d-none");
		searchAgain.classList.add("d-flex");
	}, 2000);
	spinner.classList.toggle("d-none");
});
