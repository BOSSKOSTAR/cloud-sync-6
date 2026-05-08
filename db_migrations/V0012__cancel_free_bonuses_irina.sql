-- Деактивируем бесплатные матрицы Ирины
UPDATE t_p38899835_cloud_sync_6.user_matrices SET status = 'cancelled' WHERE user_id = 11;

-- Обнуляем слоты в матрицах Леоноры
UPDATE t_p38899835_cloud_sync_6.user_matrices SET slots_filled = 0 WHERE user_id = 2;

-- Убираем ошибочные начисления Леоноре (150+3000+60000 = 63150)
UPDATE t_p38899835_cloud_sync_6.users SET balance = GREATEST(balance - 63150, 0), total_earned = GREATEST(total_earned - 63150, 0) WHERE id = 2;

-- Отменяем бонусные транзакции
UPDATE t_p38899835_cloud_sync_6.transactions SET status = 'cancelled' WHERE user_id = 2 AND type IN ('matrix_payout', 'bonus');
UPDATE t_p38899835_cloud_sync_6.transactions SET status = 'cancelled' WHERE user_id = 11;
