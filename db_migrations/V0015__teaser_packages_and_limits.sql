-- Пакеты показов для тизеров
CREATE TABLE t_p38899835_cloud_sync_6.teaser_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    views_count INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

INSERT INTO t_p38899835_cloud_sync_6.teaser_packages (name, views_count, price, description) VALUES
('Старт', 1000, 100.00, '1 000 показов вашего тизера'),
('Базовый', 5000, 450.00, '5 000 показов — экономия 10%'),
('Бизнес', 10000, 800.00, '10 000 показов — экономия 20%'),
('Про', 50000, 3500.00, '50 000 показов — экономия 30%');

-- Лимит показов для каждого тизера
ALTER TABLE t_p38899835_cloud_sync_6.teasers ADD COLUMN views_limit INTEGER DEFAULT 0;
ALTER TABLE t_p38899835_cloud_sync_6.teasers ADD COLUMN views_used INTEGER DEFAULT 0;

-- Пополнения пакетов (история покупок)
CREATE TABLE t_p38899835_cloud_sync_6.teaser_purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    teaser_id INTEGER,
    package_id INTEGER NOT NULL,
    views_count INTEGER NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    payment_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT now()
);
