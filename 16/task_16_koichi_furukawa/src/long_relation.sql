/* long_relation Column の追加 */
alter table
  [Shippers]
add
  long_relation boolean not null default false
  /* long_relation Column のフラグ更新 */
update
  [Shippers]
set
  long_relation = true
where
  ShipperID in (
    select
      ShipperID
    from
      [Orders]
    group by
      ShipperID
    having
      count(*) >= 70
  )