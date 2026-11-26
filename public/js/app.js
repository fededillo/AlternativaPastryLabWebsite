const STORAGE_KEY = "apl-richiesta";

function readRighe() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter((riga) => riga && riga.id && riga.nome) : [];
  } catch {
    return [];
  }
}

function writeRighe(righe) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(righe));
  updateBadge();
}

function updateBadge() {
  const count = readRighe().reduce((sum, riga) => sum + Number(riga.quantita || 0), 0);
  document.querySelectorAll("[data-richiesta-count]").forEach((node) => {
    node.textContent = String(count);
    node.hidden = count === 0;
  });
}

function formatPrezzo(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(number);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function renderCatalogo() {
  const root = document.querySelector("[data-catalogo]");
  if (!root) return;

  fetch("/data/prodotti.json")
    .then((response) => {
      if (!response.ok) throw new Error("catalogo");
      return response.json();
    })
    .then((prodotti) => {
      root.replaceChildren();
      if (!Array.isArray(prodotti) || prodotti.length === 0) {
        const box = el("div", "empty");
        box.append(
          el("p", "eyebrow", "Catalogo"),
          el("h2", null, "Nessun prodotto, per ora."),
          el("p", "lede", "Le schede compariranno qui quando aggiungerai voci in prodotti.json."),
        );
        const link = el("a", "button", "Scrivi una richiesta");
        link.href = "/richiesta.html";
        box.append(link);
        root.append(box);
        return;
      }

      const list = el("div", "catalogo");
      prodotti.forEach((prodotto) => {
        if (!prodotto || !prodotto.id || !prodotto.nome) return;
        const card = el("article", "product");
        if (prodotto.categoria) card.append(el("p", "meta", prodotto.categoria));
        card.append(el("h3", null, prodotto.nome));
        if (prodotto.descrizione) card.append(el("p", null, prodotto.descrizione));
        const footer = el("footer");
        footer.append(el("span", "price", formatPrezzo(prodotto.prezzo)));
        const button = el("button", "button small", "Aggiungi alla richiesta");
        button.type = "button";
        button.addEventListener("click", () => addProdotto(prodotto, button));
        footer.append(button);
        card.append(footer);
        list.append(card);
      });
      root.append(list);
    })
    .catch(() => {
      root.replaceChildren(el("div", "empty", "Impossibile leggere il catalogo."));
    });
}

function addProdotto(prodotto, button) {
  const righe = readRighe();
  const existing = righe.find((riga) => riga.id === prodotto.id);
  if (existing) existing.quantita = Math.min(99, Number(existing.quantita) + 1);
  else righe.push({ id: prodotto.id, nome: prodotto.nome, quantita: 1 });
  writeRighe(righe);
  button.textContent = "Aggiunto";
}

function renderRighe() {
  const root = document.querySelector("[data-righe]");
  if (!root) return;
  const righe = readRighe();
  root.replaceChildren();

  if (righe.length === 0) {
    root.append(el("p", "lede", "Nessun prodotto in richiesta. Puoi comunque scrivere cosa ti serve."));
    return;
  }

  righe.forEach((riga) => {
    const row = el("div", "riga");
    const copy = el("p");
    copy.append(el("strong", null, riga.nome));
    const qty = el("div", "qty");
    const minus = el("button", null, "−");
    const plus = el("button", null, "+");
    minus.type = "button";
    plus.type = "button";
    minus.setAttribute("aria-label", `Diminuisci ${riga.nome}`);
    plus.setAttribute("aria-label", `Aumenta ${riga.nome}`);
    minus.addEventListener("click", () => changeQty(riga.id, -1));
    plus.addEventListener("click", () => changeQty(riga.id, 1));
    qty.append(minus, el("span", null, String(riga.quantita)), plus);
    const remove = el("button", "button secondary small", "Togli");
    remove.type = "button";
    remove.addEventListener("click", () => changeQty(riga.id, -99));
    row.append(copy, qty, remove);
    root.append(row);
  });
}

function changeQty(id, delta) {
  const righe = readRighe()
    .map((riga) => riga.id === id ? { ...riga, quantita: Number(riga.quantita) + delta } : riga)
    .filter((riga) => riga.quantita > 0);
  writeRighe(righe);
  renderRighe();
}

function bindForm() {
  const form = document.querySelector("[data-richiesta-form]");
  if (!form) return;
  const status = document.querySelector("[data-status]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    data.righe = readRighe();
    status.className = "";
    status.textContent = "Invio in corso…";

    try {
      const response = await fetch("/api/richiesta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json().catch(() => ({}));
      if (response.status === 404) {
        status.className = "error";
        status.textContent = "L’invio si attiva su Cloudflare Pages, oppure con l’anteprima Wrangler.";
        return;
      }
      if (!response.ok || !payload.ok) {
        status.className = "error";
        status.textContent = payload.errore || "Invio non riuscito.";
        return;
      }
      writeRighe([]);
      renderRighe();
      form.reset();
      status.className = "notice";
      status.textContent = `Richiesta registrata. Riferimento ${payload.riferimento}.`;
    } catch {
      status.className = "error";
      status.textContent = "Invio non disponibile. Avvia l’anteprima con Wrangler oppure pubblica il sito su Cloudflare Pages.";
    }
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

updateBadge();
renderCatalogo();
renderRighe();
bindForm();
