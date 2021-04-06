# スロークエリを理解する

## 課題内容

[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recoiWwGUcEHDh9Eg?blocks=hide)

---

## 課題 1(実装)

### 1,2.

設定方法は、設定ファイルに記述する手法とコマンドラインで指定する手法の 2 つある。
設定ファイルに記述する手法が推奨されているが、DockerFile 未作成なので、コマンドラインで指定する手法を採用する。

**スロークエリーログの設定**

※ slow_query_log_file に設定したファイルを作成し、権限も付与

```sql
mysql> set global slow_query_log=1;
mysql> set global long_query_time=0.1;
mysql> set global slow_query_log_file ='/usr/local/var/mysql/slow_query.log';
```

**スロークエリログの設定確認**

```sql
mysql> show variables like 'slow_query_log%';
+---------------------+-------------------------------------+
| Variable_name       | Value                               |
+---------------------+-------------------------------------+
| slow_query_log      | ON                                  |
| slow_query_log_file | /usr/local/var/mysql/slow_query.log |
+---------------------+-------------------------------------+
2 rows in set (0.00 sec)
```

**閾値の設定確認**

```sql
mysql> show variables like 'long%';
+-----------------+----------+
| Variable_name   | Value    |
+-----------------+----------+
| long_query_time | 0.100000 |
+-----------------+----------+
1 row in set (0.01 sec)
```

[第 7 回　スロークエリーログを使って遅いクエリを収集する](https://gihyo.jp/dev/serial/01/mysql-road-construction-news/0007)

### 3.

#### クエリ

```sql
mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.00 sec)
```

```sql
mysql> select * from dept_manager where to_date = date('9999-01-01');
+--------+---------+------------+------------+
| emp_no | dept_no | from_date  | to_date    |
+--------+---------+------------+------------+
| 110039 | d001    | 1991-10-01 | 9999-01-01 |
| 110114 | d002    | 1989-12-17 | 9999-01-01 |
...
| 111534 | d008    | 1991-04-08 | 9999-01-01 |
| 111939 | d009    | 1996-01-03 | 9999-01-01 |
+--------+---------+------------+------------+
9 rows in set (0.00 sec)
```

```sql
mysql> select * from departments where dept_no in ('d005', 'd008');
+---------+-------------+
| dept_no | dept_name   |
+---------+-------------+
| d005    | Development |
| d008    | Research    |
+---------+-------------+
2 rows in set (0.00 sec)
```

#### スロークエリログ 結果

スロークエリログに記録されない

```bash
root@abda9d1bb1e5:/usr/local/var/mysql# cat slow_query.log
mysqld, Version: 5.7.24 (MySQL Community Server (GPL)). started with:
Tcp port: 3306  Unix socket: /var/run/mysqld/mysqld.sock
Time                 Id Command    Argument
```

### 4.

#### クエリ

1. employees テーブルから性別ごとの従業員数を求める。

```sql
mysql> SELECT gender, COUNT(gender) FROM employees GROUP BY gender;
+--------+---------------+
| gender | COUNT(gender) |
+--------+---------------+
| M      |        179973 |
| F      |        120051 |
+--------+---------------+
2 rows in set (0.18 sec)
```

2. title テーブルから、title 名に Engineer が含まれる title ごとの人数を集計する。

```sql
mysql> SELECT title, COUNT(title) FROM titles WHERE title LIKE '%Engineer%' GROUP BY title;
+--------------------+--------------+
| title              | COUNT(title) |
+--------------------+--------------+
| Assistant Engineer |        15128 |
| Engineer           |       115003 |
| Senior Engineer    |        97750 |
+--------------------+--------------+
3 rows in set (0.71 sec)
```

3. 給料レンジごとの人数は？
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

#### スロークエリログ 結果

スロークエリログに 3 クエリ分、記録されることを確認

```bash
root@abda9d1bb1e5:/usr/local/var/mysql# cat slow_query.log
mysqld, Version: 5.7.24 (MySQL Community Server (GPL)). started with:
Tcp port: 3306  Unix socket: /var/run/mysqld/mysqld.sock
Time                 Id Command    Argument
# Time: 2021-04-04T11:29:55.826707Z
# User@Host: root[root] @  [127.0.0.1]  Id:    35
# Query_time: 0.177554  Lock_time: 0.000311 Rows_sent: 2  Rows_examined: 300028
use employees;
SET timestamp=1617535795;
SELECT gender, COUNT(gender) FROM employees GROUP BY gender;
# Time: 2021-04-04T11:30:31.466291Z
# User@Host: root[root] @  [127.0.0.1]  Id:    35
# Query_time: 0.707957  Lock_time: 0.000163 Rows_sent: 3  Rows_examined: 443308
SET timestamp=1617535831;
SELECT title, COUNT(title) FROM titles WHERE title LIKE '%Engineer%' GROUP BY title;
# Time: 2021-04-04T11:31:05.832770Z
# User@Host: root[root] @  [127.0.0.1]  Id:    35
# Query_time: 1.366695  Lock_time: 0.000235 Rows_sent: 12  Rows_examined: 3144097
SET timestamp=1617535865;
SELECT
  trunc_salary,
  COUNT(trunc_salary)
FROM
  (
    SELECT
      emp_no,
      TRUNCATE(AVG(salary), -4) AS trunc_salary
    FROM
      salaries
    GROUP BY
      emp_no
  ) AS salaries
GROUP BY
  trunc_salary;
```

## 課題 2(実装)

構文

```bash
shell> mysqldumpslow [options] [log_file ...]
```

オプションなしの例

```bash
$ mysqldumpslow slow_query.log

Reading mysql slow query log from slow_query.log
Count: 2  Time=2.87s (20s)  Lock=0.00s (0s)  Rows=12.0 (84), root[root]@[127.0.0.1]
  SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -N) AS trunc_salary FROM salaries GROUP BY emp_no ) AS salaries GROUP BY trunc_salary

Count: 4  Time=0.28s (1s)  Lock=0.00s (0s)  Rows=3.0 (12), root[root]@[127.0.0.1]
  SELECT title, COUNT(title) FROM titles WHERE title LIKE 'S' GROUP BY title

Count: 7  Time=0.15s (1s)  Lock=0.00s (0s)  Rows=2.0 (14), root[root]@[127.0.0.1]
  SELECT gender, COUNT(gender) FROM employees GROUP BY gender

Count: 1  Time=0.00s (0s)  Lock=0.00s (0s)  Rows=0.0 (0), 0users@0hosts
  mysqld, Version: N.N.N (MySQL Community Server (GPL)). started with:
  # Time: N-N-04T11:N:N.826707Z
  # User@Host: root[root] @  [N.N.N.N]  Id:    N
  # Query_time: N.N  Lock_time: N.N Rows_sent: N  Rows_examined: N
  use employees;
  SET timestamp=N;
  SELECT gender, COUNT(gender) FROM employees GROUP BY gender
```

### 1.

- -s sort_type: 出力のソート方法
  - c: カウントでソート
- -t N: 先頭 N 個

```bash
$ mysqldumpslow -s c -t 1 slow_query.log

Reading mysql slow query log from slow_query.log
Count: 7  Time=0.15s (1s)  Lock=0.00s (0s)  Rows=2.0 (14), root[root]@[127.0.0.1]
  SELECT gender, COUNT(gender) FROM employees GROUP BY gender
```

### 2.

- -s sort_type: 出力のソート方法
  - t: クエリー時間でソート
- -t N: 先頭 N 個

```bash
$ mysqldumpslow -s t -t 1 slow_query.log

Reading mysql slow query log from slow_query.log
Count: 2  Time=2.87s (20s)  Lock=0.00s (0s)  Rows=12.0 (84), root[root]@[127.0.0.1]
  SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -N) AS trunc_salary FROM salaries GROUP BY emp_no ) AS salaries GROUP BY trunc_salary
```

### 3.

- -s sort_type: 出力のソート方法
  - l: ロック時間でソート
- -t N: 先頭 N 個

```bash
$ mysqldumpslow -s l -t 1 slow_query.log

Reading mysql slow query log from slow_query.log
Count: 7  Time=0.15s (1s)  Lock=0.00s (0s)  Rows=2.0 (14), root[root]@[127.0.0.1]
  SELECT gender, COUNT(gender) FROM employees GROUP BY gender
```

### メモ

- 疑問
  - ロック時間どうやって発生させるんだ？
- 調査過程

  - `LOCK TABLES` で試してみたけど、スロークエリログ のロック時間は変化なかった、、、

    ```sql
    mysql> LOCK TABLES employees READ;
    Query OK, 0 rows affected (0.01 sec)

    mysql> select count(*) from salaries;
    ERROR 1100 (HY000): Table 'salaries' was not locked with LOCK TABLES
    ```

    [13.3.5 LOCK TABLES および UNLOCK TABLES 構文](https://dev.mysql.com/doc/refman/5.6/ja/lock-tables.html)

  - `FOR UPDATE` も試してみたけど、スロークエリログ のロック時間は変化なかった、、、
    ```sql
    mysql> select count(*) from salaries FOR UPDATE;
    +----------+
    | count(*) |
    +----------+
    |  2844049 |
    +----------+
    1 row in set (21.39 sec)
    ```
  - クエリ実行時間と mysqldumpslow の時間の差分？
    - ロック時間(0.04s) = クエリ実行時間(21.39 sec) - mysqldumpslow の時間 (21.35s)
  - そもそもロック時間ってなんだろう？→ ステージイベントを確認

    `stage/sql/System lock` ← これかな？？

    ```sql
    mysql> SELECT event_name, source, truncate(timer_wait/1000000000000, 6) as duration　FROM performance_schema.events_stages_history_long WHERE NESTING_EVENT_ID=229;
    +--------------------------------+--------+----------+
    | event_name                     | source | duration |
    +--------------------------------+--------+----------+
    | stage/sql/starting             |        | 0.000051 |
    | stage/sql/checking permissions |        | 0.000011 |
    | stage/sql/Opening tables       |        | 0.000421 |
    | stage/sql/checking permissions |        | 0.000010 |
    | stage/sql/checking permissions |        | 0.000012 |
    | stage/sql/checking permissions |        | 0.002861 |
    | stage/sql/checking permissions |        | 0.000011 |
    | stage/sql/checking permissions |        | 0.003030 |
    | stage/sql/removing tmp table   |        | 0.000018 |
    | stage/sql/removing tmp table   |        | 0.000008 |
    | stage/sql/cleaning up          |        | 0.000014 |
    | stage/sql/starting             |        | 0.000065 |
    | stage/sql/checking permissions |        | 0.000014 |
    | stage/sql/Opening tables       |        | 0.000241 |
    | stage/sql/init                 |        | 0.000036 |
    | stage/sql/System lock          |        | 0.000031 | -- この行
    | stage/sql/optimizing           |        | 0.000013 |
    | stage/sql/statistics           |        | 0.000022 |
    | stage/sql/preparing            |        | 0.000021 |
    | stage/sql/executing            |        | 0.000011 |
    | stage/sql/Sending data         |        | 1.396229 |
    | stage/sql/end                  |        | 0.000011 |
    | stage/sql/query end            |        | 0.000015 |
    | stage/sql/closing tables       |        | 0.000014 |
    | stage/sql/freeing items        |        | 0.000117 |
    | stage/sql/logging slow query   |        | 0.000072 |
    | stage/sql/cleaning up          |        | 0.000009 |
    +--------------------------------+--------+----------+
    27 rows in set (0.01 sec)
    ```

    [System lock | 8.12.5.2 一般的なスレッドの状態](https://dev.mysql.com/doc/refman/5.6/ja/general-thread-states.html#docs-body:~:text=System%20lock)

    > スレッドは、テーブルの内部または外部システムロックをリクエストしようとしているか待機しています。

- 調査結果
  - [System lock | 8.12.5.2 一般的なスレッドの状態](https://dev.mysql.com/doc/refman/5.6/ja/general-thread-states.html#docs-body:~:text=System%20lock) のこと
  - そもそも疑問自体が誤り。ロック時間はクエリごとに発生している。
- 追加で発生した疑問
  - ロック時間が大きく発生するのは、どのような場合か？

### 参考記事

[4.6.9 mysqldumpslow — スロークエリーログファイルの要約](https://dev.mysql.com/doc/refman/5.6/ja/mysqldumpslow.html)

[第 131 回　 mysqldumpslow を使ってスロークエリログを解析してみる](https://gihyo.jp/dev/serial/01/mysql-road-construction-news/0131)

## 課題 3(実装)

### 1.

- 対象クエリ

  ```sql
  mysql> SELECT gender, COUNT(gender) FROM employees GROUP BY gender;
  +--------+---------------+
  | gender | COUNT(gender) |
  +--------+---------------+
  | M      |        179973 |
  | F      |        120051 |
  +--------+---------------+
  2 rows in set (0.18 sec)
  ```

- クエリー実行計画を確認

  ```sql
  mysql> EXPLAIN SELECT gender, COUNT(gender) FROM employees GROUP BY gender;
  +----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+---------------------------------+
  | id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows   | filtered | Extra                           |
  +----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+---------------------------------+
  |  1 | SIMPLE      | employees | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 299202 |   100.00 | Using temporary; Using filesort |
  +----+-------------+-----------+------------+------+---------------+------+---------+------+--------+----------+---------------------------------+
  1 row in set, 1 warning (0.00 sec)
  ```

  `Using temporary; Using filesort` すごく遅そう

  [Using filesort](http://nippondanji.blogspot.com/2009/03/using-filesort.html)

  > Using temporary; Using filesort が EXPLAIN の最初の行に出ている時は、先に JOIN してからソートされている。（最も遅い。）

- インデックス作成(gender)

  ```sql
  mysql> create index idx_gender on employees(gender);
  Query OK, 0 rows affected (0.95 sec)
  Records: 0 Duplicates: 0 Warnings: 0
  ```

- クエリー実行計画を再確認

  ```sql
  mysql> EXPLAIN SELECT gender, COUNT(gender) FROM employees GROUP BY gender;
  +----+-------------+-----------+------------+-------+---------------+------------+---------+------+--------+----------+-------------+
  | id | select_type | table     | partitions | type  | possible_keys | key        | key_len | ref  | rows   | filtered | Extra       |
  +----+-------------+-----------+------------+-------+---------------+------------+---------+------+--------+----------+-------------+
  |  1 | SIMPLE      | employees | NULL       | index | idx_gender    | idx_gender | 1       | NULL | 299202 |   100.00 | Using index |
  +----+-------------+-----------+------------+-------+---------------+------------+---------+------+--------+----------+-------------+
  1 row in set, 1 warning (0.00 sec)
  ```

  `Using temporary; Using filesort` -> `Using index` となった。

- 実行時間の比較

  0.15s -> 0.06s

  - 修正前
    ```sql
    mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id IN (283, 304, 262);
    +----------+----------+-------------------------------------------------------------+
    | EVENT_ID | duration | SQL_TEXT                                                    |
    +----------+----------+-------------------------------------------------------------+
    |      262 | 0.150518 | SELECT gender, COUNT(gender) FROM employees GROUP BY gender |
    |      283 | 0.152956 | SELECT gender, COUNT(gender) FROM employees GROUP BY gender |
    |      304 | 0.151609 | SELECT gender, COUNT(gender) FROM employees GROUP BY gender |
    +----------+----------+-------------------------------------------------------------+
    4 rows in set (0.01 sec)
    ```
  - 修正後
    ```sql
    mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , SQL_TEXT FROM performance_schema.events_statements_history_long WHERE event_id IN (427, 444, 461);
    +----------+----------+--------------------------------------------------------------+
    | EVENT_ID | duration | SQL_TEXT                                                     |
    +----------+----------+--------------------------------------------------------------+
    |      427 | 0.071922 | SELECT gender, COUNT(gender) FROM employees GROUP BY gender  |
    |      444 | 0.068278 | SELECT gender, COUNT(gender) FROM employees GROUP BY gender  |
    |      461 | 0.065691 | SELECT gender, COUNT(gender) FROM employees GROUP BY gender  |
    +----------+----------+--------------------------------------------------------------+
    5 rows in set (0.01 sec)
    ```

### 2.

- 対象クエリ

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
  12 rows in set (3.80 sec)
  ```

- クエリー実行計画を確認

  ```sql
  mysql> EXPLAIN SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -4) AS trunc_salary FROM salaries GROUP BY emp_no ) AS salaries GROUP BY trunc_salary;
  +----+-------------+------------+------------+-------+---------------+---------+---------+------+---------+----------+---------------------------------+
  | id | select_type | table      | partitions | type  | possible_keys | key     | key_len | ref  | rows    | filtered | Extra                           |
  +----+-------------+------------+------------+-------+---------------+---------+---------+------+---------+----------+---------------------------------+
  |  1 | PRIMARY     | <derived2> | NULL       | ALL   | NULL          | NULL    | NULL    | NULL | 2184160 |   100.00 | Using temporary; Using filesort |
  |  2 | DERIVED     | salaries   | NULL       | index | PRIMARY       | PRIMARY | 7       | NULL | 2184160 |   100.00 | NULL                            |
  +----+-------------+------------+------------+-------+---------------+---------+---------+------+---------+----------+---------------------------------+
  2 rows in set, 1 warning (0.00 sec)
  ```

  そもそもインデックスに PRIMARY キーを利用してるみたい。

  また、`Using temporary; Using filesort` だ、、、

  select_type=DERIVED は [FROM 句で用いられているサブクエリのこと](http://nippondanji.blogspot.com/2009/03/mysqlexplain.html#Blog1:~:text=DERIVED%E3%83%BB%E3%83%BB%E3%83%BBFROM%E5%8F%A5%E3%81%A7%E7%94%A8%E3%81%84%E3%82%89%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E3%82%B5%E3%83%96%E3%82%AF%E3%82%A8%E3%83%AA%E3%80%82)

- インデックス作成(emp_no, salary)

  ```sql
  mysql> create index idx_emp_no_salary on salaries(emp_no, salary);
  Query OK, 0 rows affected (11.96 sec)
  Records: 0  Duplicates: 0  Warnings: 0
  ```

- クエリー実行計画を再確認

  ```sql
  mysql> EXPLAIN SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -4) AS trunc_salary FROM salaries GROUP BY emp_no ) AS salaries GROUP BY trunc_salary;
  +----+-------------+------------+------------+-------+---------------------------+-------------------+---------+------+---------+----------+---------------------------------+
  | id | select_type | table      | partitions | type  | possible_keys             | key               | key_len | ref  | rows    | filtered | Extra                           |
  +----+-------------+------------+------------+-------+---------------------------+-------------------+---------+------+---------+----------+---------------------------------+
  |  1 | PRIMARY     | <derived2> | NULL       | ALL   | NULL                      | NULL              | NULL    | NULL | 2184160 |   100.00 | Using temporary; Using filesort |
  |  2 | DERIVED     | salaries   | NULL       | index | PRIMARY,idx_emp_no_salary | idx_emp_no_salary | 8       | NULL | 2184160 |   100.00 | Using index                     |
  +----+-------------+------------+------------+-------+---------------------------+-------------------+---------+------+---------+----------+---------------------------------+
  2 rows in set, 1 warning (0.01 sec)
  ```

  サブクエリの key が、`PRIMARY` -> `idx_emp_no_salary` となった。

  サブクエリの Extra が、`NULL` -> `Using index` となった。

- 実行時間の比較

  3.71s -> 1.08s

  - 修正前
    ```sql
    mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , LEFT(SQL_TEXT, 100) FROM performance_schema.events_statements_history_long WHERE event_id IN (468, 496, 524);
    +----------+----------+------------------------------------------------------------------------------------------------------+
    | EVENT_ID | duration | LEFT(SQL_TEXT, 100)                                                                                  |
    +----------+----------+------------------------------------------------------------------------------------------------------+
    |      468 | 3.794133 | SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -4) AS trunc_sa |
    |      496 | 3.882781 | SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -4) AS trunc_sa |
    |      524 | 3.714599 | SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -4) AS trunc_sa |
    +----------+----------+------------------------------------------------------------------------------------------------------+
    3 rows in set (0.00 sec)
    ```
  - 修正後
    ```sql
    mysql> SELECT EVENT_ID, TRUNCATE(timer_wait/1000000000000, 6) AS duration , LEFT(SQL_TEXT, 100) FROM performance_schema.events_statements_history_long WHERE event_id IN (271, 299, 327);
    +----------+----------+------------------------------------------------------------------------------------------------------+
    | EVENT_ID | duration | LEFT(SQL_TEXT, 100)                                                                                  |
    +----------+----------+------------------------------------------------------------------------------------------------------+
    |      271 | 1.089410 | SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -4) AS trunc_sa |
    |      299 | 1.106924 | SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -4) AS trunc_sa |
    |      327 | 1.154123 | SELECT trunc_salary, COUNT(trunc_salary) FROM ( SELECT emp_no, TRUNCATE(AVG(salary), -4) AS trunc_sa |
    +----------+----------+------------------------------------------------------------------------------------------------------+
    5 rows in set (0.01 sec)
    ```

## 課題 4(質問)

### 1.

LIMIT 句の評価順序は、1 番最後なので、フルテーブルスキャンを実行するため。
（※ただし、インデックスを利用しない場合に限る。）

[オトコのソートテクニック 2008](http://nippondanji.blogspot.com/2008/12/2008.html): 中野さんが共有してくれた記事

#### メモ

- 疑問
  - じゃあ、LIMIT 句のチューニングはどーするんだ？
- ## 調査結果

### 2.

前提として、ON 句は結合条件。WHERE 句は絞り込み条件。

|                    | ON 句で絞り込み | WHERE 句で絞り込み |
| ------------------ | --------------- | ------------------ |
| 結果 (内部結合)    | 同じ            | 同じ               |
| 結果 (外部結合)    | 異なる          | 異なる             |
| 速度 (内部結合) ?? | ○               | △                  |
| 可読性 (内部結合)  | △               | ○                  |

パフォーマンスほんとに変わるのかな？？

## 課題 5(クイズ)

### クイズ 1

あなたなら、どちらのクエリを最初に修正しますか？

1. 実行に 200 秒かかるが、管理スクリプトによって月に 1 回しか実行されないクエリ
2. 実行に 2 秒かかるが、ユーザーがアプリケーションを操作した結果として 1 時間に数百回実行されるクエリ

<details><summary>回答</summary><div>

2. 実行に 2 秒かかるが、ユーザーがアプリケーションを操作した結果として 1 時間に数百回実行されるクエリ

**ポイント**

遅いクエリを修正することは大事だが、それよりも大事なことはアプリケーションに最も影響を与えるクエリを修正することである。

</div></details>
