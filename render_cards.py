#!/usr/bin/env python3
"""Render the animated SVG cards for the GitHub profile README.

    python render_cards.py            # animated cards -> cards/{light,dark}/*.svg
    STATIC=1 python render_cards.py   # final frame only -> cards-static/{light,dark}/*.svg

Each card is a self-contained SVG shown through an <img> tag, so it only uses
what works there: an inline <style> block with CSS keyframes, SMIL <animate*>
elements, and fonts subset with pyftsubset and embedded as base64 WOFF data
URIs. No scripts and no external URLs.

Every card is rendered twice, light and dark; README.md picks one with
<picture> + prefers-color-scheme so the cards follow the reader's GitHub theme.
"""
from __future__ import annotations

import base64
import html
import json
import math
import os
import subprocess
import sys
import tempfile
from collections import defaultdict, deque
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent
FONT_DIR = ROOT / "fonts"
STATIC = os.environ.get("STATIC", "").strip().lower() not in ("", "0", "false", "no")
OUT = ROOT / ("cards-static" if STATIC else "cards")

# ==========================================================================
# CONTENT: edit everything the cards say here.
# ==========================================================================
HERO = {
    "eyebrow": "CREATIVE FULL-STACK DEVELOPER",
    "name": ["DRAGAN", "CONSTANTIN"],
    "tagline": "Imaginer aujourd’hui les expériences de demain.",
    "line": "I build experiences where code meets 3D, games and immersive tech.",
}

PORTRAIT = {
    "source": "assets/portrait-source.png",
    "crop": (318, 10, 912, 670),  # head and shoulders, aspect 0.9 like the site's frame
    "size": (324, 360),
    "out": "assets/portrait.webp",
}

TILES = [
    {"slug": "portfolio", "icon": "globe", "label": "Portfolio", "detail": "cdragan.me"},
    {"slug": "linkedin", "icon": "linkedin", "label": "LinkedIn", "detail": "in/dragan-constantin"},
    {"slug": "email", "icon": "mail", "label": "Email", "detail": "constantin.dragan@epitech.eu"},
]

NOW = {
    "eyebrow": "RIGHT NOW",
    "title": "What I’m up to",
    "rows": [
        ("book", "MSc in Immersive Systems & Virtual Reality", "Epitech Strasbourg · 2026–2028"),
        ("gamepad", "Building The Last Thread", "A Godot metroidvania I develop and score on my own"),
        ("briefcase", "Open to a work-study position", "Alternance, available now"),
    ],
}

BEYOND = {
    "title": "More than a developer",
    "tagline": "Exploring different disciplines to craft unique experiences.",
    "items": [
        ("games", "Video games", "3D modelling, level design, game making and modding.", ("#0b2e40", "#286876", "#7b9d9b")),
        ("film", "Photo & film", "Editing, VFX, short films, motion capture and sound design.", ("#171f2b", "#586a72", "#142f38")),
        ("music", "Music", "Clarinet and composition, scoring indie games and short movies.", ("#442c2b", "#8b6960", "#243e45")),
        ("fablab", "Fablab", "Laser cutting, CNC milling, vinyl cutting and 3D printing.", ("#2b3840", "#8d8c80", "#1b4146")),
    ],
}

JOURNEY = {
    "eyebrow": "JOURNEY",
    "title": "Learning, building, teaching",
    "entries": [  # chronological; the last one is "now"
        ("2021–26", "EFREI Innovation Lab", "Trainer for the FabLab, AV studio and VR"),
        ("2022–25", "EFREI 3D", "Treasurer, then president of the 3D association"),
        ("2024", "Univ. of Portsmouth", "Two-month exchange in Creative Technologies"),
        ("2024–25", "Datadidacte", "Web & game developer, lead on Eurekin"),
        ("2024–25", "EFREI", "Lecturer in Green IT and game creation"),
        ("2026–28", "Epitech", "MSc Immersive Systems & VR, Strasbourg"),
    ],
}

LANGUAGES = [  # (name, segments out of 6, label)
    ("French", 6, "Native"),
    ("English", 6, "C2 · TOEIC 990/990"),
    ("German", 3, "B1"),
    ("Romanian", 2, "A2"),
]

TOOLBOX = [
    ("CODE", ["TypeScript", "Python", "C/C++", "GDScript", "Java"]),
    ("ENGINES & WEB", ["Godot", "Unreal Engine", "Three.js", "React", "Vue"]),
    ("3D & CREATIVE", ["Blender", "Fusion 360", "DaVinci Resolve", "Figma"]),
    ("DEVOPS", ["Docker", "Git", "Linux"]),
]

FOOTER = {
    "title": "aka CoffeeOverflow",
    "line": "If something here helped or made you smile, a coffee keeps the next project brewing.",
    "button": "Buy me a coffee",
}

# When each card starts (seconds). All cards load at once, so these offsets
# make the page play from top to bottom.
TIMELINE = {
    "hero": 0.0, "tiles": 0.8, "now": 1.4,
    "beyond": 1.9, "journey": 2.5, "languages": 3.1, "footer": 3.7,
}

# ==========================================================================
# BRAND: from the portfolio's styles.css
# ==========================================================================
THEMES = {
    "dark": {
        "bg": ("#08262a", "#0b3036", "#123f46"), "ink": "#f8fcfb", "muted": "#b7d0cf", "dim": "#7fa6a8",
        "eyebrow": "#b5e8e7", "accent": "#76d8d9", "block": "#76d8d9", "italic": "#b5e8e7",
        "line": "#76d8d926", "panel": "#76d8d90d", "chip": "#76d8d91c", "chipink": "#b5e8e7",
        "track": "#76d8d921", "node": "#0b3036", "glow": 0.16,
    },
    "light": {
        "bg": ("#ffffff", "#f7faf9", "#e4efee"), "ink": "#17343b", "muted": "#47727a", "dim": "#66989b",
        "eyebrow": "#3d6068", "accent": "#216573", "block": "#76d8d9", "italic": "#28535d",
        "line": "#17343b1f", "panel": "#ffffffb3", "chip": "#eaf6f4", "chipink": "#0a353c",
        "track": "#17343b14", "node": "#ffffff", "glow": 0.22,
    },
}
FRAME, FRAME_SHADOW, FRAME_CORNER = "#0b4148", "#1b6470", "#0b4b54ae"

FONTS = {  # role: (file, axes, fallback stack, letter-spacing em)
    "display": ("Manrope-VariableFont_wght.ttf", {"wght": 800}, "Manrope, Arial, sans-serif", -0.03),
    "body": ("DMSans-VariableFont_opsz,wght.ttf", {"wght": 400, "opsz": 14}, "'DM Sans', Arial, sans-serif", 0),
    "bold": ("DMSans-VariableFont_opsz,wght.ttf", {"wght": 700, "opsz": 14}, "'DM Sans', Arial, sans-serif", 0),
    "italic": ("DMSans-Italic-VariableFont_opsz,wght.ttf", {"wght": 400, "opsz": 18}, "Georgia, serif", 0.01),
}

W = 880  # full-width card; GitHub's README column is about 880px


# ==========================================================================
# Fonts: instance the variable fonts, measure text, subset + embed as WOFF
# ==========================================================================
class FontKit:
    def __init__(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="cards-fonts-"))
        self._fonts: dict[str, TTFont] = {}
        self._paths: dict[str, Path] = {}
        self._woff: dict[tuple[str, str], str] = {}

    def font(self, role: str) -> TTFont:
        if role not in self._fonts:
            file, axes, _, _ = FONTS[role]
            static = instancer.instantiateVariableFont(TTFont(FONT_DIR / file), axes)
            path = self.tmp / f"{role}.ttf"
            static.save(path)
            self._fonts[role], self._paths[role] = TTFont(path), path
        return self._fonts[role]

    def width(self, role: str, text: str, size: float, spacing: float | None = None) -> float:
        f = self.font(role)
        cmap, hmtx, upm = f.getBestCmap(), f["hmtx"], f["head"].unitsPerEm
        adv = sum(hmtx[cmap.get(ord(ch), ".notdef")][0] for ch in text)
        ls = FONTS[role][3] if spacing is None else spacing
        return adv / upm * size + ls * size * max(len(text) - 1, 0)

    def fit(self, role: str, text: str, size: float, max_w: float) -> str:
        if self.width(role, text, size) <= max_w:
            return text
        while text and self.width(role, text + "…", size) > max_w:
            text = text[:-1]
        return text.rstrip(" .,;:-·") + "…"

    def wrap(self, role: str, text: str, size: float, max_w: float, max_lines: int) -> list[str]:
        lines, words = [], text.split()
        while words and len(lines) < max_lines:
            line = words.pop(0)
            while words and self.width(role, f"{line} {words[0]}", size) <= max_w:
                line += " " + words.pop(0)
            lines.append(line)
        if words:
            lines[-1] = self.fit(role, lines[-1] + " " + " ".join(words), size, max_w)
        return lines

    def woff_b64(self, role: str, chars: set[str]) -> str:
        text = "".join(sorted(chars | {" "}))
        if (role, text) not in self._woff:
            self.font(role)
            txt = self.tmp / f"{role}-text.txt"
            txt.write_text(text, encoding="utf-8")
            out = self.tmp / f"{role}-{len(self._woff)}.woff"
            # `python -m fontTools.subset` is the pyftsubset entry point.
            subprocess.run(
                [sys.executable, "-m", "fontTools.subset", str(self._paths[role]),
                 f"--text-file={txt}", f"--output-file={out}", "--flavor=woff",
                 "--layout-features=kern,liga", "--no-hinting", "--desubroutinize", "--name-IDs="],
                check=True,
            )
            self._woff[(role, text)] = base64.b64encode(out.read_bytes()).decode("ascii")
        return self._woff[(role, text)]


FK = FontKit()

BASE_CSS = """
.a{animation-duration:.7s;animation-timing-function:cubic-bezier(.2,.7,.2,1);animation-fill-mode:both}
.rise{animation-name:rise}.fade{animation-name:fade}.slide{animation-name:slide}
.grow-x,.grow-y,.pop{transform-box:fill-box}
.grow-x{animation-name:grow-x;transform-origin:0 50%}
.grow-y{animation-name:grow-y;transform-origin:50% 100%}
.pop{animation-name:pop;transform-origin:50% 50%}
.draw{animation-name:draw}
@keyframes rise{from{opacity:0;transform:translateY(12px)}}
@keyframes fade{from{opacity:0}}
@keyframes slide{from{opacity:0;transform:translateX(-12px)}}
@keyframes grow-x{from{transform:scaleX(0)}}
@keyframes grow-y{from{transform:scaleY(0)}}
@keyframes pop{from{opacity:0;transform:scale(.4)}}
@keyframes draw{from{stroke-dashoffset:1}}
.still{display:none}
@media (prefers-reduced-motion:reduce){
  *{animation:none!important}
  .motion{display:none}
  .still{display:inline}
}
"""


def esc(s: str) -> str:
    return html.escape(str(s), quote=True)


class Card:
    """Collects SVG markup, the glyphs each font role needs, and extra CSS."""

    def __init__(self, name: str, w: int, h: int, title: str, t0: float, theme: str, radius: int = 16):
        self.name, self.w, self.h, self.title, self.t0, self.r = name, w, h, title, t0, radius
        self.theme, self.T = theme, THEMES[theme]
        self.parts: list[str] = []
        self.defs: list[str] = []
        self.chars: dict[str, set[str]] = defaultdict(set)
        self.defs.append(
            f'<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
            f'<stop offset="0" stop-color="{self.T["bg"][0]}"/><stop offset=".6" stop-color="{self.T["bg"][1]}"/>'
            f'<stop offset="1" stop-color="{self.T["bg"][2]}"/></linearGradient>'
            f'<clipPath id="clip"><rect width="{w}" height="{h}" rx="{radius}"/></clipPath>'
        )
        self.add(f'<rect width="{w}" height="{h}" fill="url(#bg)"/>')

    # -- animation ---------------------------------------------------------
    def attrs(self, cls: str = "", anim: tuple | None = None, style: str = "") -> str:
        """class/style attributes, adding a one-shot CSS animation unless STATIC."""
        classes, styles = [cls] if cls else [], [style] if style else []
        if anim and not STATIC:
            kind, delay, *dur = anim
            classes.append(f"a {kind}")
            styles.append(f"animation-delay:{self.t0 + delay:.2f}s" + (f";animation-duration:{dur[0]}s" if dur else ""))
        return (f' class="{" ".join(classes)}"' if classes else "") + (f' style="{";".join(styles)}"' if styles else "")

    def smil(self, motion: str, still: str, reveal: float | None = None) -> None:
        """Looping SMIL content, swapped for a still copy under reduced motion.

        With `reveal`, the looping copy stays hidden until its card plays in."""
        if STATIC:
            self.add(still)
            return
        if reveal is not None:
            motion = (f'<g opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".7s" '
                      f'begin="{self.begin(reveal)}" fill="freeze"/>{motion}</g>')
        self.add(f'<g class="motion">{motion}</g><g class="still">{still}</g>')

    def begin(self, delay: float) -> str:
        return f"{self.t0 + delay:.2f}s"

    # -- drawing -----------------------------------------------------------
    def add(self, markup: str) -> None:
        self.parts.append(markup)

    def group(self, inner: str, anim: tuple | None = None) -> None:
        self.add(f"<g{self.attrs(anim=anim)}>{inner}</g>")

    def text(self, x: float, y: float, s: str, role: str, size: float, fill: str, anchor: str = "start",
             anim: tuple | None = None, spacing: float | None = None, opacity: float | None = None) -> None:
        self.chars[role].update(s)
        style = f"letter-spacing:{spacing}em" if spacing is not None else ""
        op = f' opacity="{opacity}"' if opacity is not None else ""
        self.add(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}"{op}'
                 f'{self.attrs("f-" + role, anim, style)}>{esc(s)}</text>')

    def eyebrow(self, x: float, y: float, s: str, anim: tuple | None = None, size: float = 11.5) -> None:
        self.text(x, y, s, "bold", size, self.T["eyebrow"], anim=anim, spacing=0.24)

    def chip(self, x: float, y: float, s: str, anim: tuple | None = None, size: float = 11,
             role: str = "body", h: float = 22, spacing: float | None = None, pad: float = 9) -> float:
        w = FK.width(role, s, size, spacing) + pad * 2
        self.chars[role].update(s)
        st = f' style="letter-spacing:{spacing}em"' if spacing is not None else ""
        self.group(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h}" rx="{h / 2}" fill="{self.T["chip"]}"/>'
                   f'<text x="{x + pad:.1f}" y="{y + h / 2 + size * .36:.1f}" font-size="{size}" '
                   f'fill="{self.T["chipink"]}" class="f-{role}"{st}>{esc(s)}</text>', anim)
        return w

    # -- output ------------------------------------------------------------
    def svg(self) -> str:
        css = []
        for role, chars in sorted(self.chars.items()):
            css.append(f"@font-face{{font-family:'cd-{role}';src:url(data:font/woff;base64,"
                       f"{FK.woff_b64(role, chars)}) format('woff')}}")
            css.append(f".f-{role}{{font-family:'cd-{role}',{FONTS[role][2]};letter-spacing:{FONTS[role][3]}em}}")
        if not STATIC:
            css.append(BASE_CSS)
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" '
            f'viewBox="0 0 {self.w} {self.h}" role="img" aria-labelledby="title">\n'
            f'<title id="title">{esc(self.title)}</title>\n<style>\n' + "\n".join(css) + "\n</style>\n"
            f"<defs>{''.join(self.defs)}</defs>\n"
            f'<g clip-path="url(#clip)">\n' + "\n".join(self.parts) + "\n</g>\n"
            f'<rect x=".5" y=".5" width="{self.w - 1}" height="{self.h - 1}" rx="{self.r}" fill="none" '
            f'stroke="{self.T["line"]}"/>\n</svg>\n'
        )

    def write(self) -> Path:
        path = OUT / self.theme / f"{self.name}.svg"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(self.svg(), encoding="utf-8")
        return path


# ==========================================================================
# Icons: lucide (ISC, see icons/LUCIDE-LICENSE) from icons/icons.json, plus a
# few hand-drawn ones in the same style for icons the set doesn't include.
# ==========================================================================
ALIASES = {"gamepad": "gamepad-2", "book": "book-open", "music": "music-2", "brain": "brain-circuit",
           "link": "arrow-up-right"}


def load_icons() -> dict[str, list]:
    path = ROOT / "icons" / "icons.json"
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


LUCIDE = load_icons()
FALLBACK_ICONS = {
    "globe": '<circle cx="12" cy="12" r="9.5"/><ellipse cx="12" cy="12" rx="4" ry="9.5"/><path d="M2.5 12h19M4 7h16M4 17h16"/>',
    "linkedin": '<rect x="2.5" y="2.5" width="19" height="19" rx="4"/><path d="M7.5 10.5v6M7.5 7.4v.1M11.5 16.5v-6M11.5 13c0-1.6 1.2-2.6 2.6-2.6s2.4 1 2.4 2.6v3.5"/>',
    "mail": '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
    "arrow": '<path d="M4 12h15M13 6l6 6-6 6"/>',
    "gamepad": '<rect x="2" y="6" width="20" height="12" rx="5"/><path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"/>',
    "box": '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    "camera": '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',
    "music": '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    "wrench": '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
    "book": '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    "bot": '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4H8M2 14h2M20 14h2M15 13v2M9 13v2"/>',
    "brain": '<path d="M12 5a3 3 0 1 0-6 .1 4 4 0 0 0-2.5 5.8 4 4 0 0 0 .6 6.6A4 4 0 1 0 12 18z"/>'
             '<path d="M12 5a3 3 0 1 1 6 .1 4 4 0 0 1 2.5 5.8 4 4 0 0 1-.6 6.6A4 4 0 1 1 12 18zM12 5v13"/>',
    "briefcase": '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>',
    "coffee": '<path d="M17 9h1a4 4 0 1 1 0 8h-1M3 9h14v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/>',
}


def icon_markup(kind: str, color: str) -> str:
    nodes = LUCIDE.get(ALIASES.get(kind, kind))
    if nodes is None:
        return FALLBACK_ICONS[kind]
    out = []
    for tag, attrs in nodes:
        a = " ".join(f'{k}="{color if v == "currentColor" else v}"' for k, v in attrs.items())
        out.append(f"<{tag} {a}/>")
    return "".join(out)


def icon(kind: str, x: float, y: float, size: float, color: str, sw: float = 1.8) -> str:
    k = size / 24
    return (f'<g transform="translate({x:.1f} {y:.1f}) scale({k:.3f})" fill="none" stroke="{color}" '
            f'stroke-width="{sw / k:.2f}" stroke-linecap="round" stroke-linejoin="round">{icon_markup(kind, color)}</g>')


def gradient(gid: str, stops: tuple[str, str, str], mid: float = .6) -> str:
    return (f'<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{stops[0]}"/>'
            f'<stop offset="{mid}" stop-color="{stops[1]}"/><stop offset="1" stop-color="{stops[2]}"/></linearGradient>')


def sheen(x: float, y: float, w: float, h: float) -> str:
    """The two thin diagonal light bands from the site's art panels."""
    out = []
    for at, width, colour in ((.26, .012, "#98d6d650"), (.49, .012, "#d3f4ed35")):
        x0 = x + w * at
        out.append(f'<path d="M{x0:.1f} {y + h}L{x0 + h * .6:.1f} {y}h{w * width + 2:.1f}'
                   f'L{x0 + w * width + 2:.1f} {y + h}z" fill="{colour}"/>')
    return "".join(out)


def polygon(x: float, y: float, w: float, h: float, pts) -> str:
    return " ".join(f"{x + w * px:.1f},{y + h * py:.1f}" for px, py in pts)


FRAME_PTS = [(.18, 0), (1, .05), (1, .76), (.67, 1), (0, 1), (0, .18)]


# ==========================================================================
# Portrait: crop head and shoulders, key out the purple background
# ==========================================================================
def portrait_b64() -> str:
    src, out = ROOT / PORTRAIT["source"], ROOT / PORTRAIT["out"]
    if not out.exists() or out.stat().st_mtime < src.stat().st_mtime:
        im = Image.open(src).convert("RGB").crop(PORTRAIT["crop"])
        w, h = im.size
        px = im.load()
        # "Background-ness": the backdrop is far bluer/violet than anything in the subject.
        bgness = [0.0] * (w * h)
        for y in range(h):
            for x in range(w):
                r, g, b = px[x, y]
                bgness[y * w + x] = 0.0 if b < 130 else min(1.0, max(0.0, (b - max(r, g) - 38) / 24))
        # Flood-fill from the border so blue inside the subject (eyes, shirt) survives.
        seen, queue = bytearray(w * h), deque()
        queue.extend(y * w + x for x in range(w) for y in (0, h - 1))
        queue.extend(y * w + x for y in range(h) for x in (0, w - 1))
        while queue:
            i = queue.popleft()
            if seen[i] or bgness[i] < .5:
                continue
            seen[i] = 1
            x, y = i % w, i // w
            queue.extend(j for j, ok in ((i - 1, x > 0), (i + 1, x < w - 1), (i - w, y > 0), (i + w, y < h - 1)) if ok)
        region = Image.frombytes("L", (w, h), bytes(255 if s else 0 for s in seen)).filter(ImageFilter.MaxFilter(7))
        rp, alpha = region.load(), Image.new("L", (w, h), 255)
        ap = alpha.load()
        for y in range(h):
            for x in range(w):
                if rp[x, y]:
                    ap[x, y] = round(255 * (1 - bgness[y * w + x]))
                    r, g, b = px[x, y]
                    px[x, y] = (r, g, min(b, max(r, g) + 18))  # remove the violet fringe
        alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
        im.putalpha(alpha)
        im.resize(PORTRAIT["size"], Image.LANCZOS).save(out, "WEBP", quality=82, method=6)
    return base64.b64encode(out.read_bytes()).decode("ascii")


# ==========================================================================
# Cards
# ==========================================================================
def hero(theme: str) -> Card:
    H = 340
    c = Card("hero", W, H, f"Dragan Constantin, {HERO['eyebrow'].title()}", TIMELINE["hero"], theme)
    T = c.T
    fx, fy, fw, fh = 604, 28, 252, 280
    c.defs.append(f'<radialGradient id="glow"><stop offset="0" stop-color="{T["block"]}" stop-opacity="{T["glow"]}"/>'
                  f'<stop offset="1" stop-color="{T["block"]}" stop-opacity="0"/></radialGradient>')
    c.defs.append(f'<clipPath id="frame"><polygon points="{polygon(fx + 10, fy + 10, fw - 20, fh - 20, FRAME_PTS)}"/></clipPath>')
    c.defs.append(f'<clipPath id="outer"><polygon points="{polygon(fx, fy, fw, fh, FRAME_PTS)}"/></clipPath>')
    c.defs.append('<linearGradient id="shine" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/>'
                  '<stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>')

    # backdrop: soft glow behind the portrait + the site's diagonal light bands
    glow = f'<ellipse cx="{fx + fw / 2}" cy="{fy + fh / 2}" rx="250" ry="210" fill="url(#glow)"/>'
    c.smil(motion=f'<g opacity="1">{glow}<animate attributeName="opacity" values="1;.55;1" dur="7s" '
                  f'begin="{c.begin(1.2)}" repeatCount="indefinite"/></g>', still=glow, reveal=.2)
    c.group(sheen(470, 0, 420, H).replace("#98d6d650", T["track"]).replace("#d3f4ed35", T["track"]), ("fade", .2, 1.2))

    # portrait in the angled frame, with an offset block like the About section
    c.group(f'<polygon points="{polygon(fx + 16, fy + 16, fw, fh, FRAME_PTS)}" fill="{FRAME_SHADOW}" opacity=".55"/>',
            ("slide", .55, .8))
    c.group(
        f'<polygon points="{polygon(fx, fy, fw, fh, FRAME_PTS)}" fill="{FRAME}"/>'
        f'<image href="data:image/webp;base64,{portrait_b64()}" x="{fx + 10}" y="{fy + 10}" width="{fw - 20}" '
        f'height="{fh - 20}" preserveAspectRatio="xMidYMid slice" clip-path="url(#frame)"/>'
        f'<g clip-path="url(#outer)"><polygon points="{polygon(fx + fw * .45, fy + fh * .58, fw * .55, fh * .42, [(1, 0), (1, 1), (0, 1)])}" '
        f'fill="{FRAME_CORNER}"/></g>',
        ("rise", .3, .9),
    )

    x = 48
    c.eyebrow(x, 74, HERO["eyebrow"], ("rise", .1), size=12)
    for i, line in enumerate(HERO["name"]):
        c.text(x, 136 + i * 54, line, "display", 58, T["ink"], anim=("rise", .22 + i * .14, .8))
    c.add(f'<rect x="{x}" y="212" width="72" height="4" rx="2" fill="{T["block"]}"{c.attrs(anim=("grow-x", .6, .7))}/>')
    shine = f'<rect x="{x}" y="212" width="22" height="4" fill="url(#shine)" opacity="0">'
    c.smil(motion=shine + f'<animate attributeName="x" values="{x - 22};{x + 72}" keyTimes="0;1" dur="1.4s" '
                          f'begin="{c.begin(1.6)};{c.begin(1.6)}+5.4s" repeatCount="indefinite"/>'
                          f'<set attributeName="opacity" to=".9" begin="{c.begin(1.6)}"/></rect>',
           still="")
    c.text(x, 252, HERO["tagline"], "italic", 19, T["italic"], anim=("rise", .7))
    for i, line in enumerate(FK.wrap("body", HERO["line"], 15.5, 520, 2)):
        c.text(x, 290 + i * 22, line, "body", 15.5, T["muted"], anim=("rise", .85 + i * .06))
    return c


def tile(theme: str, i: int, t: dict) -> Card:
    w, h = 286, 116
    c = Card(f"tile-{t['slug']}", w, h, f"{t['label']}: {t['detail']}", TIMELINE["tiles"] + i * .12, theme, radius=14)
    T = c.T
    c.add(f'<rect width="{w}" height="3" fill="{T["block"]}"{c.attrs(anim=("grow-x", .1, .8))}/>')
    c.group(f'<rect x="20" y="36" width="44" height="44" rx="12" fill="{T["chip"]}" stroke="{T["line"]}"/>'
            f'{icon(t["icon"], 31, 47, 22, T["accent"])}', ("pop", 0, .6))
    c.text(80, 55, t["label"], "display", 18, T["ink"], anim=("rise", .12))
    size = 12.5
    while size > 11 and FK.width("body", t["detail"], size) > w - 80 - 18:
        size -= .25
    c.text(80, 78, FK.fit("body", t["detail"], size, w - 98), "body", size, T["muted"], anim=("rise", .22))
    c.group(icon("link", w - 40, 39, 20, T["accent"]), ("slide", .35))
    return c


def now(theme: str) -> Card:
    H = 186
    c = Card("now", W, H, "Right now: " + "; ".join(f"{a}, {b}" for _, a, b in NOW["rows"]), TIMELINE["now"], theme)
    T = c.T
    c.eyebrow(36, 76, NOW["eyebrow"], ("rise", 0))
    c.text(36, 112, NOW["title"], "display", 28, T["ink"], anim=("rise", .1))
    dx, dy = 36 + FK.width("bold", NOW["eyebrow"], 11.5, .24) + 14, 72
    c.add(f'<circle cx="{dx:.1f}" cy="{dy}" r="4" fill="{T["block"]}"{c.attrs(anim=("pop", .2))}/>')
    c.smil(motion=f'<circle cx="{dx:.1f}" cy="{dy}" r="4" fill="none" stroke="{T["block"]}" opacity="0">'
                  f'<animate attributeName="r" values="4;12" dur="2s" begin="{c.begin(.6)}" repeatCount="indefinite"/>'
                  f'<animate attributeName="opacity" values=".9;0" dur="2s" begin="{c.begin(.6)}" repeatCount="indefinite"/></circle>',
           still="")
    c.add(f'<line x1="312" x2="312" y1="30" y2="{H - 30}" stroke="{T["line"]}"{c.attrs(anim=("fade", .15))}/>')
    for i, (ic, title, sub) in enumerate(NOW["rows"]):
        y, d = 30 + i * 46, .2 + i * .12
        c.group(f'<rect x="344" y="{y}" width="36" height="36" rx="10" fill="{T["chip"]}"/>'
                f'{icon(ic, 352, y + 8, 20, T["accent"])}', ("pop", d))
        c.text(396, y + 16, FK.fit("bold", title, 14.5, 450), "bold", 14.5, T["ink"], anim=("slide", d + .05))
        c.text(396, y + 34, FK.fit("body", sub, 12.5, 450), "body", 12.5, T["muted"], anim=("slide", d + .1))
    return c


# --------------------------------------------------------------------------
# "Beyond code" illustrations. Each returns (base, motion, still) markup in
# local coordinates (0..SW x 0..SH): base is static art, motion is the looping
# layer and still is its stand-in for reduced motion / STATIC.
# --------------------------------------------------------------------------
SW, SH = 192, 136
FG, MINT, DEEP = "#eaf8f5", "#76d8d9", "#08333b"


def bob(values: str, dur: float, begin: str, kind: str = "translate", key_times: str = "") -> str:
    kt = f' keyTimes="{key_times}"' if key_times else ""
    return (f'<animateTransform attributeName="transform" type="{kind}" values="{values}"{kt} dur="{dur}s" '
            f'begin="{begin}" repeatCount="indefinite"/>')


def blink(values: str, dur: float, begin: str) -> str:
    return f'<animate attributeName="opacity" values="{values}" dur="{dur}s" begin="{begin}" repeatCount="indefinite"/>'


def scene_games(begin: str) -> tuple[str, str, str]:
    """Moonlit platformer: an astronaut does low-gravity hops beside floating gems."""
    stars = "".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{FG}" opacity=".7"/>'
                    for x, y, r in ((24, 18, 1), (58, 30, 1.2), (92, 14, .9), (120, 34, 1), (178, 56, .9), (70, 50, .8)))
    base = (f'<circle cx="152" cy="30" r="22" fill="{FG}" opacity=".1"/>'
            f'<circle cx="152" cy="30" r="11" fill="{FG}" opacity=".85"/>{stars}'
            f'<polygon points="0,98 26,74 46,88 76,60 108,86 138,66 166,88 192,76 192,136 0,136" fill="{DEEP}" opacity=".45"/>'
            f'<polygon points="0,112 40,100 86,110 130,98 192,108 192,136 0,136" fill="#0b2e40" opacity=".75"/>')
    base += "".join(f'<rect x="{bx}" y="120" width="12" height="16" fill="#164e5f" stroke="{MINT}" stroke-opacity=".25"/>'
                    for bx in range(0, SW, 12))
    base += "".join(f'<rect x="{bx}" y="84" width="12" height="10" fill="#164e5f" stroke="{MINT}" stroke-opacity=".3"/>'
                    for bx in range(104, 152, 12))
    base += f'<path d="M0 120.5H192M104 84.5h48" stroke="{MINT}" stroke-width="1.5" opacity=".8"/>'

    gems = "".join(f'<rect x="{gx - 3.5}" y="62.5" width="7" height="7" fill="{MINT}" transform="rotate(45 {gx} 66)"/>'
                   for gx in (114, 128, 142))
    # astronaut facing right, feet on the ground line (y=120), scaled up around the feet
    shade = "#b9cac8"
    astronaut = (
        '<g transform="translate(46 120) scale(.7) translate(-46 -120)">'
        f'<path d="M38 77.5l-2.5-5" stroke="{shade}" stroke-width="1.2" stroke-linecap="round"/>'
        f'<circle cx="35.3" cy="72" r="1.6" fill="{MINT}"/>'
        f'<rect x="32.5" y="92" width="7" height="15" rx="2.2" fill="{shade}"/>'                     # backpack
        f'<rect x="35" y="96" width="5" height="11" rx="2.5" fill="{shade}" transform="rotate(14 37.5 97)"/>'  # back arm
        f'<rect x="40" y="107" width="5.5" height="9.5" rx="2" fill="{FG}"/>'                     # legs
        f'<rect x="46.5" y="107" width="5.5" height="9.5" rx="2" fill="{FG}"/>'
        f'<rect x="39.4" y="115.5" width="6.8" height="4.5" rx="1.6" fill="{shade}"/>'              # boots
        f'<rect x="46" y="115.5" width="7.4" height="4.5" rx="1.6" fill="{shade}"/>'
        f'<rect x="38" y="93" width="16" height="16" rx="5" fill="{FG}"/>'                          # suit
        f'<rect x="38" y="105" width="16" height="2" fill="{shade}"/>'                              # belt
        f'<rect x="42" y="98" width="8" height="5" rx="1.2" fill="#0b2e40"/>'                       # chest panel
        f'<circle cx="44.2" cy="100.5" r="1" fill="{MINT}"/><circle cx="47.6" cy="100.5" r="1" fill="#ff6b6b"/>'
        f'<rect x="51.5" y="95.5" width="5" height="11" rx="2.5" fill="{FG}" transform="rotate(-24 54 96.5)"/>'  # front arm
        f'<circle cx="46" cy="85.5" r="10" fill="{FG}"/>'                                          # helmet
        f'<rect x="43.5" y="94" width="5" height="2" rx="1" fill="{shade}"/>'                       # neck ring
        f'<rect x="41.5" y="80.5" width="12.5" height="10" rx="5" fill="#0b2e40"/>'                 # visor
        f'<path d="M45 83.2q2.8-1.7 5.6-.3" fill="none" stroke="{MINT}" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>'
        f'<circle cx="51.2" cy="86.8" r=".8" fill="{MINT}" opacity=".7"/>'
        "</g>")
    # low-gravity hop: a slow rise, a hang at the top, a soft landing
    hop = (f'<animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -22;0 -22;0 0" '
           f'keyTimes="0;.3;.58;.68;1" calcMode="spline" keySplines="0 0 1 1;.2 .7 .4 1;0 0 1 1;.6 0 .8 .5" '
           f'dur="3.2s" begin="{begin}" repeatCount="indefinite"/>')
    motion = (f'<g>{gems}{bob("0 0;0 -3;0 0", 2.2, begin)}</g>'
              f'<g>{astronaut}{hop}</g>')
    return base, motion, gems + astronaut


def scene_film(begin: str) -> tuple[str, str, str]:
    """A film strip scrolling past and a blinking REC light."""
    holes = "".join(f'<rect x="{hx}" y="47" width="5" height="4" rx="1" fill="#586a72"/>'
                    f'<rect x="{hx}" y="87" width="5" height="4" rx="1" fill="#586a72"/>' for hx in range(-80, 300, 10))
    frames = "".join(
        f'<rect x="{fx}" y="55" width="32" height="28" rx="2" fill="#2c3e48"/>'
        f'<circle cx="{fx + 23}" cy="62" r="3" fill="{FG}" opacity=".7"/>'
        f'<path d="M{fx + 2} 81l9-12 7 8 5-5 7 9z" fill="{MINT}" opacity=".55"/>' for fx in range(-80, 300, 40))
    strip = f'<rect x="-80" y="43" width="380" height="52" fill="#0d151c"/>{holes}{frames}'
    rec = (f'<circle cx="22" cy="20" r="3.5" fill="#ff6b6b"/>'
           f'<rect x="30" y="17" width="16" height="6" rx="1.5" fill="{FG}" opacity=".5"/>')
    motion = (f'<g transform="rotate(-12 96 68)"><g>{strip}{bob("0 0;-40 0", 3.2, begin)}</g></g>'
              f'<g>{rec}{blink("1;1;.15;1", 1.4, begin)}</g>')
    still = f'<g transform="rotate(-12 96 68)">{strip}</g>{rec}'
    return "", motion, still


def scene_music(begin: str) -> tuple[str, str, str]:
    """A clarinet under a curving staff; the notes bob and a few drift away."""
    staff = "".join(f'<path d="M-6 {y}C50 {y - 16} 120 {y + 14} 198 {y - 6}" fill="none" stroke="{FG}" opacity=".35"/>'
                    for y in range(30, 70, 8))

    def note(x: float, y: float, beam_to: float | None = None) -> str:
        out = (f'<ellipse cx="{x}" cy="{y}" rx="4.6" ry="3.4" fill="{FG}" transform="rotate(-22 {x} {y})"/>'
               f'<path d="M{x + 4} {y - 1}v-20" stroke="{FG}" stroke-width="1.4"/>')
        if beam_to:
            out += f'<path d="M{x + 4} {y - 21}L{beam_to + 4} {y - 25}" stroke="{FG}" stroke-width="3"/>'
        return out
    notes = [(28, 48), (58, 40), (88, 46, 106), (106, 42), (148, 36), (174, 42)]
    clarinet = ('<g transform="rotate(-10 96 112)">'
                '<rect x="14" y="108" width="140" height="9" rx="3" fill="#161112"/>'
                '<rect x="14" y="108" width="140" height="2.5" rx="1" fill="#5a4441"/>'
                '<path d="M8 110l8-1v7l-8-1z" fill="#2a2122"/>'
                '<path d="M152 106l20-6v25l-20-6z" fill="#161112"/>'
                + "".join(f'<rect x="{kx}" y="106.5" width="3" height="12" rx="1" fill="#d9e2e0"/>' for kx in (52, 96, 128))
                + "".join(f'<circle cx="{kx}" cy="112.5" r="2.4" fill="#d9e2e0"/>' for kx in (40, 64, 78, 110, 140))
                + "</g>")
    still = "".join(note(*n) for n in notes)
    motion = "".join(f'<g>{note(*n)}{bob("0 0;0 -4;0 0", 1.8, f"{begin}+{k * .25:.2f}s")}</g>'
                     for k, n in enumerate(notes))
    motion += "".join(
        f'<g opacity="0">{note(168, 96)}{bob("0 0;14 -46", 3, f"{begin}+{k * 1.5}s")}'
        f'{blink("0;.9;0", 3, f"{begin}+{k * 1.5}s")}</g>' for k in range(2))
    return staff + clarinet, motion, still


def scene_fablab(begin: str) -> tuple[str, str, str]:
    """A 3D printer on a CNC grid, its head sweeping over a vase it is printing."""
    grid = "".join(f'<path d="M{gx} 0V136" stroke="{FG}" opacity=".08"/>' for gx in range(8, SW, 16))
    grid += "".join(f'<path d="M0 {gy}H192" stroke="{FG}" opacity=".08"/>' for gy in range(8, SH, 16))
    layers = []
    for k in range(11):
        w = 30 + 14 * math.sin(k / 10 * math.pi * 1.1 + .3)
        layers.append(f'<rect x="{96 - w / 2:.1f}" y="{116 - (k + 1) * 3.2:.1f}" width="{w:.1f}" height="3" rx="1.2" '
                      f'fill="{MINT if k % 2 else "#5fc4c6"}"/>')
    frame = (f'<path d="M40 124V16M152 124V16M40 16H152" stroke="{FG}" stroke-width="3" opacity=".7" stroke-linecap="round"/>'
             f'<path d="M40 60H152" stroke="{FG}" stroke-width="2.5" opacity=".85"/>'
             f'<rect x="32" y="116" width="128" height="7" rx="2" fill="{FG}" opacity=".85"/>')
    top = 116 - 11 * 3.2
    head = (f'<rect x="88" y="53" width="16" height="13" rx="2" fill="{FG}"/>'
            f'<path d="M92 66h8l-4 6z" fill="#d9e2e0"/>'
            f'<path d="M96 72V{top:.1f}" stroke="{MINT}" stroke-width="1.6"/>')
    glow = f'<rect x="76" y="{top - 1:.1f}" width="40" height="4" rx="2" fill="{MINT}"/>'
    motion = (f'<g>{head}{bob("-14 0;14 0;-14 0", 2.6, begin)}</g>'
              f'<g opacity=".4">{glow}{blink(".1;.7;.1", 1.3, begin)}</g>')
    return grid + frame + "".join(layers), motion, head


SCENES = {"games": scene_games, "film": scene_film, "music": scene_music, "fablab": scene_fablab}


def beyond(theme: str) -> Card:
    H = 334
    c = Card("beyond", W, H, f"{BEYOND['title']}: " + ", ".join(t for _, t, _, _ in BEYOND["items"]), TIMELINE["beyond"], theme)
    T = c.T
    c.text(32, 58, BEYOND["title"], "display", 28, T["ink"], anim=("rise", 0))
    c.text(W - 32, 58, BEYOND["tagline"], "italic", 15.5, T["italic"], anchor="end", anim=("rise", .1))
    tw, gap, top, ah = SW, 16, 84, SH
    c.defs.append(f'<clipPath id="panel"><polygon points="{polygon(0, 0, tw, ah, [(.07, 0), (1, 0), (.93, 1), (0, 1)])}"/></clipPath>')
    for i, (kind, title, line, stops) in enumerate(BEYOND["items"]):
        x, d = 32 + i * (tw + gap), .25 + i * .12
        c.defs.append(gradient(f"g{i}", stops))
        base, motion, still = SCENES[kind](c.begin(d + .5))

        def place(inner: str) -> str:
            return f'<g transform="translate({x} {top})"><g clip-path="url(#panel)">{inner}</g></g>'
        c.group(place(f'<rect width="{tw}" height="{ah}" fill="url(#g{i})"/>{base}'), ("rise", d, .8))
        c.smil(motion=place(motion), still=place(still), reveal=d + .1)
        c.text(x + 4, top + ah + 32, title, "display", 16, T["ink"], anim=("rise", d + .1))
        for j, ln in enumerate(FK.wrap("body", line, 12.5, tw - 8, 3)):
            c.text(x + 4, top + ah + 54 + j * 18, ln, "body", 12.5, T["muted"], anim=("rise", d + .15 + j * .04))
    return c


def journey(theme: str) -> Card:
    H = 262
    entries = JOURNEY["entries"]
    c = Card("journey", W, H, "Journey: " + "; ".join(f"{y} {o}, {r}" for y, o, r in entries), TIMELINE["journey"], theme)
    T = c.T
    c.eyebrow(32, 50, JOURNEY["eyebrow"], ("rise", 0))
    c.text(32, 86, JOURNEY["title"], "display", 28, T["ink"], anim=("rise", .08))
    ly, n = 148, len(entries)
    col = (W - 64) / n
    c.add(f'<path d="M32 {ly}H{W - 32}" stroke="{T["track"]}" stroke-width="2"{c.attrs(anim=("fade", .1))}/>')
    c.add(f'<path d="M32 {ly}H{W - 32 - col / 2:.1f}" pathLength="1" stroke-dasharray="1" stroke="{T["block"]}" '
          f'stroke-width="2"{c.attrs(anim=("draw", .2, 1.6))}/>')
    for i, (year, org, role) in enumerate(entries):
        cx, d, last = 32 + col * (i + .5), .3 + i * .22, i == n - 1
        c.text(cx, ly - 18, year, "bold", 12.5, T["accent"], anchor="middle", anim=("rise", d))
        c.add(f'<circle cx="{cx:.1f}" cy="{ly}" r="6.5" fill="{T["block"] if last else T["node"]}" stroke="{T["block"]}" '
              f'stroke-width="2"{c.attrs(anim=("pop", d, .5))}/>')
        if last:
            c.smil(motion=f'<circle cx="{cx:.1f}" cy="{ly}" r="6.5" fill="none" stroke="{T["block"]}" opacity="0">'
                          f'<animate attributeName="r" values="6.5;16" dur="2.2s" begin="{c.begin(d + .4)}" repeatCount="indefinite"/>'
                          f'<animate attributeName="opacity" values=".8;0" dur="2.2s" begin="{c.begin(d + .4)}" repeatCount="indefinite"/></circle>',
                   still="")
        size = 14.0
        while size > 11.5 and FK.width("display", org, size) > col - 8:
            size -= .25
        c.text(cx, ly + 34, FK.fit("display", org, size, col - 8), "display", size, T["ink"], anchor="middle", anim=("rise", d + .06))
        for j, ln in enumerate(FK.wrap("body", role, 12, col - 14, 3)):
            c.text(cx, ly + 55 + j * 17, ln, "body", 12, T["muted"], anchor="middle", anim=("rise", d + .1 + j * .03))
    return c


def languages(theme: str) -> Card:
    H = 262
    c = Card("languages", W, H, "Languages: " + ", ".join(f"{n} {l}" for n, _, l in LANGUAGES)
             + ". Toolbox: " + ", ".join(t for _, ts in TOOLBOX for t in ts), TIMELINE["languages"], theme)
    T = c.T
    c.eyebrow(32, 50, "LANGUAGES", ("rise", 0))
    for i, (name, level, label) in enumerate(LANGUAGES):
        y, d = 90 + i * 42, .1 + i * .1
        c.text(32, y, name, "display", 16, T["ink"], anim=("rise", d))
        for s in range(6):
            on = s < level
            c.add(f'<rect x="{132 + s * 24}" y="{y - 10}" width="20" height="8" rx="4" '
                  f'fill="{T["block"] if on else T["track"]}"'
                  f'{c.attrs(anim=("grow-x", d + .1 + s * .05, .4) if on else ("fade", d))}/>')
        c.text(282, y, label, "body", 12.5, T["muted"], anim=("fade", d + .3))
    c.add(f'<line x1="432" x2="432" y1="34" y2="{H - 34}" stroke="{T["line"]}"{c.attrs(anim=("fade", .1))}/>')
    c.eyebrow(464, 50, "TOOLBOX", ("rise", .1))
    for i, (group, tools) in enumerate(TOOLBOX):
        y, d = 82 + i * 46, .2 + i * .12
        c.text(464, y, group, "bold", 9.5, T["dim"], anim=("rise", d), spacing=.16)
        x = 464.0
        for k, tool in enumerate(tools):
            x += c.chip(x, y + 8, tool, ("rise", d + .05 + k * .04), size=11.5) + 6
    return c


def footer(theme: str) -> Card:
    H = 104
    c = Card("footer", W, H, f"{FOOTER['title']}. {FOOTER['button']} on Ko-fi", TIMELINE["footer"], theme)
    T = c.T
    c.group(f'<rect x="28" y="28" width="48" height="48" rx="12" fill="{T["chip"]}"/>'
            f'{icon("coffee", 38, 40, 26, T["accent"])}', ("pop", 0))
    steam = [f'M{x} 40c-2-3 2-5 0-8' for x in (45, 51, 57)]
    c.smil(
        motion="".join(
            f'<path d="{p}" fill="none" stroke="{T["accent"]}" stroke-width="1.6" stroke-linecap="round" opacity="0">'
            f'<animate attributeName="opacity" values="0;.9;0" dur="2.4s" begin="{c.begin(.5 + k * .4)}" repeatCount="indefinite"/>'
            f'<animateTransform attributeName="transform" type="translate" values="0 2;0 -4" dur="2.4s" '
            f'begin="{c.begin(.5 + k * .4)}" repeatCount="indefinite"/></path>' for k, p in enumerate(steam)),
        still="".join(f'<path d="{p}" fill="none" stroke="{T["accent"]}" stroke-width="1.6" stroke-linecap="round" '
                      f'opacity=".6"/>' for p in steam),
    )
    c.text(96, 47, FOOTER["title"], "display", 18, T["ink"], anim=("rise", .1))
    c.text(96, 70, FK.fit("body", FOOTER["line"], 13, 540), "body", 13, T["muted"], anim=("rise", .18))
    bw = FK.width("bold", FOOTER["button"], 13) + 56
    bx = W - 28 - bw
    c.group(f'<rect x="{bx:.1f}" y="33" width="{bw:.1f}" height="38" rx="4" fill="{T["block"]}"/>'
            f'<text x="{bx + 18:.1f}" y="57" font-size="13" fill="#08333a" class="f-bold">{esc(FOOTER["button"])}</text>'
            f'{icon("arrow", bx + bw - 34, 43, 17, "#08333a", 2)}', ("slide", .3))
    c.chars["bold"].update(FOOTER["button"])
    return c


def main() -> None:
    for theme in THEMES:
        cards = [hero(theme), *(tile(theme, i, t) for i, t in enumerate(TILES)), now(theme),
                 beyond(theme), journey(theme), languages(theme), footer(theme)]
        for card in cards:
            path = card.write()
            print(f"{path.relative_to(ROOT).as_posix():42} {path.stat().st_size / 1024:6.1f} kB")
    print("static (final frame)" if STATIC else "animated")


if __name__ == "__main__":
    main()
