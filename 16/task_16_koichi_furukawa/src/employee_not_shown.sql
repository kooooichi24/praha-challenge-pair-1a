-- EmployeeId=1の従業員のレコードを、Employeeテーブルから削除
delete from
  [Employees]
where
  EmployeeID = 1;

-- EmloyeeId=1が担当したOrdersを表示しないクエリ
select
  OrderID,
  CustomerID,
  o.EmployeeID as EmployeeID,
  OrderDate,
  ShipperID
from
  [Orders] o
  inner join [Employees] e on o.EmployeeId = e.EmployeeId;