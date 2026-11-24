# Integration logos

Official logos of systems that [Simple Icons](https://simpleicons.org) has no icon for, as
512×512 PNGs (converted from SVG, trimmed and centred, so no SVG from outside is served). On every
start `integrationLogos` (`cms/src/content-updates.js`) uploads each one as the integration's logo
where none is set, and replaces it when the file changes while it is still the automatic one; the
news covers (`cms/scripts/logo-covers.mjs`) use them too. Symbols fill 60 % of the square, wordmarks
84 % of its width; where a wordmark has its own symbol (Silverstripe, AtroPIM), only the symbol is
used, as the projects do for their favicons.

| File | Source |
| --- | --- |
| `adobe-indesign.png`, `adobe-illustrator.png`, `magento.png` | [SVG Logos](https://github.com/gilbarbara/logos) (CC0 collection of the brands' logos), via the npm package `@iconify-json/logos` |
| `microsoft-365.png` | The Microsoft logo from the same collection |
| `adobe-experience-manager.png` | The Adobe logo from the same collection (no Experience Manager product logo is available there) |
| `django-cms.png` | `docs/images/django-cms-logo.svg` in [django-cms/django-cms](https://github.com/django-cms/django-cms) |
| `silverstripe.png` | The symbol of `.storybook/theme/images/logo.svg` in [silverstripe/silverstripe-admin](https://github.com/silverstripe/silverstripe-admin) |
| `akeneo-pim.png` | `src/Akeneo/Platform/Bundle/UIBundle/Resources/public/images/logo.svg` in [akeneo/pim-community-dev](https://github.com/akeneo/pim-community-dev) |
| `atropim.png` | The symbol of `_assets/atropim-logo.svg` in [atrocore/atropim](https://github.com/atrocore/atropim) |
| `magnolia.png` | Magnolia's app icon, supplied by Remy (224 px, scaled to 512) |
| `claude-chatgpt-and-copilot.png` | Our own icon (a chat bubble with a connector), drawn by `cms/scripts/assistant-logo.mjs`: the integration covers three brands, so it uses none of their logos |
| `neos.png` | `Neos.Neos/Resources/Public/Images/Login/Logo.svg` in [neos/neos-development-collection](https://github.com/neos/neos-development-collection) |

The logos are trademarks of their owners and are used only to name the system the plugin works with.
