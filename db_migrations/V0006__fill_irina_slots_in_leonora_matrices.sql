-- Ирина (id=6) заполняет слот 1 в матрице леоноры по тарифу Мини (matrix_id=1)
INSERT INTO t_p38899835_cloud_sync_6.matrix_slots (matrix_id, slot_position, filled_by_user_id) VALUES (1, 1, 6);
UPDATE t_p38899835_cloud_sync_6.user_matrices SET slots_filled = 1 WHERE id = 1;

-- Ирина заполняет слот 1 в матрице леоноры по тарифу Минор (matrix_id=2)
INSERT INTO t_p38899835_cloud_sync_6.matrix_slots (matrix_id, slot_position, filled_by_user_id) VALUES (2, 1, 6);
UPDATE t_p38899835_cloud_sync_6.user_matrices SET slots_filled = 1 WHERE id = 2;

-- Ирина заполняет слот 1 в матрице леоноры по тарифу Мажор (matrix_id=14)
INSERT INTO t_p38899835_cloud_sync_6.matrix_slots (matrix_id, slot_position, filled_by_user_id) VALUES (14, 1, 6);
UPDATE t_p38899835_cloud_sync_6.user_matrices SET slots_filled = 1 WHERE id = 14;