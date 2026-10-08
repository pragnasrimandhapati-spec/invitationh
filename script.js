(() => {
  const storage = window.sessionStorage;
  const guestForm = document.querySelector('#guest-form');
  const guestArea = document.querySelector('#guest-area');
  const welcomeTitle = document.querySelector('#welcome-title');
  const thanksName = document.querySelector('#thanks-name');
  const feedbackForm = document.querySelector('#feedback-form');
  const thankYou = document.querySelector('#thank-you');
  const guestInput = document.querySelector('#guest-name');
  const reviewInput = document.querySelector('#review');
  const petalLayer = document.querySelector('.petal-layer');
  const flowerColors = ['#dc7380', '#efbd61', '#e68f64', '#f2d8ba', '#ad7888', '#cf9c4c'];
  const key = 'mandhapati-housewarming-guest';

  // Flowing petals create a soft festive frame without making the invitation hard to read.
  for (let i = 0; i < 26; i += 1) {
    const petal = document.createElement('i');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.background = flowerColors[i % flowerColors.length];
    petal.style.animationDuration = `${12 + Math.random() * 15}s`;
    petal.style.animationDelay = `${-Math.random() * 26}s`;
    petal.style.transform = `scale(${0.65 + Math.random() * 0.8})`;
    petalLayer.appendChild(petal);
  }

  const readGuest = () => {
    try { return JSON.parse(storage.getItem(key) || 'null'); } catch { return null; }
  };
  const saveGuest = (guest) => storage.setItem(key, JSON.stringify(guest));
  const showGuest = (guest) => {
    guestForm.hidden = true;
    guestArea.hidden = false;
    welcomeTitle.textContent = `Welcome, ${guest.name}!`;
    thanksName.textContent = guest.name;
    if (guest.rating) feedbackForm.elements.rating.value = guest.rating;
    reviewInput.value = guest.review || '';
    if (guest.complete) {
      feedbackForm.hidden = true;
      thankYou.hidden = false;
    }
  };

  const priorVisit = readGuest();
  if (priorVisit?.name) showGuest(priorVisit);

  guestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = guestInput.value.trim();
    if (!name) return;
    const guest = { ...(readGuest() || {}), name };
    saveGuest(guest);
    showGuest(guest);
    guestArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  feedbackForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!feedbackForm.reportValidity()) return;
    const guest = readGuest() || { name: 'Guest' };
    guest.rating = feedbackForm.elements.rating.value;
    guest.review = reviewInput.value.trim();
    guest.complete = true;
    saveGuest(guest);
    thanksName.textContent = guest.name;
    feedbackForm.hidden = true;
    thankYou.hidden = false;
    thankYou.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.querySelector('#edit-note').addEventListener('click', () => {
    const guest = readGuest() || {};
    guest.complete = false;
    saveGuest(guest);
    thankYou.hidden = true;
    feedbackForm.hidden = false;
  });
})();
