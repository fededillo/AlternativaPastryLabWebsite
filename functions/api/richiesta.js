const LIMITI = {
  nome: 80,
  email: 120,
  telefono: 40,
  messaggio: 2000,
  modalita: 40,
  data: 20,
};

function testo(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function righeValide(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 30).map((riga) => ({
    id: testo(riga?.id, 80),
    nome: testo(riga?.nome, 120),
    quantita: Math.min(99, Math.max(1, Number(riga?.quantita) || 1)),
  })).filter((riga) => riga.id && riga.nome);
}

export async function onRequestPost({ request }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, errore: "Richiesta non valida." }, { status: 400 });
  }

  const richiesta = {
    nome: testo(data.nome, LIMITI.nome),
    email: testo(data.email, LIMITI.email),
    telefono: testo(data.telefono, LIMITI.telefono),
    modalita: testo(data.modalita, LIMITI.modalita),
    data: testo(data.data, LIMITI.data),
    messaggio: testo(data.messaggio, LIMITI.messaggio),
    righe: righeValide(data.righe),
  };

  if (!richiesta.nome || !richiesta.email || !richiesta.messaggio) {
    return Response.json(
      { ok: false, errore: "Nome, email e messaggio sono obbligatori." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(richiesta.email)) {
    return Response.json({ ok: false, errore: "Email non valida." }, { status: 400 });
  }

  const riferimento = crypto.randomUUID().slice(0, 8).toUpperCase();

  return Response.json({
    ok: true,
    riferimento,
    avviso: "Endpoint attivo. Collega un invio email o un database prima di usarlo con clienti veri.",
  });
}
