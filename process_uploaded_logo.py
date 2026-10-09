import os
import base64
from PIL import Image

def process_brand_logo():
    base_dir = "c:/Users/DUES-SOFT/Front-end/SSeewiz Aesthetic Decor"
    src_path = os.path.join(base_dir, "logo.png")
    
    if not os.path.exists(src_path):
        print("Error: logo.png not found")
        return

    orig = Image.open(src_path).convert("RGBA")
    w, h = orig.size
    print(f"Loaded logo.png: {w}x{h}")

    # 1. CROP THE EMBLEM (The S-House Logo Mark)
    # Emblem is in upper section Y: 0 to 445
    emblem_raw = orig.crop((0, 0, w, 445))
    emblem_bbox = emblem_raw.getbbox()
    print(f"Emblem bbox: {emblem_bbox}")
    emblem_cropped = emblem_raw.crop(emblem_bbox)
    ew, eh = emblem_cropped.size
    print(f"Emblem cropped size: {ew}x{eh}")

    # Create square padded logo mark (512x512)
    mark_512 = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    # Scale emblem to fit nicely inside 512 with 40px margin
    scale = min(432.0 / ew, 432.0 / eh)
    new_ew = int(ew * scale)
    new_eh = int(eh * scale)
    emblem_scaled = emblem_cropped.resize((new_ew, new_eh), Image.Resampling.LANCZOS)
    offset_x = (512 - new_ew) // 2
    offset_y = (512 - new_eh) // 2
    mark_512.paste(emblem_scaled, (offset_x, offset_y), emblem_scaled)
    mark_512.save(os.path.join(base_dir, "logo-symbol.png"), "PNG")
    print("Saved logo-symbol.png (512x512)")

    # 2. CROP THE TYPOGRAPHY (SSEEWIZ / Aesthetic Enterprise)
    # Typography is in lower section Y: 445 to h
    text_raw = orig.crop((0, 445, w, h))
    text_bbox = text_raw.getbbox()
    print(f"Text bbox: {text_bbox}")
    text_cropped = text_raw.crop(text_bbox)
    tw, th = text_cropped.size
    print(f"Text cropped size: {tw}x{th}")

    # 3. CREATE HORIZONTAL HEADER LOGO (logo-horizontal.png)
    # Emblem on left + Text on right
    # Target height 110px
    target_h = 110
    emblem_h = 96
    emblem_scale_h = emblem_h / float(eh)
    target_ew = int(ew * emblem_scale_h)
    target_eh = int(eh * emblem_scale_h)
    emblem_for_header = emblem_cropped.resize((target_ew, target_eh), Image.Resampling.LANCZOS)

    text_scale_h = (target_h - 22) / float(th)
    target_tw = int(tw * text_scale_h)
    target_th = int(th * text_scale_h)
    text_for_header = text_cropped.resize((target_tw, target_th), Image.Resampling.LANCZOS)

    gap = 20
    pad_x = 12
    total_w = pad_x + target_ew + gap + target_tw + pad_x

    logo_h = Image.new("RGBA", (total_w, target_h), (0, 0, 0, 0))
    # Center vertically
    ey = (target_h - target_eh) // 2
    ty = (target_h - target_th) // 2
    logo_h.paste(emblem_for_header, (pad_x, ey), emblem_for_header)
    logo_h.paste(text_for_header, (pad_x + target_ew + gap, ty), text_for_header)
    logo_h.save(os.path.join(base_dir, "logo-horizontal.png"), "PNG")
    print(f"Saved logo-horizontal.png ({total_w}x{target_h})")

    # 4. GENERATE MULTI-SIZE FAVICONS AND APPLE TOUCH ICON
    # A) 180x180 Apple Touch Icon (Dark luxury rounded container or transparent)
    apple_icon = Image.new("RGBA", (180, 180), (8, 9, 13, 255))
    apple_emblem = mark_512.resize((150, 150), Image.Resampling.LANCZOS)
    apple_icon.paste(apple_emblem, (15, 15), apple_emblem)
    apple_icon.save(os.path.join(base_dir, "apple-touch-icon.png"), "PNG")
    print("Saved apple-touch-icon.png (180x180)")

    # B) Favicon PNGs
    fav_16 = mark_512.resize((16, 16), Image.Resampling.LANCZOS)
    fav_16.save(os.path.join(base_dir, "favicon-16x16.png"), "PNG")

    fav_32 = mark_512.resize((32, 32), Image.Resampling.LANCZOS)
    fav_32.save(os.path.join(base_dir, "favicon-32x32.png"), "PNG")

    fav_64 = mark_512.resize((64, 64), Image.Resampling.LANCZOS)
    fav_64.save(os.path.join(base_dir, "favicon.png"), "PNG")

    # C) Multi-size favicon.ico
    fav_32_rgb = fav_32.copy()
    fav_16_rgb = fav_16.copy()
    fav_48 = mark_512.resize((48, 48), Image.Resampling.LANCZOS)
    fav_48.save(
        os.path.join(base_dir, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print("Saved favicon.ico, favicon.png, favicon-32x32.png, favicon-16x16.png")

    # 5. GENERATE CRISP SVG LOGOS WITH EXPLICIT WIDTH AND HEIGHT ATTRIBUTES
    # A) logo.svg (horizontal layout with explicit width, height, and viewBox)
    with open(os.path.join(base_dir, "logo-horizontal.png"), "rb") as f:
        b64_h = base64.b64encode(f.read()).decode("ascii")

    svg_horizontal = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_w} {target_h}" width="{total_w}" height="{target_h}">
  <image x="0" y="0" width="{total_w}" height="{target_h}" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{b64_h}" />
</svg>'''
    with open(os.path.join(base_dir, "logo.svg"), "w", encoding="utf-8") as f:
        f.write(svg_horizontal)
    print(f"Saved logo.svg (viewBox 0 0 {total_w} {target_h})")

    # B) logo-symbol.svg & favicon.svg (emblem mark with explicit width/height)
    with open(os.path.join(base_dir, "logo-symbol.png"), "rb") as f:
        b64_sym = base64.b64encode(f.read()).decode("ascii")

    svg_symbol = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image x="0" y="0" width="512" height="512" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,{b64_sym}" />
</svg>'''
    with open(os.path.join(base_dir, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_symbol)
    with open(os.path.join(base_dir, "logo-symbol.svg"), "w", encoding="utf-8") as f:
        f.write(svg_symbol)
    print("Saved favicon.svg and logo-symbol.svg")

process_brand_logo()
