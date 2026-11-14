import { Calendar } from '@strapi/icons';

// Labels of the editorial calendar (pages/EditorialCalendar.jsx) in the admin's languages.
const CALENDAR = {
  en: {
    title: 'Editorial calendar',
    subtitle: 'Ideas and work in progress, for news posts and improvements to the site. Draft articles count as in progress; scheduled articles appear on the site at their date. Only signed-in editors see this page.',
    newEntry: 'New idea', newArticle: 'New article',
    ideas: 'Ideas', inProgress: 'In progress', scheduled: 'Scheduled articles', done: 'Done and published',
    empty: 'Nothing here yet.', draftArticle: 'Draft article',
    'col.date': 'Date', 'col.title': 'Title', 'col.type': 'Type', 'col.languages': 'Languages',
    'type.news': 'News', 'type.improvement': 'Improvement',
    'locale.published': 'published', 'locale.modified': 'published, with unpublished changes', 'locale.draft': 'draft', 'locale.missing': 'not translated yet',
  },
  de: {
    title: 'Redaktionsplan',
    subtitle: 'Ideen und Arbeit in Umsetzung, für News-Beiträge und Verbesserungen der Website. Artikel-Entwürfe gelten als in Umsetzung; terminierte Artikel erscheinen an ihrem Datum auf der Website. Nur angemeldete Redakteurinnen und Redakteure sehen diese Seite.',
    newEntry: 'Neue Idee', newArticle: 'Neuer Artikel',
    ideas: 'Ideen', inProgress: 'In Umsetzung', scheduled: 'Terminierte Artikel', done: 'Erledigt und veröffentlicht',
    empty: 'Noch nichts hier.', draftArticle: 'Artikel-Entwurf',
    'col.date': 'Datum', 'col.title': 'Titel', 'col.type': 'Art', 'col.languages': 'Sprachen',
    'type.news': 'News', 'type.improvement': 'Verbesserung',
    'locale.published': 'veröffentlicht', 'locale.modified': 'veröffentlicht, mit unveröffentlichten Änderungen', 'locale.draft': 'Entwurf', 'locale.missing': 'noch nicht übersetzt',
  },
  fr: {
    title: 'Calendrier éditorial',
    subtitle: 'Idées et travaux en cours, pour les actualités et les améliorations du site. Les brouillons d’articles comptent comme en cours ; les articles programmés apparaissent sur le site à leur date. Seuls les rédacteurs connectés voient cette page.',
    newEntry: 'Nouvelle idée', newArticle: 'Nouvel article',
    ideas: 'Idées', inProgress: 'En cours', scheduled: 'Articles programmés', done: 'Terminés et publiés',
    empty: 'Rien pour l’instant.', draftArticle: 'Brouillon d’article',
    'col.date': 'Date', 'col.title': 'Titre', 'col.type': 'Type', 'col.languages': 'Langues',
    'type.news': 'Actualité', 'type.improvement': 'Amélioration',
    'locale.published': 'publié', 'locale.modified': 'publié, avec des modifications non publiées', 'locale.draft': 'brouillon', 'locale.missing': 'pas encore traduit',
  },
  it: {
    title: 'Piano editoriale',
    subtitle: 'Idee e lavori in corso, per le notizie e i miglioramenti del sito. Le bozze di articoli contano come in corso; gli articoli programmati appaiono sul sito alla loro data. Solo i redattori che hanno effettuato l’accesso vedono questa pagina.',
    newEntry: 'Nuova idea', newArticle: 'Nuovo articolo',
    ideas: 'Idee', inProgress: 'In corso', scheduled: 'Articoli programmati', done: 'Completati e pubblicati',
    empty: 'Ancora niente.', draftArticle: 'Bozza di articolo',
    'col.date': 'Data', 'col.title': 'Titolo', 'col.type': 'Tipo', 'col.languages': 'Lingue',
    'type.news': 'Notizia', 'type.improvement': 'Miglioramento',
    'locale.published': 'pubblicato', 'locale.modified': 'pubblicato, con modifiche non pubblicate', 'locale.draft': 'bozza', 'locale.missing': 'non ancora tradotto',
  },
};
const prefixed = (messages) => Object.fromEntries(Object.entries(messages).map(([k, v]) => [`editorial-calendar.${k}`, v]));

export default {
  config: {
    // The admin follows each user's chosen interface language.
    locales: ['de', 'fr', 'it'],
    translations: Object.fromEntries(Object.entries(CALENDAR).map(([locale, messages]) => [locale, prefixed(messages)])),
  },
  register(app) {
    app.addMenuLink({
      to: 'editorial-calendar',
      icon: Calendar,
      intlLabel: { id: 'editorial-calendar.title', defaultMessage: 'Editorial calendar' },
      Component: () => import('./pages/EditorialCalendar'),
      permissions: [{ action: 'plugin::content-manager.explorer.read', subject: 'api::article.article' }],
    });
  },
  bootstrap() {},
};
