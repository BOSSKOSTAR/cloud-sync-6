-- Добавляем Ирину в матрицу Минор (id=22) Леоноры
INSERT INTO t_p38899835_cloud_sync_6.matrix_slots (matrix_id, slot_position, filled_by_user_id)
VALUES (22, 1, 11);
UPDATE t_p38899835_cloud_sync_6.user_matrices SET slots_filled = 1 WHERE id = 22;
UPDATE t_p38899835_cloud_sync_6.users 
SET balance = balance + 3000, total_earned = COALESCE(total_earned, 0) + 3000 
WHERE id = 2;
INSERT INTO t_p38899835_cloud_sync_6.transactions (user_id, type, amount, status, description)
VALUES (2, 'matrix_payout', 3000, 'completed', 'Выплата за уровень 1 тариф Минор от пользователя Ирина');

-- Добавляем Ирину в матрицу Мажор (id=23) Леоноры
INSERT INTO t_p38899835_cloud_sync_6.matrix_slots (matrix_id, slot_position, filled_by_user_id)
VALUES (23, 1, 11);
UPDATE t_p38899835_cloud_sync_6.user_matrices SET slots_filled = 1 WHERE id = 23;
UPDATE t_p38899835_cloud_sync_6.users 
SET balance = balance + 60000, total_earned = COALESCE(total_earned, 0) + 60000 
WHERE id = 2;
INSERT INTO t_p38899835_cloud_sync_6.transactions (user_id, type, amount, status, description)
VALUES (2, 'matrix_payout', 60000, 'completed', 'Выплата за уровень 1 тариф Мажор от пользователя Ирина');
