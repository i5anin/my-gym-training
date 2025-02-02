SELECT date,
       money,
       usd,
       usd_exchange_rate
FROM dbo.adjustment_funds
ORDER BY date;