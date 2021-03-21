select
  *
from
  (
    select
      OrderID,
      count(*) as OrderDetailCount
    from
      [OrderDetails]
    group by
      OrderID
  ) as tmp
where
  tmp.OrderDetailCount = (
    select
      max(num.OrderDetailCount)
    from
      (
        select
          OrderID,
          count(*) as OrderDetailCount
        from
          [OrderDetails]
        group by
          OrderID
      ) as num
  )
order by
  OrderID desc
limit
  1;
