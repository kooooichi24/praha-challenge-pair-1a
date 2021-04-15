# ビューを使いこなす

## 課題内容

[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/rec7ZEtn2s8kZJZmA?blocks=hide)

---

## 課題 1 (実装)

### 1

ビューとは、ある SELECT 文へのエイリアスみたいなもの。

### 2

#### メリット

1. セキュリティを確保できる
2. 結合が多く、長いクエリを省くことができる

#### 用途

1. ビューごとに閲覧権限を割り当てることで、アクセスコントロールが可能になる。
2. 利用頻度が高く且つ複雑なクエリを利用する際に、作成したビューを利用することでクエリがシンプルになる。

#### 参考記事

- [What is a good reason to use SQL views?](https://stackoverflow.com/questions/2680207/what-is-a-good-reason-to-use-sql-views)
  - セキュリティ: 不必要な情報は見せない
  - シンプルさ: 複数のテーブルを 1 つの仮想テーブルに結合し、単純化
  - 集約テーブル: 計算結果へのエイリアス
  - テーブルを分割: Sale2020, Sale2019
- [View (SQL) | Wikipedia](<https://en.wikipedia.org/wiki/View_(SQL)>)
  - ビューは、読み取り専用と更新可能に定義することができる

#### 疑問

セキュリティ目的の場合は、使用する目的が明確なため想像しやすい。
一方、複雑なクエリに対するエイリアスのような目的でビューを利用する場合は、どのような基準でビューを作成するか想像しづらい。
実際の現場でビューは、どちらの目的でも利用されているのだろうか？
エイリアスのような目的で利用する場合、ビューの作成基準が気になる。

↑ 上記参考記事を読んだら、セキュリティ目的以外にも利用されることが想像できた。

### 3

| 比較項目     | View                     | Materialized View             |
| ------------ | ------------------------ | ----------------------------- |
| 主な利用目的 | セキュリティ確保等       | パフォーマンス向上            |
| データ保持   | しない                   | する                          |
| 参照時の動作 | SQL を実行して結果を返却 | 保持している SQL の結果を返却 |
| 処理速度     | 遅い                     | 速い                          |

（下記の Qiita の記事を引用しました

#### 参考記事

- [3 分でわかるマテリアライズド・ビュー -使い所と問題点を考える-](https://qiita.com/wanko5296/items/61c3e6ec4561b26beb5c)
- [Oracle の機能を使って表の結合を高速化する](https://www.atmarkit.co.jp/ait/articles/0504/21/news105.html)

#### 疑問

マテリアライズド・ビューの更新方法どうやるんだ？

マテリアライズド・ビューの更新頻度は？

## 課題 2 (実装)

### クエリ

給料レンジごとの人数は？
ただし、複数回給料をもらっている場合は平均値とする。また給料は切り捨てで考える。

```sql
mysql> SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -4) AS trunc_salary FROM salaries GROUP BY emp_no ) AS salaries GROUP BY trunc_salary;
+--------------+---------------------+
| trunc_salary | COUNT(trunc_salary) |
+--------------+---------------------+
|        30000 |                 479 |
|        40000 |               77852 |
|        50000 |               87323 |
|        60000 |               56024 |
|        70000 |               38570 |
|        80000 |               23019 |
|        90000 |               11182 |
|       100000 |                4188 |
|       110000 |                1116 |
|       120000 |                 243 |
|       130000 |                  26 |
|       140000 |                   2 |
+--------------+---------------------+
12 rows in set (3.78 sec)
```

### ビュー作成

```sql
mysql> CREATE VIEW v_salary_distribution_per_million as SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -4) AS trunc_salary FROM salaries GROUP BY emp_no ) AS salaries GROUP BY trunc_salary;
Query OK, 0 rows affected (0.03 sec)
```

テーブル確認

```sql
mysql> show tables;
+-----------------------------------+
| Tables_in_employees               |
+-----------------------------------+
| current_dept_emp                  |
| departments                       |
| dept_emp                          |
| dept_emp_latest_date              |
| dept_manager                      |
| employees                         |
| salaries                          |
| titles                            |
| v_full_departments                | -- これもビューかも
| v_full_employees                  | -- これもビューかも
| v_salary_distribution_per_million | -- 発見!!
+-----------------------------------+
11 rows in set (0.00 sec)
```

ビュー確認

```sql
mysql> select TABLE_CATALOG, TABLE_SCHEMA, TABLE_NAME, LEFT(VIEW_DEFINITION, 60), CHECK_OPTION, IS_UPDATABLE, DEFINER, SECURITY_TYPE, CHARACTER_SET_CLIENT, COLLATION_CONNECTION from INFORMATION_SCHEMA.VIEWS where TABLE_SCHEMA='employees';
+---------------+--------------+-----------------------------------+--------------------------------------------------------------+--------------+--------------+----------------+---------------+----------------------+----------------------+
| TABLE_CATALOG | TABLE_SCHEMA | TABLE_NAME                        | LEFT(VIEW_DEFINITION, 60)                                    | CHECK_OPTION | IS_UPDATABLE | DEFINER        | SECURITY_TYPE | CHARACTER_SET_CLIENT | COLLATION_CONNECTION |
+---------------+--------------+-----------------------------------+--------------------------------------------------------------+--------------+--------------+----------------+---------------+----------------------+----------------------+
| def           | employees    | current_dept_emp                  | select `l`.`emp_no` AS `emp_no`,`d`.`dept_no` AS `dept_no`,` | NONE         | YES          | root@localhost | DEFINER       | latin1               | latin1_swedish_ci    |
| def           | employees    | dept_emp_latest_date              | select `employees`.`dept_emp`.`emp_no` AS `emp_no`,max(`empl | NONE         | NO           | root@localhost | DEFINER       | latin1               | latin1_swedish_ci    |
| def           | employees    | v_full_departments                | select `employees`.`departments`.`dept_no` AS `dept_no`,`emp | NONE         | YES          | root@localhost | DEFINER       | latin1               | latin1_swedish_ci    |
| def           | employees    | v_full_employees                  | select `employees`.`employees`.`emp_no` AS `emp_no`,`employe | NONE         | YES          | root@localhost | DEFINER       | latin1               | latin1_swedish_ci    |
| def           | employees    | v_salary_distribution_per_million | select `salaries`.`trunc_salary` AS `trunc_salary`,count(`sa | NONE         | NO           | root@%         | DEFINER       | latin1               | latin1_swedish_ci    |
+---------------+--------------+-----------------------------------+--------------------------------------------------------------+--------------+--------------+----------------+---------------+----------------------+----------------------+
5 rows in set (0.01 sec)
```

ビューを利用して実行できるか確認

```sql
mysql> select * from v_salary_distribution_per_million;
+--------------+---------------------+
| trunc_salary | COUNT(trunc_salary) |
+--------------+---------------------+
|        30000 |                 479 |
|        40000 |               77852 |
|        50000 |               87323 |
|        60000 |               56024 |
|        70000 |               38570 |
|        80000 |               23019 |
|        90000 |               11182 |
|       100000 |                4188 |
|       110000 |                1116 |
|       120000 |                 243 |
|       130000 |                  26 |
|       140000 |                   2 |
+--------------+---------------------+
12 rows in set (1.23 sec)
```

### パフォーマンス

ビューなので、変化なし

```sql
mysql> mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , LEFT(SQL_TEXT, 50) FROM performance_schema.events_statements_history_long WHERE event_id IN (664, 692, 720, 748, 786, 824);
+----------+----------+----------------------------------------------------+
| EVENT_ID | duration | LEFT(SQL_TEXT, 50)                                 |
+----------+----------+----------------------------------------------------+
|      664 | 1.201020 | SELECT trunc_salary, COUNT(trunc_salary) FROM ( SE |
|      692 | 1.195313 | SELECT trunc_salary, COUNT(trunc_salary) FROM ( SE |
|      720 | 1.208220 | SELECT trunc_salary, COUNT(trunc_salary) FROM ( SE |
|      748 | 1.208986 | select * from v_salary_distribution_per_million    |
|      786 | 1.218175 | select * from v_salary_distribution_per_million    |
|      824 | 1.220190 | select * from v_salary_distribution_per_million    |
+----------+----------+----------------------------------------------------+
8 rows in set (0.01 sec)
```
