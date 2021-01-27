# CORSについて理解する
## 課題内容
[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recgTn9YMS58vKYE2?blocks=hide)

## 課題1(質問)
### 1. 
- **`CORS` の仕組み**

  ```
  CORSとは、Cross-origin のリソースへのアクセス権を与える仕組みであり、
  CORSにはsimple request と preflight request の2つの仕組みが存在する。
  
  simple request の仕組みは、
  クライアントが Cross-origin へリクエストを送信し、
  サーバーがレスポンスに Access-Control-Allow-Origin ヘッダーを返します。
  
  preflight request の仕組みは、2つの手続きから構成されています。
  1つ目の手続きは、事前に Cross-site に対してリクエストを送信してもよいかの確認です。具体的には、Access-Control-Request-Method や Access-Control-Request-Headers ヘッダーとともに、OPTHION メソッドによるHTTPリクエストを送信します。
  サーバーは、Access-Control-Allow-Origin や Access-Control-Request-Method、Access-Control-Request-Headers ヘッダーとともにリクエストを返します。
  2つ目の手続きは、実際のリクエスト・レスポンスになります。
  ```
  [オリジン間リソース共有 (CORS) | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)

#### メモ
- `CORS` とは
  
  `Cross-Origin Resource Sharing (CORS)`: オリジン間リソース共有
  
  > あるオリジンで動作しているウェブアプリケーションに、異なるオリジンにある選択されたリソースへのアクセス権を与えるようブラウザーに指示するための仕組み。
  
  [オリジン間リソース共有 (CORS) | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)

- `Same-Origin Policy` とは

  `Same-Origin Policy`: 同一オリジンポリシー
  
  > 同一オリジンポリシーとは、あるオリジンから読み込まれた文書やスクリプトについて、そのリソースから他のオリジンのリソースにアクセスできないように制限する。<br>
  > 同一オリジンポリシーはウェブのセキュリティにおける重要な仕組みであり、悪意ある行動を起こしかねないリソースの分離を目的としている。
  
  - [同一オリジンポリシー | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy)

- `Origin` とは

  > Origin = Scheme (Protocol) + Host (Domain) + Port 
  
  [Origin (オリジン) | MDN Web Docs](https://developer.mozilla.org/ja/docs/Glossary/Origin)

- `Cross-origin resource` へのリクエストでは、何が制限されて・何が許可されているか

    > Same-origin policy が存在するものの、Cross-origin で制限されているリソースと許可されているリソースが存在します。

    以下について記載されています。
    - iframes
    - CSS
    - forms
    - images
    - multimedia
    - script

    また、クイズも載っています。
    
    [What is permitted and what is blocked? | web.dev](https://web.dev/same-origin-policy/#what-is-permitted-and-what-is-blocked)

---

### 2. 
- **生じる不都合**

  ```
  Same-Origin Policy により、Cross-Origin へのリクエストがブロックされる。
  ```
  [CORSの原理を知って正しく使おう/徳丸浩のウェブセキュリティ講座 | YouTube ](https://www.youtube.com/watch?v=ryztmcFf01Y)

#### メモ
- `CORS` がなぜ必要か
  
  > `Same-Origin Policy` があり、`CORS` がない場合 <br>
  > Same-Origin Policy は安全だが、柔軟性に乏しいため。

  [CORSの原理を知って正しく使おう/徳丸浩のウェブセキュリティ講座 | YouTube ](https://www.youtube.com/watch?v=ryztmcFf01Y)

---

### 3. 
- **ケース**

  ```
  資格情報を含むリクエストに対するレスポンスの時
  ```

- **設定すべきではない理由**

  ```
  サーバーは Access-Control-Allow-Origin ヘッダーで "*" ワイルドカードではなくオリジンを指定しなければいけないから。

  ○ Access-Control-Allow-Origin: <origin>
  × Access-Control-Allow-Origin: "*"
  ```
  [Access-Control-Allow-Origin | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#access-control-allow-origin)

---

### 4. 
- **条件**

  - 許可されているメソッドのうちの一つであること。

    ```
    GET
    HEAD
    POST
    ```
  
  - 手動で設定できるヘッダーは、Fetch 仕様書で「CORS セーフリストリクエストヘッダー」として定義されている以下のヘッダ に該当する場合。
    
    ※ただし、ユーザーエージェントによって自動的に設定されたヘッダー (たとえば Connection、 User-Agent、 または Fetch 仕様書で「禁止ヘッダー名」として定義されているヘッダー) を除く
    ```
    Accept
    Accept-Language
    Content-Language
    Content-Type (但し、下記の要件を満たすもの)
    DPR
    Downlink
    Save-Data
    Viewport-Width
    Width
    ```
  
  - Content-Type ヘッダーでは以下の値のみが許可。
    ```
    application/x-www-form-urlencoded
    multipart/form-data
    text/plain
    ```

  - リクエストに使用されるどの XMLHttpRequestUpload にもイベントリスナーが登録されていないこと。これらは正しく XMLHttpRequest.upload を使用してアクセスされます。
  - リクエストに ReadableStream オブジェクトが使用されていないこと。

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
- **挙動**

  ```
  XMLHttpRequestのerrorイベントをトリガーし、要求しているJavaScriptコードへの応答データを拒否する。
  ```
  [How does Access-Control-Allow-Origin header work? | stack overflow](https://stackoverflow.com/questions/10636611/how-does-access-control-allow-origin-header-work)
  > If Site B has not indicated that Site A is allowed to access this page, the browser will trigger the XMLHttpRequest's error event and deny the response data to the requesting JavaScript code.

#### メモ
- [CORS のエラーメッセージ | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS/Errors#cors_error_messages)
  
  ブラウザに出力される CORS のエラーメッセージ一覧
  > Firefox のコンソールは、 CORS のためにリクエストが失敗した場合はコンソールにメッセージを表示します。
  
- [Reason: CORS header 'Access-Control-Allow-Origin' does not match 'xyz' | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS/Errors/CORSAllowOriginNotMatchingOrigin)

  > リクエストを作成しているオリジンが、 Access-Control-Allow-Origin ヘッダーによって許可されたオリジンのいずれにも一致しないことを表します。

  - 原因
    - オリジンの不一致
    - 複数の`Access-Control-Allow-Origin`レスポンスヘッダーを含む
      ```
      ○ `Access-Control-Allow-Origin: <origin_A>, <origin_B>`

      × `Access-Control-Allow-Origin: <origin_A>`
        `Access-Control-Allow-Origin: <origin_B>`
      ```

---

### 6. 
- **何をする必要があるか**

  ```
  XMLHttpRequest.withCredentials = True を設定する
  ```
  [資格情報を含むリクエスト | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#requests_with_credentials)

#### Refferences
- [XMLHttpRequest.withCredentials | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest#properties)

  > Boolean で、サイト間の Access-Control リクエストでクッキーや認証ヘッダーなどの資格情報を使用するかどうかを示します。

#### メモ
- [Access-Control-Allow-Credentials | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#access-control-allow-credentials)

  > Access-Control-Allow-Credentials は credentials フラグが真であるときに、リクエストへのレスポンスを開示してよいか否かを示します。<br>
  > ... <br>
  > 単純な GET リクエストはプリフライトを行いませんので、リソースへのリクエストが資格情報付きで行われた場合にリソースと共にこのヘッダーを返さなければ、レスポンスはブラウザーによって無視され、ウェブコンテンツに返らないことに注意してください。

  Cross-originサーバーは、`XMLHttpRequest.withCredentials = True` を用いたブラウザからのリクエストに対して`Access-Control-Allow-Credentials: true` のレスポンスヘッダーを返さなければいけない。
---

## 課題2(クイズ)
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

## 課題3(実装), 課題4（成果物に関する質問）
[README.md](./cors-mock/README.md)
