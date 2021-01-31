# XMLHttpRequestについて理解する
## 課題内容
[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recEJ0OREq1feaNwd?blocks=hide)

## 課題1(質問)
### 1. 
- XMLHttpRequest とは
  ```
  JavaScript などのウェブブラウザ搭載のスクリプト言語でサーバとの HTTP 通信を行うための、JavaScript の組み込みオブジェクト。
  ```
  - [XMLHttpRequest | Wikipedia](https://ja.wikipedia.org/wiki/XMLHttpRequest)
    > XMLHttpRequest (XHR) は、JavaScriptなどのウェブブラウザ搭載のスクリプト言語でサーバとのHTTP通信を行うための、組み込みオブジェクト（API）である。

- 普通の HttpRequest とは
  ```
  サーバーへのリクエストを表すサーバーサイドオブジェクト。
  ```
  Express の場合、以下の `req` 部分
  ```js
  app.get('/', (req, res) => {
    res.send('ok');
  });
  ```

- XMLHttpRequest と普通の HttpRequest の違い
  | | どの場所の話か | 役割 |
  | - | - | - |
  | XMLHttpRequest | ブラウザ | ブラウザからHttpリクエストを送信・Httpレスポンスを受信するためのもの |
  | HttpRequest | サーバー | サーバーで受け取ったHttpリクエストオブジェクトを表すためのもの |
  
  <br>
  
  - [XMLHttpRequest Vs HttpRequest](https://stackoverflow.com/questions/8668449/xmlhttprequest-vs-httprequest)
    > 要約すると、1つはブラウザで動作し、もう1つはウェブサーバーで動作します。また、両者は全く異なる役割を持っています。XMLHttpRequestはブラウザ内でウェブリソースを取得するためのものです。HttpRequestは、受信したリクエストを表します。（DeepL翻訳結果）

### 2. 
- 前提
  ```
  既定では、サイト間の XMLHttpRequest または Fetch の呼び出しにおいて、ブラウザーは資格情報を送信しない。
  ```
  [資格情報を含むリクエスト | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#requests_with_credentials)
- 問題点
  ```
  XMLHttpRequestの設定が抜けていることが原因。
  ```
- 解決例
  ```js
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://api.example.com/', true);
  xhr.withCredentials = true; // withCredentials プロパティに True を設定
  xhr.send(null);
  ```
  - [XMLHttpRequest.withCredentials | MDN Web Docs](https://developer.mozilla.org/en-US/docs/WebAPI/XMLHttpRequest/withCredentials)
  ```
  日本語の記事がない、、、翻訳してみようかな？？
  ```

### 3.
- 前提
  ```
  そもそも、ブラウザのセキュリティ機能として、異なるオリジンのリソースへのアクセスは制限されています。
  この仕組みのことを Same-origin policy と呼びます。
  
  異なるオリジンのリソースへのアクセスを実現するためには、CORS というブラウザの仕組みを利用する必要があります。
  CORS は、追加の Http ヘッダーを使用することで異なるオリジンへアクセスを可能にします。
  ```
  - [同一オリジンポリシー | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy)
  - [オリジン間リソース共有 (CORS)](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#requests_with_credentials)
- 問題点
  ```
  CORS を実現するための追加の Http ヘッダーが不足していることが原因。
  今回の場合は、サーバー側。
  ```
- 解決例

  Http レスポンスヘッダーを追加する（資格情報を含むリクエストの場合）
  ```
  Access-Control-Allow-Origin: http://example.com
  Access-Control-Allow-Credentials: true
  ```

  サーバーが Express の場合
  ```js
  const express = require('express')
  const cors = require('cors')
  const app = express()

  const corsOptions = {
    origin: 'http://example.com',
    credentials: true,
  }

  app.get('/', cors(corsOptions), (req, res) => {
    res.json({result: '任意のオリジンからこのAPIのみアクセスOK'})
  })
  
  app.listen(80, () => {
    console.log('http://api.example.com');
  });
  ```
  - [cors | Express](https://expressjs.com/en/resources/middleware/cors.html)