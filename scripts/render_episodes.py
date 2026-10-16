#!/usr/bin/env python3
"""Render episodes.json into the static homepage. No dependencies required."""
from datetime import date
from html import escape
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent.parent

def render():
    episodes = json.loads((ROOT / 'episodes.json').read_text())
    cards = []
    for episode in episodes:
        video_id = episode['video_id']
        if not re.fullmatch(r'[A-Za-z0-9_-]{11}', video_id):
            raise ValueError(f'Invalid YouTube ID: {video_id}')
        if not (ROOT / 'assets' / 'episodes' / f'{video_id}.jpg').is_file():
            raise ValueError(f'Missing thumbnail for {video_id}')
        title = escape(episode['title'])
        guest = escape(episode['guest'])
        full_title = escape(f"{episode['title']} | {episode['guest']}", quote=True)
        watch_url = f'https://www.youtube.com/watch?v={video_id}'
        video_attrs = f'data-video="{video_id}" data-title="{full_title}" href="{watch_url}" target="_blank" rel="noopener noreferrer"'
        published = date.fromisoformat(episode['published'])
        date_text = published.strftime('%d %b %Y')
        cards.append(f'''        <article class="episode-card" data-topics="{escape(' '.join(episode['topics']))}" data-keywords="{escape(episode['keywords'], quote=True)}">
          <a class="episode-image" {video_attrs} aria-label="Watch {full_title}"><img src="assets/episodes/{video_id}.jpg" width="720" height="404" alt="" loading="lazy"><span class="episode-hover"><svg class="icon" aria-hidden="true"><use href="#icon-play"/></svg></span><span class="video-duration">{escape(episode['duration'])}</span></a>
          <p class="episode-meta"><span class="episode-topic">{escape(episode['label'])}</span><span aria-hidden="true">·</span><time datetime="{published.isoformat()}">{date_text}</time></p>
          <h3><a {video_attrs}>{title}</a></h3>
          <p class="episode-guest">With {guest}</p>
          <div class="episode-links"><a {video_attrs} aria-label="Watch conversation with {guest}"><svg class="icon" aria-hidden="true"><use href="#icon-play"/></svg> Watch episode</a><a class="episode-notes" href="{escape(episode['notes_url'], quote=True)}" target="_blank" rel="noopener noreferrer" aria-label="Show notes for the conversation with {guest}">Show notes <svg class="icon" aria-hidden="true"><use href="#icon-external"/></svg></a></div>
        </article>''')
    html_path = ROOT / 'index.html'
    html = html_path.read_text()
    start = '<!-- EPISODES_START -->'
    end = '<!-- EPISODES_END -->'
    if html.count(start) != 1 or html.count(end) != 1:
        raise ValueError('Expected one pair of episode markers in index.html')
    before, remainder = html.split(start)
    _, after = remainder.split(end)
    html = before + start + '\n' + '\n'.join(cards) + '\n        ' + end + after
    html = re.sub(r'Show all \d+ episodes', f'Show all {len(episodes)} episodes', html)
    html_path.write_text(html)
    print(f'Rendered {len(episodes)} episodes into index.html')

if __name__ == '__main__':
    render()
