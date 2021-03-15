select
  o.ShipperID as ShipperID,
  count(*) as ShippingCount
from
  [Orders] o
group by
  o.ShipperID
order by
  ShippingCount desc