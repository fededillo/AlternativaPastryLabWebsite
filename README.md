# Alternativa Pastry Lab

Sito statico per Cloudflare Pages. Il catalogo è vuoto: i prodotti si aggiungono in `public/data/prodotti.json`, senza immagini.

Pagine:

- `/` home
- `/catalogo.html` catalogo
- `/chi-sono.html` presentazione
- `/richiesta.html` richiesta e ordine

## Anteprima locale

Dalla cartella del progetto:

```bash
npx wrangler pages dev public
```

Apri l’indirizzo che Wrangler stampa. L’invio del modulo funziona solo con questo comando, perché usa la funzione in `functions/api/richiesta.js`.

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

## Cloudflare Pages

Nel pannello Cloudflare: Workers & Pages → Create → Pages → Connect to Git.

- Framework preset: None
- Build command: vuoto
- Build output directory: `public`

La funzione `functions/api/richiesta.js` riceve il modulo e risponde con un codice. Non invia ancora email e non salva l’ordine: va collegata prima di raccogliere richieste vere.
