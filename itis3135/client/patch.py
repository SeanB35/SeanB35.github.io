import os

def update_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        c = f.read()
    if 'id="back-to-top"' not in c:
        i = c.find('</footer>')
        c = c[:i] + '\n<button id="back-to-top" class="back-to-top" aria-label="Back to top">Up</button>\n' + c[i:]
    
    if 'id="ba-wrapper"' not in c:
        c = c.replace('<div class="hero-content">', '<div class="hero-content reveal">')
        slider = '''
<section class="section">
    <div class="container">
        <h2 class="section-title reveal">Compare</h2>
        <div class="section-divider reveal"></div>
        <div id="ba-wrapper" class="ba-wrapper reveal">
            <img src="images/mountain.webp" alt="Raw" class="ba-before">
            <img src="images/DSC06165.webp" alt="Edited" class="ba-after">
            <div class="ba-handle"></div>
        </div>
    </div>
</section>
'''
        i = c.find('</section>') + 10
        c = c[:i] + slider + c[i:]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(c)

def update_portfolio():
    with open('portfolio.html', 'r', encoding='utf-8') as f:
        c = f.read()
    if 'id="filter-bar"' not in c:
        fil = '''
<div id="filter-bar" class="filter-bar reveal">
    <button class="filter-btn active" data-category="all">All</button>
    <button class="filter-btn" data-category="landscape">Landscape</button>
    <button class="filter-btn" data-category="urban">Urban</button>
    <button class="filter-btn" data-category="nature">Nature</button>
</div>
<div class="gallery-grid" id="gallery-grid">
'''
        c = c.replace('<div class="gallery-grid" id="gallery-grid">', fil)
    
    cats = ['landscape', 'urban', 'urban', 'landscape', 'nature', 'nature', 'nature', 'nature', 'landscape']
    for i in range(9):
        o = f'<div class="gallery-item" data-index="{i}">'
        n = f'<div class="gallery-item reveal" data-index="{i}" data-category="{cats[i]}">'
        c = c.replace(o, n)
    with open('portfolio.html', 'w', encoding='utf-8') as f:
        f.write(c)

def update_css():
    with open('style.css', 'r', encoding='utf-8') as f:
        c = f.read()
    if '.ba-wrapper' not in c:
        css = '''
.filter-bar { display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
.filter-btn { background: transparent; border: 1px solid var(--border-grit); color: var(--text-muted); padding: 0.5rem 1.5rem; cursor: pointer; text-transform: uppercase; font-size: 0.85rem; transition: 0.3s; }
.filter-btn:hover, .filter-btn.active { border-color: var(--accent); color: var(--accent); }
.gallery-item.hidden { display: none; }
.ba-wrapper { position: relative; max-width: 900px; margin: 0 auto; overflow: hidden; border: 1px solid var(--border-grit); aspect-ratio: 16/9; cursor: ew-resize; }
.ba-wrapper img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.ba-after { clip-path: inset(0 0 0 50%); }
.ba-handle { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: var(--accent); cursor: ew-resize; z-index: 10; }
.reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s; }
.reveal.revealed { opacity: 1; transform: translateY(0); }
.back-to-top { position: fixed; bottom: 30px; right: 30px; width: 45px; height: 45px; background: var(--bg-card); border: 1px solid var(--accent); color: var(--accent); cursor: pointer; opacity: 0; pointer-events: none; transition: 0.4s; z-index: 999; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
.back-to-top.visible { opacity: 1; pointer-events: auto; }
'''
        with open('style.css', 'a', encoding='utf-8') as f:
            f.write(css)

update_index()
update_portfolio()
update_css()
print('Done!')