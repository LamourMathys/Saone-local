CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  first_name  VARCHAR,
  last_name   VARCHAR,
  email       VARCHAR UNIQUE NOT NULL,
  password    VARCHAR(60),
  role        VARCHAR,
  provider    VARCHAR,
  provider_id VARCHAR,
  user_photo  VARCHAR,
  created_at  TIMESTAMP DEFAULT NOW(),
  last_login  TIMESTAMP
);

CREATE TABLE producers (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER UNIQUE NOT NULL REFERENCES users(id),
  producer_name  VARCHAR,
  description    VARCHAR,
  producer_photo VARCHAR,
  shop_location  VARCHAR,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE
);

CREATE TABLE products (
  id            SERIAL PRIMARY KEY,
  producer_id   INTEGER REFERENCES producers(id),
  category_id   INTEGER REFERENCES categories(id),
  product_name  VARCHAR,
  description   VARCHAR,
  price         DECIMAL,
  unit          VARCHAR,
  stock         INTEGER,
  product_photo VARCHAR,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  producer_id INTEGER REFERENCES producers(id),
  status      VARCHAR DEFAULT 'nouvelle',
  total_price DECIMAL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity   INTEGER,
  unit_price DECIMAL
);

CREATE TABLE favorites (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  product_id  INTEGER REFERENCES products(id),
  producer_id INTEGER REFERENCES producers(id)
);

CREATE TABLE events (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR,
  location    VARCHAR,
  event_date  TIMESTAMP,
  description VARCHAR
);
