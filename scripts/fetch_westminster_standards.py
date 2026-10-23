#!/usr/bin/env python3
"""Build assets/data/westminster-standards.json from the OPC's online texts.

Usage: scripts/fetch_westminster_standards.py [DOWNLOAD_DIR]

Downloads opc.org/wcf.html, lc.html, sc.html, BCO/FG.html and BCO/DPW.html (or
reuses copies already in DOWNLOAD_DIR) and extracts each Confession section,
catechism question, and Form of Government and Directory for Worship section
for the hover pop-ups in assets/js/bco-refs.js.
"""
import html
import json
import os
import re
import sys
import tempfile
import urllib.request

PAGES = {"wcf": "https://opc.org/wcf.html", "wlc": "https://opc.org/lc.html", "wsc": "https://opc.org/sc.html",
         "fg": "https://opc.org/BCO/FG.html", "dpw": "https://opc.org/BCO/DPW.html"}
OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "assets", "data", "westminster-standards.json")
CONTENT_END = "<!-- end theMain.insidePage -->"


def fetch(url, dest):
    if not os.path.exists(dest):
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp, open(dest, "wb") as f:
            f.write(resp.read())
    with open(dest, encoding="utf-8") as f:
        return f.read()


def clean(fragment):
    text = re.sub(r"<[^>]+>", " ", fragment)
    text = re.sub(r"\s+", " ", html.unescape(text)).strip()
    return re.sub(r"\s+([,.;:?!)])", r"\1", text)


def parse_confession(page):
    page = page.split(CONTENT_END, 1)[0]
    chapters = {}
    parts = re.split(r'<h3[^>]*><a name="Chapter_(\d+)"></a>', page)[1:]
    for num, body in zip(parts[::2], parts[1::2]):
        heading, body = body.split("</h3>", 1)
        title = clean(re.search(r"<i>(.*?)</i>", heading, re.S).group(1))
        pieces = re.split(r"<p>(\d+)\.\s", body)[1:]
        sections = {n: clean(text) for n, text in zip(pieces[::2], pieces[1::2])}
        chapters[str(int(num))] = {"title": title, "sections": sections}
    return chapters


def parse_catechism(page):
    page = page.split(CONTENT_END, 1)[0]
    questions = {}
    # Not every answer closes its <p>, so each one runs to the next question.
    for block in re.split(r"<p>Q\.\s", page)[1:]:
        m = re.match(r"(\d+)\.\s*(.*?)<br\s*/?>\s*A\.\s*(.*)", block, re.S)
        questions[m.group(1)] = {"q": clean(m.group(2)), "a": clean(m.group(3))}
    return questions


# The Directory for Worship is laid out like the Form of Government, with every
# chapter divided into lettered parts.
def parse_book_of_church_order(page):
    page = page.split(CONTENT_END, 1)[0]
    chapters = {}
    parts = re.split(r'<h3[^>]*><a name="Chapter_([IVXL]+)"></a>', page)[1:]
    for num, body in zip(parts[::2], parts[1::2]):
        heading, body = body.split("</h3>", 1)
        title = clean(heading.split("<br", 1)[1].split(">", 1)[1])
        # Unnumbered paragraphs and lettered items continue the section before
        # them. Chapter XXIX restarts its numbering under parts A and B, so
        # those sections are keyed "A.1", "B.1", ...; a part with no numbered
        # sections is keyed by its letter alone.
        sections, key, part = {}, None, ""
        for tag, text in re.findall(r"<(h3|p)>(.*?)</\1>", body, re.S):
            if tag == "h3":
                part = text.split(".", 1)[0] + "."
                key = part[:-1]
                continue
            m = re.match(r"(\d+)\.\s", text)
            if m:
                key = part + m.group(1)
                text = text[m.end():]
            sections.setdefault(key or "", []).append(clean(text))
        chapters[num] = {"title": title, "sections": sections}
    return chapters


def main():
    download_dir = sys.argv[1] if len(sys.argv) > 1 else tempfile.mkdtemp()
    pages = {key: fetch(url, os.path.join(download_dir, key + ".html")) for key, url in PAGES.items()}
    data = {
        "wcf": parse_confession(pages["wcf"]),
        "wlc": parse_catechism(pages["wlc"]),
        "wsc": parse_catechism(pages["wsc"]),
        "fg": parse_book_of_church_order(pages["fg"]),
        "dpw": parse_book_of_church_order(pages["dpw"]),
    }
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    sections = sum(len(c["sections"]) for c in data["wcf"].values())
    fg_sections = sum(len(c["sections"]) for c in data["fg"].values())
    dpw_sections = sum(len(c["sections"]) for c in data["dpw"].values())
    print(f"WCF: {len(data['wcf'])} chapters, {sections} sections; WLC: {len(data['wlc'])}; WSC: {len(data['wsc'])}; "
          f"FG: {len(data['fg'])} chapters, {fg_sections} sections; "
          f"DPW: {len(data['dpw'])} chapters, {dpw_sections} sections")


if __name__ == "__main__":
    main()
