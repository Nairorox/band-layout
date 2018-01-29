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
const typingWords = [ 'best', 'super', 'great', 'awesome', 'perfect'];

function showMember() {
  const memberLabel = this.querySelector('.memberLabel');
  if (last && this !== last) {
    last.classList.remove('band-active');
    this.classList.add('band-active');
    lastLabel.classList.remove('member-label-active');
    memberLabel.classList.add('member-label-active');
  } 
  else if (this === last) {
    this.classList.remove('band-active');
    memberLabel.classList.remove('member-label-active');
    lastLabel = null;
    last = null;
    return;
  }
  else {
    this.classList.add('band-active');
    memberLabel.classList.add('member-label-active');
  }
  last = this;
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

navbar.initPosX = navbar.offsetTop;


function stickyNav() {
  if (window.scrollY > navbar.initPosX && window.innerWidth > 600) {
    if(body.classList.contains('stickyNav')){return}
      aboutPage.style.marginTop = `${navbar.offsetHeight + 50}px`;
      body.classList.add('stickyNav');
    // body.style.paddingTop = `${navbar.offsetHeight}px`;
  } else if (window.scrollY <= navbar.initPosX) {
      if(!body.classList.contains('stickyNav')){return}
      body.classList.remove('stickyNav');
      aboutPage.style.marginTop = '50px';
  }
}


const sideMenu = {
  element: document.querySelector('.side-menu'),
  overlay: document.querySelector('.overlay'),
  active: false,
  hide() {
    sideMenu.element.classList.remove('side-menu-active');
    siteWrapper.classList.remove('site-wrapper-side-active');
    sideMenu.overlay.classList.remove('overlay-active');
    sideMenu.active = false;
  },
  toggleView() {
    const overlay = document.querySelector('.overlay');
    if (this.active === false) {
      this.element.classList.add('side-menu-active');
      siteWrapper.classList.add('site-wrapper-side-active');
      overlay.classList.add('overlay-active');
      this.active = true;
      overlay.addEventListener('click', this.hide);
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
  typingDash.style.visibility = typingDash.style.visibility === 'hidden' ? '' : 'hidden';
}, 500);
// sticky nav at resize
