CREATE TABLE IF NOT EXISTS t_p38899835_cloud_sync_6.casino_leaderboard (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(32) NOT NULL,
  coins INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_casino_leaderboard_coins ON t_p38899835_cloud_sync_6.casino_leaderboard(coins DESC);
