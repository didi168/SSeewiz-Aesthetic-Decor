import math

def generate_svg():
    # Emblem geometry (Rotational 180-deg symmetry)
    # ViewBox 500 500
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <!-- Royal Blue Gradient -->
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a5de8" />
      <stop offset="35%" stop-color="#143fb8" />
      <stop offset="70%" stop-color="#0b2b8c" />
      <stop offset="100%" stop-color="#05195e" />
    </linearGradient>

    <!-- Bevel Highlight Gradient -->
    <linearGradient id="bevelLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#5483ff" />
      <stop offset="50%" stop-color="#1947c7" />
      <stop offset="100%" stop-color="#081e66" />
    </linearGradient>

    <!-- Warm Wood / Caramel Gold Gradient -->
    <linearGradient id="woodGold" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#f5c278" />
      <stop offset="25%" stop-color="#df9a44" />
      <stop offset="60%" stop-color="#ba6d23" />
      <stop offset="85%" stop-color="#8f4a13" />
      <stop offset="100%" stop-color="#d48f3b" />
    </linearGradient>

    <!-- Drop Shadow Filter -->
    <filter id="luxuryShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#030b20" flood-opacity="0.65" />
    </filter>

    <filter id="innerGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#709bff" flood-opacity="0.4" />
    </filter>
  </defs>

  <g filter="url(#luxuryShadow)">
    <!-- ==============================================
         UPPER 'S' LOOP & ROOF STRUCTURE
         Outer hexagon top arm flowing into house roof
         ============================================== -->
    <!-- Top Ribbon -->
    <path d="
      M 370 175
      L 370 135
      L 250 65
      L 130 135
      L 130 205
      L 155 205
      L 155 150
      L 250 95
      L 345 150
      L 345 175
      Z
    " fill="url(#bevelLight)" stroke="#091f63" stroke-width="2" />

    <!-- Top House Roof & Inner Arm -->
    <path d="
      M 130 205
      L 170 205
      L 170 175
      L 250 128
      L 330 175
      L 330 245
      L 305 245
      L 305 190
      L 250 158
      L 195 190
      L 195 235
      L 130 205
      Z
    " fill="url(#blueGrad)" stroke="#091f63" stroke-width="2" />

    <!-- ==============================================
         LOWER 'S' LOOP & HOUSE BASE STRUCTURE
         (Rotational symmetry 180 degrees)
         ============================================== -->
    <!-- Bottom Ribbon -->
    <path d="
      M 130 255
      L 130 295
      L 250 365
      L 370 295
      L 370 225
      L 345 225
      L 345 280
      L 250 335
      L 155 280
      L 155 255
      Z
    " fill="url(#bevelLight)" stroke="#091f63" stroke-width="2" />

    <!-- Bottom House Base & Inner Arm -->
    <path d="
      M 370 225
      L 330 225
      L 330 255
      L 250 302
      L 170 255
      L 170 185
      L 195 185
      L 195 240
      L 250 272
      L 305 240
      L 305 195
      L 370 225
      Z
    " fill="url(#blueGrad)" stroke="#091f63" stroke-width="2" />

    <!-- ==============================================
         CENTER HOUSE BODY & 4-PANE WINDOW
         ============================================== -->
    <!-- House Inner Core Frame -->
    <polygon points="250,165 295,192 295,238 250,265 205,238 205,192" 
             fill="url(#blueGrad)" stroke="#0a2578" stroke-width="3" />

    <!-- 4-Pane Window Frame Bevel (Slight inset border) -->
    <rect x="222" y="193" width="56" height="44" rx="2" 
          fill="#071746" stroke="#1d48c4" stroke-width="2.5" />

    <!-- 4 Window Panes (2x2 grid) with bevel illumination -->
    <!-- Top-Left Pane -->
    <rect x="227" y="198" width="21" height="15" rx="1.5" 
          fill="url(#bevelLight)" stroke="#527ff2" stroke-width="1" />
    
    <!-- Top-Right Pane -->
    <rect x="252" y="198" width="21" height="15" rx="1.5" 
          fill="url(#bevelLight)" stroke="#527ff2" stroke-width="1" />
    
    <!-- Bottom-Left Pane -->
    <rect x="227" y="217" width="21" height="15" rx="1.5" 
          fill="url(#bevelLight)" stroke="#527ff2" stroke-width="1" />
    
    <!-- Bottom-Right Pane -->
    <rect x="252" y="217" width="21" height="15" rx="1.5" 
          fill="url(#bevelLight)" stroke="#527ff2" stroke-width="1" />

    <!-- Window Divider Cross -->
    <line x1="250" y1="195" x2="250" y2="235" stroke="#061338" stroke-width="3" />
    <line x1="224" y1="215" x2="276" y2="215" stroke="#061338" stroke-width="3" />
  </g>

  <!-- ==============================================
       BRAND TYPOGRAPHY
       ============================================== -->
  <g text-anchor="middle">
    <!-- Main Title: SSEEWIZ -->
    <text x="250" y="425" 
          font-family="'Cinzel', 'Plus Jakarta Sans', Arial, sans-serif" 
          font-size="44" 
          font-weight="800" 
          letter-spacing="5"
          fill="url(#blueGrad)"
          stroke="#091e5e"
          stroke-width="1.5"
          filter="url(#innerGlow)">SSEEWIZ</text>

    <!-- Subtitle: Aesthetic Enterprise -->
    <text x="250" y="455" 
          font-family="'Plus Jakarta Sans', Arial, sans-serif" 
          font-size="18" 
          font-weight="700" 
          letter-spacing="4"
          fill="url(#woodGold)">AESTHETIC ENTERPRISE</text>
  </g>
</svg>'''
    return svg

with open("c:/Users/DUES-SOFT/Front-end/SSeewiz Aesthetic Decor/logo.svg", "w", encoding="utf-8") as f:
    f.write(generate_svg())

print("Logo SVG written successfully.")
