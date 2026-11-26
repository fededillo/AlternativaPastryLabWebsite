import { onRequestPost } from "./functions/api/richiesta.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/richiesta") {
      if (request.method !== "POST") {
        return new Response("Metodo non consentito.", { status: 405 });
      }
      return onRequestPost({ request, env });
    }
    return env.ASSETS.fetch(request);
  },
};
