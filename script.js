const sections = [...document.querySelectorAll('main section')];
const tabs = document.getElementById('tabs');

sections.forEach((section, index) => {
  const button = document.createElement('button');
  button.textContent = section.dataset.title;
  button.className = index === 0 ? 'active' : '';
  button.addEventListener('click', () => {
    sections.forEach((s) => s.classList.remove('active'));
    [...tabs.querySelectorAll('button')].forEach((b) => b.classList.remove('active'));
    section.classList.add('active');
    button.classList.add('active');
  });
  const li = document.createElement('li');
  li.appendChild(button);
  tabs.appendChild(li);
});
