select
  *
from
  (
    select
      CustomerID,
      count(*) as OrderCount
    from
      [Orders]
    where
      orderdate between date('1996-01-01')
      and date('1996-12-31')
    group by
      CustomerId
  ) as temp
where
  temp.OrderCount = (
    select
      max(num.OrderCount)
    from
      (
        select
          CustomerID,
          count(*) as OrderCount
        from
          [Orders]
        where
          orderdate between date('1996-01-01')
          and date('1996-12-31')
        group by
          CustomerId
      ) as num
  );
