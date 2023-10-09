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
