const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcryptjs'); // Import bcrypt
const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

// ROUTES

// 1. GET ALL PRODUCTS
app.get('/api/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        const products = rows.map(p => ({
            ...p,
            colors: JSON.parse(p.colors),
            sizes: JSON.parse(p.sizes),
            deal: !!p.deal
        }));
        res.json({ data: products });
    });
});

// 2. LOGIN (With Hashing)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: "User not found" });

        // Compare Hashed Password
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ error: "Invalid password" });

        res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
    });
});

// 3. GET CART
app.get('/api/cart/:userId', (req, res) => {
    const sql = `
        SELECT cart.id as cartId, cart.selected_size, cart.color_name, products.* FROM cart 
        JOIN products ON cart.product_id = products.id 
        WHERE cart.user_id = ?
    `;
    db.all(sql, [req.params.userId], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        const cartItems = rows.map(p => ({
            ...p,
            colors: JSON.parse(p.colors),
            sizes: JSON.parse(p.sizes),
            selectedSize: p.selected_size,
            colorName: p.color_name,
            deal: !!p.deal
        }));
        res.json({ data: cartItems });
    });
});

// 4. ADD TO CART
app.post('/api/cart', (req, res) => {
    const { userId, productId, size, color } = req.body;
    const sql = "INSERT INTO cart (user_id, product_id, selected_size, color_name) VALUES (?, ?, ?, ?)";
    db.run(sql, [userId, productId, size, color], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Added to cart", id: this.lastID });
    });
});

// 5. REMOVE FROM CART
app.delete('/api/cart/:cartId', (req, res) => {
    const sql = "DELETE FROM cart WHERE id = ?";
    db.run(sql, req.params.cartId, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Deleted", changes: this.changes });
    });
});

// 6. CHECKOUT (NEW!) - The Transaction logic
app.post('/api/checkout', (req, res) => {
    const { userId, total, paymentMethod } = req.body;

    // A. Get current cart items
    db.all("SELECT cart.*, products.name, products.price, products.imageLabel FROM cart JOIN products ON cart.product_id = products.id WHERE user_id = ?", [userId], (err, cartItems) => {
        if (err || cartItems.length === 0) return res.status(400).json({ error: "Cart empty or error" });

        // B. Create Order Record
        db.run("INSERT INTO orders (user_id, total_amount, payment_method) VALUES (?, ?, ?)", [userId, total, paymentMethod], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            
            const orderId = this.lastID;

            // C. Move items to Order Items table
            const insertItem = db.prepare("INSERT INTO order_items (order_id, product_name, price, selected_size, color_name, image_label) VALUES (?, ?, ?, ?, ?, ?)");
            cartItems.forEach(item => {
                insertItem.run(orderId, item.name, item.price, item.selected_size, item.color_name, item.imageLabel);
            });
            insertItem.finalize();

            // D. Clear Cart
            db.run("DELETE FROM cart WHERE user_id = ?", [userId], (err) => {
                if (err) console.error(err);
                res.json({ message: "Order placed", orderId: orderId });
            });
        });
    });
});

// 7. GET ORDERS (NEW!) - For History Page
app.get('/api/orders/:userId', (req, res) => {
    const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC";
    db.all(sql, [req.params.userId], (err, orders) => {
        if (err) return res.status(400).json({ error: err.message });
        
        // For each order, get its items (This is a simplified approach, usually we use JOINs or separate calls)
        // Since sqlite is async, we'll just return orders first. The frontend can fetch items or we can just show summary.
        // For this demo, let's just return the order headers.
        res.json({ data: orders });
    });
});


// 8. TOGGLE WISHLIST (Add/Remove)
app.post('/api/wishlist', (req, res) => {
    const { userId, productId } = req.body;
    db.get("SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?", [userId, productId], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (row) {
            // If exists, delete it (Unlike)
            db.run("DELETE FROM wishlist WHERE id = ?", [row.id], (err) => res.json({ status: 'removed' }));
        } else {
            // If not exists, add it (Like)
            db.run("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", [userId, productId], (err) => res.json({ status: 'added' }));
        }
    });
});

// 9. GET USER WISHLIST (To show red hearts)
app.get('/api/wishlist/:userId', (req, res) => {
    db.all("SELECT product_id FROM wishlist WHERE user_id = ?", [req.params.userId], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ data: rows.map(r => r.product_id) }); // Return array of IDs [1, 5, 8]
    });
});

// 10. GET ANALYTICS COUNT (For the Tracker Page)
app.get('/api/analytics/wishlist/:productId', (req, res) => {
    db.get("SELECT count(*) as count FROM wishlist WHERE product_id = ?", [req.params.productId], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ count: row.count });
    });
});


// 11. UPDATE USER PROFILE (PUT) - With Password Check
app.put('/api/users/:id', (req, res) => {
    const { name, email, password } = req.body;
    
    // If password is provided, hash it and update everything
    if (password && password.trim() !== "") {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const sql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
        db.run(sql, [name, email, hashedPassword, req.params.id], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Profile updated successfully (Password changed)" });
        });
    } else {
        // If NO password provided, only update name and email
        const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
        db.run(sql, [name, email, req.params.id], function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Profile updated successfully" });
        });
    }
});

// 12. GET USER STATS (For Profile Dashboard)
app.get('/api/users/:id/stats', (req, res) => {
    const userId = req.params.id;
    const sqlOrders = "SELECT count(*) as count FROM orders WHERE user_id = ?";
    const sqlWishlist = "SELECT count(*) as count FROM wishlist WHERE user_id = ?";
    
    db.get(sqlOrders, [userId], (err, orderRow) => {
        if (err) return res.status(400).json({ error: err.message });
        db.get(sqlWishlist, [userId], (err, wishlistRow) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ orders: orderRow.count, wishlist: wishlistRow.count });
        });
    });
});

// 15. REGISTER (Create User)
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword], function(err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) return res.status(400).json({ error: "Email already exists" });
            return res.status(500).json({ error: err.message });
        }
        // Auto-login after register
        res.json({ message: "User registered", user: { id: this.lastID, name, email } });
    });
});

// 16. DELETE ACCOUNT
app.delete('/api/users/:id', (req, res) => {
    db.run("DELETE FROM users WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Account deleted successfully" });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});