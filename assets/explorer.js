(() => {
  'use strict';
  const search = document.querySelector('#skill-search');
  const group = document.querySelector('#group-select');
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#empty-state');
  const reset = document.querySelector('#reset-filters');
  const cards = [...document.querySelectorAll('[data-category]')];
  if (!search || !group || !count || !empty || !reset) return;
  const normalize = value => value.toLocaleLowerCase().replace(/[-_]+/g, ' ');
  const initial = new URLSearchParams(location.search);
  search.value = initial.get('q') || '';
  if ([...group.options].some(option => option.value === initial.get('group'))) group.value = initial.get('group');
  function filter() {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    let matches = 0;
    for (const card of cards) {
      const text = normalize(card.dataset.search || '');
      const visible = (group.value === 'all' || card.dataset.group === group.value) && terms.every(term => text.includes(term));
      card.hidden = !visible;
      if (visible) matches++;
    }
    count.textContent = `${matches} ${matches === 1 ? 'category' : 'categories'}`;
    empty.hidden = matches !== 0;
    const url = new URL(location.href);
    search.value.trim() ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
    group.value === 'all' ? url.searchParams.delete('group') : url.searchParams.set('group', group.value);
    history.replaceState(null, '', url.pathname + url.search);
  }
  search.addEventListener('input', filter);
  group.addEventListener('change', filter);
  reset.addEventListener('click', () => { search.value = ''; group.value = 'all'; filter(); search.focus(); });
  filter();
})();
