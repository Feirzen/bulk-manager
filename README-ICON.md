# App icon

The master mark is `assets/icon.svg`: a dumbbell tilted 32 degrees up and to
the right, white bar and inner plates, coral outer plates, on a full-bleed
indigo circle. The tilt is the point, it reads as the weight trend going up.

## Colors

| Part | Hex |
| --- | --- |
| Circle | `#4B45C6` |
| Bar and inner plates | `#ffffff` |
| Outer plates | `#FF8A5B` |

## Raster sizes

The SVG covers browser tabs on every current browser. iOS home screen and
lock screen shortcuts will not accept SVG, so three PNGs live alongside it:

| File | Size | Used by |
| --- | --- | --- |
| `assets/favicon-32.png` | 32 | older browser tabs |
| `assets/apple-touch-icon.png` | 180 | iOS home screen and shortcuts |
| `assets/icon-512.png` | 512 | Android, PWA installs, source of truth for re-exports |

All three are rendered from `icon.svg` at 4x and downsampled, so re-export
from the SVG rather than upscaling a PNG.
