
const items = MENU_ITEMS;
const cards = document.getElementById('cards');
const empty = document.getElementById('empty');
const search = document.getElementById('searchInput');
const filterButtons = Array.from(document.querySelectorAll('.filter'));

const searchIntro = document.createElement('div');
searchIntro.className = 'category-intro';
const searchHeading = document.createElement('h3');
searchHeading.textContent = 'Результаты поиска';
const searchDescription = document.createElement('p');
searchIntro.append(searchHeading, searchDescription);
cards.before(searchIntro);

let activeCategory = 'Все';

function render() {
  const searchText = search.value.trim();
  const query = searchText.toLowerCase();

  if (query) {
    activeCategory = 'Все';
    filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === activeCategory));
  }
  searchIntro.style.display = query ? 'block' : 'none';
  searchDescription.textContent = query ? `Результаты по запросу «${searchText}»` : '';

  const filtered = items.filter(item => {
    const catOk = activeCategory === 'Все' || item.category === activeCategory;
    const hay = [item.title, item.desc, item.price, item.category].join(' ').toLowerCase();
    const queryOk = !query || hay.includes(query);
    return query ? queryOk : catOk;
  });

  cards.innerHTML = filtered.map(item => `
    <article class="card">
      <div class="card-img">
        <span class="badge">${item.category}</span>
        <img src="${item.img}" alt="${item.alt}" loading="lazy">
      </div>
      <div class="card-content">
        <div class="title-row">
          <h3>${item.title}</h3>
          <strong>${item.price}</strong>
        </div>
        ${item.desc ? `<p>${item.desc}</p>` : ``}
      </div>
    </article>
  `).join('');

  empty.hidden = filtered.length > 0;
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    search.value = '';
    activeCategory = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.toggle('active', b === btn));
    render();
  });
});

search.addEventListener('input', render);
render();

document.querySelectorAll('[data-category-link]').forEach(link => {
  link.addEventListener('click', () => {
    const button = filterButtons.find(btn => btn.dataset.filter === link.dataset.categoryLink);
    button?.click();
  });
});

const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
  backToTop.hidden = window.scrollY < 500;
}

window.addEventListener('scroll', updateBackToTop, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
updateBackToTop();
