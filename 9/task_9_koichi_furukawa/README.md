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