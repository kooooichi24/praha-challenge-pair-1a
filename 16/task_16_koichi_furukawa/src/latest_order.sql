select
  EmployeeID,
  max(OrderDate) as LatestOrderDate
from
  [Orders]
group by
  EmployeeID
order by
  EmployeeID