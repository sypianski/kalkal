#!/usr/bin/env python3
"""Generuje wszystkie ikony kalkal z jednego opisu geometrii (wariant B „Lustro").

Dwa „k" odbite w osi: lewe czarne, prawe lustrzane i niebieskie (sygnał).
Litery są wielokątami, więc ikona wygląda tak samo bez względu na dostępne fonty.

Wymaga: rsvg-convert, Pillow. Uruchom z katalogu głównego repo:
    python3 tools/gen_icons.py

Wyjście:
  web      icons/icon.svg, icon-maskable.svg, icon-192/512.png, icon-maskable-512.png,
           apple-touch-icon.png, icon-mac-512.png, favicon.svg, favicon.ico
  iOS      flutter_app/ios/.../AppIcon.appiconset/*.png (+ icons/ios/ wersje ciemna i tonowana)
  Android  flutter_app/android/app/src/main/res (ikona adaptacyjna + mipmapy)
"""
import io
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent

PAL = {
    "light": dict(paper="#f0f0ec", ink="#0a0a0a", sig="#1b3dff"),
    "dark": dict(paper="#161616", ink="#f0f0ec", sig="#7088ff"),
    "tint": dict(paper="#1c1c1e", ink="#ffffff", sig="#b0b0b6"),
}

# „k" w układzie lokalnym: normalne 410x560, ciężkie (favicon) 470x560
K_LIGHT = dict(w=410, polys=[
    [(0, 0), (110, 0), (110, 560), (0, 560)],
    [(230, 170), (370, 170), (250, 400), (110, 400)],
    [(160, 330), (286, 330), (410, 560), (280, 560)],
])
K_HEAVY = dict(w=470, polys=[
    [(0, 0), (150, 0), (150, 560), (0, 560)],
    [(270, 170), (440, 170), (320, 400), (150, 400)],
    [(180, 330), (335, 330), (470, 560), (315, 560)],
])


def k_points(k, x, y, s, mirror=False):
    """Wielokąty litery w układzie 1024 (lista list punktów)."""
    out = []
    for poly in k["polys"]:
        pts = [((k["w"] - px) if mirror else px, py) for px, py in poly]
        out.append([(x + px * s, y + py * s) for px, py in pts])
    return out


def pair(k, s, gap, scale=1.0):
    """Para liter wyśrodkowana na 1024; scale zmniejsza całość wokół środka."""
    h = 560 * s
    wk = k["w"] * s
    y = (1024 - h) / 2
    left = k_points(k, 512 - gap / 2 - wk, y, s)
    right = k_points(k, 512 + gap / 2, y, s, mirror=True)
    if scale != 1.0:
        f = lambda p: (512 + (p[0] - 512) * scale, 512 + (p[1] - 512) * scale)
        left = [[f(p) for p in poly] for poly in left]
        right = [[f(p) for p in poly] for poly in right]
    return left, right


def poly_svg(polys, color, cls=None):
    attr = f'class="{cls}"' if cls else f'fill="{color}"'
    return "".join(
        f'<polygon {attr} points="{" ".join(f"{px:.1f},{py:.1f}" for px, py in poly)}"/>'
        for poly in polys)


def master_svg(mode="light", scale=1.0, bg=True):
    p = PAL[mode]
    left, right = pair(K_LIGHT, .8, 48, scale)
    rect = f'<rect width="1024" height="1024" fill="{p["paper"]}"/>' if bg else ""
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">' + rect +
            poly_svg(left, p["ink"]) + poly_svg(right, p["sig"]) + "</svg>")


def favicon_svg():
    left, right = pair(K_HEAVY, 1.0, 24)
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><style>'
            '.p{fill:#f0f0ec}.i{fill:#0a0a0a}.s{fill:#1b3dff}'
            '@media (prefers-color-scheme:dark){.p{fill:#161616}.i{fill:#f0f0ec}.s{fill:#7088ff}}'
            '</style><rect class="p" width="1024" height="1024"/>' +
            poly_svg(left, None, "i") + poly_svg(right, None, "s") + "</svg>\n")


def render(svg, px):
    png = subprocess.run(["rsvg-convert", "-w", str(px), "-h", str(px), "-f", "png"],
                         input=svg.encode(), capture_output=True, check=True).stdout
    return Image.open(io.BytesIO(png)).convert("RGBA")


def write(path, data):
    path = ROOT / path
    path.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(data, Image.Image):
        data.save(path)
    else:
        path.write_text(data)
    print("  ", path.relative_to(ROOT))


def mac_icon(px):
    """Szablon Big Sur: korpus 824/1024, promień ok. 22,4%, miękki cień."""
    big = 2048
    body = render(master_svg(), 1648)
    mask = Image.new("L", (1648, 1648), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 1647, 1647), radius=369, fill=255)
    body.putalpha(mask)
    canvas = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    shadow = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    sh = Image.new("L", (1648, 1648), 0)
    ImageDraw.Draw(sh).rounded_rectangle((0, 0, 1647, 1647), radius=369, fill=90)
    shadow.paste((0, 0, 0, 255), (200, 224), sh)
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.alpha_composite(body, (200, 200))
    return canvas.resize((px, px), Image.LANCZOS)


# ---------- web ----------
def web():
    print("web:")
    write("icons/icon.svg", master_svg() + "\n")
    write("icons/icon-maskable.svg", master_svg(scale=.85) + "\n")
    write("icons/icon-192.png", render(master_svg(), 192))
    write("icons/icon-512.png", render(master_svg(), 512))
    write("icons/icon-maskable-512.png", render(master_svg(scale=.85), 512))
    write("icons/apple-touch-icon.png", render(master_svg(), 180).convert("RGB"))
    write("icons/icon-mac-512.png", mac_icon(512))
    write("favicon.svg", favicon_svg())
    fav = favicon_svg()
    ico = [render(fav, s) for s in (16, 32, 48)]
    path = ROOT / "favicon.ico"
    ico[2].save(path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=ico[:2])
    print("  ", path.relative_to(ROOT))


# ---------- iOS ----------
def ios():
    print("iOS:")
    base = ROOT / "flutter_app/ios/Runner/Assets.xcassets/AppIcon.appiconset"
    contents = json.loads((base / "Contents.json").read_text())
    master = master_svg()
    for img in contents["images"]:
        side = float(img["size"].split("x")[0])
        px = round(side * int(img["scale"].rstrip("x")))
        write(base.relative_to(ROOT) / img["filename"], render(master, px).convert("RGB"))
    # iOS 18: wersje ciemna i tonowana (do podpięcia w Contents.json po teście na Macu)
    write("icons/ios/AppIcon-dark-1024.png", render(master_svg("dark"), 1024).convert("RGB"))
    write("icons/ios/AppIcon-tinted-1024.png", render(master_svg("tint"), 1024).convert("RGB"))


# ---------- Android ----------
def vec_path(poly, fill, scale=.72):
    # 1024 -> viewport 108, treść skurczona do strefy bezpiecznej (66 dp)
    f = lambda p: ((512 + (p[0] - 512) * scale) * 108 / 1024, (512 + (p[1] - 512) * scale) * 108 / 1024)
    pts = [f(p) for p in poly]
    d = "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in pts) + " Z"
    return f'    <path android:fillColor="{fill}" android:pathData="{d}"/>\n'


def vector(left, right, c_left, c_right):
    head = ('<?xml version="1.0" encoding="utf-8"?>\n'
            '<vector xmlns:android="http://schemas.android.com/apk/res/android"\n'
            '    android:width="108dp" android:height="108dp"\n'
            '    android:viewportWidth="108" android:viewportHeight="108">\n')
    body = "".join(vec_path(p, c_left) for p in left) + "".join(vec_path(p, c_right) for p in right)
    return head + body + "</vector>\n"


def android():
    print("Android:")
    res = Path("flutter_app/android/app/src/main/res")
    left, right = pair(K_LIGHT, .8, 48)
    write(res / "drawable/ic_launcher_foreground.xml", vector(left, right, "#0a0a0a", "#1b3dff"))
    write(res / "drawable/ic_launcher_monochrome.xml", vector(left, right, "#000000", "#000000"))
    write(res / "values/ic_launcher_background.xml",
          '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n'
          '    <color name="ic_launcher_background">#f0f0ec</color>\n</resources>\n')
    write(res / "mipmap-anydpi-v26/ic_launcher.xml",
          '<?xml version="1.0" encoding="utf-8"?>\n'
          '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
          '    <background android:drawable="@color/ic_launcher_background"/>\n'
          '    <foreground android:drawable="@drawable/ic_launcher_foreground"/>\n'
          '    <monochrome android:drawable="@drawable/ic_launcher_monochrome"/>\n'
          '</adaptive-icon>\n')
    for d, px in dict(mdpi=48, hdpi=72, xhdpi=96, xxhdpi=144, xxxhdpi=192).items():
        write(res / f"mipmap-{d}/ic_launcher.png", render(master_svg(), px))


if __name__ == "__main__":
    web()
    ios()
    android()
