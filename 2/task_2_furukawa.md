# curlとpostmanに慣れる
## 課題内容
[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/rech1NoXAKAFx4nZt?blocks=hide)

本回答は、Local環境で[httpbin](https://hub.docker.com/r/kennethreitz/httpbin/)を起動した状態を想定しています。

環境構築手順
```bash
$ docker pull kennethreitz/httpbin
$ docker run -p 80:80 kennethreitz/httpbin
```

## curl（回答）
### 問題１
#### request
```bash
$ curl -X GET -H "X-Test: hello" localhost/headers # 最も丁寧
もしくは
$ curl -H "X-Test: hello" localhost/headers # 最も省略
```

#### response
```json
{
  "headers": {
    "Accept": "*/*", 
    "Host": "localhost", 
    "User-Agent": "curl/7.64.1", 
    "X-Test": "hello"
  }
}
```

#### Refference
- `-X` (`man curl`の出力結果より抜粋)
  - デフォルトはGET
    - 例) `-X GET` と `-X` は同義
- `-H` (`man curl`の出力結果より抜粋)
  - 任意の数の追加ヘッダーを指定することができる。
    - 例) `-H "X-Test1: hello1" -H "X-Test2: hello2"`
  - 内部ヘッダを削除するには、コロンの右側に内容のない置換を与えます。
    - 例) `-H "Host:"`
  - カスタムヘッダを値なしで送信する場合、そのヘッダはセミコロンで終わらせなければならない。
    - 例) `-H "X-Custom-Header;"`


### 問題２
#### request
```bash
$ curl -X POST localhost/post -H "Content-Type: application/json" -d '{"name": "hoge"}'
```

#### response
```json
{
  "args": {}, 
  "data": "{\"name\": \"hoge\"}", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "16", 
    "Content-Type": "application/json", 
    "Host": "localhost", 
    "User-Agent": "curl/7.64.1"
  }, 
  "json": {
    "name": "hoge"
  }, 
  "origin": "172.17.0.1", 
  "url": "http://localhost/post"
}
```

#### Refference
- `-d` (`man curl`の出力結果より抜粋)
  - 指定されたデータを POST リクエストで HTTP サーバーに送信する。
  - 送信データのデフォルト形式は、`Content-Type: application/x-www-form-urlencoded` である。
    - `-F` の場合は、`Content-Type: multipart/form-data` である。
- [Content-Type | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Type)
  - POST時は、クライアントから送信するリソースの[MINEタイプ](https://developer.mozilla.org/ja/docs/Glossary/MIME_type)を示す。
- [Accept | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Accept)
  - クライアントが理解できるコンテンツタイプを[MIMEタイプ](https://developer.mozilla.org/ja/docs/Glossary/MIME_type)で伝える。
  - `-H Accept: application/json` のみをヘッダーに付与した場合に、レスポンスが`data:""`及び`json:null`であったため、記載。

### 問題３
#### request
```bash
$ curl -X POST localhost/post -H "Content-Type: application/json" -d '{"userA": {"name": "hoge", "age": 29}}'
```

#### response
```json
{
  "args": {}, 
  "data": "{\"userA\": {\"name\": \"hoge\", \"age\": 29}}", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "38", 
    "Content-Type": "application/json", 
    "Host": "localhost", 
    "User-Agent": "curl/7.64.1"
  }, 
  "json": {
    "userA": {
      "age": 29, 
      "name": "hoge"
    }
  }, 
  "origin": "172.17.0.1", 
  "url": "http://localhost/post"
}
```

### 問題４
#### request
```bash
$ curl -X POST localhost/post -H "Content-Type: application/x-www-form-urlencoded" -d '{"name": "hoge"}'
```

#### response
```json
{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {
    "{\"name\": \"hoge\"}": ""
  }, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "16", 
    "Content-Type": "application/x-www-form-urlencoded", 
    "Host": "localhost", 
    "User-Agent": "curl/7.64.1"
  }, 
  "json": null, 
  "origin": "172.17.0.1", 
  "url": "http://localhost/post"
}
```

#### Refference
- [POST | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods/POST)
  - `application/x-www-form-urlencoded` はクエリパラメータの形式で送信する。
  - パーセプトエンコーディングされるため、バイナリデータの扱いには向かない。

---

## postman（回答）
[Postman Collectionの共有リンク](https://documenter.getpostman.com/view/13988787/TVt2ciqe)

#### Refference
- [自社 API の Postman Collection を外部公開して社内外の開発者の生産性をあげていく | Qiita](https://qiita.com/jrsyo/items/302b76a40ddc4a695900)

## クイズ
### curl
#### クイズ１
curlコマンドで`-d`(`--data`)オプションを記述したときのデフォルトの`Content-Type`は何か？

<details><summary>回答</summary><div>

`Content-Type: application/x-www-form-urlencoded`

以下、`man curl` の出力結果の一部。
> (HTTP) Sends the specified data in a POST request to the HTTP server, in the same way that a browser does when a user has filled in an HTML form and presses the submit button. This will cause curl to pass the data to the server using the content-type application/x-www-form-urlencoded. Compare to -F, --form.

また、`-F`(`--Form`)オプション時のデフォルトの`Content-Type`は、`Content-Type: multipart/form-data`
</div></details>

#### クイズ２
`application/x-www-form-urlencoded` と `application/json` は何が異なるか?

<details><summary>回答</summary><div>

送信するデータ形式が異なる。

- x-www-form-urlencoded の場合
  - `a=1&b=1` のようなクエリパラメータの形式([パーセントエンコーディング](https://developer.mozilla.org/ja/docs/Glossary/percent-encoding)有り)
  - パーセプトエンコーディングを行うため、バイナリデータの扱いには向かない。
- application/json の場合
  - `{"a":1,"b":2}` のようなJSON文字列

**Refference**
- [POST | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods/POST)
- [備忘録：Content-typeについて | Qiita](https://qiita.com/bellcrud/items/1c7c73d42df10b4107c0)
- [curl の POST オプション -d と -F の違いから、改めて MIME type を学ぶ | Qiita](https://qiita.com/att55/items/04e8080d1c441837ad42)

</div></details>

#### クイズ３
- 以下のようなレスポンスヘッダーのみ得られるcurlを作成してください。
- methodはGET
- URLは`https://httpbin.org/get`

```
HTTP/1.1 200 OK // ここも重要
Date: Sun, 03 Jan 2021 14:57:30 GMT
Content-Type: application/json
Content-Length: 255
Connection: keep-alive
Server: gunicorn/19.9.0
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

<details><summary>回答</summary><div>

**request**
```bash
$ curl -I --http1.1 https://httpbin.org/get
もしくは
$ curl -X GET -I --http1.1 https://httpbin.org/get
```

**ポイント**
- `-I` (`--head`)オプション
  - レスポンスヘッダーのみを出力する
- `--http1.1` オプション
  - HTTP/1.1 の指定

</div></details>

#### クイズ４
- 以下のようなレスポンスヘッダーとレスポンスボディが得られるcurlを作成してください。
- methodはGET
- URLは`https://httpbin.org/get`

```
HTTP/1.1 200 OK // ここも大事
Date: Sun, 03 Jan 2021 15:20:43 GMT
Content-Type: application/json
Content-Length: 255
Connection: keep-alive
Server: gunicorn/19.9.0
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true

{
  "args": {}, 
  "headers": {
    "Accept": "*/*", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.64.1", 
    "X-Amzn-Trace-Id": "Root=1-5ff1e0cb-7b1f779f54ceb3a50a5a5504"
  }, 
  "origin": "60.114.99.112", 
  "url": "https://httpbin.org/get"
}
```

<details><summary>回答</summary><div>

**request**
```bash
$ curl -i --http1.1 https://httpbin.org/get
もしくは
$ curl -X GET -i --http1.1 https://httpbin.org/get
```

**ポイント**
- `-i` (`--include`)オプション
  - レスポンスヘッダーとレスポンスボディを出力する
- `--http1.1` オプション
  - HTTP/1.1 の指定

</div></details>





#### クイズ５
- 以下のような、curlの追加情報やリクエストヘッダー、レスポンスヘッダー、レスポンスボディで構成されている出力が得られるcurlを作成してください。
- methodはGET
- URLは`https://httpbin.org/get`

```
*   Trying 54.164.234.192...
* TCP_NODELAY set
* Connected to httpbin.org (54.164.234.192) port 443 (#0)
* ALPN, offering http/1.1
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/cert.pem
  CApath: none
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Change cipher spec (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: CN=httpbin.org
*  start date: Dec 21 00:00:00 2020 GMT
*  expire date: Jan 19 23:59:59 2022 GMT
*  subjectAltName: host "httpbin.org" matched cert's "httpbin.org"
*  issuer: C=US; O=Amazon; OU=Server CA 1B; CN=Amazon
*  SSL certificate verify ok.
> GET /get HTTP/1.1
> Host: httpbin.org
> User-Agent: curl/7.64.1
> Accept: */*
> 
< HTTP/1.1 200 OK // ここも重要
< Date: Sun, 03 Jan 2021 15:51:30 GMT
< Content-Type: application/json
< Content-Length: 255
< Connection: keep-alive
< Server: gunicorn/19.9.0
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Credentials: true
< 
{
  "args": {}, 
  "headers": {
    "Accept": "*/*", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.64.1", 
    "X-Amzn-Trace-Id": "Root=1-5ff1e802-7d011ba8777eec822301f4f3"
  }, 
  "origin": "60.114.99.112", 
  "url": "https://httpbin.org/get"
}
* Connection #0 to host httpbin.org left intact
* Closing connection 0
```

<details><summary>回答</summary><div>

**request**
```bash
$ curl -v --http1.1 https://httpbin.org/get
もしくは
$ curl -X GET -v --http1.1 https://httpbin.org/get
```

**ポイント**
- `-v` (`--verbose`)オプション
  - curlの追加情報やリクエストヘッダー、レスポンスヘッダー、レスポンスボディを出力する
  - デバッグ用途などで利用する
  - `*` で始まる行は、curl によって提供された追加情報
  - `>` で始まる行は、curl によって送信された "ヘッダデータ"
  - `<` で始まる行は、通常は隠されている curl によって受信された "ヘッダデータ" 
- `--http1.1` オプション
  - HTTP/1.1 の指定

</div></details>

### postman
#### クイズ１
#### クイズ２
#### クイズ３

## 疑問
1. man curl で得られる出力の -H 部分の記述内容の一部が理解できない。

    内部ヘッダー(internal headers) とは??
    Hostなどの定義済みのヘッダーのことだろうか?

    であるとするならば、何が嬉しい?

    例えば、-d でデフォルトのContent-Type: application/x-www-form-urlencoded の場合
    curl -X POST localhost/post -H "Content-Type: application/json" -d "{"foo":"bar"}" の場合に、ヘッダーはContent-Type: application/jsonが優先されるってことかな？

    以下、man curl 実行時の -H の記述。
    > Note that if you should add a custom header that has the same name as one of the internal ones curl would use, your externally set header will be used instead of the internal one. This allows you to make even trickier stuff than curl would normally do. 
    
    以下、DeepLでの翻訳結果。
    > curl が使用する内部ヘッダーと同じ名前のカスタムヘッダーを追加した場合、内部ヘッダーの代わりに外部設定されたヘッダーが使用されることに注意してください。これにより、curl が通常行うよりもさらにトリッキーなものを作成することができます。