select
  round(sum(od.Quantity * p.Price)) as sales,
  c.Country as Country
from
  [Orders] o
  left outer join [OrderDetails] od on o.OrderID = od.OrderID
  left outer join [Products] p on od.ProductID = p.ProductID
  left outer join [Customers] c on o.CustomerID = c.CustomerID
group by
  c.Country
order by
  sales desc;