/**
 * The hamburger menu of supertext.com (neo site, November 2026), so both sites show the same menu:
 * a promo card, the main pages in large type and the company pages. Links go to www.supertext.com.
 * Update it here when supertext.com's menu changes.
 */
const BASE = 'https://www.supertext.com';

const MENU = {
  en: {
    promo: 'Supertext lets companies translate better, faster, cheaper and more securely. From 0 to 100% automated.',
    promoLink: ['Learn more', '/en/enterprise'],
    main: [['Translator', '/en#translator'], ['Subscriptions', '/en/subscriptions'], ['Enterprise', '/en/enterprise'], ['Contact', '/en/contact']],
    side: [['Why Supertext?', '/en/why-supertext'], ['AI technology', '/en/technology'], ['Linguistic expertise', '/en/language-expertise'], ['About us', '/en/about-supertext'], ['Work at Supertext', '/en/work-at-supertext']],
  },
  de: {
    promo: 'Mit Supertext übersetzen Unternehmen besser, schneller, günstiger und sicherer. Von 0 % bis 100 % automatisiert.',
    promoLink: ['Mehr erfahren', '/de-CH/enterprise'],
    main: [['Übersetzer', '/de-CH#translator'], ['Abos', '/de-CH/abos'], ['Für Unternehmen', '/de-CH/enterprise'], ['Kontakt', '/de-CH/kontakt']],
    side: [['Warum Supertext?', '/de-CH/warum-supertext'], ['KI-Technologie', '/de-CH/technologie'], ['Sprachexpertise', '/de-CH/sprachexpertise'], ['Über uns', '/de-CH/ueber-supertext'], ['Arbeiten bei Supertext', '/de-CH/arbeiten-bei-supertext']],
  },
  fr: {
    promo: 'Avec Supertext, les entreprises obtiennent des traductions de meilleure qualité, plus rapides, plus économiques et plus sûres. Processus automatisés de 0 % à 100 %.',
    promoLink: ['En savoir plus', '/fr/enterprise'],
    main: [['Traducteur', '/fr#translator'], ['Abonnements', '/fr/abonnements'], ['Pour les entreprises', '/fr/enterprise'], ['Contact', '/fr/contact']],
    side: [['Pourquoi Supertext ?', '/fr/pourquoi-supertext'], ['Technologie IA', '/fr/technologie'], ['Expertise linguistique', '/fr/langue-expertise'], ['À propos de nous', '/fr/a-propos-supertext'], ['Travailler chez Supertext', '/fr/travailler-chez-supertext']],
  },
  it: {
    promo: 'Supertext offre alle aziende traduzioni migliori, più rapide, più convenienti e più sicure. Il tutto automatizzato dallo 0 al 100%.',
    promoLink: ['Scopri di più', '/it/enterprise'],
    main: [['Traduttore', '/it#translator'], ['Abbonamenti', '/it/abbonamenti'], ['Per le aziende', '/it/enterprise'], ['Contatti', '/it/contatto']],
    side: [['Perché Supertext?', '/it/perche-supertext'], ['Tecnologia IA', '/it/tecnologia'], ['Competenze linguistiche', '/it/linguaggio-esperti'], ['Chi siamo', '/it/supertext-sul-web'], ['Lavora da Supertext', '/it/lavorare-da-supertext']],
  },
};

const link = ([label, path]) => ({ label, url: `${BASE}${path}` });

export function supertextMenu(locale) {
  const m = MENU[locale] || MENU.en;
  return { promo: m.promo, promoLink: link(m.promoLink), main: m.main.map(link), side: m.side.map(link) };
}
