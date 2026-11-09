'use strict';

// The statistics page (November 2026): adoption from Supertext Plugin Health, development pace from
// GitHub, demand and support from this site. All numbers come in automatically (Statistics block);
// French and Italian (and German) come from the background translation.

const link = (label, url, style = 'primary', newTab = false) => ({ label, url, style, newTab });

const statisticsPage = {
  title: 'Statistics',
  slug: 'statistics',
  seo: {
    metaTitle: 'Supertext plugins in numbers',
    metaDescription:
      'How many sites use the Supertext translation plugins, which system versions and languages they run, how often we release and how fast we answer. Updated daily.',
  },
  blocks: [
    {
      __component: 'blocks.hero',
      layout: 'centered',
      eyebrow: 'Statistics',
      title: 'The plugins in numbers',
      subtitle:
        'How many sites translate with Supertext plugins, how often we ship updates, and what people ask for. Updated automatically every day.',
      primaryCta: link('Browse integrations', '/en/integrations'),
      secondaryCta: link('See the roadmap', '/en/roadmap', 'secondary'),
    },
    {
      __component: 'blocks.statistics',
      showAdoption: true,
      showPace: true,
      showDemand: true,
      minCount: 10,
    },
    {
      __component: 'blocks.faq',
      title: 'About these numbers',
      items: [
        {
          question: 'Where do the numbers come from?',
          answer:
            'Installations, versions and languages come from the plugins themselves: they report their version to Supertext when their settings are saved and after updates. Releases and issues come from the plugins’ public GitHub repositories, requests and support from this website.',
        },
        {
          question: 'What do the plugins send?',
          answer:
            'The site address, the plugin, system and runtime versions and whether the API key works; the language settings only when an administrator sends them. Never content, API keys or personal data. Administrators can turn it off in the plugin settings (*Send version information to Supertext*).',
        },
        {
          question: 'Why don’t all plugins show a number?',
          answer:
            'We show numbers only from ten installations up, so no single site can be recognised. Plugins below that are listed as new.',
        },
        {
          question: 'Do test and development sites count?',
          answer: 'No. Installations on local addresses (localhost, .test and similar) are left out.',
        },
      ],
    },
    {
      __component: 'blocks.cta-band',
      tone: 'dark',
      title: 'Missing your system?',
      text: 'Request a plugin: every request counts when we decide what to build next.',
      primaryCta: link('Request a plugin', '/en/support?kind=request'),
      secondaryCta: link('See the roadmap', '/en/roadmap', 'secondary'),
    },
  ],
};

const footerStatistics = {
  url: '/en/statistics',
  label: { en: 'Statistics', de: 'Statistiken', fr: 'Statistiques', it: 'Statistiche' },
};

module.exports = { statisticsPage, footerStatistics };
