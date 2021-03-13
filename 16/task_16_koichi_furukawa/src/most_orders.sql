select
  *
from
  (
    select
      OrderID,
      count(*) OrderDetailCount
    from
      [OrderDetails]
    group by
      OrderID
  ) as tmp
where
  tmp.OrderDetailCount = (
    select
      max(OrderDetailCount)
    from
      (
        select
          OrderID,
          count(*) OrderDetailCount
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