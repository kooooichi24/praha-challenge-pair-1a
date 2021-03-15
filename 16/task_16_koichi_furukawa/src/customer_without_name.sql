-- 任意の１レコードのCustomerNameをNULLにする
update
  [Customers]
set
  CustomerName = null
where
  CustomerID = 1;

-- CustomerNameが存在するユーザを取得する
select
  *
from
  [Customers]
where
  CustomerName is null;