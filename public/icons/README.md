# PWA Icons Generation Guide

This app requires PWA icons in various sizes. You can generate them using online tools or design software.

## Required Icon Sizes

- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Quick Generation Methods:

### Option 1: Using PWA Asset Generator

1. Install: `npm install -g pwa-asset-generator`
2. Create a source icon (1024x1024 PNG recommended)
3. Run: `pwa-asset-generator [source-icon.png] ./public/icons --icon-only --padding "10%"`

### Option 2: Using Online Tools

- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/

### Option 3: Manual Creation

Create a simple icon design with:

- App name initial "C" for ClarityHub
- Black background (#000000)
- White text/icon
- Border radius for modern look

## Current Setup

Icons should be placed in: `/public/icons/`
Naming format: `icon-[size].png` (e.g., `icon-192x192.png`)

## Design Recommendations

- Use high contrast (black/white theme)
- Keep design simple and recognizable at small sizes
- Ensure icon works both as square and with rounded corners
- Test on both light and dark backgrounds
