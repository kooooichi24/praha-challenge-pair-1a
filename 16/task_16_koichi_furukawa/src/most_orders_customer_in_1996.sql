select
  *
from
  (
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
  ) as temp
where
  temp.OrderCount = (
    select
      max(OrderCount)
    from
      (
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
      ) as num
  );