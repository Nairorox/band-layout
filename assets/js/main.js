const body = document.querySelector('body');
const navbar = document.querySelector('nav');
const header = document.querySelector('header');
const bandMembers = document.querySelectorAll('.bandMember');
const siteWrapper = document.querySelector('.site-wrapper');
const aboutPage = document.querySelector('.about-page');
const caret = document.querySelector('.caret');
const typable = document.querySelector('.typable');
const galleryPhotos = document.querySelectorAll('.gallery-photo');
let pageElementsPos = Array.from(document.querySelectorAll('.page-elements')).map(element => element.offsetTop - navbar.offsetHeight);
let lastMember;
let lastLabel;
const typingWords = [ 'best', 'super', 'great', 'awesome', 'perfect'];

let changerLeft;
let changerRight;
let currentGalleryIndex;


function showMember() {
  const memberLabel = this.querySelector('.memberLabel');
  if (lastMember && this !== lastMember) {
    lastMember.classList.remove('band-active');
    this.classList.add('band-active');
    lastLabel.classList.remove('member-label-active');
    memberLabel.classList.add('member-label-active');
  } 
  else if (this === lastMember) {
    this.classList.remove('band-active');
    memberLabel.classList.remove('member-label-active');
    lastLabel = null;
    lastMember = null;
    return;
  }
  else {
    this.classList.add('band-active');
    memberLabel.classList.add('member-label-active');
  }
  lastMember = this;
  lastLabel = memberLabel;
}


let scrollInterval;
function smoothScroll(scrollYBreak = document.body.scrollHeight) {
  body.style.overflow = 'hidden';
  pageElementsPos = Array.from(document.querySelectorAll('.page-elements')).map(element => element.offsetTop - navbar.offsetHeight);
  if (scrollInterval) { clearInterval(scrollInterval); }
  let i = window.scrollY;

  if (i >= scrollYBreak) {
    scrollInterval = setInterval(() => {
      if (i <= scrollYBreak || i < 0) {
        clearInterval(scrollInterval);
        body.style.overflow = 'initial';
      }
      window.scrollTo(0, i);
      i -= 12;
    }, 15);
  } else {
    scrollInterval = setInterval(() => {
      if (i >= scrollYBreak || i >= document.body.scrollHeight - window.innerHeight) {
        clearInterval(scrollInterval);
        body.style.overflow = 'initial';
      }
      window.scrollTo(0, i);
      i += 12;
    }, 15);
  }
}

navbar.initPosY = navbar.offsetTop;


function stickyNav() {
  if (window.scrollY > navbar.initPosY && window.innerWidth > 600) {
    if(body.classList.contains('stickyNav')){
      return
    }
      aboutPage.style.marginTop = `${navbar.offsetHeight + 50}px`;
      body.classList.add('stickyNav');
    // body.style.paddingTop = `${navbar.offsetHeight}px`;
  } else if (window.scrollY <= navbar.initPosY) {
      if(!body.classList.contains('stickyNav')){
        return
      }
      body.classList.remove('stickyNav');
      aboutPage.style.marginTop = '50px';
  }
}


const sideMenu = {
  element: document.querySelector('.side-menu'),
  overlay: document.querySelector('.overlay'),
  active: false,
  hidePhotoGallery(){
    while(sideMenu.overlay.children.length > 0){
      sideMenu.overlay.removeChild(sideMenu.overlay.children[0]);
    }
  },
  hide(e) {
    if((e && e.target === this) || !e){
      sideMenu.element.classList.remove('side-menu-active');
      siteWrapper.classList.remove('site-wrapper-side-active');
      sideMenu.overlay.classList.remove('overlay-active');
      sideMenu.active = false;
      sideMenu.hidePhotoGallery();
    }
  },
  toggleView() {
    if (this.active === false) {
      this.hidePhotoGallery();
      this.element.classList.add('side-menu-active');
      siteWrapper.classList.add('site-wrapper-side-active');
      this.overlay.classList.add('overlay-active');
      this.active = true;
    } else {
      this.hide();
    }
  },
};

function sideMenuActivate(e) {
  if (e.key === 'Escape') {
    sideMenu.toggleView();
  }
}

const typing = {
  curIndex: 0,
  finished: true,
  type(element, desireText) {
    if (this.finished) {
      this.finished = false;
      desireText = desireText.toString();
      const typableText = element.innerText.split('');
      const erase = setInterval(() => {
        typableText.pop();
        element.innerText = typableText.join('');
        if (typableText.length === 0) {
          clearInterval(erase);
          let i = 0;
          const typingNow = setInterval(() => {
            if (i >= desireText.length - 1) {
              typing.finished = true;
              clearInterval(typingNow);
              setTimeout(() => {
                typing.curIndex < typingWords.length - 1 ? typing.curIndex += 1 : typing.curIndex = 0;
                typing.type(typable, typingWords[typing.curIndex]);
              }, 700);
            }
            element.innerText += desireText[i].toUpperCase();
            i += 1;
          }, 300);
        }
      }, 100);
    }
  },
};
  function galleryKeyHandler(e){
    if(document.querySelector('.photo-active')){
        if(e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'arrowleft'){
          changePhoto('l');
        }
        else if(e.key.toLowerCase() === 'd' || e.key.toLowerCase() === 'arrowright'){
          changePhoto('r');
        }
      }
    }
  document.addEventListener('keydown', galleryKeyHandler);

let changePhotoTimeout;
function changePhoto(direction){
  clearTimeout(changePhotoTimeout);
  let activePhoto = document.querySelector('.photo-active');
  if(this === changerRight || direction === 'r'){
    currentGalleryIndex < galleryPhotos.length -1 ? currentGalleryIndex += 1 : currentGalleryIndex = 0;
  }
  else if(this === changerLeft || direction === 'l'){
    currentGalleryIndex > 0 ? currentGalleryIndex -= 1 : currentGalleryIndex = galleryPhotos.length - 1;
    }
    activePhoto.classList.add('photo-changing');
   changePhotoTimeout = setTimeout(function(){
      activePhoto.style.background = window.getComputedStyle(galleryPhotos[currentGalleryIndex]).background;
      console.log(currentGalleryIndex);
      activePhoto.classList.remove('photo-changing');
  }, 300);
}

function showGallery(){
  sideMenu.overlay.classList.add('overlay-active');
  let copiedPhoto = this.cloneNode(true)
  copiedPhoto.classList.add('photo-active')
  changerLeft = document.createElement('div');
  changerRight = document.createElement('div');
  currentGalleryIndex = Number(this.dataset.galleryIndex);
  changerLeft.innerText = '⇦';
  changerLeft.classList.add('photo-changer');
  changerLeft.classList.add('photo-changer--left');
  changerRight.innerText = '⇨'
  changerRight.classList.add('photo-changer');
  changerRight.classList.add('photo-changer--right');
  sideMenu.overlay.appendChild(copiedPhoto);
  copiedPhoto.appendChild(changerLeft);
  copiedPhoto.appendChild(changerRight);

  document.querySelectorAll('.photo-changer').forEach(changer => {
    changer.addEventListener('click', changePhoto);
  });
}

galleryPhotos.forEach((photo) => {
  photo.addEventListener('click', showGallery);
})

typing.type(typable, typingWords[0]);
document.addEventListener('scroll', stickyNav);
document.addEventListener('keyup', sideMenuActivate);

bandMembers.forEach((member) => {
  member.addEventListener('click', showMember);
});

document.querySelectorAll('[data-index]').forEach((list) => {
  list.addEventListener('click', () => smoothScroll(pageElementsPos[Number(list.dataset.index) - 1]));
});


setInterval(() => {
  caret.style.visibility = caret.style.visibility === 'hidden' ? '' : 'hidden';
}, 500);

sideMenu.overlay.addEventListener('click', sideMenu.hide);

window.addEventListener("resize", function(){
  navbar.initPosY = header.offsetHeight;
  stickyNav();
});