# トランザクションについて理解する

## 課題内容

[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/rec9KOUld1eqrA9nt?blocks=hide)

---

## 課題 1

### 1

デットロックとは、互いに相手の処理が終了するのを待っている状態のこと。

#### 参考記事

- [第 12 回　デッドロックについて](https://oss-db.jp/dojo/dojo_12)
  - デッドロックが発生した場合は、ROLLBACK するしかない。
  - しかし、PostgreSQL にはデッドロックを自動検出し、解決する仕組みがある。
    - [18.12. ロック管理 | PostgreSQL](https://www.postgresql.jp/document/9.1/html/runtime-config-locks.html)
- [デッドロックとは](https://wa3.i-3-i.info/word11317.html)

### 2

そもそも前提知識が不足していたため、自分が理解した順序で記載したいと思います。

#### トランザクションとは

分けることのできない論理的な一連の処理

- [トランザクション | Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%88%E3%83%A9%E3%83%B3%E3%82%B6%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3)

#### ACID 特性とは

信頼性のあるトランザクションシステムが持つべき性質のこと。

1. 不可分性(Atomicity)
2. 一貫性(Consistency)
3. 独立性(Isolation)
4. 永続性(Durability)

- [ACID (コンピュータ科学) | Wikipedia](<https://ja.wikipedia.org/wiki/ACID_(%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF%E7%A7%91%E5%AD%A6)>)
  - 銀行での口座間送金を例に説明していて、わかりやすい。

#### 3 種類の読み込み不都合 とは

ACID 特性の I に反したもの。

1. Dirty read
2. Non-repeatable read
3. Phantom read

#### 3 種類の読み込み不都合 のそれぞれの説明

Isolation を期待しているのに、Isolation ではない。

|                     | 概要（別のトランザクションで、〇〇）                      | ポイント      |
| ------------------- | --------------------------------------------------------- | ------------- |
| Dirty read          | コミットされていないデータを読み取れる現象                | 未コミット    |
| Non-repeatable read | コミットされていて、更新されたデータを読み取れる現象      | Update        |
| Phantom read        | コミットされていて、挿入/削除されたデータが読み取れる現象 | Insert/Delete |

- [[RDBMS][SQL]トランザクション分離レベルについて極力分かりやすく解説](https://qiita.com/PruneMazui/items/4135fcf7621869726b4b)

#### ISOLATION LEVEL とは

トランザクションシステムでは、性能と Isolatation はトレードオフの関係にある。
このトレードオフの具合を表したものが ISOLATION LEVEL である。

#### 性能と Isolatation はトレードオフの関係 って具体的には？

トランザクションシステムは不具合を起こさないことが最も大事。
不具合を起こさないようにするには、シリアル処理が最も簡単で安全。
しかしながら、複数トランザクションを処理する場合、シリアル処理だと待ち時間が発生してしまう。

このような待ち状態を最小化するためには、パラレル処理が望ましい。
しかし、パラレル処理は一歩間違えると、独立性が損なわれてしまう。

このような関係が、性能と Isolation のトレードオフの関係。

#### なぜ ISOLATION LEVEL を考える必要があるのか？

アプリケーションごとに必要な要件は異なるため、最初に定義しておくため？

#### 4 種類の ISOLATION LEVEL

1. SERIALIZABLE
2. REPEATABLE READ
3. READ COMMITTED
4. READ UNCOMMITTED

#### ISOLATION LEVEL と 読み込み不都合 の関係

| ISOLATION LEVEL  | Phantom read | Non-repeatable read | Dirty read |
| ---------------- | ------------ | ------------------- | ---------- |
| SERIALIZABLE     |              |                     |            |
| REPEATABLE READ  | ○            |                     |            |
| READ COMMITTED   | ○            | ○                   |            |
| READ UNCOMMITTED | ○            | ○                   | ○          |

### 3

ロックする対象が異なる

### 4

#### 排他制御とは

ダブルブッキングしないための仕組み

- [排他制御 | 「分かりそう」で「分からない」でも「分かった」気になれる IT 用語辞典](https://wa3.i-3-i.info/word11316.html)
- [排他制御 | Wikipedia](https://ja.wikipedia.org/wiki/%E6%8E%92%E4%BB%96%E5%88%B6%E5%BE%A1)
- [排他制御（楽観ロック・悲観ロック）の基礎](https://qiita.com/NagaokaKenichi/items/73040df85b7bd4e9ecfc)

#### 楽観ロックとは

楽観的ロックとは、レコードを読み込んでバージョン番号を記録し、レコードを書き戻す前にバージョンが変更されていないことを確認する戦略。
レコードを書き戻すときには、バージョンの更新をフィルタリングして、それがアトミックであることを確認する。つまり、バージョンをチェックしてからレコードをディスクに書き込むまでの間に更新されていないことを確認し、1 回のヒットでバージョンを更新する。

- [Optimistic Locking](https://stackoverflow.com/questions/129329/optimistic-vs-pessimistic-locking#answer-129397:~:text=Optimistic%20Locking%20is%20a%20strategy%20where,before%20you%20write%20the%20record%20back.)

#### 悲観ロックとは

悲観的ロックとは、自分が使い終わるまでレコードを自分専用にロックすること。
楽観的ロックよりも整合性が高くなるが、デッドロックを避けるためにアプリケーションの設計に注意する必要がある。

- [Pessimistic Locking](https://stackoverflow.com/questions/129329/optimistic-vs-pessimistic-locking#answer-129397:~:text=next.-,Pessimistic%20Locking%20is%20when%20you%20lock%20the%20record%20for%20your%20exclusive%20use,until%20you%20have%20finished%20with%20it.)

#### 違い

| -                    | 楽観ロック                                       | 悲観ロック                                 |
| -------------------- | ------------------------------------------------ | ------------------------------------------ |
| 思想                 | めったなことでは他者との同時更新は起きないと仮定 | 他者が同じデータに頻繁に変更を加えると仮定 |
| 手法                 | データ取得時と更新時の DB のバージョンを確認     | データ取得時にロック                       |
| エラー発生タイミング | 更新時                                           | 読み取り時                                 |

## 課題 2

検証用にターミナルを 2 つ立ち上げる。
片方をトランザクション実行用、もう片方を読み取り用とする。
以降、トランザクション実行用を session1, 読み取り用を session2 と呼ぶ。

### Dirty Read

#### session2 の ISOLATION LEVEL の確認

```sql
mysql> SELECT @@GLOBAL.tx_isolation, @@tx_isolation;
+-----------------------+-----------------+
| @@GLOBAL.tx_isolation | @@tx_isolation  |
+-----------------------+-----------------+
| REPEATABLE-READ       | REPEATABLE-READ |
+-----------------------+-----------------+
1 row in set, 2 warnings (0.00 sec)
```

#### session2 の ISOLATION LEVEL を READ UNCOMMITTED と設定する

```sql
mysql> SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
Query OK, 0 rows affected (0.00 sec)
```

#### session1 で更新処理のうち COMMIT 未実施状態にする

```sql
mysql> START TRANSACTION;
     > UPDATE employees SET last_name = 'Facello2' WHERE emp_no = 10001;
     > -- COMMIT;
```

#### session2 で Dirty Read が発生することを確認する。

(期待値: last_name = 'Facello2')

```sql
mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello2  | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.01 sec)
```

commit していないのに、変更されていることが他のセッションから確認できた。つまり Dirty Read が発生している。

### Non-repeatable read

#### session2 の ISOLATION LEVEL を READ COMMITTED と設定する

```sql
mysql> SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
Query OK, 0 rows affected (0.00 sec)
```

#### session1 で更新処理のうち COMMIT 未実施状態にする

```sql
mysql> START TRANSACTION;
     > UPDATE employees SET last_name = 'Facello3' WHERE emp_no = 10001;
     > -- COMMIT;
```

#### session2 で Dirty Read が発生しないことを確認する。

(期待値: last_name = 'Facello2')

```sql
mysql> START TRANSACTION;
     > select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello2  | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.01 sec)
```

#### session1 で COMMIT する

```sql
mysql> COMMIT;
```

#### session2 で Non-repeatable read が発生することを確認する。

(期待値: last_name = 'Facello3')

```sql
mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello3  | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.00 sec)
```

トランザクションが COMMIT していないのに、last_name が 'Facello3' に更新されていたため、Non-repeatable read が発生していることが分かる

### Phantom read

#### session2 の ISOLATION LEVEL を REPEATABLE READ と設定する

```sql
mysql> SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
Query OK, 0 rows affected (0.00 sec)
```

#### session2 でトランザクションを開始する

```sql
mysql> START TRANSACTION;
     > select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello3  | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.00 sec)
```

#### session1 で更新処理を実施する

```sql
mysql> UPDATE employees SET last_name = 'Facello4' WHERE emp_no = 10001;
```

#### session2 で Non-repeatable read が発生しないことを確認する。

```sql
mysql> select * from employees where emp_no = 10001;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello3  | M      | 1986-06-26 |
+--------+------------+------------+-----------+--------+------------+
1 row in set (0.00 sec)
```

#### Phantom read が発生することを確認

session2 でトランザクションを開始する

```sql
mysql> START TRANSACTION;
     > select count(*) from employees;
+----------+
| count(*) |
+----------+
|   300024 |
+----------+
1 row in set (0.85 sec)
```

session1 で insert する

```sql
mysql> insert employees values(999999, '9999-12-31', 'testFirstName', 'testLastName', 'M', '9999-12-31');
```

session2 で　ファントムリード発生していることを確認する

(期待値: 件数は 1 つ増えている)

```sql
mysql> select count(*) from employees;
+----------+
| count(*) |
+----------+
|   300024 |
+----------+
1 row in set (0.85 sec)
```

あれ！？！？！？！！！？

MySQL では、REPEATABLE READ でファントムリードが発生しないみたい

- [トランザクション分離レベルについてのまとめ](https://qiita.com/song_ss/items/38e514b05e9dabae3bdb)
  - > ※ MySQL(InnoDB)では、MVCC(MultiVersion Concurrency Control)という技術でファントムリードを防いでいます。
- [MySQL 用語集](https://dev.mysql.com/doc/refman/5.6/ja/glossary.html#docs-body:~:text=%E3%81%97%E3%81%9F%E3%81%8C%E3%81%A3%E3%81%A6%E3%80%81%E5%8F%8D%E5%BE%A9%E4%B8%8D%E5%8F%AF%E8%83%BD%E8%AA%AD%E3%81%BF%E5%8F%96%E3%82%8A%E3%81%AF%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E3%81%97%E3%81%BE%E3%81%99%E3%81%8C%E3%80%81%E3%83%95%E3%82%A1%E3%83%B3%E3%83%88%E3%83%A0%E8%AA%AD%E3%81%BF%E5%8F%96%E3%82%8A%E3%81%AF%E3%81%97%E3%81%BE%E3%81%9B%E3%82%93%E3%80%82)
  - > InnoDB のデフォルト分離レベル。照会される行がほかのトランザクションによって変更されるのを防ぎます。したがって、反復不可能読み取りはブロックしますが、ファントム読み取りはしません。

#### ISOLATION LEVEL を READ COMMITTED でファントムリードが発生することを確認

ISOLATION LEVEL を READ COMMITTED に設定

```sql
mysql> SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
Query OK, 0 rows affected (0.00 sec)
```

session2 でトランザクションを開始する

```sql
mysql> START TRANSACTION;
     > select count(*) from employees;
+----------+
| count(*) |
+----------+
|   300024 |
+----------+
1 row in set (0.05 sec)
```

session1 で insert する

```sql
mysql> insert employees values(999999, '9999-12-31', 'testFirstName', 'testLastName', 'M', '9999-12-31');
```

session2 でファントムリードが発生していることを確認

```sql
mysql> select count(*) from employees;
+----------+
| count(*) |
+----------+
|   300025 |
+----------+
1 row in set (0.07 sec)
```

session1 で delete する

```sql
mysql> delete from employees where emp_no = 999999;
Query OK, 1 row affected (0.00 sec)
```

delete でも session2 でファントムリードが発生していることを確認

```sql
mysql> select count(*) from employees;
+----------+
| count(*) |
+----------+
|   300024 |
+----------+
1 row in set (0.05 sec)
```

### メモ

- SET TRANSACTION 構文の GLOBAL, SESSION ってなんだ？

  トランザクションの特性の**スコープ**を、変更するパラメータ。

  ```sql
  SET [GLOBAL | SESSION] TRANSACTION
    transaction_characteristic [, transaction_characteristic] ...
  ```

  - GROBAL
    - すべてのセッションに対して適用される
    - 今回の場合は、ほかのターミナルで開いたセッションにも影響する
  - SESSION
    - 現在のセッションに対して適用される
    - 今回の場合は、ほかのターミナルで開いたセッションには影響しない
  - なにも設定しない
    - 現在のセッションで次に実行される次のトランザクションに対して適用される
    - `SELECT @@GLOBAL.tx_isolation, @@tx_isolation;` で確認しても変数の値は変わらない

  [トランザクションの隔離レベルの設定と tx_isolation のメモ](https://qiita.com/amapyon/items/d37a788a29d0b3f7c53f)

  [13.3.6 SET TRANSACTION 構文](https://dev.mysql.com/doc/refman/5.6/ja/set-transaction.html#docs-body:~:text=%E3%83%88%E3%83%A9%E3%83%B3%E3%82%B6%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E7%89%B9%E6%80%A7%E3%81%AE%E3%82%B9%E3%82%B3%E3%83%BC%E3%83%97)

- SET TRANSACTION 構文の READ ONLY, READ WRITE ってなんだ？

  トランザクションの**アクセスモード**を変更するパラメータ。

  ```sql
  transaction_characteristic:
  ISOLATION LEVEL level
  | READ WRITE -- これと
  | READ ONLY  -- これ
  ```

  - READ WRITE
    - 読み込みも書き込みも許可する
  - READ ONLY
    - 読み込みだけ許可する

### 参考記事

- [13.3.1 START TRANSACTION、COMMIT、および ROLLBACK 構文](https://dev.mysql.com/doc/refman/5.6/ja/commit.html)
- [13.3.6 SET TRANSACTION 構文](https://dev.mysql.com/doc/refman/5.6/ja/set-transaction.html)

## 課題 3(クイズ)

### クイズ 1

MySQL の SET TRANSACTION に関するクイズです。

GLOBAL と SESSION を設定しないと、どのような挙動になるでしょうか？

```sql
SET [GLOBAL | SESSION] TRANSACTION
    transaction_characteristic [, transaction_characteristic] ...
```

[13.3.6 SET TRANSACTION 構文](https://dev.mysql.com/doc/refman/5.6/ja/set-transaction.html)

<details><summary>回答</summary><div>

現在のセッションで次に実行される次のトランザクションに対して適用される

`SELECT @@GLOBAL.tx_isolation, @@tx_isolation;` で確認しても変数の値は変わらない

</div></details>

### クイズ 2

MySQL の START TRANSACTION, SET TRANSACTION に共通するクイズです。

READ WRITE, READ ONLY とは、それぞれ何でしょうか？

<details><summary>回答</summary><div>

- READ WRITE
  - 読み込みも書き込みも許可する
- READ ONLY
  - 読み込みだけ許可する

</div></details>

### クイズ 3

ファントムリードはコミット済みの、どの処理が読み取れる現象でしょうか？

1. update
2. insert
3. delete

<details><summary>回答</summary><div>

insert と delete

</div></details>

### 疑問

- 読み取り専用を敢えて指定するときは、どんな場合だろうか? 何が嬉しいのか?
  - 後で読む: [Transactions for read-only DB access?](https://stackoverflow.com/questions/818074/transactions-for-read-only-db-access)
- 読み取りの場合に、auto commit を OFF にすることはあるのだろうか? どのような理由があるのか?
