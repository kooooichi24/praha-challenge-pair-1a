select
  CustomerID,
  count(*) as OrderCount
from
  [Orders]
where
  orderdate between '1996-01-01'
  and '1996-12-31'
group by
  CustomerId
having
  count(*) >= 3
order by
  OrderCount desc;