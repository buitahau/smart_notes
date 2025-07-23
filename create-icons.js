const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'src', 'assets');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Define icon sizes
const sizes = [16, 32, 48, 128];

// Create a simple icon design (pencil and notebook)
const createIcon = (size) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 0, size, size);

    // Notebook
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size * 0.2, size * 0.2, size * 0.6, size * 0.6);

    // Notebook lines
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = size * 0.02;
    for (let i = 0.4; i < 0.8; i += 0.1) {
        ctx.beginPath();
        ctx.moveTo(size * 0.2, size * i);
        ctx.lineTo(size * 0.8, size * i);
        ctx.stroke();
    }

    // Pencil
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.moveTo(size * 0.3, size * 0.3);
    ctx.lineTo(size * 0.5, size * 0.3);
    ctx.lineTo(size * 0.5, size * 0.5);
    ctx.lineTo(size * 0.3, size * 0.5);
    ctx.closePath();
    ctx.fill();

    // Pencil tip
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(size * 0.4, size * 0.3);
    ctx.lineTo(size * 0.45, size * 0.35);
    ctx.lineTo(size * 0.35, size * 0.35);
    ctx.closePath();
    ctx.fill();

    return canvas;
};

// Generate icons for all sizes
sizes.forEach(size => {
    const canvas = createIcon(size);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), buffer);
    console.log(`Created icon${size}.png`);
});
