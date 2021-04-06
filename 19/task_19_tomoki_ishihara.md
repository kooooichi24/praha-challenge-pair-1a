# スロークエリを理解する

## 課題1

### 調査

[MySQL :: MySQL 8.0 Reference Manual :: 5.4.5 The Slow Query Log](https://dev.mysql.com/doc/refman/8.0/en/slow-query-log.html) 読んで概要を理解する

スロークエリとは

- `long_query_time` より実行時間が長い または
- `min_examined_limit` より多くの行を見ている

クエリのこと。

slow_query_logで有効無効を設定する
long_query_time: 最小0, デフォルト10 (秒)
min_examined_limit
slow_query_log_file でログファイル名を指定可能

---

- 管理ステートメント
- インデックスを使用しないクエリ

はデフォルトではスロークエリログに記録されない。それぞれ `log_slow_admin_statements` `log_queries_not_using_indexes` で設定する。

---

### 1

`slow_query_log` 変数に `ON` を設定することで、スロークエリログを有効化した。

```sh
mysql> set global slow_query_log = ON;
Query OK, 0 rows affected (0.01 sec)

mysql> show variables like 'slow%';
+---------------------+--------------------------------------+
| Variable_name       | Value                                |
+---------------------+--------------------------------------+
| slow_launch_time    | 2                                    |
| slow_query_log      | ON                                   |
| slow_query_log_file | /var/lib/mysql/e0de365a29e6-slow.log |
+---------------------+--------------------------------------+
3 rows in set (0.00 sec)
```

### 2

`long_query_time` に `0.1` を指定することで、実行に0.1秒以上かかったクエリをスロークエリログに記録するように設定。

[Mysql slow queryの設定と解析方法 - 主夫ときどきプログラマ](https://masayuki14.hatenablog.com/entry/20120704/1341360260) に書いてあるように、 `long_query_time` の値が変わっていないように見えたが再度ログインすることで変更が確認できた。

> long_query_time の値が変更されていない場合がありますが、その時は一度コンソールを閉じ
> 最ログインすると変更されていることが確認できます。

```sh
mysql> set global long_query_time = 0.1;
Query OK, 0 rows affected (0.00 sec)

// 再起動

mysql> show variables like 'long_query%';
+-----------------+----------+
| Variable_name   | Value    |
+-----------------+----------+
| long_query_time | 0.100000 |
+-----------------+----------+
1 row in set (0.00 sec)
```

### 2.5

スロークエリログはデフォルトで `/var/lib/mysql/XXXXX-slow.log ` に出力されるようになっているが、コンテナに入って毎回見に行くのは面倒なので、ボリュームに指定したディレクトリ (`/var/lib/mysql` 以下) に出力するように設定を変更した。

```sh
mysql> set global slow_query_log_file = '/var/lib/mysql/slow-query.log';
Query OK, 0 rows affected (0.01 sec)

mysql> show variables like 'slow%';
+---------------------+-------------------------------+
| Variable_name       | Value                         |
+---------------------+-------------------------------+
| slow_launch_time    | 2                             |
| slow_query_log      | ON                            |
| slow_query_log_file | /var/lib/mysql/slow-query.log |
+---------------------+-------------------------------+
3 rows in set (0.00 sec)
```

このような内容が記録されていた。

```text
mysqld, Version: 5.7.24 (MySQL Community Server (GPL)). started with:
Tcp port: 3306  Unix socket: /var/run/mysqld/mysqld.sock
Time                 Id Command    Argument
```

### 3

実行時間が0.1秒より短いのクエリを3つ実行 -> 記録されない



### 4

実行時間が0.1秒以上のクエリを3つ実行 -> 記録される

#### 1

実行時間: 約0.19秒

```sh
mysql> select * from employees where hire_date = date('1980-06-09');
Empty set (0.19 sec)
```

→ ログに記録された

```text
Time                 Id Command    Argument
# Time: 2021-04-06T08:07:32.260660Z
# User@Host: root[root] @  [172.17.0.1]  Id:     4
# Query_time: 0.182143  Lock_time: 0.000073 Rows_sent: 0  Rows_examined: 300024
use employees;
SET timestamp=1617696452;
select * from employees where hire_date = date('1980-06-09');
```

## 課題2

`mysqldumpslow` コマンドを使って

> 今回はMySQLの組み込みの機能だけを活用して

組み込み以外の方法にはどのようなものがあるのだろう？

### 1

最も頻度が高くスロークエリに現れるクエリを特定

### 2

実行時間が最も長いクエリ

### 3

ロック時間が最も長いクエリ

ロック時間とは?

### 4 (番外編)

異なるクエリとみせかけて、実質ほとんど同じクエリ

## 課題3

### 1

頻度が最も高いスロークエリにインデックスを作成

### 2

実行時間が最も長いスロークエリにインデックスを作成

可能であればとは?インデックスだけでは速くならない可能性がある？

## 課題4

### 1

`LIMIT 1` なのにクエリが遅いのはなぜか

### 2

where で絞るのと on の違い

## 課題5 (クイズ)

スロークエリに関するクイズ3つ

- long_query_timeのデフォルト値は何秒ですか？
- slowquery log 中の
  - Query_time
  - lock-time
  - rows-sent
  - Rows_examined
  - 

### クイズ1

### クイズ2

### クイズ3
