document.addEventListener("DOMContentLoaded", () => {
  const sections = [...document.querySelectorAll("#content section")];
  const tabs = document.getElementById("tabs");
  let routeMap = null;

  const activateSection = (sectionId) => {
    const targetSection =
        sections.find((section) => section.id === sectionId) || sections[0];

    if (!targetSection) {
      return;
    }

    sections.forEach((item) => {
      item.classList.toggle("active", item.id === targetSection.id);
    });

    tabs.querySelectorAll("a").forEach((tab) => {
      const isActive = tab.dataset.sectionId === targetSection.id;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-current", isActive ? "page" : "false");
    });

  };

  sections.forEach((section) => {
    const link = document.createElement("a");

    link.href = `#${section.id}`;
    link.textContent = section.dataset.title || section.id;
    link.dataset.sectionId = section.id;
    link.classList.remove("active");
    link.setAttribute("aria-controls", section.id);
    link.setAttribute("aria-current", "false");

    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetHash = `#${section.id}`;
      if (window.location.hash === targetHash) {
        activateSection(section.id);
        return;
      }
      window.location.hash = section.id;
    });

    const listItem = document.createElement("li");
    listItem.appendChild(link);
    tabs.appendChild(listItem);
  });

  const initialHash = decodeURIComponent(window.location.hash.slice(1));
  activateSection(initialHash);

  window.addEventListener("hashchange", () => {
    const hashSection = decodeURIComponent(window.location.hash.slice(1));
    if (sections.some((section) => section.id === hashSection)) {
      activateSection(hashSection);
    }
  });

});