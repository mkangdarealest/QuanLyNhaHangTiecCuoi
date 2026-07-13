const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Ensure public/images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// SVG content definitions for different items
const svgs = {
    'sup_cua.svg': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#d4af37"/>
                    <stop offset="100%" stop-color="#f3e5ab"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)"/>
            <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.3"/>
            <!-- Soup Bowl Icon -->
            <path d="M120,130 C120,180 280,180 280,130 Z" fill="none" stroke="url(#gold)" stroke-width="3"/>
            <path d="M100,130 L300,130" stroke="url(#gold)" stroke-width="4" stroke-linecap="round"/>
            <path d="M160,110 C160,95 170,95 170,80" fill="none" stroke="url(#gold)" stroke-width="2" stroke-linecap="round"/>
            <path d="M200,110 C200,95 210,95 210,80" fill="none" stroke="url(#gold)" stroke-width="2" stroke-linecap="round"/>
            <path d="M240,110 C240,95 250,95 250,80" fill="none" stroke="url(#gold)" stroke-width="2" stroke-linecap="round"/>
            <text x="200" y="210" fill="url(#gold)" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle" letter-spacing="1">SÚP CUA BỂ</text>
        </svg>
    `,
    'goi_tien_vua.svg': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#d4af37"/>
                    <stop offset="100%" stop-color="#f3e5ab"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)"/>
            <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.3"/>
            <!-- Salad/Plate Icon -->
            <ellipse cx="200" cy="130" rx="90" ry="40" fill="none" stroke="url(#gold)" stroke-width="3"/>
            <ellipse cx="200" cy="130" rx="60" ry="25" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-dasharray="5,5"/>
            <path d="M170,120 C180,105 190,135 200,120 C210,105 220,135 230,120" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-linecap="round"/>
            <text x="200" y="210" fill="url(#gold)" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle" letter-spacing="1">GỎI TIẾN VUA</text>
        </svg>
    `,
    'ga_dong_tao.svg': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#d4af37"/>
                    <stop offset="100%" stop-color="#f3e5ab"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)"/>
            <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.3"/>
            <!-- Chicken Icon -->
            <path d="M150,150 C130,120 150,80 180,90 C200,80 230,90 240,110 C260,110 270,130 260,150 Z" fill="none" stroke="url(#gold)" stroke-width="3"/>
            <path d="M190,165 L180,185 M220,165 L230,185" stroke="url(#gold)" stroke-width="3" stroke-linecap="round"/>
            <text x="200" y="210" fill="url(#gold)" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle" letter-spacing="1">GÀ ĐÔNG TẢO</text>
        </svg>
    `,
    'tom_hum.svg': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#d4af37"/>
                    <stop offset="100%" stop-color="#f3e5ab"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)"/>
            <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.3"/>
            <!-- Lobster Icon -->
            <path d="M200,80 C185,100 185,150 200,170 C215,150 215,100 200,80" fill="none" stroke="url(#gold)" stroke-width="3"/>
            <path d="M185,110 C155,100 155,80 170,70" fill="none" stroke="url(#gold)" stroke-width="2"/>
            <path d="M215,110 C245,100 245,80 230,70" fill="none" stroke="url(#gold)" stroke-width="2"/>
            <text x="200" y="210" fill="url(#gold)" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle" letter-spacing="1">TÔM HÙM ĐÚT LÒ</text>
        </svg>
    `,
    'lau_hai_san.svg': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#d4af37"/>
                    <stop offset="100%" stop-color="#f3e5ab"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)"/>
            <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.3"/>
            <!-- Hotpot Icon -->
            <ellipse cx="200" cy="140" rx="80" ry="30" fill="none" stroke="url(#gold)" stroke-width="3"/>
            <path d="M120,140 L120,160 C120,180 280,180 280,160 L280,140" fill="none" stroke="url(#gold)" stroke-width="3"/>
            <path d="M175,140 L175,95 C175,90 225,90 225,95 L225,140" fill="none" stroke="url(#gold)" stroke-width="2"/>
            <text x="200" y="210" fill="url(#gold)" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle" letter-spacing="1">LẨU HẢI SẢN</text>
        </svg>
    `,
    'che_to_yen.svg': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#d4af37"/>
                    <stop offset="100%" stop-color="#f3e5ab"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)"/>
            <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.3"/>
            <!-- Dessert Cup Icon -->
            <path d="M140,100 L260,100 L230,160 L170,160 Z" fill="none" stroke="url(#gold)" stroke-width="3"/>
            <path d="M170,160 L170,180 L230,180 L230,160" fill="none" stroke="url(#gold)" stroke-width="2"/>
            <path d="M150,180 L250,180" stroke="url(#gold)" stroke-width="3"/>
            <text x="200" y="215" fill="url(#gold)" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle" letter-spacing="1">CHÈ TỔ YẾN</text>
        </svg>
    `,
    'ruou_vang.svg': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#d4af37"/>
                    <stop offset="100%" stop-color="#f3e5ab"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)"/>
            <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.3"/>
            <!-- Wine Glasses Icon -->
            <path d="M170,80 L170,120 C170,140 200,140 200,120 L200,80 Z" fill="none" stroke="url(#gold)" stroke-width="2"/>
            <path d="M185,133 L185,165" stroke="url(#gold)" stroke-width="2"/>
            <path d="M175,165 L195,165" stroke="url(#gold)" stroke-width="2"/>
            
            <path d="M210,95 L210,130 C210,145 235,145 235,130 L235,95 Z" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.7"/>
            <path d="M222.5,139 L222.5,165" stroke="url(#gold)" stroke-width="2" opacity="0.7"/>
            <path d="M215,165 L230,165" stroke="url(#gold)" stroke-width="2" opacity="0.7"/>
            <text x="200" y="210" fill="url(#gold)" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle" letter-spacing="1">RƯỢU VANG PHÁP</text>
        </svg>
    `,
    'am_thanh.svg': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#d4af37"/>
                    <stop offset="100%" stop-color="#f3e5ab"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)"/>
            <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.3"/>
            <!-- Audio Speaker / Wave Icon -->
            <rect x="175" y="80" width="50" height="90" rx="8" fill="none" stroke="url(#gold)" stroke-width="3"/>
            <circle cx="200" cy="110" r="12" fill="none" stroke="url(#gold)" stroke-width="2"/>
            <circle cx="200" cy="145" r="16" fill="none" stroke="url(#gold)" stroke-width="2"/>
            <!-- Soundwaves -->
            <path d="M150,105 C140,115 140,135 150,145" fill="none" stroke="url(#gold)" stroke-width="2" stroke-linecap="round"/>
            <path d="M250,105 C260,115 260,135 250,145" fill="none" stroke="url(#gold)" stroke-width="2" stroke-linecap="round"/>
            <text x="200" y="210" fill="url(#gold)" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle" letter-spacing="1">ÂM THANH ÁNH SÁNG</text>
        </svg>
    `,
    'mc_band.svg': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#d4af37"/>
                    <stop offset="100%" stop-color="#f3e5ab"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)"/>
            <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.3"/>
            <!-- Microphone Icon -->
            <rect x="190" y="70" width="20" height="50" rx="10" fill="none" stroke="url(#gold)" stroke-width="3"/>
            <path d="M175,95 C175,120 225,120 225,95" fill="none" stroke="url(#gold)" stroke-width="2"/>
            <line x1="200" y1="117" x2="200" y2="145" stroke="url(#gold)" stroke-width="3"/>
            <path d="M180,145 L220,145" stroke="url(#gold)" stroke-width="3" stroke-linecap="round"/>
            <text x="200" y="210" fill="url(#gold)" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle" letter-spacing="1">MC &amp; BAN NHẠC</text>
        </svg>
    `,
    'trang_tri.svg': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#d4af37"/>
                    <stop offset="100%" stop-color="#f3e5ab"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)"/>
            <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.3"/>
            <!-- Wedding Flowers/Stage Icon -->
            <path d="M130,160 C130,100 270,100 270,160" fill="none" stroke="url(#gold)" stroke-width="3"/>
            <circle cx="200" cy="100" r="16" fill="none" stroke="url(#gold)" stroke-width="2"/>
            <path d="M190,100 C170,100 170,70 190,80 C200,60 210,60 210,80 C230,70 230,100 210,100" fill="none" stroke="url(#gold)" stroke-width="1.5"/>
            <text x="200" y="210" fill="url(#gold)" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle" letter-spacing="1">TRANG TRÍ HOA TƯƠI</text>
        </svg>
    `,
    'default.svg': `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
            <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#0f172a"/>
                </linearGradient>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#d4af37"/>
                    <stop offset="100%" stop-color="#f3e5ab"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g1)"/>
            <rect x="10" y="10" width="380" height="230" rx="15" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.3"/>
            <!-- Standard Crown Icon -->
            <path d="M150,160 L130,110 L175,130 L200,90 L225,130 L270,110 L250,160 Z" fill="none" stroke="url(#gold)" stroke-width="3"/>
            <text x="200" y="210" fill="url(#gold)" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle" letter-spacing="1">ROYAL WEDDING</text>
        </svg>
    `
};

// Write SVGs to public/images/
Object.keys(svgs).forEach(filename => {
    const filePath = path.join(IMAGES_DIR, filename);
    fs.writeFileSync(filePath, svgs[filename].trim(), 'utf8');
    console.log(`Created SVG asset: ${filePath}`);
});

// Update db.json
const dbPath = path.join(__dirname, 'db.json');
if (fs.existsSync(dbPath)) {
    let dbContent = fs.readFileSync(dbPath, 'utf8');
    // Replace all .jpg with .svg in db.json
    dbContent = dbContent.replace(/\.jpg/g, '.svg');
    fs.writeFileSync(dbPath, dbContent, 'utf8');
    console.log("Updated db.json image paths to .svg");
}

// Update public/index.html
const htmlPath = path.join(__dirname, 'public', 'index.html');
if (fs.existsSync(htmlPath)) {
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    // Replace all .jpg with .svg in public/index.html options
    htmlContent = htmlContent.replace(/\.jpg/g, '.svg');
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log("Updated index.html image path options to .svg");
}

console.log("Assets generation and extension update completed successfully!");
