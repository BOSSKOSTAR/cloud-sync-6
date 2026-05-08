-- Заполняем слот в матрице Мини (id=21) Леоноры — Ириной
INSERT INTO t_p38899835_cloud_sync_6.matrix_slots (matrix_id, slot_position, filled_by_user_id)
VALUES (21, 1, 11);

UPDATE t_p38899835_cloud_sync_6.user_matrices SET slots_filled = 1 WHERE id = 21;

-- Начисляем выплату Леоноре за слот (payout_per_slot уровня 1 тарифа Мини)
UPDATE t_p38899835_cloud_sync_6.users 
SET balance = balance + 150, total_earned = COALESCE(total_earned, 0) + 150 
WHERE id = 2;

INSERT INTO t_p38899835_cloud_sync_6.transactions (user_id, type, amount, status, description)
VALUES (2, 'matrix_payout', 150, 'completed', 'Выплата за уровень 1 от пользователя Ирина');
