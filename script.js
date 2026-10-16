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

    // Leaflet нужно пересчитать размеры, когда карта
    // открывается внутри ранее скрытого раздела.
    if (routeMap && targetSection.id === "guide") {
      setTimeout(() => {
        routeMap.invalidateSize();
      }, 150);
    }
  };

  // Создаём кнопки навигации автоматически из разделов HTML.
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

  // Координаты основных точек маршрута.
  // Для удалённых мест координаты могут быть приблизительными.
  const routePoints = [
    {
      number: 1,
      name: "Курильское озеро",
      lat: 51.45,
      lng: 157.10,
      transport: "Вахтовка"
    },
    {
      number: 2,
      name: "Посёлок Паужетка",
      lat: 51.47,
      lng: 156.75,
      transport: "Вахтовка"
    },
    {
      number: 3,
      name: "Кутхины баты",
      lat: 51.55,
      lng: 156.50,
      transport: "Вахтовка"
    },
    {
      number: 4,
      name: "Авачинская бухта",
      lat: 52.90,
      lng: 158.50,
      transport: "Катер"
    },
    {
      number: 5,
      name: "Скалы Три Брата",
      lat: 52.87,
      lng: 158.68,
      transport: "Катер"
    },
    {
      number: 6,
      name: "Морские птицы и рыбалка",
      lat: 52.88,
      lng: 158.62,
      transport: "Катер"
    },
    {
      number: 7,
      name: "Вулкан Горелый",
      lat: 52.56,
      lng: 158.04,
      transport: "Джип"
    },
    {
      number: 8,
      name: "Вулкан Толбачик",
      lat: 55.83,
      lng: 160.33,
      transport: "Джип"
    },
    {
      number: 9,
      name: "Мёртвый лес",
      lat: 55.76,
      lng: 160.30,
      transport: "Джип"
    },
    {
      number: 10,
      name: "Лавовые поля",
      lat: 55.70,
      lng: 160.28,
      transport: "Джип"
    },
    {
      number: 11,
      name: "Халактырский пляж",
      lat: 52.97,
      lng: 158.86,
      transport: "Джип"
    },
    {
      number: 12,
      name: "Паратунка",
      lat: 52.96,
      lng: 158.25,
      transport: "Джип"
    }
  ];

  const mapElement = document.getElementById("kamchatka-route-map");

  // Если карта или библиотека Leaflet не загрузились,
  // навигация по остальным разделам всё равно работает.
  if (!mapElement || typeof L === "undefined") {
    console.warn(
        "Карта не загружена. Проверь подключение к интернету и Leaflet."
    );
    return;
  }

  // Создаём карту.
  routeMap = L.map(mapElement, {
    scrollWheelZoom: false
  }).setView([53.7, 158.5], 5);

  // Подложка OpenStreetMap.
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">' +
        "OpenStreetMap</a>",
    maxZoom: 18
  }).addTo(routeMap);

  // Добавляем маркеры с номерами и описаниями.
  const markerCoordinates = [];

  routePoints.forEach((point) => {
    const coordinates = [point.lat, point.lng];
    markerCoordinates.push(coordinates);

    const markerIcon = L.divIcon({
      className: "route-marker-wrapper",
      html: `<div class="route-marker">${point.number}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker(coordinates, {
      icon: markerIcon,
      title: point.name
    })
        .addTo(routeMap)
        .bindPopup(
            `<strong>${point.number}. ${point.name}</strong>` +
            `<br>Транспорт: ${point.transport}`
        );
  });

  // Линия показывает общий порядок точек, а не точную дорогу.
  L.polyline(markerCoordinates, {
    color: "#ff5722",
    weight: 3,
    opacity: 0.75,
    dashArray: "7 8"
  }).addTo(routeMap);

  // Показываем все точки маршрута в пределах карты.
  routeMap.fitBounds(markerCoordinates, {
    padding: [30, 30]
  });

  // Если пользователь открыл раздел карты после загрузки страницы,
  // пересчитываем размеры карты.
  window.addEventListener("resize", () => {
    routeMap.invalidateSize();
  });
});