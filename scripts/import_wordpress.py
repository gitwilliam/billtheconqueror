#!/usr/bin/env python3
import re
import html
import os
import sys
import urllib.request
import xml.etree.ElementTree as ET

NS = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "wp": "http://wordpress.org/export/1.2/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
}

XML_PATH = "/Users/bill/Documents/billtheconqueror.WordPress.2026-07-25.xml"
DEV_DIR = os.path.join(os.path.dirname(__file__), "..", "_dev")
IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "images", "dev")

def slugify(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text

def html_to_markdown(content):
    # Convert <pre><code> blocks to fenced code blocks
    def code_block(m):
        code = html.unescape(m.group(1))
        code = re.sub(r"<[^>]+>", "", code)
        return f"\n```\n{code}\n```\n"
    content = re.sub(r"<pre[^>]*><code[^>]*>(.*?)</code></pre>", code_block, content, flags=re.S)
    content = re.sub(r"<pre[^>]*>(.*?)</pre>", code_block, content, flags=re.S)

    content = re.sub(r"<h1[^>]*>(.*?)</h1>", r"\n# \1\n", content, flags=re.S)
    content = re.sub(r"<h2[^>]*>(.*?)</h2>", r"\n## \1\n", content, flags=re.S)
    content = re.sub(r"<h3[^>]*>(.*?)</h3>", r"\n### \1\n", content, flags=re.S)
    content = re.sub(r"<h4[^>]*>(.*?)</h4>", r"\n#### \1\n", content, flags=re.S)

    content = re.sub(r"<strong[^>]*>(.*?)</strong>", r"**\1**", content, flags=re.S)
    content = re.sub(r"<b[^>]*>(.*?)</b>", r"**\1**", content, flags=re.S)
    content = re.sub(r"<em[^>]*>(.*?)</em>", r"*\1*", content, flags=re.S)
    content = re.sub(r"<i[^>]*>(.*?)</i>", r"*\1*", content, flags=re.S)
    content = re.sub(r"<code[^>]*>(.*?)</code>", r"`\1`", content, flags=re.S)

    content = re.sub(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', r"[\2](\1)", content, flags=re.S)
    content = re.sub(r'<img[^>]*src="([^"]*)"[^>]*/?>', r"![](\1)", content, flags=re.S)

    content = re.sub(r"<li[^>]*>(.*?)</li>", r"- \1", content, flags=re.S)
    content = re.sub(r"</?(ul|ol)[^>]*>", "", content)

    content = re.sub(r"<p[^>]*>", "\n", content)
    content = re.sub(r"</p>", "\n", content)
    content = re.sub(r"<br\s*/?>", "\n", content)

    content = re.sub(r"<[^>]+>", "", content)
    content = html.unescape(content)
    content = re.sub(r"\n{3,}", "\n\n", content)
    return content.strip()

def download_image(url, dest_dir):
    os.makedirs(dest_dir, exist_ok=True)
    filename = os.path.basename(url.split("?")[0])
    dest_path = os.path.join(dest_dir, filename)
    if not os.path.exists(dest_path):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as resp, open(dest_path, "wb") as f:
                f.write(resp.read())
            print(f"  downloaded {filename}")
        except Exception as e:
            print(f"  FAILED to download {url}: {e}")
            return None
    return filename

def main():
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    channel = root.find("channel")
    items = channel.findall("item")
    posts = [
        i for i in items
        if i.find("wp:post_type", NS).text == "post"
        and i.find("wp:status", NS).text == "publish"
    ]

    os.makedirs(DEV_DIR, exist_ok=True)

    for post in posts:
        title = post.find("title").text or "untitled"
        pub_date = post.find("wp:post_date", NS).text
        date_part = pub_date.split(" ")[0]
        content = post.find("content:encoded", NS).text or ""

        slug_el = post.find("wp:post_name", NS)
        slug = slug_el.text if slug_el is not None and slug_el.text else slugify(title)

        print(f"Processing: {title}")

        image_urls = re.findall(r'<img[^>]*src="([^"]*)"', content)
        for img_url in image_urls:
            filename = download_image(img_url, IMAGES_DIR)
            if filename:
                content = content.replace(img_url, f"/assets/images/dev/{filename}")

        body = html_to_markdown(content)

        front_matter = (
            "---\n"
            f'title: "{title.replace(chr(34), chr(39))}"\n'
            f"date: {pub_date}\n"
            "---\n\n"
        )

        out_path = os.path.join(DEV_DIR, f"{date_part}-{slug}.markdown")
        with open(out_path, "w") as f:
            f.write(front_matter + body + "\n")

    print(f"\nDone. Wrote {len(posts)} posts to {DEV_DIR}")

if __name__ == "__main__":
    main()
