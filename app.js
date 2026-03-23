// FoodTrack - app.js
// Uses Open Food Facts API (free, no API key required)
// API Docs: https://world.openfoodfacts.org/data

let allResults = [];
let currentFilter = 'all';
let currentQuery = '';

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-theme');
  localStorage.setItem('foodtrack-theme', isLight ? 'light' : 'dark');
}

function initTheme() {
  const savedTheme = localStorage.getItem('foodtrack-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  } else if (savedTheme === 'dark') {
    document.body.classList.remove('light-theme');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.body.classList.add('light-theme');
  }
}

// Initialize theme immediately
initTheme();

// ─── Search ───────────────────────────────────────────────────────────────────

async function search() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;
  currentQuery = query;

  showLoading();

  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=30&fields=product_name,brands,nutriments,nutriscore_grade,quantity`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();

    allResults = (data.products || []).filter(p => p.product_name);
    renderResults();
  } catch (err) {
    showError();
  }
}

// ─── Filtering & Sorting ──────────────────────────────────────────────────────

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderResults();
}

function applySort() {
  renderResults();
}

function getFiltered() {
  let items = [...allResults];

  // Apply filter
  if (currentFilter === 'low-cal') {
    items = items.filter(p => getN(p, 'energy-kcal_100g') > 0 && getN(p, 'energy-kcal_100g') < 100);
  } else if (currentFilter === 'high-protein') {
    items = items.filter(p => getN(p, 'proteins_100g') > 10);
  } else if (currentFilter === 'low-sugar') {
    items = items.filter(p => getN(p, 'sugars_100g') >= 0 && getN(p, 'sugars_100g') < 5);
  }

  // Apply sort
  const sort = document.getElementById('sortSelect').value;
  if (sort === 'cal-asc')      items.sort((a, b) => getN(a, 'energy-kcal_100g') - getN(b, 'energy-kcal_100g'));
  else if (sort === 'cal-desc')     items.sort((a, b) => getN(b, 'energy-kcal_100g') - getN(a, 'energy-kcal_100g'));
  else if (sort === 'protein-desc') items.sort((a, b) => getN(b, 'proteins_100g') - getN(a, 'proteins_100g'));
  else if (sort === 'sugar-asc')    items.sort((a, b) => getN(a, 'sugars_100g') - getN(b, 'sugars_100g'));

  return items;
}

// ─── Render ───────────────────────────────────────────────────────────────────

function renderResults() {
  const items = getFiltered();
  const container = document.getElementById('resultsContainer');
  const statusBar = document.getElementById('statusBar');

  document.getElementById('resultCount').textContent = items.length;
  document.getElementById('queryLabel').textContent = `"${currentQuery}"`;
  statusBar.style.display = 'flex';

  if (items.length === 0) {
    container.innerHTML = `
      <div class="state-box">
        <span class="icon">🔍</span>
        <p>No results found for this filter.<br>Try a different filter or search term.</p>
      </div>`;
    return;
  }

  container.innerHTML = '<div class="results-grid" id="resultsGrid"></div>';
  const grid = document.getElementById('resultsGrid');

  items.forEach((p, i) => {
    const kcal    = fmt(getN(p, 'energy-kcal_100g'));
    const protein = fmt(getN(p, 'proteins_100g'));
    const fat     = fmt(getN(p, 'fat_100g'));
    const carbs   = fmt(getN(p, 'carbohydrates_100g'));
    const grade   = p.nutriscore_grade;

    const card = document.createElement('div');
    card.className = 'food-card';
    card.style.animationDelay = `${i * 40}ms`;
    card.innerHTML = `
      <div>
        <div class="food-name">${escapeHTML(p.product_name)}</div>
        ${p.brands ? `<div class="food-brand">${escapeHTML(p.brands.split(',')[0])}</div>` : ''}
        <div class="food-meta">
          <div class="nutrient-pill">
            <span class="nutrient-val kcal">${kcal}</span>
            <span class="nutrient-lbl">kcal</span>
          </div>
          <div class="nutrient-pill">
            <span class="nutrient-val protein">${protein}g</span>
            <span class="nutrient-lbl">protein</span>
          </div>
          <div class="nutrient-pill">
            <span class="nutrient-val">${fat}g</span>
            <span class="nutrient-lbl">fat</span>
          </div>
          <div class="nutrient-pill">
            <span class="nutrient-val">${carbs}g</span>
            <span class="nutrient-lbl">carbs</span>
          </div>
        </div>
      </div>
      <div class="card-score">
        <div class="nutri-grade ${gradeClass(grade)}">${gradeLabel(grade)}</div>
      </div>
    `;
    card.addEventListener('click', () => openModal(p));
    grid.appendChild(card);
  });
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function openModal(p) {
  document.getElementById('modalTitle').textContent = p.product_name;
  document.getElementById('modalBrand').textContent = p.brands ? `by ${p.brands.split(',')[0]}` : '';

  const grade   = p.nutriscore_grade;
  const kcal    = fmt(getN(p, 'energy-kcal_100g'));
  const protein = fmt(getN(p, 'proteins_100g'));
  const fat     = fmt(getN(p, 'fat_100g'));
  const carbs   = fmt(getN(p, 'carbohydrates_100g'));
  const sugar   = fmt(getN(p, 'sugars_100g'));
  const fiber   = fmt(getN(p, 'fiber_100g'));
  const salt    = fmt(getN(p, 'salt_100g'));
  const satFat  = fmt(getN(p, 'saturated-fat_100g'));

  // Daily reference values for bar widths
  const maxRef = { fat: 70, carbs: 260, protein: 50, sugar: 90, fiber: 30, salt: 6 };

  const barWidth = (val, key) => {
    const n = parseFloat(val);
    if (!n) return 0;
    return Math.min(100, (n / maxRef[key]) * 100).toFixed(1);
  };

  const nutrients = [
    { name: 'Fat',      val: fat,    key: 'fat',     cls: 'fat' },
    { name: 'Sat. Fat', val: satFat, key: 'fat',     cls: 'fat' },
    { name: 'Carbs',    val: carbs,  key: 'carbs',   cls: 'carbs' },
    { name: 'Sugar',    val: sugar,  key: 'sugar',   cls: 'sugar' },
    { name: 'Fiber',    val: fiber,  key: 'fiber',   cls: 'fiber' },
    { name: 'Protein',  val: protein,key: 'protein', cls: 'protein' },
    { name: 'Salt',     val: salt,   key: 'salt',    cls: 'salt' },
  ];

  document.getElementById('modalBody').innerHTML = `
    <div class="nutriscore-section">
      <div class="nutri-grade nutriscore-big ${gradeClass(grade)}">${gradeLabel(grade)}</div>
      <div class="nutriscore-info">
        <div class="lbl">Nutri-Score</div>
        <div class="desc">${gradeDesc(grade)}</div>
      </div>
    </div>

    <div class="section-title">Macronutrients per 100g</div>
    <div class="macro-grid">
      <div class="macro-box">
        <span class="val kcal-val">${kcal}</span>
        <span class="unit">kcal</span>
        <span class="lbl">Energy</span>
      </div>
      <div class="macro-box">
        <span class="val protein-val">${protein}</span>
        <span class="unit">g</span>
        <span class="lbl">Protein</span>
      </div>
      <div class="macro-box">
        <span class="val">${fat}</span>
        <span class="unit">g</span>
        <span class="lbl">Fat</span>
      </div>
      <div class="macro-box">
        <span class="val">${carbs}</span>
        <span class="unit">g</span>
        <span class="lbl">Carbs</span>
      </div>
    </div>

    <div class="section-title">Detailed Breakdown</div>
    ${nutrients.map(n => `
      <div class="nutrient-row">
        <span class="nutrient-name">${n.name}</span>
        <div class="bar-track">
          <div class="bar-fill ${n.cls}" style="width:${barWidth(n.val, n.key)}%"></div>
        </div>
        <span class="nutrient-amount">${n.val}${n.val !== '—' ? 'g' : ''}</span>
      </div>
    `).join('')}

    ${p.quantity ? `<div style="margin-top:20px;font-size:11px;color:var(--muted)">Package size: ${escapeHTML(p.quantity)}</div>` : ''}
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) {
    closeModalDirect();
  }
}

function closeModalDirect() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ─── State Views ──────────────────────────────────────────────────────────────

function showLoading() {
  document.getElementById('statusBar').style.display = 'none';
  document.getElementById('resultsContainer').innerHTML = `
    <div class="state-box">
      <div class="spinner"></div>
      <p>Fetching nutrition data...</p>
    </div>`;
}

function showError() {
  document.getElementById('resultsContainer').innerHTML = `
    <div class="state-box">
      <span class="icon">⚠️</span>
      <p>Failed to fetch data.<br>Check your connection and try again.</p>
    </div>`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getN(p, key) {
  return parseFloat(p.nutriments?.[key]) || 0;
}

function fmt(val) {
  if (val === 0 || isNaN(val)) return '—';
  return val % 1 === 0 ? String(val) : val.toFixed(1);
}

function gradeClass(g) {
  if (!g) return 'grade-unknown';
  return 'grade-' + g.toLowerCase();
}

function gradeLabel(g) {
  return g ? g.toUpperCase() : '?';
}

function gradeDesc(g) {
  const map = {
    a: 'Excellent nutritional quality',
    b: 'Good nutritional quality',
    c: 'Average nutritional quality',
    d: 'Poor nutritional quality',
    e: 'Bad nutritional quality'
  };
  return map[g?.toLowerCase()] || 'No Nutri-Score available';
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') search();
});
