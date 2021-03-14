select
  o.CustomerId CustomerID,
  count(*) OrderCount
from
  [Orders] as o
where
  orderdate between '1996-01-01'
  and '1996-12-31'
group by
  o.CustomerId
having
  count(*) >= 3
order by
  OrderCount desc;