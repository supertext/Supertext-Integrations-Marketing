# News covers from the plugins' guide screenshots: the screenshot centred on a light
# background in the site's colours (1600x800), so the news card's wide crop keeps it whole.
# Run from the folder that holds the plugin repos' clones:
#   node supertext-integrations-marketing/cms/scripts/own-covers.mjs /tmp/raw
#   python3 supertext-integrations-marketing/cms/scripts/make-covers.py /tmp/raw
# (the Swiss German guides get theirs from swiss-guide-covers.mjs).
# Then commit cms/src/seed/covers/ (the content update article-covers uploads new ones).
import os, sys
RAW = (sys.argv[1] if len(sys.argv) > 1 else '.') + '/'
from PIL import Image, ImageDraw, ImageFilter
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'seed', 'covers') + '/'
W,H=1600,800
def bg():
    im=Image.new('RGB',(W,H)); px=im.load()
    a=(0xe9,0xf9,0xef); b=(0xf2,0xf2,0xf2)
    for y in range(H):
        for x in range(0,W):
            t=(x/W*0.6+y/H*0.4)
            px[x,y]=tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))
    return im
BG=bg()
def cover(name, path, crop=None, maxw=1280, maxh=600):
    im=Image.open(path).convert('RGB')
    if crop: im=im.crop(crop)
    s=min(maxw/im.width, maxh/im.height, 2.0)
    im=im.resize((int(im.width*s), int(im.height*s)), Image.LANCZOS)
    c=BG.copy()
    x=(W-im.width)//2; y=(H-im.height)//2
    sh=Image.new('L',(W,H),0); ImageDraw.Draw(sh).rounded_rectangle((x+6,y+14,x+im.width+6,y+im.height+14),12,fill=70)
    sh=sh.filter(ImageFilter.GaussianBlur(18)); c.paste(Image.new('RGB',(W,H),(0,50,48)),(0,0),sh)
    m=Image.new('L',im.size,0); ImageDraw.Draw(m).rounded_rectangle((0,0,im.width-1,im.height-1),12,fill=255)
    c.paste(im,(x,y),m)
    c.save(OUT+name+'.png', optimize=True)
R=''
cover('wpml-strings', R+'wordpress-wpml-supertext-translation/docs/images/string-translations.png', crop=(0,0,1398,620))
cover('wordpress-wpml', R+'wordpress-wpml-supertext-translation/docs/images/editor-box-after.png')
cover('plugin-updates-november-2026', R+'joomla-supertext-translation/docs/images/export-dialog.png')
cover('craft-silverstripe-grav', R+'craftcms-supertext-translation/docs/images/01-translate-box.png')
cover('akeneo-pimcore-atropim', R+'akeneo-supertext-translation/docs/images/02-translate-dialog.png')
# Code examples (no interface to show) and this site's own pages.
cover('kotlin-sdk', RAW+'kotlin-sdk.png', maxw=1200, maxh=560)
cover('sdks', RAW+'sdks.png', maxw=1200, maxh=560)
cover('support-page', RAW+'support-page.png', maxh=620)
cover('roadmap', RAW+'roadmap.png', maxh=600)
cover('new-systems-on-the-roadmap', RAW+'new-systems-on-the-roadmap.png', maxh=620)
