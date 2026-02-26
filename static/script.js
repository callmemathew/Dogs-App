document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");
  const tbody = document.getElementById("dogTableBody");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const pageInfo = document.getElementById("pageInfo");

  const limitDefault = 10;
  const FAKE_DELAY_MS = 3000;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const getPage = () => {
    const u = new URL(window.location.href);
    const p = parseInt(u.searchParams.get("page") || "1", 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  };

  const getLimit = () => {
    const u = new URL(window.location.href);
    const l = parseInt(u.searchParams.get("limit") || String(limitDefault), 10);
    return Number.isFinite(l) && l > 0 ? l : limitDefault;
  };

  const setPage = (newPage) => {
    const u = new URL(window.location.href);
    u.searchParams.set("page", String(newPage));
    if (!u.searchParams.get("limit"))
      u.searchParams.set("limit", String(limitDefault));
    history.pushState({}, "", u);
    loadData();
  };

  const showLoader = () => {
    document.body.classList.add("is-loading");
    loader.classList.remove("hide");
    content.classList.remove("show");
  };

  const hideLoader = () => {
    loader.classList.add("hide");
    document.body.classList.remove("is-loading");
    document.body.classList.add("loaded");
  };

  async function loadData() {
    const page = getPage();
    const limit = getLimit();

    try {
      showLoader();

      const [dogs] = await Promise.all([
        fetch(`/api/dogs?page=${page}&limit=${limit}`, {
          cache: "no-store",
        }).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }),
        sleep(FAKE_DELAY_MS),
      ]);

      if (!Array.isArray(dogs) || dogs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">Нет данных для этой страницы</td></tr>`;
      } else {
        tbody.innerHTML = dogs
          .map(
            (d) => `
              <tr>
                <td>${d.number ?? ""}</td>
                <td>${d.breed ?? ""}</td>
                <td>${d.name ?? ""}</td>
                <td><img src="${d.photo ?? ""}" alt="${d.breed ?? ""}" width="100"></td>
                <td>${d.location ?? ""}</td>
              </tr>
            `,
          )
          .join("");
      }

      if (pageInfo) pageInfo.textContent = `page=${page} | limit=${limit}`;

      hideLoader();

      requestAnimationFrame(() => {
        void content.offsetWidth;
        content.classList.add("show");
      });

      const title = document.querySelector(".saber-title");
      requestAnimationFrame(() => title?.classList.add("ignite"));
    } catch (e) {
      console.error(e);
      loader.textContent = "Ошибка загрузки данных";
      document.body.classList.remove("is-loading");
    }
  }

  prevBtn?.addEventListener("click", () => {
    const p = getPage();
    if (p > 1) setPage(p - 1);
  });

  nextBtn?.addEventListener("click", () => {
    const p = getPage();
    setPage(p + 1);
  });

  // первый запуск
  loadData();
});
