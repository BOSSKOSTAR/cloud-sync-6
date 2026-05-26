CREATE TABLE t_p38899835_cloud_sync_6.teasers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    image_url TEXT,
    target_url TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE t_p38899835_cloud_sync_6.teaser_clicks (
    id SERIAL PRIMARY KEY,
    teaser_id INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referer TEXT,
    clicked_at TIMESTAMP DEFAULT now()
);

CREATE TABLE t_p38899835_cloud_sync_6.teaser_views (
    id SERIAL PRIMARY KEY,
    teaser_id INTEGER,
    ip_address VARCHAR(45),
    viewed_at TIMESTAMP DEFAULT now()
);

INSERT INTO t_p38899835_cloud_sync_6.teasers (user_id, title, description, image_url, target_url, category, is_active, is_approved, views, clicks) VALUES
(NULL, 'Похудей за 30 дней без диет!', 'Уникальная методика изменила жизнь 50 000 человек', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 'https://example.com', 'health', true, true, 1520, 89),
(NULL, 'Зарабатывай из дома от 50 000 руб', 'Без опыта и вложений. Начни прямо сейчас!', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop', 'https://example.com', 'money', true, true, 3200, 214),
(NULL, 'Этот трюк с Wi-Fi знают не все', 'Провайдеры не хотят, чтобы ты это знал', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop', 'https://example.com', 'tech', true, true, 890, 67),
(NULL, 'Секрет молодости от 70-летней бабушки', 'Дерматологи в шоке от этого рецепта', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop', 'https://example.com', 'beauty', true, true, 2100, 156),
(NULL, 'Новый смартфон за 999 руб', 'Акция заканчивается через 2 часа. Торопись!', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', 'https://example.com', 'shop', true, true, 4500, 380),
(NULL, 'Как я купил квартиру без ипотеки', 'Реальная история с доказательствами', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop', 'https://example.com', 'money', true, true, 1800, 122);
