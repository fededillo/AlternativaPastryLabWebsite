# Alternativa Pastry Lab

Sito statico su Cloudflare Workers. Il catalogo è vuoto: i prodotti si aggiungono in `public/data/prodotti.json`, senza immagini.

Pagine:

- `/` home
- `/catalogo.html` catalogo
- `/chi-sono.html` presentazione
- `/richiesta.html` richiesta e ordine

## Anteprima locale

Dalla cartella del progetto:

```bash
npx wrangler dev
```

Apri l’indirizzo che Wrangler stampa. L’invio del modulo passa da `worker.js`.

## Prodotti

`public/data/prodotti.json` è un array. Esempio di una scheda, quando vorrai inserirla:

```json
{
  "id": "torta-limone",
  "nome": "Torta al limone",
  "descrizione": "Pasta frolla e crema al limone.",
  "prezzo": 28,
  "categoria": "Torte"
}
```

Non c’è un campo immagine: le schede restano solo testo.

## GitHub Desktop

1. File → Add local repository e scegli questa cartella.
2. Se GitHub Desktop chiede di creare un repository, conferma.
3. Scrivi un commit e pubblica il repository con Publish repository.

## Cloudflare

Il sito si pubblica con Workers Builds. Il comando di deploy è `npx wrangler deploy`, senza comando di build.

In `wrangler.toml`, `name` deve essere identico al nome del Worker nel pannello Cloudflare. Se non coincide, la build segnala di aggiornare il file e apre una pull request.

`worker.js` riceve il modulo e risponde con un codice. Non invia ancora email e non salva l’ordine: va collegato prima di raccogliere richieste vere.
