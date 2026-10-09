import os
import subprocess
import time

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = r"C:\Users\DUES-SOFT\Front-end\SSeewiz Aesthetic Decor\screenshots_before"
os.makedirs(OUTPUT_DIR, exist_ok=True)

VIEWPORTS = [
    (320, 568, "320_iphone5_portrait"),
    (360, 640, "360_android_portrait"),
    (375, 812, "375_iphoneX_portrait"),
    (390, 844, "390_iphone14_portrait"),
    (414, 896, "414_iphonePlus_portrait"),
    (480, 800, "480_mobile_wide"),
    (568, 320, "568x320_mobile_landscape"),
    (667, 375, "667x375_mobile_landscape"),
    (600, 960, "600_small_tablet"),
    (768, 1024, "768_tablet_portrait"),
    (820, 1180, "820_ipad_air"),
    (1024, 768, "1024_tablet_landscape"),
    (1280, 800, "1280_desktop"),
    (1366, 768, "1366_desktop"),
    (1440, 900, "1440_desktop"),
    (1536, 864, "1536_desktop"),
    (1920, 1080, "1920_fhd_desktop"),
    (2560, 1440, "2560_qhd_ultrawide"),
    (3440, 1440, "3440_ultrawide"),
    (3840, 2160, "3840_4k"),
    (5120, 1440, "5120_super_ultrawide")
]

print("Running baseline responsive audit screenshot captures...")
for width, height, name in VIEWPORTS:
    target_img = os.path.join(OUTPUT_DIR, f"{name}.png")
    cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--screenshot={target_img}",
        f"--window-size={width},{height}",
        "--hide-scrollbars",
        "http://localhost:4321/"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    size = os.path.getsize(target_img) if os.path.exists(target_img) else 0
    print(f"Viewport {width}x{height} ({name}): Screenshot size = {size} bytes")

print("Baseline screenshots captured in:", OUTPUT_DIR)
