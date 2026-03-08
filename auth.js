/* ============================================
   DRIP — auth.js (simplified)
   Token is set by login.html
   This file just reads it and updates navbar
   ============================================ */

function getToken() {
  return sessionStorage.getItem('drip-token');
}

function getUser() {
  const u = sessionStorage.getItem('drip-user');
  return u ? JSON.parse(u) : null;
}

function handleLogout() {
  sessionStorage.removeItem('drip-token');
  sessionStorage.removeItem('drip-user');
  window.location.href = 'login.html';
}

function updateNavbarUserState() {
  const user      = getUser();
  const authBtn   = document.getElementById('authBtn');
  const greeting  = document.getElementById('userGreeting');
  const firstName = document.getElementById('userFirstName');
  const logoutBtn = document.getElementById('logoutBtn');

  if (user && getToken()) {
    if (authBtn)   authBtn.style.display   = 'none';
    if (greeting)  greeting.classList.add('visible');
    if (firstName) firstName.textContent   = user.firstName;
    if (logoutBtn) logoutBtn.style.display = 'flex';
  } else {
    if (authBtn)   authBtn.style.display   = 'flex';
    if (greeting)  greeting.classList.remove('visible');
    if (firstName) firstName.textContent   = '';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

/* clicking the person icon goes to login page */
document.getElementById('authBtn')?.addEventListener('click', () => {
  window.location.href = 'login.html';
});

/* init */
updateNavbarUserState();