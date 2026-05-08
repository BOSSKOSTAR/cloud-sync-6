INSERT INTO t_p38899835_cloud_sync_6.tariffs (name, slug, entry_price, matrix_count) VALUES
  ('Мини', 'mini', 300.00, 5),
  ('Минор', 'minor', 6000.00, 5),
  ('Мажор', 'major', 120000.00, 5);

INSERT INTO t_p38899835_cloud_sync_6.matrix_levels (tariff_id, level_number, payout_per_slot, slots_count)
SELECT t.id, l.level_number, l.payout_per_slot, l.slots_count
FROM t_p38899835_cloud_sync_6.tariffs t
CROSS JOIN (VALUES
  (1, 150.00, 2),
  (2, 750.00, 2),
  (3, 1875.00, 2),
  (4, 4687.00, 2),
  (5, 11718.00, 2)
) AS l(level_number, payout_per_slot, slots_count)
WHERE t.slug = 'mini';

INSERT INTO t_p38899835_cloud_sync_6.matrix_levels (tariff_id, level_number, payout_per_slot, slots_count)
SELECT t.id, l.level_number, l.payout_per_slot, l.slots_count
FROM t_p38899835_cloud_sync_6.tariffs t
CROSS JOIN (VALUES
  (1, 3000.00, 2),
  (2, 7500.00, 2),
  (3, 18750.00, 2),
  (4, 46875.00, 2),
  (5, 117187.00, 2)
) AS l(level_number, payout_per_slot, slots_count)
WHERE t.slug = 'minor';

INSERT INTO t_p38899835_cloud_sync_6.matrix_levels (tariff_id, level_number, payout_per_slot, slots_count)
SELECT t.id, l.level_number, l.payout_per_slot, l.slots_count
FROM t_p38899835_cloud_sync_6.tariffs t
CROSS JOIN (VALUES
  (1, 60000.00, 2),
  (2, 150000.00, 2),
  (3, 375000.00, 2),
  (4, 937500.00, 2),
  (5, 2343750.00, 2)
) AS l(level_number, payout_per_slot, slots_count)
WHERE t.slug = 'major';
