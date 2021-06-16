# 設計原則（SOLID）

## 課題内容

[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recWERjAlpNxrnrns?blocks=hide)

---

## Single Responsibility Principle (単一責任の原則)

> 1 つのクラスは 1 つだけの責任を持たなければならない。すなわち、ソフトウェアの仕様の一部分を変更したときには、それにより影響を受ける仕様は、そのクラスの仕様でなければならない。

[SOLID | Wikipedia](https://ja.wikipedia.org/wiki/SOLID)

### SRP ではない例

```ts
class Product {
  private readonly name: string;
  private readonly price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }

  // 割引メソッド
  public discountedPrice(): number {
    // 10% 割引
    return this.getPrice() * (1 - 0.1);
  }
}

class Main {
  private product = new Product();

  public execute(): void {
    product.discountedPrice();
  }
}
```

### どこが悪いのか

Product クラスが、2 つの責任を持っている。

Product プロパティの管理と 割引 の 2 つ。

### なぜ悪いのか

- プロパティ を変更する場合も、割引のロジックを変更する場合も Product クラスを変更しなければいけなくなる。

???

### どうすべきか

```ts
class Product {
  private readonly name: string;
  private readonly price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }
}

class DiscountManager {
  // 割引メソッド
  public discountedPrice(product: Product): number {
    // 10% 割引
    return product.getPrice() * (1 - 0.1);
  }
}

class Main {
  private product = new Product();
  private discountManager = new DiscountManager();

  public execute(): void {
    discountManager.discountedPrice(product);
  }
}
```

### SRP と 単純にファイルを細かく分割することの違い

- 違いは、責務が単一か複数か。
  - SRP は、責務が単一の module(file,class,method)になる。
  - ファイル分割は、責務が単一ではない。
- いくら細分化しても、責務が 1 箇所にまとまっていないと、変更する際に複数箇所変更しなければいけなくなる。

### メモ

- ~~SRP ではないことで発生する弊害をコードレベルで掴めていない~~
- ~~SRP ではないと、何が問題になるのか。具体例を示せない。~~

## 開放閉鎖の原則（Open–closed principle）

> 「ソフトウェアのエンティティは（中略）拡張に対して開かれていなければならないが、変更に対しては閉じていなければならない。」

[SOLID | Wikipedia](https://ja.wikipedia.org/wiki/SOLID)

### オープン・クローズドの原則 ではない例

```ts
class Product {
  private readonly type: "freshFood" | "beverage";
  private readonly name: string;
  private readonly price: number;

  constructor(type: string, name: string, price: number) {
    this.type = type;
    this.name = name;
    this.price = price;
  }

  public getType(): string {
    return this.type;
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }
}

class DiscountManager {
  // 割引メソッド
  public discountedPrice(product: Product): number {
    switch (product.getType()) {
      case "freshFood":
        // 生鮮食品は10%割引
        return product.getPrice() * (1 - 0.1);
        break;
      case "beverage":
        // 飲料水は5%割引
        return product.getPrice() * (1 - 0.05);
        break;
      default:
        return product.getPrice();
        break;
    }
  }
}

class Main {
  private discoutManager = new DiscountManager();
  private freshFood = new FreshFood();
  private beverage = new Beverage();
  private bread = new Bread();

  public execute(): void {
    discountManager.discountPrice(freshFood);
    discountManager.discountPrice(beverage);
  }
}
```

### どこが悪いのか

新たに、パンは 3%割引と追加したい場合、既存の `DiscountManager.discountedPrice` の Switch 処理を追記しないといけない。

`DiscountManager.discountedPrice` が `Product` に依存していることが悪い。

### なぜ悪いか

`DiscountManager.discountedPrice` が `Product` に依存していることで、変更が必要になるから。

つまり、依存していることで拡張性が損なわれているから、悪い。

### どうすべきか

```ts
interface IProduct {
  private readonly type: string;
  private readonly name: string;
  private readonly price: number;

  public getType(): string {}
  public getName(): string {}
  public getPrice(): number {}
  public discountedPrice(): number {}
}

class FreshFood implements IProduct {
  // ...省略

  public discountedPrice(): number {
    return getPrice() * (1 - 0.1);
  }
}

class Beverage implements IProduct {
  // ...省略

  public discountedPrice(): number {
    return getPrice() * (1 - 0.05);
  }
}

class DiscountManager {
  // 割引メソッド
  public discountedPrice(product: IProduct): number {
    return product.discountedPrice();
  }
}
```

### 何が改善されたか

パンは 3%割引と追加したい場合、DiscoutManager クラスを変更せずに、Product クラスを拡張して Bread クラスを作ることで、対応可能になった。

```ts
class Bread implements IProduct {
  // ...省略

  public discountedPrice(): number {
    return getPrice() * (1 - 0.03);
  }
}

class DiscountManager {
  // 割引メソッド
  public discountedPrice(product: IProduct): number {
    return product.discountedPrice(); // 何も変更しない
  }
}

class Main {
  private discoutManager = new DiscountManager();
  private freshFood = new FreshFood();
  private beverage = new Beverage();
  private bread = new Bread();

  public execute(): void {
    discountManager.discountPrice(freshFood);
    discountManager.discountPrice(beverage);
    discountManager.discountPrice(bread);
  }
}
```

### 疑問

- OCP 違反の解決策は、Interface 以外にもあるのかな？
  - > クラスはオブジェクトではなくインターフェースに依存せよ
  - https://qiita.com/UWControl/items/98671f53120ae47ff93a#:~:text=%E3%80%8C%E3%82%AF%E3%83%A9%E3%82%B9%E3%81%AF%E3%82%AA%E3%83%95%E3%82%99%E3%82%B7%E3%82%99%E3%82%A7%E3%82%AF%E3%83%88%E3%81%A6%E3%82%99%E3%81%AF%E3%81%AA%E3%81%8F%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%95%E3%82%A7%E3%83%BC%E3%82%B9%E3%81%AB%E4%BE%9D%E5%AD%98%E3%81%9B%E3%82%88%E3%80%8D

## リスコフの置換原則 （Liskov substitution principle）

> プログラムの中にある任意のオブジェクトは、プログラムの正しさを変化させることなく、そのサブクラスのオブジェクトと置換できなければならない。

[SOLID | Wikipedia](https://ja.wikipedia.org/wiki/SOLID)

置換できなければならない。の置換ってどういうことだろう？

つまり、「基本クラスを使っている場所で、代わりにサブクラスを使っても大丈夫」ということ

以下の条件を満たせばよい

- 1.サブクラスのメソッドは、基本クラスのメソッドよりもインプットの条件が緩い
- 2.サブクラスのメソッド、基本クラスのメソッドよりもアウトプットの条件が厳しい

### リスコフの置換原則 ではない例

```ts
class SuperClass {
  // 引数は、1以上100以下の整数
  // 返り値は、1以上100以下の整数
  public getNumber(input: number): number {
    if (!(input >= 1) || !(input <= 100)) {
      throw new Error("引数の値が不正です。");
    }

    const output = Math.random() * 101;
    if (!(output >= 1) || !(output <= 100)) {
      throw new Error("返り値が不正です。");
    }
    return output;
  }
}

class SubClass1 extends SupurClass {
  // 引数は、1以上10以下の整数
  // 返り値は、1以上10以下の整数
  public getNumber(input: number): number {
    if (!(input >= 1) || !(input <= 10)) {
      throw new Error("引数の値が不正です。");
    }

    const output = Math.random() * 11;
    if (!(output >= 1) || !(output <= 10)) {
      throw new Error("返り値が不正です。");
    }
    return output;
  }
}

class SubClass2 extends SupurClass {
  // 引数は、1以上1000以下の整数
  // 返り値は、1以上1000以下の整数
  public getNumber(input: number): number {
    if (!(input >= 1) || !(input <= 1000)) {
      throw new Error("引数の値が不正です。");
    }

    const output = Math.random() * 1001;
    if (!(output >= 1) || !(output <= 1001)) {
      throw new Error("返り値が不正です。");
    }
    return output;
  }
}
```

### どこが悪いのか

- SubClass1
  - サブクラスの `getNumber`メソッドの**引数の制約が厳しい**。
  - そのため、基本クラスをサブクラスのメソッドに置換した場合、問題が発生する。
- SubClass2
  - サブクラスの `getNumber`メソッドの**返り値の制約が緩い**。
  - そのため、基本クラスをサブクラスのメソッドに置換した場合、問題が発生する。

### なぜ悪いか(違反した場合、どのような不都合が生じるか)

- 継承なのに、継承できていない？
- そのサブクラスを使う人が予想している挙動に違反しているから？

### どうすべきか

```ts
class SuperClass {
  // 引数は、1以上100以下の整数
  // 返り値は、1以上100以下の整数
  public getNumber(input: number): number {
    if (!(input >= 1) || !(input <= 100)) {
      throw new Error("引数の値が不正です。");
    }

    const output = Math.random() * 101;
    if (!(output >= 1) || !(output <= 100)) {
      throw new Error("返り値が不正です。");
    }
    return output;
  }
}

class SubClass extends SupurClass {
  // 引数は、1以上1000以下の整数
  // 返り値は、1以上10以下の整数
  public getNumber(input: number): number {
    if (!(input >= 1) || !(input <= 1000)) {
      throw new Error("引数の値が不正です。");
    }

    const output = Math.random() * 11;
    if (!(output >= 1) || !(output <= 10)) {
      throw new Error("返り値が不正です。");
    }
    return output;
  }
}
```

### 疑問

- 「継承しているから、サブクラスのメソッドで基本クラスのメソッドを置き換えてももちろん同じような挙動になるよね？」 ということなのかな？
- 「Open にしているのに、Open を満たすような条件じゃないとだめだよね？」ということ？

### メモ

- 契約による設計の理解が浅い？
- 一般的な解決策は何があるのだろうか

## インターフェイス分離の原則（Interface segregation principle）

> 汎用的な目的のインターフェイスが 1 つだけあるよりも、特定のクライアント向けのインターフェイスが多数あった方がよりよい。

[SOLID | Wikipedia](https://ja.wikipedia.org/wiki/SOLID)

### インターフェイス分離の原則 ではない例

```ts
interface Object {
  public moveForward(distance: number): void {}
  public moveBackward(distance: number): void {}
  public rise(distance: number): void {}
  public descend(distance: number): void {}
}

class Car implements Object {
  private x: number;

  constructor(x: number) {
    this.x = x;
  }

  public moveForward(distance: number): void {
    this.x += distance;
  }

  public moveBackward(distance: number): void {
    this.x -= distance;
  }

  public rise(distance: number): void {}
  public descend(distance: number): void {}
}

class Helicopter implements Object {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public moveForward(distance: number): void {
    this.x += distance;
  }

  public moveBackward(distance: number): void {
    this.x -= distance;
  }

  public rise(distance: number): void {
    this.y += distance;
  }

  public descend(distance: number): void {
    this.y -= distance;
  }
}
```

### どこが悪いのか

- Car クラスのインターフェースに、不必要なメソッドが含まれていること。
- Car クラスと Helicopter クラスでそれぞれインターフェースを作っていないこと

### なぜ悪いか

- それぞれインターフェースを作っていないことで、片方の都合でインターフェースを追加/削除する場合に、もう片方も修正する必要がある
  - つまり、依存してしまう
- メソッドの引数の型が変化した場合に、そのインターフェースを利用している全てのクラスに影響が及んでしまう

### どうすべきか

```ts
interface ICar {
  public moveForward(distance: number): void {}
  public moveBackward(distance: number): void {}
}

interface IHelicopter {
  public moveForward(distance: number): void {}
  public moveBackward(distance: number): void {}
  public rise(distance: number): void {}
  public descend(distance: number): void {}
}

class Car implements ICar {
  private x: number;

  constructor(x: number) {
    this.x = x;
  }

  public moveForward(distance: number): void {
    this.x += distance;
  }

  public moveBackward(distance: number): void {
    this.x -= distance;
  }
}

class Helicopter implements IHelicopter {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public moveForward(distance: number): void {
    this.x += distance;
  }

  public moveBackward(distance: number): void {
    this.x -= distance;
  }

  public rise(distance: number): void {
    this.y += distance;
  }

  public descend(distance: number): void {
    this.y -= distance;
  }
}
```

### 何が改善されたか

- それぞれインターフェースを作った
- Car クラスに rise, descend メソッドがなくなった

### どのようなメリットがあるか

- 不要なメソッドの定義がなくなったことで、不要なテストを記述しなくて良くなった
  - 「不要なメソッドが呼ばれたら throw すること」などをテストしなくてよい
- 依存度が少なくなったことで、変更箇所が少なくなった

### 疑問

- 全てのクラスに固有のインタフェースを作成すべきではないよね？
  - Domain にはインターフェースいらないはず

## 依存性逆転の原則（Dependency inversion principle）

> 具体ではなく、抽象に依存しなければならない

[SOLID | Wikipedia](https://ja.wikipedia.org/wiki/SOLID)

### 依存性逆転の原則 ではない例

```ts
class PC {
  private usbPort: UsbPort = USB_TYPE_C_PORT;
  private usbKeyboad: UsbKeyboad;

  constructor(usbKeyboad: UsbKeyboad): void {
    this.usbKeyboad = usbKeyboad;
  }

  public connectUsbKeyboard(): void {
    this.usbKeyborad.connect(this.usbPort);
  }
}

class UsbKeyboad {
  private isConnect = false;

  public connect(usbPort: UsbPort): void {
    this.isConnect = true;
  }
}
```

### どこが悪いのか

- PC クラスが、UsbKeyboard クラスに依存している。
  - つまり、具体に依存している

### なぜ悪いか

- a

### どうすべきか

```ts
interface IUsbKeyboard {
  private isConnect: boolean;
  public connect(usbPort: UsbPort): void {}
}

class PC {
  private usbPort: UsbPort = USB_TYPE_C_PORT;
  private usbKeyboad: IUsbKeyboard;

  constructor(usbKeyboard: IUsbKeyboard): void {
    this.usbKeyboad = usbKeyboard;
  }

  public connectUsbKeyboard(): void {
    this.usbKeyborad.connect(this.usbPort);
  }
}

class UsbKeyboad {
  private isConnect = false;

  public connect(usbPort: UsbPort): void {
    this.isConnect = true;
  }
}
```

### 何が改善されたか

- PC クラスが、UsbKeyboard インターフェースに依存している
  - 依存が具体から抽象に変更された

### どのようなメリットがあるか

- > 依存する方向を安定したモジュールに向けるほど、変更に関わるコストが小さくなる。

[依存関係逆転の原則（Dependency Inversion Principle） - 逆転ってなんやねん？ | Qiita](https://qiita.com/turara/items/2ac6946e05d9f22843a4#%E3%81%AA%E3%81%AB%E3%81%8C%E5%AC%89%E3%81%97%E3%81%84%E3%82%93%E7%BF%BB%E8%A8%B3%E3%81%93%E3%81%86%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%A7%E3%81%A9%E3%82%93%E3%81%AA%E5%88%A9%E7%9B%8A%E3%81%8C%E5%BE%97%E3%82%89%E3%82%8C%E3%82%8B%E3%81%AE%E3%81%A7%E3%81%99%E3%81%8B)

### どんなときに依存性の逆転を用いる必要があるか

- 上位のモジュールから、下位のモジュールを呼び出す時
  - 例えば、アプリケーション層からインフラストラクチャー層を呼び出す時

[1 分でわかる依存関係逆転の原則(DIP)](https://qiita.com/wanko5296/items/29e74cc7dd7562624d08#dipdependency-inversion-principle---%E4%BE%9D%E5%AD%98%E9%96%A2%E4%BF%82%E9%80%86%E8%BB%A2%E3%81%AE%E5%8E%9F%E5%89%87)

### メモ

- 依存が具体から抽象になることを、なぜ逆転と呼ぶのか？
  - 呼び出し元である PC クラスよりも、UsbKeyboard インターフェースの方が上位なのか？
    - > ソースコードの依存性と処理の流れが逆
- ソースコードの依存性
  - あれ？ PC クラス は UsbKeyboard インターフェースに依存している
  - 具体から抽象に変えても、依存関係の変わらないような気が
    - PC クラスは UsbKeyboard インターフェースに依存している
    - PC クラスは UsbKeyboard クラスに依存している
  - 考える対象が違う
  - UsbKeyboard クラスは UsbKeyboard インターフェースに依存している
- 処理の流れ
  - PC クラス は UsbKeyboard のインスタンスを通じてメソッド を呼び出す

## 参考文献

- [良いコードとは何か - エンジニア新卒研修 スライド公開 | Note](https://note.com/cyberz_cto/n/n26f535d6c575)
- [単一責任原則で無責任な多目的クラスを爆殺する | Qiita](https://qiita.com/MinoDriven/items/76307b1b066467cbfd6a)
- [きれいなコードを書くために SOLID 原則を学びました ① ~単一責任の原則~ | Qiita](https://qiita.com/suzuki0430/items/b13c7c1f637e7cd2146d)
- [オープン・クローズドの原則 - TypeScript で学ぶ SOLID 原則 part 1](https://qiita.com/ryo2132/items/01f0fcb8ff27353f8ecb)
- [インターフェイス分離の原則](https://think-on-object.blogspot.com/2011/11/interface-segregation-principle-isp-top.html#relation)
- [1 分でわかる依存関係逆転の原則(DIP)](https://qiita.com/wanko5296/items/29e74cc7dd7562624d08)
- [よくわかる SOLID 原則 5: D（依存性逆転の原則）](https://note.com/erukiti/n/n913e571e8207)
