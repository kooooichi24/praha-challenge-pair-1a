/* Junior Column の追加 */
alter table
  [employees]
add
  Junior boolean not null default false;

/* Junior Column のフラグ更新 */
update
  [employees]
set
  Junior = true
where
  employees.BirthDate >= date('1960-01-01');