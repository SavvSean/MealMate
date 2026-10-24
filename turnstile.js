/* MealMate Turnstile adapter — public browser-side code only.
   Supabase checks the token server-side when CAPTCHA protection is enabled.
   DO NOT put the Cloudflare Secret Key in any website file. */
(() => {
  'use strict';
  const siteKey = String(window.MEALMATE_TURNSTILE_SITE_KEY || '').trim();
  const state = {
    auth: { id: null, token: '', waiters: [], rendering: null },
    recovery: { id: null, token: '', waiters: [], rendering: null }
  };
  const ids = {
    auth: { button: 'authSubmit', root: 'mmTurnstileAuth' },
    recovery: { button: 'mmRecoverySend', root: 'mmTurnstileRecovery' }
  };

  let sdkPromise;
  function sdk() {
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      if (window.turnstile?.render) { resolve(window.turnstile); return; }
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = () => window.turnstile?.render
        ? resolve(window.turnstile)
        : reject(new Error('Turnstile is unavailable in this browser.'));
      script.onerror = () => reject(new Error('Could not load Turnstile. Check your connection or content blocker.'));
      document.head.append(script);
    });
    return sdkPromise;
  }
  function displayError(context, message) {
    const p = document.querySelector(`#${ids[context].root} .mm-captcha-note`);
    if (p) { p.textContent = message; p.dataset.error = 'true'; }
  }
  function slot(context) {
    const spec = ids[context];
    if (!spec) throw new Error('Unknown MealMate verification form.');
    const button = document.getElementById(spec.button);
    const form = document.getElementById(context === 'auth' ? 'authForm' : 'mmRecoveryEmailForm');
    if (!button || !form || form.hidden) return null;
    let wrapper = document.getElementById(spec.root);
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = spec.root;
      wrapper.className = 'mm-captcha-wrapper';
      const text = document.createElement('p');
      text.className = 'mm-captcha-label';
      text.textContent = 'Kitchen safety check';
      const mount = document.createElement('div');
      mount.className = 'mm-captcha-widget';
      const note = document.createElement('p');
      note.className = 'mm-captcha-note';
      note.textContent = 'Checking your connection…';
      note.setAttribute('role', 'status');
      wrapper.append(text, mount, note);
      button.before(wrapper);
    }
    return wrapper.querySelector('.mm-captcha-widget');
  }
  function finishWaiters(context, error, token = '') {
    const pending = state[context].waiters.splice(0);
    for (const waiter of pending) {
      clearTimeout(waiter.timer);
      error ? waiter.reject(error) : waiter.resolve(token);
    }
  }
  async function prepare(context) {
    if (!siteKey || siteKey === 'PASTE_YOUR_PUBLIC_SITE_KEY_HERE') {
      throw new Error('Add the public Turnstile Site Key to turnstile-sitekey.js.');
    }
    const mount = slot(context);
    if (!mount) throw new Error('MealMate verification form is not ready. Open the form and try again.');
    const current = state[context];
    if (current.id !== null) return current;
    if (current.rendering) return current.rendering;
    current.rendering = (async () => {
      try {
        const api = await sdk();
        // The widget is attached to the current form; one widget per flow.
        const id = api.render(mount, {
          sitekey: siteKey,
          theme: 'light',
          size: 'flexible',
          appearance: 'always',
          callback: token => {
            current.token = token;
            const note = document.querySelector(`#${ids[context].root} .mm-captcha-note`);
            if (note) { note.textContent = 'Verification ready.'; note.dataset.error = 'false'; }
            finishWaiters(context, null, token);
          },
          'expired-callback': () => {
            current.token = '';
            displayError(context, 'Verification expired. Please try again.');
            finishWaiters(context, new Error('Verification expired. Please try again.'));
          },
          'error-callback': () => {
            current.token = '';
            displayError(context, 'Verification failed. Please retry.');
            finishWaiters(context, new Error('Verification failed. Please try again.'));
          }
        });
        if (id === undefined || id === null) throw new Error('Unable to display the verification challenge.');
        current.id = id;
        const note = document.querySelector(`#${ids[context].root} .mm-captcha-note`);
        if (note && !current.token) note.textContent = 'Complete the verification if prompted.';
        return current;
      } catch (err) {
        displayError(context, err.message || 'Verification unavailable.');
        throw err;
      } finally {
        current.rendering = null;
      }
    })();
    return current.rendering;
  }
  async function getToken(context) {
    const current = await prepare(context);
    // A token is single-use. Call reset() after every Auth attempt.
    if (current.token) return current.token;
    return new Promise((resolve, reject) => {
      const waiter = { resolve, reject, timer: null };
      waiter.timer = setTimeout(() => {
        const at = current.waiters.indexOf(waiter);
        if (at >= 0) current.waiters.splice(at, 1);
        reject(new Error('Verification timed out. Please try again.'));
      }, 120000);
      current.waiters.push(waiter);
    });
  }
  function reset(context) {
    const current = state[context];
    if (!current) return;
    current.token = '';
    if (current.id !== null && window.turnstile?.reset) {
      try { window.turnstile.reset(current.id); } catch (error) {
        console.warn('Turnstile reset unavailable:', error?.message || 'retry later');
      }
    }
  }

  // Prepare widgets when forms are opened, rather than waiting for submission.
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.matches('[data-action="account"],#authSwitch')) {
      queueMicrotask(() => { void prepare('auth').catch(err => displayError('auth', err.message)); });
    }
    if (button.matches('#mealMateForgotPassword,#mmRecoveryAnother')) {
      queueMicrotask(() => { void prepare('recovery').catch(err => displayError('recovery', err.message)); });
    }
  });
  window.MealMateTurnstile = { getToken, reset, prepare };
})();
