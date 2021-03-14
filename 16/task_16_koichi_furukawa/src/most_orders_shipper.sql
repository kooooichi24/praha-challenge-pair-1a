select
  o.ShipperID ShipperID,
  count(*) ShippingCount
from
  [Orders] as o
group by
  o.ShipperID
order by
  ShippingCount desc