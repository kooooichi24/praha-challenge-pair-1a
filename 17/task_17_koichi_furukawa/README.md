# インデックスを理解する

## 課題内容

[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recaoPX7kBTbdWJfo?blocks=hide)

---

## 課題 1(質問)

### 1.

インデックスは、本の索引のようなものであり、**ある値がどこにあるかを結びつけるもの**である。
ある値がどこにあるかが分かることで何が嬉しいかというと、データ構造を自由に変更することが可能な点が挙げられる。
なぜなら、データ構造を変更することでアルゴリズム手法を変更できるからである。例えばリストから二分探索木にデータ構造を変更することで、アルゴリズムを線形探索法から二分探索法に変更できる。
これにより、計算量を O(N)から O(log n)に削減できる。
まとめると、インデックスとは、ある値がどこにあるかを結びつける仕組みであり、その仕組みによってデータ構造を変更することができる。

- 参考文献
  - [【SQL】ゼロ知識から実行計画を読み解きパフォーマンス改善](https://qiita.com/yoshinori_hisakawa/items/5ef0cf4fd8eb6dd3037f)
  - [実行計画？？統計情報？？って人へ](https://qiita.com/NagaokaKenichi/items/5b6eb9887f88046a594d)

### 2.

#### スロークエリログとは

実行時間が遅いクエリのログのこと。

> スロークエリログ (Slow query log) は、MySQL で出力できるログの種類の 1 つです。 SQL の実行時間が指定した時間よりもかかってしまった SQL を全て出力することができます。 これにより、アプリケーション構築時や本番運用時にパフォーマンスのボトルネックとなっている SQL を発見するのに大いに役に立ちます。

[MySQL チューニングの基本「スロークエリログ」を知ろう！](https://weblabo.oscasierra.net/mysql-slow-query-log-1/)

#### なぜスロークエリログを調査する必要があるか

手当たり次第にインデックスを貼ると、パフォーマンスのボトルネックとなるインデックスまで貼ってしまう可能性がある。
そのため、ボトルネックとなっている SQL がないことを確認するために、スロークエリログを調べる必要がある。

### 3.

カラムの値の種類の絶対数

[カーディナリティについてまとめてみた](https://qiita.com/soyanchu/items/034be19a2e3cb87b2efb)

### 4.

#### カバリングインデックスとは

> 「インデックスが含む値のみを読み出すような検索」の場合、データファイルへのアクセスをすることなく、インデックスへのアクセスのみで完結することができます。 これをカバリングインデックスと呼びます。

[MySQL(InnoDB)のインデックスについての備忘録](https://naokirin.hatenablog.com/entry/2015/02/07/193609)

```sql
CREATE TABLE index_test ( key1 INT UNSIGNED PRIMARY KEY, noIndexColumn INT);

-- カバリングインデックス
SELECT key1 from key1 > 0 and key1 <= 10;

-- カバリングインデックスではない
SELECT key1, noIndexColumn from key1 > 0 and key1 <= 10;
```

不要な列を取得しないためにも、`select * from ...` は避けた方が良い

> このようにカバリングインデックスを積極的に狙うのであれば、不要な列を取得しない、とくに SELECT \* from ... は極力避けたほうがよい、ということになります。

- 他に目を通した記事
  - [Covering Index と self-join と MySQL](https://blog.nomadscafe.jp/2011/08/coverting-index-self-join-mysql.html)
  - [【MySQL】Covering Index で処理が高速化するのを確認する](https://www.softel.co.jp/blogs/tech/archives/5139)

## 課題 2(実装)

### クエリ 1

#### インデックス作成前

インデックス確認

```sql
mysql> SHOW INDEX FROM salaries;
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table    | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| salaries |          0 | PRIMARY  |            1 | emp_no      | A         |      228939 |     NULL | NULL   |      | BTREE      |         |               |
| salaries |          0 | PRIMARY  |            2 | from_date   | A         |     2184159 |     NULL | NULL   |      | BTREE      |         |               |
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
2 rows in set (0.00 sec)
```

クエリ実行

```sql
mysql> SELECT count(*) FROM salaries WHERE salary > 60000;
+----------+
| count(*) |
+----------+
|  1495933 |
+----------+
1 row in set (0.58 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 730;
+----------+----------+----------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                           |
+----------+----------+----------------------------------------------------+
|      730 | 0.581245 | SELECT count(*) FROM salaries WHERE salary > 60000 |
+----------+----------+----------------------------------------------------+
1 row in set (0.01 sec)
```

#### インデックス作成後

インデックス作成

```sql
mysql> ALTER TABLE salaries ADD INDEX (salary);
Query OK, 0 rows affected (14.25 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

インデックスが作成されたことの確認

```sql
mysql> SHOW INDEX FROM salaries;
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table    | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| salaries |          0 | PRIMARY  |            1 | emp_no      | A         |      228939 |     NULL | NULL   |      | BTREE      |         |               |
| salaries |          0 | PRIMARY  |            2 | from_date   | A         |     2184159 |     NULL | NULL   |      | BTREE      |         |               |
| salaries |          1 | salary   |            1 | salary      | A         |       72949 |     NULL | NULL   |      | BTREE      |         |               |
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
3 rows in set (0.00 sec)
```

クエリ実行

```sql
mysql> SELECT count(*) FROM salaries WHERE salary > 60000;
+----------+
| count(*) |
+----------+
|  1495933 |
+----------+
1 row in set (0.35 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 883;
+----------+----------+----------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                           |
+----------+----------+----------------------------------------------------+
|      883 | 0.349875 | SELECT count(*) FROM salaries WHERE salary > 60000 |
+----------+----------+----------------------------------------------------+
1 row in set (0.00 sec)
```

クエリー実行計画の取得

```sql
mysql> EXPLAIN SELECT count(*) FROM salaries WHERE salary > 60000;
+----+-------------+----------+------------+-------+---------------+--------+---------+------+---------+----------+--------------------------+
| id | select_type | table    | partitions | type  | possible_keys | key    | key_len | ref  | rows    | filtered | Extra                    |
+----+-------------+----------+------------+-------+---------------+--------+---------+------+---------+----------+--------------------------+
|  1 | SIMPLE      | salaries | NULL       | range | salary        | salary | 4       | NULL | 1092079 |   100.00 | Using where; Using index |
+----+-------------+----------+------------+-------+---------------+--------+---------+------+---------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

`type: range` は、インデックスを使用して範囲選択している。

> 行を選択するためのインデックスを使用して、特定の範囲にある行のみが取得されます。

[8.8.2 EXPLAIN 出力フォーマット/EXPLAIN 結合型 | MySQL Documentation](https://dev.mysql.com/doc/refman/5.6/ja/explain-output.html#explain-join-types)

[【MySQL】遅い select 文の原因を調査する【explain の読み方】](https://qiita.com/mtanabe/items/33a80bf2749a872645e6)

[MySQL の EXPLAIN を徹底解説!!](http://nippondanji.blogspot.com/2009/03/mysqlexplain.html)

### クエリ 2

#### インデックス作成前

インデックス確認

```sql
mysql> SHOW INDEX FROM employees;
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY  |            1 | emp_no      | A         |      299157 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
1 row in set (0.00 sec)
```

クエリ実行

```sql
mysql> SELECT count(*) FROM employees WHERE birth_date BETWEEN DATE('1959-01-01') AND DATE('1999-12-31');
+----------+
| count(*) |
+----------+
|   140449 |
+----------+
1 row in set (0.08 sec)
```

#### インデックス作成後

インデックス作成

```sql
mysql> ALTER TABLE employees ADD INDEX index_birth_date(birth_date);
Query OK, 0 rows affected (1.54 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

インデックスが作成されたことの確認

```sql
mysql> SHOW INDEX FROM employees;
+-----------+------------+------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name         | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY          |            1 | emp_no      | A         |      299157 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | index_birth_date |            1 | birth_date  | A         |        4747 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
2 rows in set (0.00 sec)
```

クエリ実行

```sql
mysql> SELECT count(*) FROM employees WHERE birth_date BETWEEN DATE('1959-01-01') AND DATE('1999-12-31');
+----------+
| count(*) |
+----------+
|   140449 |
+----------+
1 row in set (0.03 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 2839;
+----------+----------+---------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                          |
+----------+----------+---------------------------------------------------------------------------------------------------+
|     2839 | 0.039025 | SELECT count(*) FROM employees WHERE birth_date BETWEEN DATE('1959-01-01') AND DATE('1999-12-31') |
+----------+----------+---------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

クエリー実行計画の取得

```sql
mysql> EXPLAIN SELECT count(*) FROM employees WHERE birth_date BETWEEN DATE('1959-01-01') AND DATE('1999-12-31');
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+--------+----------+--------------------------+
| id | select_type | table     | partitions | type  | possible_keys    | key              | key_len | ref  | rows   | filtered | Extra                    |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+--------+----------+--------------------------+
|  1 | SIMPLE      | employees | NULL       | range | index_birth_date | index_birth_date | 3       | NULL | 149578 |   100.00 | Using where; Using index |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+--------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

### クエリ 3

インデックス確認

```sql
mysql> SHOW INDEX FROM employees;
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table    | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| salaries |          0 | PRIMARY  |            1 | emp_no      | A         |      228939 |     NULL | NULL   |      | BTREE      |         |               |
| salaries |          0 | PRIMARY  |            2 | from_date   | A         |     2184159 |     NULL | NULL   |      | BTREE      |         |               |
| salaries |          1 | salary   |            1 | salary      | A         |       72949 |     NULL | NULL   |      | BTREE      |         |               |
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
3 rows in set (0.00 sec)
```

クエリ実行

```sql
mysql> SELECT count(*) FROM employees WHERE first_name LIKE 'FU%';
+----------+
| count(*) |
+----------+
|     2079 |
+----------+
1 row in set (0.07 sec)
```

#### インデックス作成後

インデックス作成

```sql
mysql> ALTER TABLE employees ADD INDEX index_first_name(first_name);
Query OK, 0 rows affected (1.58 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

インデックスが作成されたことの確認

```sql
mysql> SHOW INDEX FROM employees;
+-----------+------------+------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name         | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY          |            1 | emp_no      | A         |      299157 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | index_birth_date |            1 | birth_date  | A         |        4747 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | index_first_name |            1 | first_name  | A         |        1251 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
3 rows in set (0.00 sec)
```

クエリ実行

```sql
mysql> SELECT count(*) FROM employees WHERE first_name LIKE 'FU%';
+----------+
| count(*) |
+----------+
|     2079 |
+----------+
1 row in set (0.00 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 3349;
+----------+----------+------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                   |
+----------+----------+------------------------------------------------------------+
|     3349 | 0.001427 | SELECT count(*) FROM employees WHERE first_name LIKE 'FU%' |
+----------+----------+------------------------------------------------------------+
1 row in set (0.00 sec)
```

クエリー実行計画の取得

```sql
mysql> EXPLAIN SELECT count(*) FROM employees WHERE first_name LIKE 'FU%';
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+------+----------+--------------------------+
| id | select_type | table     | partitions | type  | possible_keys    | key              | key_len | ref  | rows | filtered | Extra                    |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+------+----------+--------------------------+
|  1 | SIMPLE      | employees | NULL       | range | index_first_name | index_first_name | 16      | NULL | 2079 |   100.00 | Using where; Using index |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

## 課題 3(実装)

### インデックスあり

インデックス確認

```sql
mysql> SHOW INDEX FROM salaries;
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table    | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| salaries |          0 | PRIMARY  |            1 | emp_no      | A         |      228939 |     NULL | NULL   |      | BTREE      |         |               |
| salaries |          0 | PRIMARY  |            2 | from_date   | A         |     2184160 |     NULL | NULL   |      | BTREE      |         |               |
| salaries |          1 | salary   |            1 | salary      | A         |       72949 |     NULL | NULL   |      | BTREE      |         |               |
+----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
3 rows in set (0.01 sec)
```

INSERT クエリ

```sql
mysql> INSERT INTO salaries VALUES (499999, 50000, '2020-01-01', '2021-01-01');
Query OK, 1 row affected (0.09 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 3645;
+----------+----------+-------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                |
+----------+----------+-------------------------------------------------------------------------+
|     3645 | 0.096011 | INSERT INTO salaries VALUES (499999, 50000, '2020-01-01', '2021-01-01') |
+----------+----------+-------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

### インデックスなし

インデックス削除

```sql
mysql> ALTER TABLE salaries DROP INDEX salary;
Query OK, 0 rows affected (0.12 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Primary Key は削除しなくてよいのかな...？

ちなみに削除しようとしたらエラーになった

```sql
mysql> ALTER TABLE salaries DROP PRIMARY KEY;
ERROR 1025 (HY000): Error on rename of './employees/#sql-1_2' to './employees/salaries' (errno: 150 - Foreign key constraint is incorrectly formed)
```

INSERT クエリ

```sql
mysql> INSERT INTO salaries VALUES (499999, 50000, '2021-01-01', '2022-01-01');
Query OK, 1 row affected (0.02 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 3810;
+----------+----------+-------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                |
+----------+----------+-------------------------------------------------------------------------+
|     3810 | 0.022312 | INSERT INTO salaries VALUES (499999, 50000, '2021-01-01', '2022-01-01') |
+----------+----------+-------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

### インデックスありなし比較

#### 実行時間比較

インデックスがない場合の方が、INSERT 文の実行速度が早かった

|          | インデックスなし | インデックスあり |
| -------- | ---------------- | ---------------- |
| 実行速度 | 0.09s            | 0.02s            |

#### 理由

インデックスを貼るために、追加したデータをインデックスに追加するから。

また、インデックスの順序とツリーのバランスを保つための処理がある。

> テーブルにインデックスがある場合、データベースはインデックスを使って新しいエントリを見つけられるようにしなければなりません。そのため、 新しいエントリはテーブルの全てのインデックスにも追加されます。従って、インデックスの数は insert 文の実行コストの乗数になります。

[インデックスの欠点 : 書き込みが遅くなる - Use The Index, Luke](https://use-the-index-luke.com/ja/sql/dml)

[インデックスを作れば作るほど、INSERT が遅くなる](https://use-the-index-luke.com/ja/sql/dml/insert)

### DELETE 文もおなじ？

INSERT 文と同じ。

> 実際の行の削除は、新しい行の挿入と似たプロセスです。特に、インデックスから参照を削除し、インデックスツリーのバランスを保つ動きが 似ています。

[インデックスを作れば作るほど、DELETE が遅くなる](https://use-the-index-luke.com/ja/sql/dml/delete)

## 課題 3(クイズ)

### クイズ 1

1960 年以降に生まれた社員数を集計せよ

<details><summary>回答</summary><div>

#### インデックスなし

クエリ実行

```sql
mysql> SELECT count(emp_no) FROM employees WHERE birth_date >= DATE('1960-01-01');
+---------------+
| count(emp_no) |
+---------------+
|        117138 |
+---------------+
1 row in set (0.10 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 5038;
+----------+----------+----------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                   |
+----------+----------+----------------------------------------------------------------------------+
|     5038 | 0.104014 | SELECT count(emp_no) FROM employees WHERE birth_date >= DATE('1960-01-01') |
+----------+----------+----------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

クエリー実行計画の取得

```sql
mysql> EXPLAIN SELECT count(emp_no) FROM employees WHERE birth_date >= DATE('1960-01-01');
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299157 |    33.33 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

#### インデックスあり（birth_date）

インデックス作成

```sql
mysql> ALTER TABLE employees ADD INDEX index_birth_date(birth_date);
Query OK, 0 rows affected (1.21 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

クエリ実行

```sql
mysql> SELECT count(emp_no) FROM employees WHERE birth_date >= DATE('1960-01-01');
+---------------+
| count(emp_no) |
+---------------+
|        117138 |
+---------------+
1 row in set (0.04 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 5174;
+----------+----------+----------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                   |
+----------+----------+----------------------------------------------------------------------------+
|     5174 | 0.044887 | SELECT count(emp_no) FROM employees WHERE birth_date >= DATE('1960-01-01') |
+----------+----------+----------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

クエリー実行計画の取得

```sql
mysql> EXPLAIN SELECT count(emp_no) FROM employees WHERE birth_date >= DATE('1960-01-01');
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+--------+----------+--------------------------+
| id | select_type | table     | partitions | type  | possible_keys    | key              | key_len | ref  | rows   | filtered | Extra                    |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+--------+----------+--------------------------+
|  1 | SIMPLE      | employees | NULL       | range | index_birth_date | index_birth_date | 3       | NULL | 149578 |   100.00 | Using where; Using index |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+--------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

</div></details>

### クイズ 2

1960 年に生まれた社員数を集計せよ

<details><summary>回答</summary><div>

#### インデックスなし

インデックス確認

```sql
mysql> SHOW INDEX FROM employees;
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY  |            1 | emp_no      | A         |      299157 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
1 row in set (0.01 sec)
```

クエリ実行(Like 句使用)

```sql
mysql> SELECT count(emp_no) FROM employees WHERE DATE_FORMAT(birth_date, '%Y%m%d') like '1960%';
+---------------+
| count(emp_no) |
+---------------+
|         23126 |
+---------------+
1 row in set (0.18 sec)
```

クエリ実行(BETWEEN 使用)

```sql
mysql> SELECT count(emp_no) FROM employees WHERE birth_date BETWEEN DATE('1960-01-01') AND DATE('1960-12-31');
+---------------+
| count(emp_no) |
+---------------+
|         23126 |
+---------------+
1 row in set (0.09 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id in (5340, 5388);
+----------+----------+--------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                               |
+----------+----------+--------------------------------------------------------------------------------------------------------+
|     5340 | 0.182378 | SELECT count(emp_no) FROM employees WHERE DATE_FORMAT(birth_date, '%Y%m%d') like '1960%'               |
|     5388 | 0.091249 | SELECT count(emp_no) FROM employees WHERE birth_date BETWEEN DATE('1960-01-01') AND DATE('1960-12-31') |
+----------+----------+--------------------------------------------------------------------------------------------------------+
2 rows in set (0.01 sec)
```

クエリー案 1 の実行計画の取得

```sql
mysql> EXPLAIN SELECT count(emp_no) FROM employees WHERE DATE_FORMAT(birth_date, '%Y%m%d') like '1960%';
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299157 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

クエリー案 2 の実行計画の取得

```sql
mysql> EXPLAIN SELECT count(emp_no) FROM employees WHERE birth_date BETWEEN DATE('1960-01-01') AND DATE('1960-12-31');
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299157 |    11.11 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

#### インデックスあり（birth_date）

インデックス作成

```sql
mysql> ALTER TABLE employees ADD INDEX index_birth_date(birth_date);
Query OK, 0 rows affected (1.47 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

インデックス確認

```sql
mysql> SHOW INDEX FROM employees;
+-----------+------------+------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name         | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY          |            1 | emp_no      | A         |      299157 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | index_birth_date |            1 | birth_date  | A         |        4712 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+------------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
2 rows in set (0.00 sec)
```

クエリ実行(Like 句使用)

```sql
mysql> SELECT count(emp_no) FROM employees WHERE DATE_FORMAT(birth_date, '%Y%m%d') like '1960%';
+---------------+
| count(emp_no) |
+---------------+
|         23126 |
+---------------+
1 row in set (0.17 sec)
```

クエリ実行(BETWEEN 使用)

```sql
mysql> SELECT count(emp_no) FROM employees WHERE birth_date BETWEEN DATE('1960-01-01') AND DATE('1960-12-31');
+---------------+
| count(emp_no) |
+---------------+
|         23126 |
+---------------+
1 row in set (0.01 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id in (5542, 5590);
+----------+----------+--------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                               |
+----------+----------+--------------------------------------------------------------------------------------------------------+
|     5542 | 0.172233 | SELECT count(emp_no) FROM employees WHERE DATE_FORMAT(birth_date, '%Y%m%d') like '1960%'               |
|     5590 | 0.009745 | SELECT count(emp_no) FROM employees WHERE birth_date BETWEEN DATE('1960-01-01') AND DATE('1960-12-31') |
+----------+----------+--------------------------------------------------------------------------------------------------------+
2 rows in set (0.01 sec)
```

クエリー案 1 の実行計画の取得

```sql
mysql> EXPLAIN SELECT count(emp_no) FROM employees WHERE DATE_FORMAT(birth_date, '%Y%m%d') like '1960%';
+----+-------------+-----------+------------+-------+---------------+------------------+---------+------+--------+----------+--------------------------+
| id | select_type | table     | partitions | type  | possible_keys | key              | key_len | ref  | rows   | filtered | Extra                    |
+----+-------------+-----------+------------+-------+---------------+------------------+---------+------+--------+----------+--------------------------+
|  1 | SIMPLE      | employees | NULL       | index | NULL          | index_birth_date | 3       | NULL | 299157 |   100.00 | Using where; Using index |
+----+-------------+-----------+------------+-------+---------------+------------------+---------+------+--------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

クエリー案 2 の実行計画の取得

```sql
mysql> EXPLAIN SELECT count(emp_no) FROM employees WHERE birth_date BETWEEN DATE('1960-01-01') AND DATE('1960-12-31');
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+-------+----------+--------------------------+
| id | select_type | table     | partitions | type  | possible_keys    | key              | key_len | ref  | rows  | filtered | Extra                    |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+-------+----------+--------------------------+
|  1 | SIMPLE      | employees | NULL       | range | index_birth_date | index_birth_date | 3       | NULL | 43264 |   100.00 | Using where; Using index |
+----+-------------+-----------+------------+-------+------------------+------------------+---------+------+-------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

</div></details>

### クイズ 3

最も女性が入社した年度と人数を取得せよ。

<details><summary>回答</summary><div>

#### インデックスなし

インデックス確認

```sql
mysql> SHOW INDEX FROM employees;
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY  |            1 | emp_no      | A         |      299157 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+----------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
1 row in set (0.00 sec)
```

クエリ実行

```sql
mysql> SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1;
+-----------+--------+-------+
| hire_year | gender | count |
+-----------+--------+-------+
|      1986 | F      | 14434 |
+-----------+--------+-------+
1 row in set (0.13 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 6277;
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                                                     |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     6277 | 0.124098 | SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1 |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.01 sec)
```

クエリー実行計画の取得

```sql
mysql> EXPLAIN SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1;
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------------------------------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra                                        |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------------------------------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299157 |    50.00 | Using where; Using temporary; Using filesort |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

#### インデックスあり（gender のみ）

インデックス作成(gender のみ)

```sql
mysql> ALTER TABLE employees ADD INDEX index_gender(gender);
Query OK, 0 rows affected (1.01 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

インデックス確認

```sql
mysql> SHOW INDEX FROM employees;
+-----------+------------+--------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name     | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+--------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY      |            1 | emp_no      | A         |      299157 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | index_gender |            1 | gender      | A         |           1 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+--------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
2 rows in set (0.00 sec)
```

クエリ実行

```sql
mysql> SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1;
+-----------+--------+-------+
| hire_year | gender | count |
+-----------+--------+-------+
|      1986 | F      | 14434 |
+-----------+--------+-------+
1 row in set (0.21 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 6431;
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                                                     |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     6431 | 0.211344 | SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1 |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.01 sec)
```

クエリーの実行計画の取得

```sql
mysql> EXPLAIN SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1;
+----+-------------+-----------+------------+------+---------------+--------------+---------+-------+--------+----------+--------------------------------------------------------+
| id | select_type | table     | partitions | type | possible_keys | key          | key_len | ref   | rows   | filtered | Extra                                                  |
+----+-------------+-----------+------------+------+---------------+--------------+---------+-------+--------+----------+--------------------------------------------------------+
|  1 | SIMPLE      | employees | NULL       | ref  | index_gender  | index_gender | 1       | const | 149578 |   100.00 | Using index condition; Using temporary; Using filesort |
+----+-------------+-----------+------------+------+---------------+--------------+---------+-------+--------+----------+--------------------------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

</div></details>

#### インデックスあり（hire_date のみ）

インデックス作成(hire_date のみ)

```sql
mysql> ALTER TABLE employees ADD INDEX index_hire_date(hire_date);
Query OK, 0 rows affected (1.22 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

インデックス確認

```sql
mysql> SHOW INDEX FROM employees;
+-----------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name        | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY         |            1 | emp_no      | A         |      299157 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | index_hire_date |            1 | hire_date   | A         |        5636 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
2 rows in set (0.00 sec)
```

クエリ実行

```sql
mysql> SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1;
+-----------+--------+-------+
| hire_year | gender | count |
+-----------+--------+-------+
|      1986 | F      | 14434 |
+-----------+--------+-------+
1 row in set (0.13 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 6583;
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                                                     |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     6583 | 0.133667 | SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1 |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

クエリーの実行計画の取得

```sql
mysql> EXPLAIN SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1;
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------------------------------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra                                        |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------------------------------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299157 |    50.00 | Using where; Using temporary; Using filesort |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

</div></details>
#### インデックスあり（hire_date のみ）

インデックス作成(hire_date のみ)

```sql
mysql> ALTER TABLE employees ADD INDEX index_hire_date(hire_date);
Query OK, 0 rows affected (1.22 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

インデックス確認

```sql
mysql> SHOW INDEX FROM employees;
+-----------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name        | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY         |            1 | emp_no      | A         |      299157 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | index_hire_date |            1 | hire_date   | A         |        5636 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
2 rows in set (0.00 sec)
```

クエリ実行

```sql
mysql> SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1;
+-----------+--------+-------+
| hire_year | gender | count |
+-----------+--------+-------+
|      1986 | F      | 14434 |
+-----------+--------+-------+
1 row in set (0.13 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 6583;
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                                                     |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     6583 | 0.133667 | SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1 |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

クエリーの実行計画の取得

```sql
mysql> EXPLAIN SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1;
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------------------------------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra                                        |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------------------------------------+
|  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299157 |    50.00 | Using where; Using temporary; Using filesort |
+----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+----------------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

</div></details>

#### インデックスあり（gender と hire_date）

インデックス作成(gender を追加)

```sql
mysql> ALTER TABLE employees ADD INDEX index_gender(gender);
Query OK, 0 rows affected (0.92 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

インデックス確認

```sql
mysql> SHOW INDEX FROM employees;
+-----------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| Table     | Non_unique | Key_name        | Seq_in_index | Column_name | Collation | Cardinality | Sub_part | Packed | Null | Index_type | Comment | Index_comment |
+-----------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
| employees |          0 | PRIMARY         |            1 | emp_no      | A         |      299157 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | index_hire_date |            1 | hire_date   | A         |        5636 |     NULL | NULL   |      | BTREE      |         |               |
| employees |          1 | index_gender    |            1 | gender      | A         |           1 |     NULL | NULL   |      | BTREE      |         |               |
+-----------+------------+-----------------+--------------+-------------+-----------+-------------+----------+--------+------+------------+---------+---------------+
3 rows in set (0.00 sec)
```

クエリ実行

```sql
mysql> SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1;
+-----------+--------+-------+
| hire_year | gender | count |
+-----------+--------+-------+
|      1986 | F      | 14434 |
+-----------+--------+-------+
1 row in set (0.21 sec)
```

実行時間

```sql
mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id = 6757;
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
| EVENT_ID | duration | SQL_TEXT                                                                                                                                                     |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     6757 | 0.207205 | SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1 |
+----------+----------+--------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.01 sec)
```

クエリーの実行計画の取得

```sql
mysql> EXPLAIN SELECT YEAR(hire_date) hire_year, gender, COUNT(gender) count FROM employees WHERE gender = 'F' GROUP BY YEAR(hire_date), gender ORDER BY count DESC LIMIT 1;
+----+-------------+-----------+------------+------+---------------+--------------+---------+-------+--------+----------+--------------------------------------------------------+
| id | select_type | table     | partitions | type | possible_keys | key          | key_len | ref   | rows   | filtered | Extra                                                  |
+----+-------------+-----------+------------+------+---------------+--------------+---------+-------+--------+----------+--------------------------------------------------------+
|  1 | SIMPLE      | employees | NULL       | ref  | index_gender  | index_gender | 1       | const | 149578 |   100.00 | Using index condition; Using temporary; Using filesort |
+----+-------------+-----------+------------+------+---------------+--------------+---------+-------+--------+----------+--------------------------------------------------------+
1 row in set, 1 warning (0.00 sec)
```

#### まとめ

自分が考えたクエリだと、インデックスなしが 1 番早かった、、（GROUP BY 句で変換しているからインデックスが無効化されちゃったのかな？）

|          | インデックスなし | index_gender のみ | index_hire_date のみ | index_gender と index_hire_date |
| -------- | ---------------- | ----------------- | -------------------- | ------------------------------- |
| 実行速度 | 0.124s           | 0.211s            | 0.133s               | 0.207s                          |

</div></details>

## メモ

### setup

```bash
docker pull genschsa/mysql-employees
docker run -d --name mysql-employees -p 3306:3306 -e MYSQL_ROOT_PASSWORD=college -v $PWD/data:/var/lib/mysql genschsa/mysql-employees
docker exec -it mysql-employees bash
mysql -u root -p -h 127.0.0.1
```

### DB まわりのコマンド

```sql
-- データベース一覧の表示
SHOW DATABASES;

-- データベースの選択
USE employees;

-- テーブル一覧の確認
SHOW TABLES;

--  テーブル構造の確認
SHOW COLUMNS FROM employees;

-- インデックスの確認
SHOW index FROM salaries;

-- インデックスの作成
ALTER TABLE salaries ADD INDEX (salary);
```

### パフォーマンススキーマまわりのコマンド

```sql
-- MySQLサーバーのシステム設定値を確認
-- performance_schema が ON になっていることを確認
SHOW GLOBAL VARIABLES LIKE 'performance_schema';

-- パフォーマンススキーマの設定に関するテーブルの確認
SHOW TABLES FROM performance_schema LIKE 'setup\_%';

-- パフォーマンススキーマの設定の確認
-- setup_consumers テーブルは、パフォーマンススキーマが計測した統計を記録するかどうかが設定されている
SELECT * FROM performance_schema.setup_consumers;
-- setup_instruments テーブルは、setup_consumers テーブルよりさらに細分化された「パフォーマンススキーマがどのイベントの統計情報を記録するか」が設定されている
SELECT * FROM performance_schema.setup_instruments;

-- 計測項目の変更
UPDATE performance_schema.setup_instruments SET ENABLED = 'YES', TIMED = 'YES' WHERE NAME LIKE '%statement/%';
UPDATE performance_schema.setup_instruments SET ENABLED = 'YES', TIMED = 'YES' WHERE NAME LIKE '%stage/%';
UPDATE performance_schema.setup_consumers SET ENABLED = 'YES' WHERE NAME LIKE '%events_statements_%';
UPDATE performance_schema.setup_consumers SET ENABLED = 'YES' WHERE NAME LIKE '%events_stages_%';

-- ステートメントの識別
SELECT EVENT_ID, truncate(timer_wait/1000000000000, 6) as duration , SQL_TEXT FROM performance_schema.events_statements_history_long;

-- プロファイリング情報の確認
-- ステートメントのステージイベントを取得する
SELECT event_name, source, truncate(timer_wait/1000000000000, 6) as duration FROM performance_schema.events_stages_history_long WHERE NESTING_EVENT_ID=115;
```

[performance_schema を sys で使い倒す！](https://thinkit.co.jp/article/10028)

[誰も教えてくれなかった MySQL の障害解析方法](https://qiita.com/muran001/items/14f19959d4723ffc29cc)

[第 130 回　クエリをプロファイリングしてみる](https://gihyo.jp/dev/serial/01/mysql-road-construction-news/0130)
