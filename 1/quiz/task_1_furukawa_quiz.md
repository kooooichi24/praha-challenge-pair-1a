# よく使うHTTPヘッダを理解する
## 課題２（クイズ）
[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recmY0UlZtew3TOs2?blocks=hide)

## 課題２（回答）
### クイズ１
HTTPヘッダーは、一般ヘッダー・リクエストヘッダー・レスポンスヘッダー・エンティティヘッダーに分類できますが、各分類1つずつ具体的なHTTPヘッダーを挙げてください。

<details><summary>回答</summary><div>

<b>一般ヘッダー</b>
```text
Date, Cache-Control, Connection など
```

- [General header (一般ヘッダー) - MDN Web Docs](https://developer.mozillaorg/ja/docs/Glossary/General_header)
  - 一般ヘッダーは、リクエスト及びレスポンスメッセージの両方で使用できるものの、内物そのものには適用されない HTTP ヘッダーです。
- [4.5 General Header Fields - RFC2616](https://tools.ietf.org/htmlrfc2616#section-4.5)
  - 全ての一般ヘッダーが気になる方は、こちらを参照してください。

<b>リクエストヘッダー</b>
```text
Host, User-Agent, Accept, Referer など
```

- [Request header (リクエストヘッダー) - MDN Web Docs](https://developer.mozilla.org/ja/docs/Glossary/Request_header)
  - リクエストヘッダーは、 HTTP リクエストで使用される HTTP ヘッダーであり、メッセージの内容には関連しないものです。
- [5.3 Request Header Fields - RFC2616](https://tools.ietf.org/html/rfc2616#section-5.3)
  - 全てのリクエストヘッダーが気になる方は、こちらを参照してください。

<b>レスポンスヘッダー</b>
```text
Age, Location, Server など
```

- [Response header (レスポンスヘッダー) - MDN Web Docs](https://developer.mozilla.org/ja/docs/Glossary/Response_header)
  - レスポンスヘッダーは、 HTTP レスポンスで使用できる HTTP ヘッダーで、メッセージの内容には関連しないものです。
- [6.2 Response Header Fields - RFC2616](https://tools.ietf.org/html/rfc2616#section-6.2)
  - 全てのリクエストヘッダーが気になる方は、こちらを参照してください。

<b>エンティティヘッダー</b>
```text
Content-Length、Content-Language、Content-Encoding など
```

- [Entity header(エンティティヘッダー) - MDN Web Docs](https://developer.mozilla.org/ja/docs/Glossary/Entity_header)
  - レスポンスヘッダーは、 HTTP レスポンスで使用できる HTTP ヘッダーで、メッセージの内容には関連しないものです。
- [7.1 Entity Header Fields - RFC2616](https://tools.ietf.org/html/rfc2616#section-7.1)
  - 全てのリクエストヘッダーが気になる方は、こちらを参照してください。

</div></details>

### クイズ２
HTTP/1.1にて、Hostヘッダーフィールドを含まないリクエストメッセージをクライアントが送信した場合、サーバはどのような対応をしなければならないか？

<details><summary>回答</summary><div>

```text
400(Bad Request)ステータスコードで応答しなければならない。
また、1つ以上のHostヘッダーフィールドまたは無効なフィールド値を持つHostヘッダーフィールドを含むリクエストメッセージに対しても同様に400(Bad Request)ステータスコードで応答しなければならない。
```

- [5.4. Host - MDN Web Docs](https://tools.ietf.org/html/rfc7230#section-5.4)

</div></details>

### クイズ３
HostヘッダーはHTTP/1.1における唯一の必須ヘッダであるが、なぜHostヘッダのみ必須なのか？

<details><summary>回答</summary><div>

```text
ネームベースのバーチャルホストが用いられた際の名前解決に必要となることが挙げられる。
またネームベースのバーチャルホストは、IPアドレス枯渇を防ぐことができる。
```

- [HTTPってなんなの 1/2 - Hatena Blog](https://sisidovski.hatenablog.com/entry/2012/08/21/020355)
- [バーチャルホスト - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%90%E3%83%BC%E3%83%81%E3%83%A3%E3%83%AB%E3%83%9B%E3%82%B9%E3%83%88)
  - バーチャルホスト(Virtual Host)とは1つのサーバで複数のドメインを運用する技術のことで、Webサーバ、メールサーバなどで利用される。

</div></details>