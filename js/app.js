import { renderCatalog, bindCatalogEvents } from './catalog.js';
import { renderDetail } from './detail.js';
import { renderStats } from './stats.js';
import { renderRegister, bindRegisterEvents } from './register.js';

const routes = {
  catalog: renderCatalog,
  stats: renderStats,
  register: renderRegister,
};

function getRoute() {
  const hash = window.location.hash.slice(1) || 'catalog';
  if (hash.startsWith('service/')) {
    return { page: 'service', id: hash.split('/')[1] };
  }
  return { page: hash };
}

function updateNav(page) {
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

function render() {
  const route = getRoute();
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main-content');

  updateNav(route.page);

  let result;
  if (route.page === 'service') {
    result = renderDetail(route.id);
  } else if (routes[route.page]) {
    result = routes[route.page]();
  } else {
    result = renderCatalog();
  }

  sidebar.innerHTML = result.sidebar;
  main.innerHTML = result.main;

  // Bind events after render
  if (route.page === 'catalog' || (!route.page && !routes[route.page])) {
    bindCatalogEvents();
  }
  if (route.page === 'register') {
    bindRegisterEvents();
  }

  // Scroll to top on page change
  main.scrollTop = 0;
}

// Nav link clicks
document.querySelectorAll('.nav-link').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = el.dataset.page;
  });
});

// Hash change routing
window.addEventListener('hashchange', render);

// Initial render
render();

// Blinking cursor effect
setInterval(() => {
  const cursor = document.querySelector('.cursor-blink');
  if (cursor) cursor.classList.toggle('off');
}, 530);
