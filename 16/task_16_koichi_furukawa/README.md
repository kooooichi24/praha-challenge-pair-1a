# SQL10 本ノック

## 課題内容

[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recUtU0RUu8Daymau?blocks=hide)

---

## 課題 1(実装)

![DB Diagram](./DB_Diagram/DB_Diagram.png)
[DB Diagram](./DB_Diagram/DB_Diagram.md)

### 1. 「常連顧客を特定して欲しい」

#### 1996 年に 3 回以上注文した（Orders が 3 つ以上紐づいている）Customer の ID と、注文回数を取得してみてください

[実行結果](./output_images/order_count_3.png)

[実行クエリ](./src/order_count_3.sql)

#### 最もよく注文してくれたのは、どの Customer でしょうか？

[実行結果](./output_images/most_orders_customer_in_1996.png)

[実行クエリ](./src/most_orders_customer_in_1996.sql)

- 疑問
  - サブクエリ使いすぎマンになってしまった。
  - しょうがない？
- 参考文献
  - [今更だけど SQL で count した中から max 値を取得する | Qiita](https://qiita.com/Kuzira_Kuzira/items/3106748174ef7fb6d907)

### 2. 過去最も多くの OrderDetail が紐づいた Order を取得してください。何個 OrderDetail が紐づいていたでしょうか？

[実行結果](./output_images/most_orders.png)

[実行クエリ](./src/most_orders.sql)

- 疑問
  - 過去最も多くの OrderDetail が紐づいた Order は 10 record 存在したが、今回は設問上 OrderID の降順で 1 件のみ取得した
    - わざわざ 1 件に絞る必要ある？
      - 要望上、複数件出力する必要がないからかな？
    - なぜ OrderID の降順なのだろうか（特に深い意味はないと思ってる）

### 3. Order 数が多い順番に Shipper の id を並べてください。Order 数も表示してください

[実行結果](./output_images/most_orders_shipper.png)

[実行クエリ](./src/most_orders_shipper.sql)

### 4. 売上が高い順番に Country を並べてください。売上も表示してください

[実行結果](./output_images/sales_country.png)

[実行クエリ](./src/sales_country.sql)

### 5. 国ごとの売上を年ごとに集計する

[実行結果](./output_images/sales_country_year.png)

[実行クエリ](./src/sales_country_year.sql)

### 6. Employee テーブルに「Junior（若手）」カラム（boolean）を追加

[実行結果](./output_images/junior.png)

[実行クエリ](./src/junior.sql)

## 課題 2(質問)

## 疑問

- `between` の挙動が想定と異なる気がする？

  - 1996 年のデータを取得するとき

    想定してたクエリ

    ```sql
    where orderdate between '1996-01-01' and '1997-01-01'
    ```

    実際のクエリ

    ```sql
    where orderdate between '1996-01-01' and '1996-12-31'
    ```

    確か SQL って国際標準で文法があった気がする。WebSQL は準じていないのかな？そもそも WebSQL のサポートしている構文はどこで確認できるんだろう

  - 解決
    - Web SQL は、Sqlite 3.6.19 でサポートされている SQL 構文と同様。
      - [5 Web SQL](https://www.w3.org/TR/2010/NOTE-webdatabase-20101118/#web-sql)
        > User agents must implement the SQL dialect supported by Sqlite 3.6.19.
    - Sqlite は `between 'date1' and 'date2'` のとき、date2 を含む
      - [SQLite BETWEEN dates example](https://www.sqlitetutorial.net/sqlite-between/)

## メモ

- SQL Formatter 導入
  - [SQL Formatter](https://marketplace.visualstudio.com/items?itemName=adpyke.vscode-sql-formatter)
