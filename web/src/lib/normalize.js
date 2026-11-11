/** Lower case without accents, so "typo3", "Créer" and "creer" match. Used on the server and in the browser. */
export const normalize = (text) =>
  String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
