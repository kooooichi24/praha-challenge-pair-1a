# DDD を学ぶ（基礎）

## 課題内容

[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recEPQL4Vw1BVnxcH?blocks=hide)

---

## 課題 1

- 知識を表現するパターン
  - エンティティ
  - 値オブジェクト
  - ドメインサービス
- アプリケーションを実現するためのパターン
  - リポジトリ
  - アプリケーションサービス
  - ファクトリ 

### エンティティ

- エンティティ
  - ドメインオブジェクトの一種
- 性質
  - 可変である
  - 同じ属性であっても区別される
  - 同一性により区別される
- 例

  ```js
  class Student {
    private id: string; // 同一性
    private name: string;

    constructor() {
      // 省略
    }

    changeName(name: string): void {
      this.name = name; // 可変である
    }
  }

  class Main {
    execute(): void {
      const student = new Student("Furukawa");
      student.changeName("Furukawa Koichi");
      console.log(student.getId() === new Student("Nakano Tsubasa").getId()); // 同一性により比較
    }
  }
  ```

### 値オブジェクト（バリューオブジェクト）

- 値オブジェクト
  - ドメインオブジェクトの一種
- 性質
  - 不変である
  - 交換可能である
  - 等価性により比較される
- 例

  ```js
  class Money {
    private amount: number;

    constructor(amount: number) {
      this.amount = amount;
    }
  }

  class Main {
    execute(): void {
      const amount = new Money(100);
      // amount.incrementAmount(500); 可変ではなく、不変
      amount = new Money(500); // 交換可能
      console.log(amount === new Money(500)); // 等価性により比較
    }
  }
  ```

- メリット
  - 表現力が増す
  - 不正な値を散財させない
  - 誤った代入を防ぐ
  - ロジックの散財を防ぐ

### 集約

- 集約とは
  - 必ず守りたい強い整合性を持ったオブジェクトのまとまり
- 性質
  - オブジェクトは必ず集約に属する
  - 集約単位でトランザクション処理を実施する
  - 外部からの集約に関する操作は、すべて集約ルートを経由する

### ユビキタス言語

- ユビキタス言語とは
  - モデルの言葉を Biz/Dev 内やドキュメント/コード 内など、全ての場所で統一して利用するためのもの

### 境界づけられたコンテキスト

- 境界づけられたコンテキストとは
  - モデルが適用される範囲のこと
- 例（商品）
  - 販売コンテキスト
  - 配送コンテキスト

### ドメイン

- ドメインとは（一般的）
  - 領域のこと
- ドメインとは（ソフトウェア開発）
  - プログラムを適用する対象となる領域
- 大事なこと
  - ドメインが何か？ではなく、ドメインに含まれるものが何か？

### ドメインサービス

- ドメインサービスとは
  - ドメインルールを、エンティティや値オブジェクトに記載すると不自然になるものを、ドメインサービスに書く
    - 集合に対する操作など

### リポジトリ

- リポジトリとは
  - 集約単位で永続化層へのアクセスを提供するもの
- 責務
  - ドメインオブジェクトの永続化や再構築
- ポイント
  - リポジトリは List のように扱う
  - List に追加/削除するなどの操作のみ

### アプリケーション（ユースケース層と呼ばれることも）

- アプリケーションとは
  - ドメインオブジェクトを用いてユースケースを実現する
- 責務
  - ユースケースの実現
- ポイント
  - How ではなく What を記述する

### CQRS

- CQRS とは
  - Usecase <-> Repository における参照に使用するモデルと更新に使用するモデルを分離すること
- ポイント
  - 更新系はドメインオブジェクトをそのまま使用
  - 参照系はユースケースに特化した型を定義

### DTO(Data Transfer Object)

- DTO とは
  - ユースケース層からプレゼンテーション層に返す値の型 として利用する
- ポイント
  - DTO を使えば、プレゼンテーション層でドメインオブジェクトの状態が変えられてしまうことを防げる

## 課題 2

### クイズ 1

Usecase <- Repository への返り値の型は、どのようにすべきでしょうか？

<details><summary>回答</summary><div>

CQRS を利用するならば、

- 更新系の場合、「DB から取得したデータ」を「ドメインオブジェクト」にマッピングして返す
- 参照系の場合、「DB から取得したデータ」を「特定のユースケースに特化した型(DTO)」にマッピングして返す
- 参考記事
  - [issues/231 | ddd-q-and-a](https://github.com/little-hands/ddd-q-and-a/issues/231)

</div></details>

### クイズ 2

Presentation <- Usecase への返り値の型は、どのようにすべきでしょうか？

<details><summary>回答</summary><div>

- ドメインオブジェクトを、DTO にマッピングして返す
- 参考記事
  - [issues/231 | ddd-q-and-a](https://github.com/little-hands/ddd-q-and-a/issues/231)

</div></details>
