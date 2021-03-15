select
  EmployeeID,
  max(OrderDate) LatestOrderDate
from
  [Orders]
group by
  EmployeeID
order by
  EmployeeID