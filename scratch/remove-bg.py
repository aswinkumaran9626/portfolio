from PIL import Image
import numpy as np

files = ["coding-pose.png", "portrait.png", "presenting-pose.png", "confident-pose.png"]

for f in files:
    path = f"public/avatar/{f}"
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)

    r, g, b = arr[:, :, 0].astype(int), arr[:, :, 1].astype(int), arr[:, :, 2].astype(int)

    brightness = (r + g + b) / 3
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    saturation = max_c - min_c

    is_bg = (brightness > 195) & (saturation < 18)

    arr[:, :, 3] = np.where(is_bg, 0, 255)
    out = Image.fromarray(arr, "RGBA")
    out.save(path)
    print(f"processed {f}")
