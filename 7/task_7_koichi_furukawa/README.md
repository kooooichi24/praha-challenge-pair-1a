# キャッシュについて理解する
## 課題内容
[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recoJOv7Mr2ur4Vn1?blocks=hide)

## 課題1(質問)
### 1. 
- **キャッシュが必要な理由**

  ```
  クライアント・サーバー間の通信時間よりも、クライアント・キャッシュ間の通信時間の方が短い。
  そのため頻繁に利用する情報に関しては、キャッシュを利用した方がクライアントにレスポンスを早く返せるからである。
  ```

---

### 2. 
- **キャッシュの種類**

  - キャッシュのカテゴリ
    ```
    プライベートキャッシュ と 共有キャッシュ の2つのカテゴリーに大別できる。
    ```
    [さまざまな種類のキャッシュ | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Caching#different_kinds_of_caches)

  - ブラウザキャッシュ
    ```
    プライベートキャッシュに該当する。
    特徴は、ブラウザにキャッシュ領域が存在する点である。
    ```

  - プロキシキャッシュ
    ```
    共有キャッシュに該当する。
    特徴は、プロキシサーバーにキャッシュ領域が存在する点である。
    ```
    [キャッシュのしくみ | Oracle](https://docs.oracle.com/cd/E19528-01/820-0863/adyml/index.html)
  
  - リバースプロキシのキャッシュ
    ```
    共有キャッシュに該当する。
    特徴は、リバースプロキシサーバーにキャッシュ領域が存在する点である。
    ```

#### メモ
- キャッシュメモリ
  ```
  主記憶装置とCPUなど処理装置との間に構成される。

  実はキャッシュメモリは1段だけではなく、多段構造になっている。
  CPU <-> L1キャッシュ <-> L2キャッシュ, L3キャッシュ <-> 主記憶装置

  ※ プロセッサによっては、L3キャッシュを持たないものもある。
  ※ 2013年時点ではL4キャッシュまでCPUに内蔵する例も存在する。
  ```
  [キャッシュメモリ | Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%AD%E3%83%A3%E3%83%83%E3%82%B7%E3%83%A5%E3%83%A1%E3%83%A2%E3%83%AA)

- プロキシとリバースプロキシの違い
  ```
  設置場所が違う。

  プロキシサーバ
    クライアント → プロキシサーバ → インターネット → Webサーバ
  
  プロキシサーバ
    クライアント → インターネット → リバースプロキシサーバ → Webサーバ
  ```
  [4.7　リバースプロキシの設定](http://itdoc.hitachi.co.jp/manuals/3020/30203U1720/EU170054.HTM)
  ![プロキシとリバースプロキシの違い](./static/proxy_reverse-proxy.png)

---

### 3. 
- **それぞれの役割**
  - Cache-Control ヘッダー

    Cache-Control ヘッダーの役割
    ```
    リクエスト・レスポンスでキャッシュのディレクティブ(指示)を定義すること。
    ```
    
    ディレクティブの種類
    | ディレクティブ    | 説明 |
    | --------------- | --- |
    | no-store        | キャッシュしない |
    | no-cache        | キャッシュするが再検証する |
    | public          | 常に全てをキャッシュする |
    | private         | 共有キャッシュには保存しない <br> ただしブラウザのプライベートキャッシュには保存できる |
    | max-age         | キャッシュの有効期限 (秒数) |
    | must-revalidate | キャッシュが期限切れだった場合、オリジンサーバで検証しないと有効期限切れのキャッシュを利用できない |

    [Cache-Control ヘッダー | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Caching#the_cache-control_header)

  - Expires ヘッダー

    Expires ヘッダーの役割
    ```
    レスポンスのリソースの有効期限を定義すること。
    ```
    [Expires | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Expires)

    優先順位

      `Cache-Control: max-age=<seconds> または Cache-Control: s-maxage=<seconds>` **>** `Expires: <http-date>`
    > レスポンスに max-age または s-maxage ディレクティブを持つ Cache-Control ヘッダーがある場合、Expires ヘッダーは無視されます。
    

  - Pragma ヘッダー

    Pragma ヘッダーの役割
    ```
    Cache-Control ヘッダーの下位互換。
    HTTP/1.0 でのキャッシュ時に利用する。

    ※ HTTP/1.0 クライアントとの下位互換性のためにのみ使用すること。
    ```
    [Pragma | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Pragma)

---

### 4. 
- **最大容量**
  - Chrome
    ```
    a
    ```
  
  - Safari
    ```
    a
    ```
  
  - Firefox
    ```
    a
    ```

  - Edge
    ```
    a
    ```
- **上限を超えたときの挙動**
  ```
  a
  ```

#### Refferences
- [単純リクエスト | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#simple_requests)

#### メモ
- [プリフライトリクエスト | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#preflighted_requests)

  > **サイト間リクエストがユーザーデータに影響を与える可能性が`ある`ような場合**に、このようにプリフライトを行います。
  
  逆に考えると、単純リクエストの条件は、**サイト間リクエストがユーザーデータに影響を与える可能性が`ない`ような場合**

  - 疑問
    - PUT Method は、なぜサイト間リクエストがユーザーデータに影響を与える可能性が`ある`のか
    - どのようなヘッダーが、影響を与える可能性があるか。

---

### 5. 
- **動的なサイトのキャッシュには、expires ヘッダーを利用しない方が良い理由**
  ```
  ユーザーエージェントによって、配信リソースが異なる場合について考える。
  例えば、PC用とスマートフォン用の配信リソースなどである。

  expires ヘッダーの役割は、レスポンスのリソースの有効期限を定義することである。
  そのため、異なるユーザーエージェントに対するキャッシュ利用の判断ができないからである。
  ```
  [変化するレスポンス | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Caching#varying_responses)

- **どうすればよいか**
  ```
  vary レスポンスヘッダーを利用する。

  上記の例の場合は、Vary: User-Agent レスポンスヘッダーを返す。
  ```

#### メモ
- [動的な配信 | Google検索セントラル](https://developers.google.com/search/mobile-sites/mobile-seo/dynamic-serving?hl=ja)

  確かにユーザーエージェントの検出間違いやすそう、、
  > 一般に、ユーザーエージェントの検出（ユーザーエージェントの「スニッフィング」と呼ばれることもあります）は、エラーが発生しやすい処理です。

- [Varyヘッダとキャッシュについて](https://kiririmode.hatenablog.jp/entry/20170626/1498402800)
  
  Vary ヘッダがなかったらどうなるか について記述してあり、理解しやすかったです。

  > 1. クライアント A から Accept-Encoding: gzip つきのリクエストが送信され、サーバは gzip 圧縮されたコンテンツを返す。これがキャッシュサーバにキャッシュされる。 <br>
  > 2. gzip を理解しないクライアント B が同じ URL にリクエストを発行する (Accept-Encoding ヘッダは含まれていない) と、キャッシュサーバが gzip 圧縮されたキャッシュを返す

---

### 6. 
- **hoge**

  ```
  hoge
  ```
  []()

---

## 課題2 (実装)

[README.md](./cache-mock/README.md)

## 課題3 (成果物に関する質問)


## 課題4 (クイズ)
クロスオリジンリソースで指定されたアクションが許可されているかどうかのクイズ

### クイズ1
web.devドメインのWebページには、次のiframeが含まれています。

```html
<iframe id="iframe" src="https://example.com/some-page.html" alt="Sample iframe"></iframe>
```

WebページのJavaScriptには、埋め込みページの要素からテキストコンテンツを取得するための次のコードが含まれています。

```js
const iframe = document.getElementById('iframe');
const message = iframe.contentDocument.getElementById('message').innerText;
```

このJavaScriptは許可されていますか？


<details><summary>回答</summary><div>

```
許可されていない。

iframeはホストWebページと同じオリジン上にないため、ブラウザーは埋め込みページの読み取りを許可しません。
```

</div></details>

### クイズ2
web.devドメインのWebページには、次のフォームが含まれています。

```html
<form action="https://example.com/results.json">
  <label for="email">Enter your email: </label>
  <input type="email" name="email" id="email" required>
  <button type="submit">Subscribe</button>
</form>
```

このフォームを送信できますか？

<details><summary>回答</summary><div>

```
送信できる。

フォームデータactionは、`<form>`要素の属性で指定されたクロスオリジンURLに書き込むことができます。
```

</div></details>

### クイズ3
web.devドメインのWebページには、次のiframeが含まれています。

```html
<iframe src="https://example.com/some-page.html" alt="Sample iframe"></iframe>
```

このiframeの埋め込みは許可されていますか？

<details><summary>回答</summary><div>

```
通常は許可されている。

オリジンの所有者がX-Frame-Options HTTPヘッダーをdenyまたはsameoriginに設定していない限り、クロスオリジンのiframe埋め込みが許可されます。
```

</div></details>

### クイズ4
web.devドメインのWebページには、次のキャンバスが含まれています。

```html
<canvas id="bargraph"></canvas>
```

WebページのJavaScriptには、キャンバスに画像を描画するための次のコードが含まれています。

```js
var context = document.getElementById('bargraph').getContext('2d');
var img = new Image();
  img.onload = function() {
  context.drawImage(img, 0, 0);
};
img.src = 'https://example.com/graph-axes.svg';
```

この画像をキャンバスに描くことはできますか？

<details><summary>回答</summary><div>

```
場合による。

画像は別のオリジンにあります。
オリジンの所有者が画像に適切な CORSヘッダーを指定した場合、画像は安全に描画できます。
そうでない場合、画像はエラーを引き起こします。
```

</div></details>

#### Refferences
- [Same-origin policy](https://web.dev/same-origin-policy/#what-is-permitted-and-what-is-blocked)
  - 理解度テストより引用
---
