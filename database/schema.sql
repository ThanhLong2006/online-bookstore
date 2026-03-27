CREATE DATABASE IF NOT EXISTS quanlysach CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quanlysach;
-- 1. Nhà xuất bản (Publisher)
CREATE TABLE publishers (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) UNIQUE,
    description TEXT,
    logo_url VARCHAR(255),
    website VARCHAR(255),
    founded_year SMALLINT,
    country VARCHAR(100),
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);
-- 2. Tác giả (Authors) – một sách có thể có nhiều tác giả
CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    slug VARCHAR(150) UNIQUE,
    pen_name VARCHAR(100),
    biography TEXT,
    birth_year SMALLINT,
    death_year SMALLINT,
    nationality VARCHAR(80),
    photo_url VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);
-- 3. Thể loại / Danh mục (Categories) – hỗ trợ nhiều cấp (parent-child)
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(130) UNIQUE NOT NULL,
    parent_id INT NULL,
    description TEXT,
    image_url VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
   
    FOREIGN KEY (parent_id) REFERENCES categories(category_id) ON DELETE SET NULL
);
-- 4. Sách (Books) – bảng trung tâm
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE,
    isbn13 VARCHAR(20) UNIQUE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(12,0) NOT NULL DEFAULT 0,
    sale_price DECIMAL(12,0) DEFAULT NULL, -- giá khuyến mãi
    discount_percent TINYINT DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    page_count SMALLINT,
    publish_date DATE,
    language VARCHAR(50) DEFAULT 'Tiếng Việt',
    format ENUM('Bìa mềm','Bìa cứng','Ebook','AudioBook') DEFAULT 'Bìa mềm',
    weight DECIMAL(6,2) COMMENT 'gram',
    dimensions VARCHAR(50) COMMENT 'D x R x C cm',
    publisher_id INT,
    cover_image VARCHAR(255),
    images JSON, -- lưu nhiều ảnh phụ dạng ["url1","url2"]
    rating_avg DECIMAL(3,1) DEFAULT 0,
    rating_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    is_featured TINYINT(1) DEFAULT 0,
    is_new TINYINT(1) DEFAULT 0,
    is_bestseller TINYINT(1) DEFAULT 0,
    status ENUM('draft','published','discontinued') DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
   
    FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id) ON DELETE SET NULL
);
-- 5. Bảng liên kết sách – tác giả (nhiều-nhiều)
CREATE TABLE book_authors (
    book_id INT NOT NULL,
    author_id INT NOT NULL,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
);
-- 6. Bảng liên kết sách – thể loại (nhiều-nhiều)
CREATE TABLE book_categories (
    book_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (book_id, category_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);
-- 7. Người dùng / Khách hàng
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    gender ENUM('male','female','other') NULL,
    birth_date DATE,
    avatar_url VARCHAR(255),
    role ENUM('customer','admin','staff','editor') DEFAULT 'customer',
    is_active TINYINT(1) DEFAULT 1,
    email_verified TINYINT(1) DEFAULT 0,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);
-- 8. Địa chỉ giao hàng của user (hỗ trợ nhiều địa chỉ)
CREATE TABLE user_addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    ward VARCHAR(100),
    district VARCHAR(100),
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    is_default TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
   
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- 9. Đơn hàng
CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- NULL nếu khách vãng lai
    guest_email VARCHAR(120) NULL,
    order_code VARCHAR(20) UNIQUE NOT NULL, -- DH0000123
    status ENUM('pending','confirmed','processing','shipping','delivered','cancelled','returned')
                            DEFAULT 'pending',
    total_amount DECIMAL(14,0) NOT NULL,
    discount_amount DECIMAL(12,0) DEFAULT 0,
    shipping_fee DECIMAL(10,0) DEFAULT 0,
    final_amount DECIMAL(14,0) NOT NULL,
    payment_method ENUM('cod','bank','momo','vnpay','zalopay','paypal') DEFAULT 'cod',
    payment_status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
    shipping_address JSON, -- lưu snapshot địa chỉ lúc đặt hàng
    note TEXT,
    cancelled_reason TEXT,
    delivered_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
   
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);
-- 10. Chi tiết đơn hàng
CREATE TABLE order_items (
    order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    book_id INT NOT NULL,
    title_snapshot VARCHAR(255) NOT NULL, -- lưu tên sách tại thời điểm mua
    price_snapshot DECIMAL(12,0) NOT NULL,
    quantity SMALLINT NOT NULL,
    subtotal DECIMAL(14,0) NOT NULL,
   
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE RESTRICT
);
-- 11. Giỏ hàng (có thể dùng session hoặc lưu DB)
CREATE TABLE cart_items (
    cart_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- NULL nếu khách chưa đăng nhập
    session_id VARCHAR(100) NULL, -- cho khách vãng lai
    book_id INT NOT NULL,
    quantity SMALLINT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
   
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
   
    UNIQUE KEY unique_item (user_id, session_id, book_id)
);
-- tăng tốc độ truy vấn
-- books
CREATE INDEX idx_books_title       ON books(title);
CREATE INDEX idx_books_slug        ON books(slug);
CREATE INDEX idx_books_price       ON books(price);
CREATE INDEX idx_books_sale_price  ON books(sale_price);
CREATE INDEX idx_books_publisher   ON books(publisher_id);
CREATE INDEX idx_books_status      ON books(status);

-- orders
CREATE INDEX idx_orders_user       ON orders(user_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_created    ON orders(created_at);

-- cart_items
CREATE INDEX idx_cart_user_session ON cart_items(user_id, session_id);