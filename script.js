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

(() => {
  let typedText = "";

  document.addEventListener("keydown", (event) => {
    if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.key.length !== 1
    ) return;

    typedText = (
        typedText + event.key.toLocaleLowerCase("ru")
    ).slice(-7);

    if (typedText.endsWith("десятка")) {
      typedText = "";
      showTeacherEasterEgg();
    }
  });

  function showTeacherEasterEgg() {
    if (document.querySelector(".teacher-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "teacher-overlay";

    overlay.innerHTML = `
      <div class="teacher-card">
        <button class="teacher-close" aria-label="Закрыть">&times;</button>

        <div class="teacher-label">
          ✦ СЕКРЕТНЫЙ УРОВЕНЬ ОТКРЫТ ✦
        </div>

        <div class="teacher-emoji">🧑‍🏫</div>

        <div class="teacher-rating">★ 10/10 ★</div>

        <h2>ВЫ ЛУЧШИЙ!</h2>

        <p>
          Уровень харизмы: <strong>Супер-пуперский</strong>.<br>
          Уровень преподавания: <strong>вне конкуренции</strong>.
        </p>

        <div class="teacher-stamp">
          ОДОБРЕНО<br>
          <strong>НА 10/10</strong>
        </div>

        <button class="teacher-continue">
          Продолжить быть легендой ↗
        </button>

        <div class="teacher-footer">
          Вы нашли пасхалку. Теперь это официально.
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    function closePopup() {
      overlay.classList.add("teacher-hiding");

      setTimeout(() => overlay.remove(), 250);

      document.removeEventListener("keydown", escapeHandler);
    }

    function escapeHandler(event) {
      if (event.key === "Escape") closePopup();
    }

    overlay.querySelector(".teacher-close")
        .addEventListener("click", closePopup);

    overlay.querySelector(".teacher-continue")
        .addEventListener("click", closePopup);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closePopup();
    });

    document.addEventListener("keydown", escapeHandler);
  }
})();

