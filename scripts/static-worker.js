// Production adapter only. The website is a static React + Vite application.
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
