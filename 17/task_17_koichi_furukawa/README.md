# インデックスを理解する

## 課題内容

[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recaoPX7kBTbdWJfo?blocks=hide)

---

## 課題 1(質問)

### 1.

インデックスは、本の索引のようなものであり、**ある値がどこにあるかを結びつけるもの**である。
ある値がどこにあるかが分かることで何が嬉しいかというと、データ構造を自由に変更することが可能な点が挙げられる。
なぜなら、データ構造を変更することでアルゴリズム手法を変更することできる。例えばリストから二分探索木にデータ構造を変更することで、アルゴリズムを線形探索法から二分探索法に変更できる。
これにより、計算量を O(N)から O(log n)に削減できる。
まとめると、インデックスとは、ある値がどこにあるかを結びつける仕組みであり、その仕組みによってデータ構造を変更することができる。

- 参考文献
  - [【SQL】ゼロ知識から実行計画を読み解きパフォーマンス改善](https://qiita.com/yoshinori_hisakawa/items/5ef0cf4fd8eb6dd3037f)
  - [実行計画？？統計情報？？って人へ](https://qiita.com/NagaokaKenichi/items/5b6eb9887f88046a594d)

### 2.

#### スロークエリログとは

実行時間が遅いクエリのログのこと。（そのまんま）

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

## 課題 3(実装)

## 課題 4(クイズ)

### クイズ 1

<details><summary>回答</summary><div>

</div></details>

### クイズ 2

<details><summary>回答</summary><div>

</div></details>

### クイズ 3

<details><summary>回答</summary><div>

</div></details>

### クイズ 4

<details><summary>回答</summary><div>

</div></details>

## 疑問

## メモ
