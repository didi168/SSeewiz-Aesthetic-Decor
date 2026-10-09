import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def make_assets():
    base_dir = "c:/Users/DUES-SOFT/Front-end/SSeewiz Aesthetic Decor"

    # 1. STANDALONE SYMBOL SVG (Favicon & App Icon)
    symbol_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <!-- Brand Blue Gradients -->
    <linearGradient id="symBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2554d9" />
      <stop offset="30%" stop-color="#123eb4" />
      <stop offset="70%" stop-color="#09257d" />
      <stop offset="100%" stop-color="#041240" />
    </linearGradient>

    <linearGradient id="symHighlight" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#5a88ff" />
      <stop offset="50%" stop-color="#1a4be0" />
      <stop offset="100%" stop-color="#0a2575" />
    </linearGradient>

    <linearGradient id="windowGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#729cfd" />
      <stop offset="100%" stop-color="#1b47c4" />
    </linearGradient>

    <!-- Warm Wood Accent for Inner Trim -->
    <linearGradient id="woodAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d99748" />
      <stop offset="50%" stop-color="#ad6925" />
      <stop offset="100%" stop-color="#6e3809" />
    </linearGradient>

    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#02091c" flood-opacity="0.6" />
    </filter>
  </defs>

  <g filter="url(#softShadow)" transform="translate(0, 0)">
    <!-- Top S-Arm & Roof -->
    <path d="
      M 310 128
      L 310 98
      L 200 35
      L 90 98
      L 90 170
      L 118 170
      L 118 114
      L 200 68
      L 282 114
      L 282 136
      Z
    " fill="url(#symHighlight)" stroke="#06184f" stroke-width="2" />

    <path d="
      M 90 170
      L 132 170
      L 132 142
      L 200 102
      L 268 142
      L 268 205
      L 242 205
      L 242 156
      L 200 131
      L 158 156
      L 158 198
      L 90 170
      Z
    " fill="url(#symBlue)" stroke="#06184f" stroke-width="2" />

    <!-- Bottom S-Arm & Base (180deg symmetry) -->
    <path d="
      M 90 272
      L 90 302
      L 200 365
      L 310 302
      L 310 230
      L 282 230
      L 282 286
      L 200 332
      L 118 286
      L 118 264
      Z
    " fill="url(#symHighlight)" stroke="#06184f" stroke-width="2" />

    <path d="
      M 310 230
      L 268 230
      L 268 258
      L 200 298
      L 132 258
      L 132 195
      L 158 195
      L 158 244
      L 200 269
      L 242 244
      L 242 202
      L 310 230
      Z
    " fill="url(#symBlue)" stroke="#06184f" stroke-width="2" />

    <!-- Center House Apex Outline -->
    <polygon points="200,136 238,160 238,240 200,264 162,240 162,160"
             fill="url(#symBlue)" stroke="#051545" stroke-width="2.5" />

    <!-- 4-Pane Window Inner Recess -->
    <rect x="176" y="174" width="48" height="48" rx="2" 
          fill="#030b20" stroke="#102f8c" stroke-width="2" />

    <!-- 4 Window Panes -->
    <rect x="180" y="178" width="18" height="18" rx="1.5" fill="url(#windowGlow)" />
    <rect x="202" y="178" width="18" height="18" rx="1.5" fill="url(#windowGlow)" />
    <rect x="180" y="200" width="18" height="18" rx="1.5" fill="url(#windowGlow)" />
    <rect x="202" y="200" width="18" height="18" rx="1.5" fill="url(#windowGlow)" />

    <!-- Cross divider -->
    <line x1="200" y1="176" x2="200" y2="220" stroke="#030b20" stroke-width="2.5" />
    <line x1="178" y1="198" x2="222" y2="198" stroke="#030b20" stroke-width="2.5" />
  </g>
</svg>'''

    with open(f"{base_dir}/favicon.svg", "w", encoding="utf-8") as f:
        f.write(symbol_svg)

    with open(f"{base_dir}/logo-symbol.svg", "w", encoding="utf-8") as f:
        f.write(symbol_svg)

    # 2. HORIZONTAL HEADER LOGO SVG
    horizontal_logo_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 120" width="100%" height="100%">
  <defs>
    <linearGradient id="hBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a5de8" />
      <stop offset="35%" stop-color="#143fb8" />
      <stop offset="70%" stop-color="#0b2b8c" />
      <stop offset="100%" stop-color="#05195e" />
    </linearGradient>

    <linearGradient id="hHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#5e8eff" />
      <stop offset="100%" stop-color="#143fb8" />
    </linearGradient>

    <linearGradient id="hWood" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f5be72" />
      <stop offset="35%" stop-color="#d48c34" />
      <stop offset="75%" stop-color="#a8601c" />
      <stop offset="100%" stop-color="#d48c34" />
    </linearGradient>

    <filter id="hShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#02091c" flood-opacity="0.4" />
    </filter>
  </defs>

  <g transform="translate(10, 6) scale(0.27)" filter="url(#hShadow)">
    <!-- Top S-Arm -->
    <path d="
      M 310 128 L 310 98 L 200 35 L 90 98 L 90 170 L 118 170 L 118 114 L 200 68 L 282 114 L 282 136 Z
    " fill="url(#hHighlight)" stroke="#06184f" stroke-width="2" />
    <path d="
      M 90 170 L 132 170 L 132 142 L 200 102 L 268 142 L 268 205 L 242 205 L 242 156 L 200 131 L 158 156 L 158 198 L 90 170 Z
    " fill="url(#hBlue)" stroke="#06184f" stroke-width="2" />

    <!-- Bottom S-Arm -->
    <path d="
      M 90 272 L 90 302 L 200 365 L 310 302 L 310 230 L 282 230 L 282 286 L 200 332 L 118 286 L 118 264 Z
    " fill="url(#hHighlight)" stroke="#06184f" stroke-width="2" />
    <path d="
      M 310 230 L 268 230 L 268 258 L 200 298 L 132 258 L 132 195 L 158 195 L 158 244 L 200 269 L 242 244 L 242 202 L 310 230 Z
    " fill="url(#hBlue)" stroke="#06184f" stroke-width="2" />

    <!-- House & Window -->
    <polygon points="200,136 238,160 238,240 200,264 162,240 162,160" fill="url(#hBlue)" stroke="#051545" stroke-width="2.5" />
    <rect x="176" y="174" width="48" height="48" rx="2" fill="#030b20" stroke="#102f8c" stroke-width="2" />
    <rect x="180" y="178" width="18" height="18" rx="1.5" fill="#527ff2" />
    <rect x="202" y="178" width="18" height="18" rx="1.5" fill="#527ff2" />
    <rect x="180" y="200" width="18" height="18" rx="1.5" fill="#527ff2" />
    <rect x="202" y="200" width="18" height="18" rx="1.5" fill="#527ff2" />
    <line x1="200" y1="176" x2="200" y2="220" stroke="#030b20" stroke-width="2.5" />
    <line x1="178" y1="198" x2="222" y2="198" stroke="#030b20" stroke-width="2.5" />
  </g>

  <!-- Typography Right -->
  <g transform="translate(130, 20)">
    <text x="0" y="44" 
          font-family="'Cinzel', 'Plus Jakarta Sans', Arial, sans-serif" 
          font-size="42" 
          font-weight="800" 
          letter-spacing="5"
          fill="url(#hHighlight)"
          stroke="#07194f"
          stroke-width="1.2">SSEEWIZ</text>

    <text x="3" y="74" 
          font-family="'Plus Jakarta Sans', Arial, sans-serif" 
          font-size="15" 
          font-weight="700" 
          letter-spacing="4.5"
          fill="url(#hWood)">AESTHETIC ENTERPRISE</text>

    <text x="3" y="93" 
          font-family="'Plus Jakarta Sans', Arial, sans-serif" 
          font-size="9.5" 
          font-weight="500" 
          letter-spacing="1.5"
          fill="#8e9bbb">INTERIOR ARCHITECTURE &amp; 3D SPATIAL CURATION</text>
  </g>
</svg>'''

    with open(f"{base_dir}/logo.svg", "w", encoding="utf-8") as f:
        f.write(horizontal_logo_svg)

    # 3. GENERATE HIGH-RES PNG FAVICONS & OG IMAGE USING PILLOW
    # Let's draw the icon on PIL image
    def draw_emblem_on_image(draw, ox, oy, scale, bg_dark=True):
        # Coordinates in symbol coordinates (400x400 space)
        # Scaled and translated
        def t(x, y):
            return (ox + x * scale, oy + y * scale)

        c_blue = (20, 63, 184)
        c_light_blue = (60, 115, 240)
        c_deep_blue = (8, 30, 100)
        c_glow = (90, 145, 255)
        c_dark = (3, 11, 32)
        c_wood = (212, 140, 52)

        # Top outer arm
        top_arm1 = [t(310, 128), t(310, 98), t(200, 35), t(90, 98), t(90, 170), t(118, 170), t(118, 114), t(200, 68), t(282, 114), t(282, 136)]
        draw.polygon(top_arm1, fill=c_light_blue, outline=c_deep_blue)

        top_arm2 = [t(90, 170), t(132, 170), t(132, 142), t(200, 102), t(268, 142), t(268, 205), t(242, 205), t(242, 156), t(200, 131), t(158, 156), t(158, 198)]
        draw.polygon(top_arm2, fill=c_blue, outline=c_deep_blue)

        # Bottom outer arm
        bot_arm1 = [t(90, 272), t(90, 302), t(200, 365), t(310, 302), t(310, 230), t(282, 230), t(282, 286), t(200, 332), t(118, 286), t(118, 264)]
        draw.polygon(bot_arm1, fill=c_light_blue, outline=c_deep_blue)

        bot_arm2 = [t(310, 230), t(268, 230), t(268, 258), t(200, 298), t(132, 258), t(132, 195), t(158, 195), t(158, 244), t(200, 269), t(242, 244), t(242, 202)]
        draw.polygon(bot_arm2, fill=c_blue, outline=c_deep_blue)

        # Center house body
        house_poly = [t(200, 136), t(238, 160), t(238, 240), t(200, 264), t(162, 240), t(162, 160)]
        draw.polygon(house_poly, fill=c_deep_blue, outline=c_light_blue)

        # Window background
        wx, wy = t(176, 174)
        ww, wh = 48 * scale, 48 * scale
        draw.rectangle([wx, wy, wx + ww, wy + wh], fill=c_dark, outline=c_light_blue)

        # 4 panes
        gap = 4 * scale
        pw = (ww - gap * 3) / 2
        ph = (wh - gap * 3) / 2
        p1 = [wx + gap, wy + gap, wx + gap + pw, wy + gap + ph]
        p2 = [wx + gap * 2 + pw, wy + gap, wx + gap * 2 + pw * 2, wy + gap + ph]
        p3 = [wx + gap, wy + gap * 2 + ph, wx + gap + pw, wy + gap * 2 + ph * 2]
        p4 = [wx + gap * 2 + pw, wy + gap * 2 + ph, wx + gap * 2 + pw * 2, wy + gap * 2 + ph * 2]

        for p in [p1, p2, p3, p4]:
            draw.rectangle(p, fill=c_glow, outline=c_deep_blue)

    # A) 180x180 Apple Touch Icon
    img_apple = Image.new("RGBA", (180, 180), (8, 11, 20, 255))
    d_apple = ImageDraw.Draw(img_apple)
    draw_emblem_on_image(d_apple, 15, 15, 150.0 / 400.0)
    img_apple.save(f"{base_dir}/apple-touch-icon.png", "PNG")

    # B) Favicon PNG (64x64 and 32x32)
    img_fav = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d_fav = ImageDraw.Draw(img_fav)
    draw_emblem_on_image(d_fav, 2, 2, 60.0 / 400.0)
    img_fav.save(f"{base_dir}/favicon.png", "PNG")

    # C) High-res Open Graph Preview (1200x630) for Social & SEO
    og_img = Image.new("RGBA", (1200, 630), (7, 10, 18, 255))
    d_og = ImageDraw.Draw(og_img)

    # Ambient radial navy and warm wood glow
    for r in range(400, 0, -20):
        alpha = int(25 * (1 - r / 400))
        d_og.ellipse([150 - r, 315 - r, 150 + r, 315 + r], fill=(20, 63, 184, alpha))
        d_og.ellipse([1000 - r, 315 - r, 1000 + r, 315 + r], fill=(184, 110, 40, alpha))

    # Draw large emblem
    draw_emblem_on_image(d_og, 80, 115, 400.0 / 400.0)

    # Texts on right
    # Headline text using default PIL font scaled or drawn lines
    d_og.rectangle([540, 180, 1120, 184], fill=(212, 140, 52, 255)) # Warm wood gold bar
    # Save OG
    og_img.save(f"{base_dir}/og-image.png", "PNG")

    print("All vector & PNG assets generated successfully.")

make_assets()
