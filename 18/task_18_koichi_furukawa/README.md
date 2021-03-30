# 複合インデックスを理解する

## 課題内容

[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recu06ptqQLUVPxVR?blocks=hide)

---

## 課題 1(質問)

### 1.

複合インデックスとは、複数のカラムから成るインデックスのことである。

例えば、`colA`, `colB` が存在し、両方のカラムを用いて検索したい場合は、両方のカラムから成るインデックスを作成することができる。

また、作成した複合インデックスが `idx_colA_colB_colC` の場合、検索条件が `colAのみ`、`colAとcolB`、`colA_colB_colC` のときに作成した複合インデックスが利用されます。

[8.3.5 マルチカラムインデックス](https://dev.mysql.com/doc/refman/5.6/ja/multiple-column-indexes.html)

### 2.

インデックスの順番が逆だった。

```sql
CREATE INDEX employees_name ON employees (last_name, first_name)
```

## 課題 2(実装)

### クエリ 1

```sql
mysql> SELECT count(*) FROM salaries WHERE from_date = DATE('1986-06-26') AND to_date = DATE('1987-06-26');
+----------+
| count(*) |
+----------+
|       86 |
+----------+
```

#### インデックスあり （from_date, to_date）

クエリーの実行計画の取得

```sql
mysql> EXPLAIN SELECT count(*) FROM salaries WHERE from_date = DATE('1986-06-26') AND to_date = DATE('1987-06-26');
+----+-------------+----------+------------+------+---------------+-------------+---------+-------------+------+----------+-------------+
| id | select_type | table    | partitions | type | possible_keys | key         | key_len | ref         | rows | filtered | Extra       |
+----+-------------+----------+------------+------+---------------+-------------+---------+-------------+------+----------+-------------+
|  1 | SIMPLE      | salaries | NULL       | ref  | idx_from_to   | idx_from_to | 6       | const,const |   86 |   100.00 | Using index |
+----+-------------+----------+------------+------+---------------+-------------+---------+-------------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```

#### まとめ

|             | 実行速度  | レコードアクセスタイプ | possible_keys | key         | rows    |
| ----------- | --------- | ---------------------- | ------------- | ----------- | ------- |
| no index    | 3.978288s | ALL                    | NULL          | NULL        | 2184160 |
| idx_from_to | 0.000652s | ref                    | idx_from_to   | idx_from_to | 86      |

### クエリ 2

```sql
mysql> SELECT count(*) FROM employees WHERE last_name LIKE 'A%' AND first_name LIKE 'A%';
+----------+
| count(*) |
+----------+
|      766 |
+----------+
```

#### インデックスあり （last_name, first_name）

クエリーの実行計画の取得

```sql
mysql> EXPLAIN SELECT count(*) FROM employees WHERE last_name LIKE 'A%' AND first_name LIKE 'A%';
+----+-------------+-----------+------------+-------+--------------------+--------------------+---------+------+-------+----------+--------------------------+
| id | select_type | table     | partitions | type  | possible_keys      | key                | key_len | ref  | rows  | filtered | Extra                    |
+----+-------------+-----------+------------+-------+--------------------+--------------------+---------+------+-------+----------+--------------------------+
|  1 | SIMPLE      | employees | NULL       | range | idx_employees_name | idx_employees_name | 34      | NULL | 20034 |    11.11 | Using where; Using index |
+----+-------------+-----------+------------+-------+--------------------+--------------------+---------+------+-------+----------+--------------------------+
1 row in set, 1 warning (0.00 sec)
```

#### まとめ

|             | 実行速度  | レコードアクセスタイプ | possible_keys      | key                | rows   |
| ----------- | --------- | ---------------------- | ------------------ | ------------------ | ------ |
| no index    | 0.097194s | ALL                    | NULL               | NULL               | 299157 |
| idx_from_to | 0.006959s | range                  | idx_employees_name | idx_employees_name | 20034  |

### クエリ 3

```sql
mysql> SELECT COUNT(*) FROM titles WHERE to_date = DATE('9999-01-01') AND title = 'Technique Leader';
+----------+
| COUNT(*) |
+----------+
|    12055 |
+----------+
```

#### インデックスあり (to_date, title)

クエリーの実行計画の取得

```sql
mysql> EXPLAIN SELECT COUNT(*) FROM titles WHERE to_date = DATE('9999-01-01') AND title = 'Technique Leader';
+----+-------------+--------+------------+------+-------------------+-------------------+---------+-------------+-------+----------+-------------+
| id | select_type | table  | partitions | type | possible_keys     | key               | key_len | ref         | rows  | filtered | Extra       |
+----+-------------+--------+------------+------+-------------------+-------------------+---------+-------------+-------+----------+-------------+
|  1 | SIMPLE      | titles | NULL       | ref  | idx_to_date_title | idx_to_date_title | 56      | const,const | 22938 |   100.00 | Using index |
+----+-------------+--------+------------+------+-------------------+-------------------+---------+-------------+-------+----------+-------------+
1 row in set, 1 warning (0.00 sec)
```

#### まとめ

|             | 実行速度  | レコードアクセスタイプ | possible_keys     | key               | rows   |
| ----------- | --------- | ---------------------- | ----------------- | ----------------- | ------ |
| no index    | 0.140697s | ALL                    | NULL              | NULL              | 443080 |
| idx_from_to | 0.005762s | ref                    | idx_to_date_title | idx_to_date_title | 22938  |

## 課題 3(クイズ)

### クイズ 1

Georgi Facello さんの情報を取得してください

<details><summary>回答</summary><div>

```sql
mysql> SELECT * FROM employees WHERE first_name = 'Georgi' AND last_name = 'Facello';
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
|  55649 | 1956-01-23 | Georgi     | Facello   | M      | 1988-05-04 |
+--------+------------+------------+-----------+--------+------------+
```

#### インデックスあり (last_name, first_name)

クエリーの実行計画の取得

```sql
mysql> EXPLAIN SELECT * FROM employees WHERE first_name = 'Georgi' AND last_name = 'Facello';
+----+-------------+-----------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys          | key                    | key_len | ref         | rows | filtered | Extra |
+----+-------------+-----------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | idx_lastname_firstname | idx_lastname_firstname | 34      | const,const |    2 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

#### まとめ

|                        | 実行速度  | レコードアクセスタイプ | possible_keys          | key                    | rows   |
| ---------------------- | --------- | ---------------------- | ---------------------- | ---------------------- | ------ |
| no index               | 0.105547s | ALL                    | NULL                   | NULL                   | 299157 |
| idx_lastname           | 0.001581s | ref                    | idx_lastname           | idx_lastname           | 186    |
| idx_firstname          | 0.002202s | ref                    | idx_firstname          | idx_firstname          | 253    |
| idx_lastname_firstname | 0.000803s | ref                    | idx_lastname_firstname | idx_lastname_firstname | 2      |

</div></details>

### クイズ 2

1956-01-23 生まれの Georgi Facello さんの情報を取得してください

<details><summary>回答</summary><div>

```sql
mysql> SELECT * FROM employees WHERE birth_date = DATE('1956-01-23') AND first_name = 'Georgi' AND last_name = 'Facello';
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  55649 | 1956-01-23 | Georgi     | Facello   | M      | 1988-05-04 |
+--------+------------+------------+-----------+--------+------------+
```

#### インデックスあり (birth_date, first_name, last_name)

クエリーの実行計画の取得

```sql
mysql> EXPLAIN SELECT * FROM employees WHERE birth_date = DATE('1956-01-23') AND first_name = 'Georgi' AND last_name = 'Facello';
+----+-------------+-----------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys          | key                    | key_len | ref         | rows | filtered | Extra |
+----+-------------+-----------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | idx_lastname_firstname | idx_lastname_firstname | 34      | const,const |    2 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

#### まとめ

|                                  | 実行速度  | レコードアクセスタイプ | possible_keys                    | key                              | rows   |
| -------------------------------- | --------- | ---------------------- | -------------------------------- | -------------------------------- | ------ |
| no index                         | 0.110734s | ALL                    | NULL                             | NULL                             | 299157 |
| idx_birthdate_firstname_lastname | 0.000783s | ref                    | idx_birthdate_firstname_lastname | idx_birthdate_firstname_lastname | 1      |

</div></details>

### クイズ 3

同姓同名の人は何人いるでしょうか？

<details><summary>回答</summary><div>

```sql
mysql> SELECT count(*) FROM employees WHERE (first_name, last_name) IN (SELECT first_name, last_name FROM employees GROUP BY first_name, last_name HAVING count(*) > 1);
+----------+
| count(*) |
+----------+
|    40299 |
+----------+
```

#### インデックスあり (first_name, last_name)

クエリーの実行計画の取得

```sql
mysql> EXPLAIN SELECT count(*) FROM employees WHERE (first_name, last_name) IN (SELECT first_name, last_name FROM employees GROUP BY first_name, last_name HAVING count(*) > 1);
+----+-------------+-----------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------+
| id | select_type | table     | partitions | type | possible_keys          | key                    | key_len | ref         | rows | filtered | Extra |
+----+-------------+-----------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------+
|  1 | SIMPLE      | employees | NULL       | ref  | idx_lastname_firstname | idx_lastname_firstname | 34      | const,const |    2 |   100.00 | NULL  |
+----+-------------+-----------+------------+------+------------------------+------------------------+---------+-------------+------+----------+-------+
1 row in set, 1 warning (0.00 sec)
```

#### まとめ

|                                  |          | 実行速度  | レコードアクセスタイプ | possible_keys                    | key                              | rows   |
| -------------------------------- | -------- | --------- | ---------------------- | -------------------------------- | -------------------------------- | ------ |
| no index                         | PRIMARY  | 2.153668s | ALL                    | NULL                             | NULL                             | 299157 |
| no index                         | SUBQUERY | 2.153668s | ALL                    | NULL                             | NULL                             | 299157 |
| idx_birthdate_firstname_lastname | PRIMARY  | 0.513596s | index                  | NULL                             | idx_birthdate_firstname_lastname | 299157 |
| idx_birthdate_firstname_lastname | SUBQUERY | 0.513596s | index                  | idx_birthdate_firstname_lastname | idx_birthdate_firstname_lastname | 299157 |

</div></details>

## メモ

### index 関連

インデックスは 1 つの方が良い！！

> 2 つインデックスを作ると、select の パフォーマンスはよくなりますが、インデックスは 1 つの方がよいでしょう。 ストレージ領域の節約だけにとどまらず、2 番目のインデックスのメンテナンスの オーバーヘッドも減らすことができるからです。テーブルに対するインデックスの数が少ないほど、insert や delete、update のパフォーマンスは向上します。
> [複合インデックスの正しい列の順序 - Use The Index, Luke](https://use-the-index-luke.com/ja/sql/where-clause/the-equals-operator/concatenated-keys)
