#!/usr/bin/env python3
"""Gera imagens-placeholder (SVG) em tons de roxo para o site.
Uso: python3 -I src/make-placeholders.py
As imagens vão para src/assets/img/ e devem ser trocadas pelo marketing."""
import os, random, math

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "img")
os.makedirs(OUT, exist_ok=True)
random.seed(7)

PALETTES = [
    ("#2e1065", "#5b21b6", "#8b5cf6"), ("#1e0b4b", "#4c1d95", "#a78bfa"), ("#150f24", "#3b1a7a", "#7c3aed"),
    ("#12052e", "#6d28d9", "#c4b5fd"), ("#0b0716", "#2e1065", "#8b5cf6"), ("#241347", "#5b21b6", "#a78bfa"),
]

def shapes(w, h, c3, n=7):
    out = []
    for i in range(n):
        kind = random.choice(["circle", "ring", "line", "rect"])
        x, y = random.uniform(0, w), random.uniform(0, h)
        op = random.uniform(.06, .22)
        if kind == "circle":
            out.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{random.uniform(h*.08, h*.35):.0f}" fill="{c3}" opacity="{op:.2f}"/>')
        elif kind == "ring":
            out.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{random.uniform(h*.1, h*.4):.0f}" fill="none" stroke="{c3}" stroke-width="{random.uniform(2, 40):.0f}" opacity="{op:.2f}"/>')
        elif kind == "line":
            a = random.uniform(0, math.pi)
            L = random.uniform(w*.3, w*.9)
            out.append(f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x+math.cos(a)*L:.0f}" y2="{y+math.sin(a)*L:.0f}" stroke="{c3}" stroke-width="{random.uniform(1, 6):.0f}" opacity="{op:.2f}"/>')
        else:
            s = random.uniform(h*.1, h*.4)
            out.append(f'<rect x="{x:.0f}" y="{y:.0f}" width="{s:.0f}" height="{s:.0f}" rx="{s*.12:.0f}" fill="{c3}" opacity="{op:.2f}" transform="rotate({random.uniform(-30,30):.0f} {x:.0f} {y:.0f})"/>')
    return "\n".join(out)

def svg(name, w, h, label):
    c1, c2, c3 = random.choice(PALETTES)
    gid = name.replace(".", "-")
    body = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<defs>
  <linearGradient id="g-{gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient>
  <radialGradient id="r-{gid}" cx="{random.uniform(.2,.8):.2f}" cy="{random.uniform(.2,.8):.2f}" r=".7"><stop offset="0" stop-color="{c3}" stop-opacity=".55"/><stop offset="1" stop-color="{c3}" stop-opacity="0"/></radialGradient>
  <pattern id="p-{gid}" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" fill="#ffffff" opacity=".10"/></pattern>
</defs>
<rect width="{w}" height="{h}" fill="url(#g-{gid})"/>
<rect width="{w}" height="{h}" fill="url(#r-{gid})"/>
{shapes(w, h, c3)}
<rect width="{w}" height="{h}" fill="url(#p-{gid})"/>
<text x="{w-18}" y="{h-18}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="{max(12, h//48)}" font-weight="700" letter-spacing="2" fill="#ffffff" opacity=".35">{label}</text>
</svg>'''
    with open(os.path.join(OUT, name), "w") as f:
        f.write(body)

# 12 fotos genéricas (paisagem) + versões quadradas via object-fit no CSS
for i in range(1, 13):
    svg(f"ph-{i:02d}.svg", 1200, 800, f"FOTO {i:02d} · SUBSTITUIR")
# topo da home (mais largo)
svg("hero.svg", 1920, 1080, "IMAGEM DE FUNDO · SUBSTITUIR POR VÍDEO/FOTO")
# avatar
with open(os.path.join(OUT, "avatar.svg"), "w") as f:
    f.write('''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
<defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2e1065"/><stop offset="1" stop-color="#150f24"/></linearGradient></defs>
<rect width="400" height="400" fill="url(#a)"/>
<circle cx="200" cy="150" r="70" fill="#a78bfa" opacity=".5"/>
<path d="M60 400c0-90 62-150 140-150s140 60 140 150z" fill="#a78bfa" opacity=".5"/>
<text x="200" y="380" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="2" fill="#fff" opacity=".4">FOTO · SUBSTITUIR</text>
</svg>''')
print(f"✓ placeholders gerados em {OUT}")
