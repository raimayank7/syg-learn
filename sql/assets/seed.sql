CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  joined TEXT NOT NULL,
  email TEXT
);
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER NOT NULL
);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  order_date TEXT NOT NULL,
  status TEXT NOT NULL
);
CREATE TABLE order_items (
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL
);
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  salary INTEGER NOT NULL,
  manager_id INTEGER REFERENCES employees(id),
  hired TEXT NOT NULL
);
INSERT INTO customers (id, name, city, state, joined, email) VALUES
  (1, 'Asha Verma', 'Ludhiana', 'Punjab', '2025-01-15', 'asha@example.com'),
  (2, 'Ravi Kumar', 'Delhi', 'Delhi', '2025-02-03', 'ravi@example.com'),
  (3, 'Meena Gill', 'Amritsar', 'Punjab', '2025-03-21', NULL),
  (4, 'Kabir Khan', 'Mumbai', 'Maharashtra', '2025-04-10', 'kabir@example.com'),
  (5, 'Sunita Rao', 'Chennai', 'Tamil Nadu', '2025-05-05', 'sunita@example.com'),
  (6, 'Arjun Mehta', 'Pune', 'Maharashtra', '2025-06-18', NULL),
  (7, 'Priya Nair', 'Kochi', 'Kerala', '2025-07-02', 'priya@example.com'),
  (8, 'Imran Ali', 'Delhi', 'Delhi', '2025-08-14', 'imran@example.com'),
  (9, 'Neha Joshi', 'Jaipur', 'Rajasthan', '2025-09-09', 'neha@example.com'),
  (10, 'Tara Singh', 'Ludhiana', 'Punjab', '2025-10-27', NULL),
  (11, 'Vikram Das', 'Kolkata', 'West Bengal', '2025-11-30', 'vikram@example.com'),
  (12, 'Joy Thomas', 'Mumbai', 'Maharashtra', '2026-01-08', 'joy@example.com');
INSERT INTO products (id, name, category, price, stock) VALUES
  (1, 'Basmati Rice 5 kg', 'Grocery', 650, 40),
  (2, 'Toor Dal 1 kg', 'Grocery', 160, 75),
  (3, 'Sunflower Oil 1 L', 'Grocery', 145, 60),
  (4, 'Tea 500 g', 'Grocery', 280, 0),
  (5, 'Notebook 200 pages', 'Stationery', 60, 300),
  (6, 'Ball Pen pack of 10', 'Stationery', 90, 150),
  (7, 'Geometry Box', 'Stationery', 120, 45),
  (8, 'School Bag', 'Stationery', 750, 20),
  (9, 'LED Bulb 9 W', 'Electronics', 110, 200),
  (10, 'Extension Board', 'Electronics', 399, 35),
  (11, 'Earphones', 'Electronics', 499, 0),
  (12, 'Power Bank', 'Electronics', 1299, 18),
  (13, 'Steel Bottle 1 L', 'Home', 450, 55),
  (14, 'Pressure Cooker 3 L', 'Home', 1450, 12),
  (15, 'Bedsheet Double', 'Home', 899, 25),
  (16, 'Wall Clock', 'Home', 349, 30);
INSERT INTO orders (id, customer_id, order_date, status) VALUES
  (1, 1, '2026-01-05', 'delivered'),
  (2, 2, '2026-01-12', 'delivered'),
  (3, 4, '2026-01-20', 'cancelled'),
  (4, 1, '2026-02-02', 'delivered'),
  (5, 5, '2026-02-14', 'delivered'),
  (6, 7, '2026-02-28', 'delivered'),
  (7, 2, '2026-03-03', 'delivered'),
  (8, 8, '2026-03-15', 'delivered'),
  (9, 9, '2026-03-22', 'cancelled'),
  (10, 4, '2026-04-01', 'delivered'),
  (11, 11, '2026-04-18', 'delivered'),
  (12, 1, '2026-05-06', 'delivered'),
  (13, 5, '2026-05-19', 'shipped'),
  (14, 12, '2026-06-02', 'delivered'),
  (15, 8, '2026-06-21', 'delivered'),
  (16, 2, '2026-07-09', 'delivered'),
  (17, 7, '2026-08-11', 'shipped'),
  (18, 4, '2026-09-01', 'pending'),
  (19, 9, '2026-09-17', 'pending'),
  (20, 1, '2026-10-04', 'pending');
INSERT INTO order_items (order_id, product_id, quantity) VALUES
  (1, 1, 2), (1, 2, 1), (1, 5, 4),
  (2, 9, 4), (2, 10, 1),
  (3, 12, 1),
  (4, 3, 2), (4, 4, 1),
  (5, 13, 2), (5, 6, 1),
  (6, 14, 1),
  (7, 5, 10), (7, 6, 2), (7, 7, 1),
  (8, 11, 1), (8, 9, 2),
  (9, 15, 1),
  (10, 8, 1), (10, 5, 5),
  (11, 1, 1), (11, 2, 2), (11, 3, 1),
  (12, 12, 1), (12, 11, 1),
  (13, 15, 2),
  (14, 10, 2), (14, 9, 6),
  (15, 13, 1), (15, 7, 2),
  (16, 1, 1), (16, 4, 2),
  (17, 14, 1), (17, 13, 1),
  (18, 6, 3),
  (19, 2, 3), (19, 3, 2),
  (20, 8, 2), (20, 5, 6), (20, 6, 1);
INSERT INTO employees (id, name, department, salary, manager_id, hired) VALUES
  (1, 'Anita Kapoor', 'Management', 95000, NULL, '2019-04-01'),
  (2, 'Rohit Bansal', 'Sales', 60000, 1, '2020-06-15'),
  (3, 'Deepa Iyer', 'Sales', 48000, 2, '2021-09-01'),
  (4, 'Manoj Yadav', 'Sales', 48000, 2, '2022-01-10'),
  (5, 'Farah Sheikh', 'Warehouse', 42000, 1, '2020-11-20'),
  (6, 'Gopal Reddy', 'Warehouse', 30000, 5, '2023-03-05'),
  (7, 'Harpreet Kaur', 'Support', 36000, 1, '2021-02-14'),
  (8, 'Nikhil Jain', 'Support', 33000, 7, '2024-07-22');
