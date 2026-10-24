/* MealMate password recovery add-on.
 * Include after cloud.js and before app.js. No secrets or local password storage.
 */
(() => {
  'use strict';
  const cloud = window.MealMateCloud;
  const authBg = document.getElementById('authBg');
  const authForm = document.getElementById('authForm');
  const authTitle = document.getElementById('authTitle');
  const authSwitch = document.getElementById('authSwitch');
  const modalMarker = 'mealmate_recovery';
  if (!cloud || !authBg || !authForm || !authTitle || !authSwitch) {
    console.warn('MealMate Recovery: missing account markup or Cloud adapter.');
    return;
  }

  // The link is inserted into the existing Kitchen Key panel; it appears only on Sign In.
  const forgotButton = document.createElement('button');
  forgotButton.type = 'button';
  forgotButton.id = 'mealMateForgotPassword';
  forgotButton.className = 'mm-forgot-link';
  forgotButton.textContent = 'Forgot password?';
  authSwitch.before(forgotButton);

  const overlay = document.createElement('div');
  overlay.id = 'mealMateRecoveryOverlay';
  overlay.className = 'mm-recovery-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="mm-recovery-panel" role="dialog" aria-modal="true"
      aria-labelledby="mmRecoveryTitle" aria-describedby="mmRecoveryIntro">
      <div class="mm-recovery-banner" aria-hidden="true">✳&#xFE0E; A NOTE FROM CHEF KYOKU ✳&#xFE0E;</div>
      <div class="mm-recovery-seal" aria-hidden="true">✉</div>
      <h2 id="mmRecoveryTitle">Find your Kitchen Key!</h2>
      <p id="mmRecoveryIntro">Enter the email for your kitchen. We'll send you a secure recovery link.</p>
      <form id="mmRecoveryEmailForm">
        <label class="mm-recovery-field" for="mmRecoveryEmail">Email address</label>
        <input id="mmRecoveryEmail" type="email" autocomplete="email" maxlength="254" required
          placeholder="chef@example.com" />
        <button type="submit" class="mm-recovery-primary" id="mmRecoverySend">Send recovery email</button>
      </form>
      <form id="mmRecoveryPasswordForm" hidden>
        <div class="mm-recovery-fieldset">
          <label for="mmRecoveryPassword">New password</label>
          <div class="mm-recovery-password-row">
            <input id="mmRecoveryPassword" type="password" autocomplete="new-password" minlength="8" required
              placeholder="At least 8 characters" />
            <button type="button" data-toggle="mmRecoveryPassword" aria-label="Show new password" aria-pressed="false">Show</button>
          </div>
        </div>
        <div class="mm-recovery-fieldset">
          <label for="mmRecoveryConfirm">Confirm new password</label>
          <div class="mm-recovery-password-row">
            <input id="mmRecoveryConfirm" type="password" autocomplete="new-password" minlength="8" required
              placeholder="Repeat your new password" />
            <button type="button" data-toggle="mmRecoveryConfirm" aria-label="Show confirmation password" aria-pressed="false">Show</button>
          </div>
        </div>
        <button class="mm-recovery-primary" id="mmRecoveryUpdate" type="submit">Update password</button>
        <button class="mm-recovery-inline" id="mmRecoveryAnother" type="button">Request another recovery link</button>
      </form>
      <p id="mmRecoveryMessage" class="mm-recovery-message" role="status" aria-live="polite"></p>
      <button type="button" id="mmRecoveryCancel" class="mm-recovery-secondary">Back to kitchen</button>
    </section>`;
  document.body.append(overlay);

  const byId = id => document.getElementById(id);
  const emailForm = byId('mmRecoveryEmailForm');
  const passwordForm = byId('mmRecoveryPasswordForm');
  const emailInput = byId('mmRecoveryEmail');
  const message = byId('mmRecoveryMessage');
  const cancel = byId('mmRecoveryCancel');
  let mode = 'email';
  let returnFocus = null;
  let requestInProgress = false;
  let recoveryVerified = false;
  let passwordUpdated = false;

  function setMessage(text, kind = 'info') {
    message.textContent = text;
    message.dataset.kind = kind;
  }
  function setMode(next) {
    mode = next;
    emailForm.hidden = next !== 'email';
    passwordForm.hidden = next !== 'password';
    byId('mmRecoveryTitle').textContent = next === 'password' ? 'A fresh Kitchen Key!' : 'Find your Kitchen Key!';
    byId('mmRecoveryIntro').textContent = next === 'password'
      ? 'Your recovery link is ready. Choose a new password to reopen your kitchen.'
      : 'Enter the email for your kitchen. We’ll send a secure recovery link.';
    cancel.textContent = next === 'password' ? 'Back to sign in' : 'Back to kitchen';
  }
  function show(which, note = '', kind = 'info') {
    if (!overlay.hidden && mode === which) {
      if (note) setMessage(note, kind);
      return;
    }
    returnFocus = document.activeElement;
    if (authBg.classList.contains('visible')) byId('closeAuth')?.click();
    setMode(which);
    setMessage(note, kind);
    overlay.hidden = false;
    document.body.classList.add('mm-recovery-open');
    (which === 'email' ? emailInput : byId('mmRecoveryPassword')).focus();
  }
  function cleanUrl() {
    if (!/^https?:$/.test(location.protocol)) return;
    const url = new URL(location.href);
    url.searchParams.delete(modalMarker);
    // Remove any temporary reset error parameters, without touching unrelated parameters.
    for (const key of ['error', 'error_code', 'error_description']) url.searchParams.delete(key);
    const clean = url.pathname + url.search;
    history.replaceState(history.state, '', clean);
  }
  function hide() {
    if (requestInProgress) return;
    overlay.hidden = true;
    document.body.classList.remove('mm-recovery-open');
    passwordForm.reset();
    setMessage('');
    cleanUrl();
    if (passwordUpdated) {
      passwordUpdated = false;
      document.querySelector('[data-action="account"]')?.click();
    } else returnFocus?.focus?.();
  }
  function syncForgotLink() {
    const canShow = cloud.enabled && !authForm.hidden && authTitle.textContent.trim() === 'Open your cloud kitchen';
    forgotButton.hidden = !canShow;
  }
  const watch = new MutationObserver(syncForgotLink);
  watch.observe(authTitle, {childList:true, characterData:true, subtree:true});
  watch.observe(authForm, {attributes:true, attributeFilter:['hidden']});
  syncForgotLink();

  forgotButton.addEventListener('click', () => {
    show('email');
    const existingEmail = byId('authEmail')?.value?.trim();
    if (existingEmail) emailInput.value = existingEmail;
  });
  cancel.addEventListener('click', hide);
  byId('mmRecoveryAnother').addEventListener('click', () => {
    recoveryVerified = false;
    setMode('email');
    setMessage('Enter your email to get a fresh recovery link.');
    emailInput.focus();
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) hide(); });
  document.addEventListener('keydown', e => {
    if (overlay.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); hide(); return; }
    if (e.key !== 'Tab') return;
    // Keep keyboard focus inside the modal.
    const focusables = [...overlay.querySelectorAll('button:not([hidden]):not(:disabled), input:not([hidden]):not(:disabled)')]
      .filter(el => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
    else if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
  });

  emailForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (requestInProgress) return;
    const email = emailInput.value.trim();
    if (!emailInput.reportValidity()) return;
    requestInProgress = true;
    byId('mmRecoverySend').disabled = true;
    setMessage('Sending your recovery instructions…');
    try {
      await cloud.sendPasswordRecovery(email);
      // Deliberately do not reveal whether this address has an account.
      setMessage('If that email has a MealMate account, a recovery link is on its way! Check your inbox and spam folder.', 'success');
    } catch (error) {
      // Do not echo potentially sensitive backend responses or account-existence information.
      if (String(error?.status) === '429') setMessage('Too many requests. Please try again later.', 'error');
      else setMessage('We couldn’t send the email right now. Please try again shortly.', 'error');
      console.warn('MealMate recovery email failed:', error?.status || error?.code || 'request failed');
    } finally {
      requestInProgress = false;
      byId('mmRecoverySend').disabled = false;
    }
  });

  overlay.addEventListener('click', e => {
    const button = e.target.closest('button[data-toggle]');
    if (!button) return;
    const input = byId(button.dataset.toggle);
    if (!input) return;
    const reveal = input.type === 'password';
    input.type = reveal ? 'text' : 'password';
    button.textContent = reveal ? 'Hide' : 'Show';
    button.setAttribute('aria-label', (reveal ? 'Hide' : 'Show') + ' password');
    button.setAttribute('aria-pressed', String(reveal));
  });

  passwordForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (requestInProgress) return;
    const first = byId('mmRecoveryPassword').value;
    const second = byId('mmRecoveryConfirm').value;
    if (first.length < 8) {setMessage('Choose a password with at least 8 characters.', 'error');return;}
    if (first !== second) {setMessage('The passwords don’t match yet. Please check both fields.', 'error');return;}
    requestInProgress = true;
    byId('mmRecoveryUpdate').disabled = true;
    setMessage('Updating your Kitchen Key…');
    try {
      // Verify the Supabase server recognizes the recovery session before updating.
      const user = await cloud.getRecoveryUser();
      if (!user) {
        setMessage('Your recovery link has expired or isn’t valid. Request another email to try again.', 'error');
        return;
      }
      const result = await cloud.setRecoveredPassword(first);
      passwordForm.reset();
      cleanUrl();
      recoveryVerified = false;
      passwordUpdated = true;
      if (result.signedOut) {
        setMessage('UMAI!!! Your password is updated! Sign in again using your new password.', 'success');
      } else {
        setMessage('Password updated! Please sign out before signing in with your new password.', 'success');
      }
      cancel.textContent = 'Back to sign in';
    } catch (error) {
      if (String(error?.status) === '422') setMessage('Supabase rejected that password. Please choose a stronger, different password.', 'error');
      else setMessage('Could not update the password. Your link may have expired; please request a new one.', 'error');
      console.warn('MealMate password update failed:', error?.status || error?.code || 'request failed');
    } finally {
      requestInProgress = false;
      byId('mmRecoveryUpdate').disabled = false;
    }
  });

  async function showRecoveryFromLink() {
    recoveryVerified = true;
    show('password', 'Checking your secure recovery link…');
    const user = await cloud.getRecoveryUser();
    if (overlay.hidden) return;
    if (user) setMessage('Your link is verified. Create a new password below.', 'success');
    else setMessage('That link could not be verified. Try refreshing once, or request another recovery email.', 'error');
  }
  cloud.onPasswordRecovery(() => { void showRecoveryFromLink(); });

  // Supabase may restore the session before the UI finishes initializing on an iPhone.
  // The query flag lets us render the recovery screen even if the event was earlier.
  // Clear any literal token fragment only after the Supabase client has parsed it.
  const query = new URLSearchParams(location.search);
  const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
  if (query.has(modalMarker) || hash.get('type') === 'recovery') {
    const error = query.get('error_code') || hash.get('error_code');
    if (error) {
      show('email', 'Your recovery link is invalid or expired. Enter your email to request another one.', 'error');
    } else {
      show('password', 'Checking your secure recovery link…');
      // The Cloud adapter initializes as part of app.js. Checking again slightly later
      // handles both fresh redirects and refreshes of the recovery URL.
      let attempts = 0;
      const check = async () => {
        if (overlay.hidden || !['password'].includes(mode) || recoveryVerified) return;
        const user = await cloud.getRecoveryUser();
        if (user) {recoveryVerified=true;setMessage('Your link is verified. Create a new password below.', 'success');}
        else if (++attempts < 8) setTimeout(check, 350);
        else setMessage('We couldn’t verify this recovery link. Request another email.', 'error');
      };
      setTimeout(check, 350);
    }
  }
})();
