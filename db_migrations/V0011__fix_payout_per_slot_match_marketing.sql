-- Пересчитываем выплаты по маркетинг-плану: payout_per_slot = цена тарифа * 2^(level-1)
-- Мини: 300, 600, 1200, 2400, 4800
UPDATE t_p38899835_cloud_sync_6.matrix_levels ml
SET payout_per_slot = CASE ml.level_number
  WHEN 1 THEN 300
  WHEN 2 THEN 600
  WHEN 3 THEN 1200
  WHEN 4 THEN 2400
  WHEN 5 THEN 4800
END
WHERE ml.tariff_id = (SELECT id FROM t_p38899835_cloud_sync_6.tariffs WHERE slug = 'mini');

-- Минор: 6000, 12000, 24000, 48000, 96000
UPDATE t_p38899835_cloud_sync_6.matrix_levels ml
SET payout_per_slot = CASE ml.level_number
  WHEN 1 THEN 6000
  WHEN 2 THEN 12000
  WHEN 3 THEN 24000
  WHEN 4 THEN 48000
  WHEN 5 THEN 96000
END
WHERE ml.tariff_id = (SELECT id FROM t_p38899835_cloud_sync_6.tariffs WHERE slug = 'minor');

-- Мажор: 120000, 240000, 480000, 960000, 1920000
UPDATE t_p38899835_cloud_sync_6.matrix_levels ml
SET payout_per_slot = CASE ml.level_number
  WHEN 1 THEN 120000
  WHEN 2 THEN 240000
  WHEN 3 THEN 480000
  WHEN 4 THEN 960000
  WHEN 5 THEN 1920000
END
WHERE ml.tariff_id = (SELECT id FROM t_p38899835_cloud_sync_6.tariffs WHERE slug = 'major');
