/* MealMate beta: adds legal links without changing kitchen state or Supabase code. */
(() => {
  'use strict';
  function insertLegalLinks() {
    if (document.getElementById('mealmateLegalLinks')) return;
    const outer = document.querySelector('.outer-frame');
    if (outer) {
      const footer = document.createElement('footer');
      footer.className = 'mealmate-legal-links';
      footer.id = 'mealmateLegalLinks';
      footer.innerHTML = '<nav aria-label="Legal and community information"><a href="privacy.html">Privacy Notice</a><span aria-hidden="true">·</span><a href="terms.html">Terms of Use</a><span aria-hidden="true">·</span><a href="community-guidelines.html">Community Guidelines</a></nav><span class="mealmate-beta-tag">FRIENDS-ONLY BETA</span>';
      outer.appendChild(footer);
    }
    const authSwitch = document.getElementById('authSwitch');
    if (authSwitch && !document.getElementById('mealmateAuthLegal')) {
      const paragraph = document.createElement('p');
      paragraph.id = 'mealmateAuthLegal';
      paragraph.className = 'mealmate-auth-legal';
      paragraph.innerHTML = 'Before registering, please read our <a href="privacy.html" target="_blank" rel="noopener noreferrer">Privacy Notice</a> and <a href="terms.html" target="_blank" rel="noopener noreferrer">Terms of Use</a>.';
      authSwitch.insertAdjacentElement('afterend', paragraph);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', insertLegalLinks, { once: true });
  else insertLegalLinks();
})();
