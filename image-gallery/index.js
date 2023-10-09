const inputSearch = document.getElementById('search-image');
const clearSearch = document.getElementById('clear-search');
const btnSearch = document.getElementById('btn-search');
const main = document.getElementById('main');
const imageFull = document.getElementById('full-image');
const descriptionFull = document.getElementById('full-decription');
const downloadLink = document.getElementById('download');
const overlay = document.getElementById('overlay');
const overlayBack = document.getElementById('overlay-back');
const audioClick = document.getElementById('song-click');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnUp = document.getElementById('btn-up');

getImages(page, search);
function getImages(page, search = 'all') {
  let url = '';
  if (search === 'all') url = `https://api.unsplash.com/photos?client_id=4-EJtgSsL_fig8yHRfZ9DaV7_DqqHQZoahL2MaYrEw0&page=${page}`;
  else url = `https://api.unsplash.com/search/photos?client_id=4-EJtgSsL_fig8yHRfZ9DaV7_DqqHQZoahL2MaYrEw0&page=${page}&query=${search}`;
  const options = {
    method: 'GET',
  };
  fetchAsync();
  async function fetchAsync() { 
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (search === 'all') {
        for (let i = 0; i < data.length; i++) {
          createImage(data[i].urls.regular ,data[i].links.download, data[i].description, data[i].alt_description);
        }
      }

      if (search !== 'all') {
        for (let i = 0; i < data.results.length; i++) {
          createImage(data.results[i].urls.regular ,data.results[i].links.download, data.results[i].description, data.results[i].alt_description);
        }
      }

    } catch (error) {
      if (error != "") {
        console.log("Error: " + error + "\nCheck the app later.");
      }
    }
  }
}

function createImage(smallImage, fullImage, description, altDescription) {
  main.append(document.createElement('div'));
  main.getElementsByTagName('div')[main.getElementsByTagName('div').length - 1].classList.add('cards');
  main.getElementsByTagName('div')[main.getElementsByTagName('div').length - 1].append(document.createElement('img'));
  main.getElementsByTagName('img')[main.getElementsByTagName('img').length - 1].classList.add('cards__image');
  main.getElementsByClassName('cards__image')[main.getElementsByClassName('cards__image').length - 1].src = smallImage;
  main.getElementsByClassName('cards__image')[main.getElementsByClassName('cards__image').length - 1].setAttribute('data-download', fullImage);
  main.getElementsByClassName('cards__image')[main.getElementsByClassName('cards__image').length - 1].setAttribute('data-description', description);
  main.getElementsByTagName('div')[main.getElementsByTagName('div').length - 1].append(document.createElement('p'));
  main.getElementsByTagName('p')[main.getElementsByTagName('p').length - 1].classList = 'cards__description';
  main.getElementsByClassName('cards__description')[main.getElementsByClassName('cards__description').length - 1].textContent = altDescription;
}

function throttle(callee, timeout) {
  let timer = null

  return function perform(...args) {
    if (timer) return

    timer = setTimeout(() => {
      callee(...args)

      clearTimeout(timer)
      timer = null
    }, timeout)
  }
}

btnUp.addEventListener('click', () => {
  window.scroll({top: 0, behavior: "smooth"});
});

window.addEventListener("scroll", throttle( () => {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;

  if (scrolled > 400) btnUp.classList.remove('unvisible');
  else btnUp.classList.add('unvisible');
  if (position >= threshold) {
    page += 1;
    setTimeout(() => { getImages(page, search); }, 250);
  }
}, 250));

document.body.addEventListener('click', () => {
  audioClick.play();
  if (event.target.classList == 'cards__image') {
    document.body.classList.add('scroll-off');
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) === false) {
      document.body.classList.add('scroll-padding');
      document.getElementsByTagName('footer')[0].classList.add('footer-padding');
    }
    imageFull.src = event.target.src;
    (event.target.dataset.description !== 'null') ? descriptionFull.textContent = event.target.dataset.description : descriptionFull.textContent = 'There is no additional description to this image';
    downloadLink.href = event.target.dataset.download;
    overlay.classList.add('overlay__index_up');
    overlayBack.classList.add('overlay__background_show');

    images = document.getElementsByClassName('cards__image');
    for (let i = 0; i < images.length; i++) if (images[i] === event.target) count = i;
  } 
  if (navigator.maxTouchPoints === 0) {
    if (event.target.classList.value === 'overlay__background overlay__background_show' || event.target.classList.value === 'overlay__background_controls') {
      overlayBack.classList.remove('overlay__background_show');
      setTimeout(() => { 
        overlay.classList.remove('overlay__index_up');
        document.body.classList.remove('scroll-off');
        document.body.classList.remove('scroll-padding');
        document.getElementsByTagName('footer')[0].classList.remove('footer-padding');
      },2000);
    }
  }
})

btnPrev.addEventListener('click', () => {
  imageFull.classList.add('hide');
  count -= 1;
  if (count < 0) count = images.length - 1;
  setTimeout(()=>{
    imageFull.src = images[count].src;
    downloadLink.href = images[count].dataset.download;
    (images[count].dataset.description !== 'null') ? descriptionFull.textContent = images[count].dataset.description : descriptionFull.textContent = 'There is no additional description to this image';
    imageFull.classList.remove('hide');
    imageFull.classList.add('show');
    setTimeout(() => {
      imageFull.classList.remove('show');
    }, 200);
  },200);
});

btnNext.addEventListener('click', () => {
  imageFull.classList.add('hide');
  count += 1;
  if (count > images.length - 1) count = 0;
  setTimeout(()=>{
    imageFull.src = images[count].src;
    downloadLink.href = images[count].dataset.download;
    (images[count].dataset.description !== 'null') ? descriptionFull.textContent = images[count].dataset.description : descriptionFull.textContent = 'There is no additional description to this image';
    imageFull.classList.remove('hide');
    imageFull.classList.add('show');
    setTimeout(() => {
      imageFull.classList.remove('show');
    }, 200);
  },200);
});

overlay.addEventListener('touchstart', function (event) {
  touchstartX = event.changedTouches[0].screenX;
  touchstartY = event.changedTouches[0].screenY;
}, false);

overlay.addEventListener('touchend', function (event) {
  touchendX = event.changedTouches[0].screenX;
  touchendY = event.changedTouches[0].screenY;
  handleGesture();
}, false);


function handleGesture() {
  if (touchendX < touchstartX) { //Swiped Left
    imageFull.classList.add('hide');
    count += 1;
    if (count > images.length - 1) count = 0;
    setTimeout(()=>{
      imageFull.src = images[count].src;
      downloadLink.href = images[count].dataset.download;
      (images[count].dataset.description !== 'null') ? descriptionFull.textContent = images[count].dataset.description : descriptionFull.textContent = 'There is no additional description to this image';
      imageFull.classList.remove('hide');
      imageFull.classList.add('show');
      setTimeout(() => {
        imageFull.classList.remove('show');
      }, 200);
    },200);
  }

  if (touchendX > touchstartX) { //Swiped Right
    imageFull.classList.add('hide');
    count -= 1;
    if (count < 0) count = images.length - 1;
    setTimeout(()=>{
      imageFull.src = images[count].src;
      downloadLink.href = images[count].dataset.download;
      (images[count].dataset.description !== 'null') ? descriptionFull.textContent = images[count].dataset.description : descriptionFull.textContent = 'There is no additional description to this image';
      imageFull.classList.remove('hide');
      imageFull.classList.add('show');
      setTimeout(() => {
        imageFull.classList.remove('show');
      }, 200);
    },200);
  }

  if (touchendY < touchstartY) { // Swiped Up
    overlayBack.classList.remove('overlay__background_show');
    setTimeout(() => { 
      overlay.classList.remove('overlay__index_up');
      document.body.classList.remove('scroll-off');
      document.body.classList.remove('scroll-padding');
      document.getElementsByTagName('footer')[0].classList.remove('footer-padding');
    },2000);
  }
}
