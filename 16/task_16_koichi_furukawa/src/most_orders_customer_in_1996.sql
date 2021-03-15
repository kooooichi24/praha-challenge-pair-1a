select
  *
from
  (
    select
      o.CustomerId as CustomerID,
      count(*) as OrderCount
    from
      [Orders] o
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
          o.CustomerId as CustomerID,
          count(*) as OrderCount
        from
          [Orders] o
        where
          orderdate between '1996-01-01'
          and '1996-12-31'
        group by
          o.CustomerId
      ) as num
  );