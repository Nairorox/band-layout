const body = document.querySelector('body');
const navbar = document.querySelector('nav');
const bandMembers = document.querySelectorAll('.bandMember');
const siteWrapper = document.querySelector('.site-wrapper');
const aboutPage = document.querySelector('.about-page');
const typingDash = document.querySelector('.typing-dash');
const typable = document.querySelector('.typable');
let pageElementsPos = Array.from(document.querySelectorAll('.page-elements')).map(element => element.offsetTop);
let last;
let lastLabel;


function showMember(){
	let memberLabel = this.querySelector('.memberLabel');
	if(last && this != last){
		last.classList.remove('band-active');

		this.classList.add('band-active');
		lastLabel.classList.remove('member-label-active');
		memberLabel.classList.add('member-label-active');
	}
	else if(this == last){
		this.classList.remove('band-active');
		memberLabel.classList.remove('member-label-active');
		lastLabel = null;
		last = null;
		return;
	}
	else{
	this.classList.add('band-active');
	memberLabel.classList.add('member-label-active');
	}
	last = this;
	lastLabel = memberLabel;
}


let scrollInterval;
function smoothScroll(scrollYBreak = document.body.scrollHeight){
	body.style.overflow = 'hidden';
	pageElementsPos = Array.from(document.querySelectorAll('.page-elements')).map(element => element.offsetTop - navbar.offsetHeight);
	if(scrollInterval){clearInterval(scrollInterval)}
	let i = window.scrollY;

	if(i >= scrollYBreak){
		scrollInterval = setInterval(function(){
			if (i <= scrollYBreak || i < 0){
				clearInterval(scrollInterval);
				body.style.overflow = 'initial'
			}
			window.scrollTo(0,i);
		 	i-= 12;
		},15);
	}

	else{
		scrollInterval = setInterval(function(){
			if(i >= scrollYBreak || i >= document.body.scrollHeight-window.innerHeight){
				clearInterval(scrollInterval);
				body.style.overflow = 'initial'
			}
			window.scrollTo(0,i);
			i+= 12;
		},15);
	}
	return;
}

navbar.initPosX = navbar.offsetTop; 

function stickyNav(){
	if(window.scrollY > navbar.initPosX){ 
	aboutPage.style.marginTop = `${navbar.offsetHeight + 10}px`;
		body.classList.add('stickyNav');
		//body.style.paddingTop = `${navbar.offsetHeight}px`;
	}
	
	else if(window.scrollY <= navbar.initPosX){
		body.classList.remove('stickyNav');
		aboutPage.style.marginTop = `10px`;
	}
}



sideMenu = {
	element: document.querySelector('.side-menu'),
	overlay: document.querySelector('.overlay'),
	active: false,
	hide: function(){
			sideMenu.element.classList.remove('side-menu-active');
			siteWrapper.classList.remove('site-wrapper-side-active');
			sideMenu.overlay.classList.remove('overlay-active');
			sideMenu.active = false;
	},
	toggleView: function(){
		let overlay = document.querySelector('.overlay');
		if(this.active === false){
			this.element.classList.add('side-menu-active');
			siteWrapper.classList.add('site-wrapper-side-active');
			overlay.classList.add('overlay-active');
			this.active = true;
			overlay.addEventListener('click', this.hide);
		}
		else{
			this.hide();
		}
	},
}

function sideMenuActivate(e){
	if(e.key === 'Escape'){
		sideMenu.toggleView();
	}
}

function carousel(right = true){
	const currentSlide = document.querySelector('header');
	const prevSlide = document.querySelector('.prev-slide');
	const nextSlide = document.querySelector('.next-slide');
	if(right){
		
	}
}

typing = {
curIndex: 0,
finished: true,
	type: function(element, desireText){
		if(this.finished){
		this.finished = false;
		desireText = desireText.toString();
		let typableText = element.innerText.split('');
		let erase = setInterval(function(){
				typableText.pop();
				element.innerText = typableText.join('');
				if(typableText.length == 0){
					clearInterval(erase);
					let i = 0;
					let typingNow = setInterval(function(){
						if(i >= desireText.length-1){
							typing.finished = true;
							clearInterval(typingNow)
							setTimeout(function(){
								console.log(typing.curIndex);
								console.log(typingWords.length);
								typing.curIndex < typingWords.length-1 ? typing.curIndex++ : typing.curIndex = 0;
								typing.type(typable, typingWords[typing.curIndex]);
							}, 700);
						}
						element.innerText += desireText[i].toUpperCase();
						i++;
					}, 300);
				}
			}, 100);
		}
	}
}
typingWords = ['important','like us','the best','super','great','awesome', 'perfect'];

typing.type(typable, typingWords[0]);
//type(typable, 'JANUSZE');;
document.addEventListener('scroll', stickyNav);
document.addEventListener('keyup', sideMenuActivate)

bandMembers.forEach(member =>{
	member.addEventListener('click', showMember);
});

document.querySelectorAll('[data-index]').forEach(list => {
	list.addEventListener('click', () => smoothScroll(pageElementsPos[Number(list.dataset.index)-1]))
})




setInterval(function(){
typingDash.style.visibility = typingDash.style.visibility === 'hidden' ? '' : 'hidden';
}, 500);

//sticky nav at resize