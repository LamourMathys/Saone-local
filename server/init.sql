DROP TABLE IF EXISTS event_participants CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS producers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

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
  shop_location  VARCHAR,
  business_name  VARCHAR,
  siret          INTEGER
);

CREATE TABLE categories (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR UNIQUE,
  description   VARCHAR
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
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id),
  producer_id   INTEGER REFERENCES producers(id),
  status        VARCHAR DEFAULT 'nouvelle',
  total_price   DECIMAL,
  created_at    TIMESTAMP DEFAULT NOW(),
  completed_at  TIMESTAMP
);

CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity   INTEGER
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
  description VARCHAR,
  location    VARCHAR,
  event_date  TIMESTAMP,
  creator_id  INTEGER REFERENCES users(id)
);

CREATE TABLE event_participants (
  id          SERIAL PRIMARY KEY,
  event_id    INTEGER REFERENCES events(id),
  role        VARCHAR
);