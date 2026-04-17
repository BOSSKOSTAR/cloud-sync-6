CREATE UNIQUE INDEX IF NOT EXISTS transactions_payment_id_unique 
ON t_p38899835_cloud_sync_6.transactions (payment_id) 
WHERE payment_id IS NOT NULL;