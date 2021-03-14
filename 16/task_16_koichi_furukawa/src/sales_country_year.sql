select
  round(sum(od.Quantity * p.Price)) sales,
  strftime('%Y', o.OrderDate) OrderYear,
  c.Country
from
  [Orders] as o
  left outer join [OrderDetails] as od on o.OrderID = od.OrderID
  left outer join [Products] as p on od.ProductID = p.ProductID
  left outer join [Customers] as c on o.CustomerID = c.CustomerID
group by
  c.Country,
  strftime('%Y', o.OrderDate)