'use strict';
document.documentElement.classList.add('js');
const storage = {
  read(key, fallback) {
    try { const raw = localStorage.getItem(`cookbook:${key}`); return raw ? JSON.parse(raw) : fallback; }
    catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(`cookbook:${key}`, JSON.stringify(value)); return true; }
    catch { showToast('Браузер не разрешил сохранить отметки на этом устройстве.'); return false; }
  }
};
const savedFavorites = storage.read('favorites', []);
const favorites = new Set(Array.isArray(savedFavorites) ? savedFavorites.filter(value => typeof value === 'string') : []);
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.append(toast); }
  toast.textContent = message;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.remove(), 3500);
}
function updateFavoriteButtons() {
  document.querySelectorAll('[data-favorite]').forEach(button => {
    const selected = favorites.has(button.dataset.favorite);
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', `${selected ? 'Убрать из избранного' : 'В избранное'}: ${button.dataset.title}`);
    button.textContent = button.classList.contains('star') ? (selected ? '★' : '☆') : (selected ? 'В избранном' : 'В избранное');
  });
}
document.querySelectorAll('[data-favorite]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.favorite;
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  storage.write('favorites', [...favorites]);
  updateFavoriteButtons();
  if (typeof applyFilters === 'function') applyFilters();
}));
updateFavoriteButtons();
function normalize(text) { return text.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').replaceAll('кабачок', 'кабач').replace(/кабачк[а-я]*/g, 'кабач').replace(/\s+/g, ' ').trim(); }
const search = document.querySelector('#search');
const cards = [...document.querySelectorAll('.recipe-card')];
let activeCategory = 'Все рецепты';
let onlyFavorites = false;
function applyFilters() {
  if (!search) return;
  const query = normalize(search.value).split(' ').filter(Boolean);
  const status = document.querySelector('#status-filter').value;
  let visible = 0;
  cards.forEach(card => {
    const matches = query.every(word => normalize(card.dataset.search).includes(word));
    const categoryMatches = activeCategory === 'Все рецепты' || card.dataset.category === activeCategory;
    const statusMatches = !status || (status === 'fragment' ? card.dataset.kind === 'fragment' : card.dataset.issues === 'true');
    const favoriteMatches = !onlyFavorites || favorites.has(card.dataset.id);
    card.hidden = !(matches && categoryMatches && statusMatches && favoriteMatches);
    if (!card.hidden) visible++;
  });
  document.querySelector('#results-count').textContent = `Найдено: ${visible}`;
  document.querySelector('#results-title').textContent = onlyFavorites ? 'Избранное' : activeCategory;
  document.querySelector('#empty').hidden = visible > 0;
  const params = new URLSearchParams();
  if (search.value) params.set('q', search.value);
  if (activeCategory !== 'Все рецепты') params.set('category', activeCategory);
  if (onlyFavorites) params.set('favorites', '1');
  if (status) params.set('status', status);
  history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}`);
}
if (search) {
  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || '';
  const categoryNames = [...document.querySelectorAll('[data-category-filter]')].map(button => button.dataset.categoryFilter);
  activeCategory = categoryNames.includes(params.get('category')) ? params.get('category') : 'Все рецепты';
  onlyFavorites = params.get('favorites') === '1';
  const status = params.get('status');
  document.querySelector('#status-filter').value = ['fragment', 'issues'].includes(status) ? status : '';
  function updateCategories() {
    document.querySelectorAll('[data-category-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.categoryFilter === activeCategory)));
  }
  document.querySelectorAll('[data-category-filter]').forEach(button => button.addEventListener('click', () => {
    activeCategory = button.dataset.categoryFilter; updateCategories(); applyFilters();
  }));
  document.querySelector('#favorites-filter').setAttribute('aria-pressed', String(onlyFavorites));
  document.querySelector('#favorites-filter').addEventListener('click', event => {
    onlyFavorites = !onlyFavorites; event.currentTarget.setAttribute('aria-pressed', String(onlyFavorites)); applyFilters();
  });
  search.addEventListener('input', applyFilters);
  document.querySelector('#status-filter').addEventListener('change', applyFilters);
  document.querySelectorAll('[data-reset]').forEach(button => button.addEventListener('click', () => {
    search.value = ''; onlyFavorites = false; activeCategory = 'Все рецепты';
    document.querySelector('#status-filter').value = '';
    document.querySelector('#favorites-filter').setAttribute('aria-pressed', 'false');
    updateCategories(); applyFilters(); search.focus();
  }));
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); search.focus(); }
  });
  updateCategories(); applyFilters();
}
const recipeId = document.body.dataset.recipe;
if (recipeId) {
  const savedChecks = storage.read(`checks:${recipeId}`, []);
  const checked = new Set(Array.isArray(savedChecks) ? savedChecks : []);
  const inputs = [...document.querySelectorAll('.ingredient input')];
  inputs.forEach((input, index) => {
    input.checked = checked.has(index);
    input.addEventListener('change', () => {
      input.checked ? checked.add(index) : checked.delete(index);
      storage.write(`checks:${recipeId}`, [...checked]);
    });
  });
  document.querySelector('#reset-checks').addEventListener('click', () => {
    checked.clear(); inputs.forEach(input => { input.checked = false; }); storage.write(`checks:${recipeId}`, []);
  });
  document.querySelector('#print').addEventListener('click', () => window.print());
  document.querySelector('#read-mode').addEventListener('click', event => {
    const active = document.body.classList.toggle('read-mode'); event.currentTarget.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#copy-link').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); showToast('Ссылка на рецепт скопирована.'); }
    catch { showToast('Скопируйте адрес рецепта из адресной строки браузера.'); }
  });
}

// Keep the catalog compact on phones; every category remains in a native disclosure.
const categoryPicker = document.querySelector('.category-picker');
if (categoryPicker && matchMedia('(max-width: 760px)').matches) {
  categoryPicker.open = false;
  categoryPicker.querySelectorAll('[data-category-filter]').forEach(button => {
    button.addEventListener('click', () => {
      categoryPicker.open = false;
      categoryPicker.querySelector('summary').textContent = activeCategory === 'Все рецепты' ? 'Разделы книги' : activeCategory;
    });
  });
}
document.querySelectorAll('.masthead nav a').forEach(link => {
  if (link.pathname === location.pathname) link.setAttribute('aria-current', 'page');
});
