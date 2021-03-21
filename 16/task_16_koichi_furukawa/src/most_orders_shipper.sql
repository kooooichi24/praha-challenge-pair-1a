select
  ShipperID,
  count(*) as ShippingCount
from
  [Orders]
group by
  ShipperID
order by
  ShippingCount desc;