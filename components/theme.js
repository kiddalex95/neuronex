export function initThemeToggle() {
  const toggleBtn = document.querySelector('.theme-btn');
  const body = document.body;

  // Load saved theme from localStorage
  let currentTheme = localStorage.getItem('neuronex_theme') || 'light';
  if (currentTheme === 'dark') body.classList.add('dark');

  // Toggle on click
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('neuronex_theme', currentTheme);
  });
}