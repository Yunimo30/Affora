const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs'); // Import bcrypt


const db = new sqlite3.Database(path.join(__dirname, 'affora.db'), (err) => {
    if (err) console.error('Error opening database:', err.message);
    else console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    // TABLES
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price TEXT, rating INTEGER, reviewCount INTEGER, imageLabel TEXT, colors TEXT, sizes TEXT, description TEXT, deal BOOLEAN, deal_type TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, product_id INTEGER, selected_size TEXT, color_name TEXT, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(product_id) REFERENCES products(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, total_amount TEXT, payment_method TEXT, order_date DATETIME DEFAULT CURRENT_TIMESTAMP, status TEXT DEFAULT 'Processing')`);
    db.run(`CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER, product_name TEXT, price TEXT, selected_size TEXT, color_name TEXT, image_label TEXT, FOREIGN KEY(order_id) REFERENCES orders(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS wishlist (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, product_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(product_id) REFERENCES products(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, product_id INTEGER, rating INTEGER, comment TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id), FOREIGN KEY(product_id) REFERENCES products(id))`);

    // SEED DATA
    db.get("SELECT count(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
            console.log("Seeding Database...");
            
            // 1. PRODUCTS (Using the filenames we downloaded)
            const products = [
                // Tech
                { id: 1, name: "Premium Wireless Headphones", price: "₱14,999.00", rating: 5, reviewCount: 128, imageLabel: "headphones.jpg", deal_type: "flash", colors: ["#1F2937", "#9CA3AF"], sizes: ["Std"], description: "Noise-cancelling over-ear headphones.", deal: 1 },
                { id: 4, name: "Smart Watch Series 7", price: "₱19,999.00", rating: 4, reviewCount: 200, imageLabel: "watch.jpg", deal_type: "new", colors: ["#000000", "#E5E7EB"], sizes: ["44mm"], description: "Fitness tracker and notifications.", deal: 0 },
                { id: 9, name: "Mech. Gaming Keyboard", price: "₱3,499.00", rating: 5, reviewCount: 340, imageLabel: "keyboard.jpg", deal_type: "bundle", colors: ["#000000", "#FFFFFF"], sizes: ["TKL", "Full"], description: "RGB Mechanical keyboard with Blue switches.", deal: 1 },
                { id: 10, name: "Ultra-Wide Monitor 34\"", price: "₱24,599.00", rating: 5, reviewCount: 89, imageLabel: "monitor.jpg", deal_type: "flash", colors: ["#000000"], sizes: ["34 Inch"], description: "144Hz curved gaming monitor.", deal: 0 },
                { id: 11, name: "Pro Gaming Mouse", price: "₱2,199.00", rating: 4, reviewCount: 150, imageLabel: "mouse.jpg", deal_type: "freeship", colors: ["#000000"], sizes: ["Std"], description: "Lightweight wireless mouse.", deal: 1 },
                
                // Apparel
                { id: 2, name: "Classic Affora Tee", price: "₱899.00", rating: 4, reviewCount: 85, imageLabel: "tee.jpg", deal_type: "50off", colors: ["#5B9BD5", "#FFFFFF", "#000000"], sizes: ["S", "M", "L"], description: "Soft cotton blend everyday tee.", deal: 0 },
                { id: 3, name: "Ocean Breeze Hoodie", price: "₱1,999.00", rating: 5, reviewCount: 42, imageLabel: "hoodie.jpg", deal_type: "clearance", colors: ["#5B9BD5", "#1E3A8A"], sizes: ["M", "L", "XL"], description: "Fleece-lined hoodie.", deal: 1 },
                { id: 5, name: "Vintage Denim Jacket", price: "₱3,499.00", rating: 5, reviewCount: 15, imageLabel: "jacket.jpg", deal_type: "new", colors: ["#1E3A8A", "#60A5FA"], sizes: ["M", "L"], description: "Classic vintage wash denim.", deal: 0 },
                { id: 12, name: "Floral Summer Dress", price: "₱1,299.00", rating: 5, reviewCount: 67, imageLabel: "dress.jpg", deal_type: "50off", colors: ["#FECACA", "#FDE68A"], sizes: ["S", "M"], description: "Lightweight dress for summer.", deal: 1 },
                { id: 13, name: "Formal Office Slacks", price: "₱1,599.00", rating: 4, reviewCount: 45, imageLabel: "slacks.jpg", deal_type: "freeship", colors: ["#000000", "#4B5563"], sizes: ["30", "32", "34"], description: "Tailored fit slacks.", deal: 0 },

                // Accessories
                { id: 6, name: "Eco Canvas Tote", price: "₱299.00", rating: 3, reviewCount: 30, imageLabel: "tote.jpg", deal_type: "bundle", colors: ["#E5E7EB"], sizes: ["One Size"], description: "Durable grocery tote.", deal: 1 },
                { id: 8, name: "Blue Light Glasses", price: "₱1,499.00", rating: 4, reviewCount: 66, imageLabel: "glasses.jpg", deal_type: "new", colors: ["#000000", "#D4AF37"], sizes: ["Std"], description: "Eye protection for screen usage.", deal: 0 },
                { id: 14, name: "Leather Wallet", price: "₱999.00", rating: 5, reviewCount: 210, imageLabel: "wallet.jpg", deal_type: "flash", colors: ["#78350F", "#000000"], sizes: ["Std"], description: "Genuine leather bifold.", deal: 0 },

                // Appliances
                { id: 15, name: "Air Fryer 4L", price: "₱4,599.00", rating: 5, reviewCount: 520, imageLabel: "airfryer.jpg", deal_type: "flash", colors: ["#000000"], sizes: ["4L"], description: "Oil-free frying for healthy meals.", deal: 1 },
                { id: 16, name: "Smart Rice Cooker", price: "₱3,299.00", rating: 4, reviewCount: 112, imageLabel: "ricecooker.jpg", deal_type: "bundle", colors: ["#FFFFFF"], sizes: ["1.8L"], description: "Digital fuzzy logic cooker.", deal: 0 },
                { id: 17, name: "Ergo Office Chair", price: "₱8,499.00", rating: 4, reviewCount: 55, imageLabel: "chair.jpg", deal_type: "clearance", colors: ["#000000", "#9CA3AF"], sizes: ["Std"], description: "Lumbar support mesh chair.", deal: 0 },

                // Beauty
                { id: 18, name: "Yoga Mat Non-Slip", price: "₱699.00", rating: 5, reviewCount: 90, imageLabel: "yogamat.jpg", deal_type: "freeship", colors: ["#8B5CF6", "#10B981"], sizes: ["Std"], description: "Thick cushion mat.", deal: 1 },
                { id: 19, name: "Matte Lipstick Set", price: "₱499.00", rating: 4, reviewCount: 430, imageLabel: "lipstick.jpg", deal_type: "bundle", colors: ["#9F1239"], sizes: ["Set of 3"], description: "Long-lasting matte finish.", deal: 1 },
                { id: 20, name: "Face Serum Vit C", price: "₱899.00", rating: 5, reviewCount: 220, imageLabel: "serum.jpg", deal_type: "50off", colors: ["#F59E0B"], sizes: ["30ml"], description: "Brightening facial serum.", deal: 0 },
                
                // Partners
                { id: 101, name: "PowerBank 20k", price: "₱899.00", rating: 5, reviewCount: 50, imageLabel: "powerbank.jpg", deal_type: "flash", colors: ["#000000"], sizes: ["Std"], description: "Fast charging powerbank.", deal: 1 },
                { id: 102, name: "Slim Tea Detox", price: "₱250.00", rating: 4, reviewCount: 120, imageLabel: "tea.jpg", deal_type: "bundle", colors: ["#10B981"], sizes: ["1 Box"], description: "Herbal detox tea.", deal: 1 },
                { id: 103, name: "Toy Racing Car", price: "₱199.00", rating: 5, reviewCount: 300, imageLabel: "toycar.jpg", deal_type: "clearance", colors: ["#EF4444"], sizes: ["Std"], description: "High speed toy car.", deal: 1 }
            ];

            const insert = db.prepare("INSERT INTO products (id, name, price, rating, reviewCount, imageLabel, colors, sizes, description, deal, deal_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            products.forEach(p => insert.run(p.id, p.name, p.price, p.rating, p.reviewCount, p.imageLabel, JSON.stringify(p.colors), JSON.stringify(p.sizes), p.description, p.deal, p.deal_type));
            insert.finalize();

            // 2. USERS (HASHED PASSWORD)
            // Default: guest@affora.com / password123
            const hashedPassword = bcrypt.hashSync("password123", 10);
            db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", ["Guest User", "guest@affora.com", hashedPassword]);
            
            // 3. REVIEWS
            const reviewStmt = db.prepare("INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)");
            reviewStmt.run(1, 1, 5, "Amazing sound quality, definitely worth it!");
            reviewStmt.run(1, 1, 4, "Great, but a bit heavy.");
            reviewStmt.finalize();
        }
    });
});
module.exports = db;