#!/usr/bin/env python3
"""Poster images for the integration videos, from our own MP4s (never YouTube thumbnails).

Usage: python3 scripts/video-posters.py <folder with <Repo>.mp4 and <Repo>-install.mp4>

Writes web/public/videos/<slug>-demo.webp and <slug>-install.webp (1280x720, WebP) and the list
web/src/lib/video-posters.js. Needs ffmpeg and Pillow. The frame is taken at 70 % of the video
(the translated result in the demos, the settings screen in the install videos) unless FRAMES
names another second. Look at every new poster before committing it: no localhost, no secrets.
"""
import json, os, subprocess, sys, tempfile
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'web', 'public', 'videos')
MANIFEST = os.path.join(ROOT, 'web', 'src', 'lib', 'video-posters.js')

# Repo name (without -Supertext-Translation) → integration slug, where they differ.
SLUGS = {
    'Akeneo': 'akeneo-pim', 'Apostrophe': 'apostrophecms', 'CraftCms': 'craft-cms', 'djangoCMS': 'django-cms',
    'OrchardCore': 'orchard-core', 'Payload': 'payload-cms',
}
# Seconds where 70 % shows a dialog or too little: '<Repo>' (demo) or '<Repo>-install'.
FRAMES = {
    'Magento': 25.9, 'Umbraco': 26.3, 'PrestaShop': 28.7, 'Shopify': 15.6, 'Directus': 30.6,
    'Typo3-install': 36.9,
}


def duration(path):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]))


def main(folder):
    os.makedirs(OUT, exist_ok=True)
    posters = json.loads(open(MANIFEST).read().split('export default', 1)[1].rstrip().rstrip(';')) if os.path.exists(MANIFEST) else []
    for name in sorted(os.listdir(folder)):
        if not name.endswith('.mp4') or '-Supertext-Translation' not in name:
            continue
        repo, rest = name[:-4].split('-Supertext-Translation', 1)
        kind = 'install' if rest == '-install' else 'demo'
        slug = SLUGS.get(repo, repo.lower())
        path = os.path.join(folder, name)
        second = FRAMES.get(repo + ('-install' if kind == 'install' else ''), duration(path) * 0.7)
        with tempfile.TemporaryDirectory() as tmp:
            png = os.path.join(tmp, 'frame.png')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{second:.2f}', '-i', path, '-frames:v', '1', png], check=True)
            image = Image.open(png).convert('RGB').resize((1280, 720), Image.LANCZOS)
            target = os.path.join(OUT, f'{slug}-{kind}.webp')
            for quality in (78, 70, 62, 55):
                image.save(target, 'WEBP', quality=quality, method=6)
                if os.path.getsize(target) < 120_000:
                    break
        posters.append(f'{slug}-{kind}')
        print(f'{slug}-{kind}: {second:.1f} s, {os.path.getsize(target) // 1024} KB')
    with open(MANIFEST, 'w') as f:
        f.write('// Made by scripts/video-posters.py: <slug>-<kind> for every poster in public/videos.\n')
        f.write('export default ' + json.dumps(sorted(set(posters)), indent=2) + ';\n')


if __name__ == '__main__':
    main(sys.argv[1])
