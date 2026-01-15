import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloadFolder = path.join(__dirname, 'public', 'products');

// Create folder
if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder, { recursive: true });
}

// UPDATED LIST: Fixed the broken links for Lipstick, Airfryer, Rice Cooker, Wallet
const imagesToDownload = [
    // Tech
    { filename: "headphones.jpg", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", backup: "headphones" },
    { filename: "watch.jpg", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", backup: "smartwatch" },
    { filename: "keyboard.jpg", url: "https://images.unsplash.com/photo-1587829745563-84b70e47dd79?w=600&q=80", backup: "mechanical keyboard" },
    { filename: "monitor.jpg", url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80", backup: "computer monitor" },
    { filename: "mouse.jpg", url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80", backup: "computer mouse" },
    
    // Apparel
    { filename: "tee.jpg", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", backup: "tshirt" },
    { filename: "hoodie.jpg", url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80", backup: "hoodie" },
    { filename: "jacket.jpg", url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80", backup: "denim jacket" },
    { filename: "dress.jpg", url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80", backup: "dress" },
    { filename: "slacks.jpg", url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", backup: "pants" },

    // Accessories
    { filename: "tote.jpg", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80", backup: "totebag" },
    { filename: "glasses.jpg", url: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80", backup: "eyeglasses" },
    
    // FIXED: Wallet (New Link)
    { filename: "wallet.jpg", url: "https://images.unsplash.com/photo-1627123424574-1837303e5a05?w=600&q=80", backup: "leather wallet" },

    // Appliances & Home
    // FIXED: Airfryer (New Link - Generic black kitchen appliance closer to airfryer)
    { filename: "airfryer.jpg", url: "https://images.unsplash.com/photo-1626146672322-297eb098b638?w=600&q=80", backup: "kitchen air fryer" },
    // FIXED: Rice Cooker (New Link - White kitchen appliance)
    { filename: "ricecooker.jpg", url: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&q=80", backup: "rice cooker" },
    { filename: "chair.jpg", url: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80", backup: "office chair" },

    // Beauty & Sports
    { filename: "sneakers.jpg", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", backup: "sneakers" },
    { filename: "yogamat.jpg", url: "https://images.unsplash.com/photo-1592432678016-e910b452f9a9?w=600&q=80", backup: "yoga mat" },
    
    // FIXED: Lipstick (New Link)
    { filename: "lipstick.jpg", url: "https://images.unsplash.com/photo-1586495777744-4413f21062dc?w=600&q=80", backup: "red lipstick" },
    { filename: "serum.jpg", url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80", backup: "skincare bottle" },

    // Partners
    { filename: "powerbank.jpg", url: "https://images.unsplash.com/photo-1609592424393-2c35804374b7?w=600&q=80", backup: "powerbank" },
    { filename: "tea.jpg", url: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&q=80", backup: "tea cup" },
    { filename: "toycar.jpg", url: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&q=80", backup: "toy car" }
];

const downloadFile = async (url, filepath) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filepath, buffer);
};

console.log(`🚀 Starting Robust Download (Fixing inaccuracies)...`);

(async () => {
    let successCount = 0;
    
    for (const item of imagesToDownload) {
        const filePath = path.join(downloadFolder, item.filename);
        process.stdout.write(`Downloading ${item.filename}... `);

        try {
            // 1. Try Primary URL
            await downloadFile(item.url, filePath);
            console.log("✅ (Primary)");
            successCount++;
        } catch (err) {
            // 2. If Primary fails, try Backup
            try {
                const backupUrl = `https://loremflickr.com/600/600/${item.backup.replace(' ', ',')}/all`;
                await downloadFile(backupUrl, filePath);
                console.log("⚠️ (Backup Used)");
                successCount++;
            } catch (backupErr) {
                console.log(`❌ FAILED BOTH SOURCES`);
            }
        }
    }
    console.log(`\n🎉 Process finished. ${successCount}/${imagesToDownload.length} images ready.`);
})();