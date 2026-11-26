/* Explicit, verified page destinations; keep shared fragments where possible. */
(() => {
  function destination(link) {
    const target = link.dataset.decubTarget;
    const anchors = JSON.parse(link.dataset.decubAnchors);
    let fragment = '';
    try { fragment = decodeURIComponent(window.location.hash.slice(1)); } catch { /* invalid fragment */ }
    return fragment && anchors.includes(fragment)
      ? target + '#' + encodeURIComponent(fragment) : target;
  }
  function update() {
    for (const link of document.querySelectorAll('a[data-decub-target]')) {
      link.setAttribute('href', destination(link));
    }
  }
  update();
  window.addEventListener('hashchange', update);
  // Use the verified destination even if a theme handler rewrites the href.
  // Preserve native modified clicks, new-tab actions and keyboard activation.
  window.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-decub-target]');
    if (!link) return;
    const target = destination(link);
    link.setAttribute('href', target);
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey
        || (link.target && link.target !== '_self')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(target);
  }, true);
})();
