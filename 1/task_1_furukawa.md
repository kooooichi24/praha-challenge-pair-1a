# よく使うHTTPヘッダを理解する
## TODO
- [x] HTTPの説明
- [x] HTTPメッセージ
- [x] HTTPヘッダーまとめる

[HTTPの基礎的なところを図解してみた - miro](https://miro.com/app/board/o9J_laM8geg=/)

## 課題１（質問）
[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recmY0UlZtew3TOs2?blocks=hide)

## 課題１（回答）
### Host
- 役割
  - リクエスト送信先のサーバーのホスト名とポート番号を指定する。
- ヘッダー種別
  - リクエストヘッダー

### Content-type
- 役割
  - リソースのメディア種別を示す。
- ヘッダー種別
  - エンティティヘッダー

### User-agent
- 役割
  - リクエストを送るユーザーエージェントに関する情報を示す。
- ヘッダー種別
  - リクエストヘッダー

### Accept
- 役割
  - 受け入れ可能なレスポンスのメディアタイプを指定する。
- ヘッダー種別
  - リクエストヘッダー

### Referer
- 役割
  - 現在リクエストされているページへのリンク先を持った直前のウェブページのアドレスを指定する。
- ヘッダー種別
  - リクエストヘッダー

### Accept-Encoding
- 役割
  - クライアントが理解可能なエンコードアルゴリズムをサーバーに通知する。
- ヘッダー種別
  - リクエストヘッダー

### Authorization
- 役割
  - サーバーがユーザーエージェントを認証するための資格情報を持つ。
- ヘッダー種別
  - リクエストヘッダー

### Location
- 役割
  - ページのリダイレクト先のURLを示す。
- ヘッダー種別
  - レスポンスヘッダー

---
### refererについて
- なぜ rel=noreferrer を設定する必要があるか？
  - 前提
    -  aタグのtarget="_blank"は、リンク先文書を新しいタブで開く。
  - 理由
    - 遷移先のページと遷移元のページは同一プロセスで実行しています。このような状況下の場合、遷移先のページに埋め込まれたJavaScriptにより、セキュリティ及びパフォーマンス上で問題があります。セキュリティ上の問題は、遷移先のページに埋め込まれたJavaScriptが遷移元のページを悪意のあるURLへリダイレクト可能な点が挙げられます。パフォーマンス上の問題は、遷移先で負荷の高い処理が実行可能な点が挙げられます。これらの問題を回避するために、rel=noreferrer を設定する必要があります。
- 起きうる問題
  - セキュリティの観点では、パスワードが悪意のある第三者へバレてしまうことが挙げられます。具体的には、フィッシングページなどの悪意のあるURLへリダイレクトすることで、フィッシングページがパスワードの再入力画面を表示し、ユーザがパスワードを入力することで第三者にパスワードがバレてしまいます。
- 設定すべきHTTPリクエストヘッダー
  - 同じオリジン
    ```http
    GET /fuga HTTP/1.1
    HOST: example.com
    Referer: https://example.com/hoge?user=user&password=password
    Referrer-Policy: origin-when-cross-origin
    ```
  - 別のオリジン
    ```http
    GET / HTTP/1.1
    HOST: another.domain.com
    Referer: https://example.com/
    Referrer-Policy: origin-when-cross-origin
    ```
  - なぜ別のオリジンの場合は、オリジン情報だけをrefererとして送信するのか？
    - プライバシーやセキュリティーの観点から、URLを外部に漏らしたくないから。具体例として、社内システムのURLや、Private GistなどのURLさえ共有すればアクセスできるタイプのサービスが挙げられる。

- 参考文献
  - [Hypertext Transfer Protocol -- HTTP/1.1 - RFC2616](https://tools.ietf.org/html/rfc2616)
  - [Hypertext Transfer Protocol (HTTP/1.1): Message Syntax and Routing - RFC7230](https://tools.ietf.org/html/rfc7230)
  - [Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content - RFC7231](https://tools.ietf.org/html/rfc7231)
  - [Links to cross-origin destinations are unsafe - web.dev](https://web.dev/external-anchors-use-rel-noopener/)
  - [Referrer-Policy - MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Referrer-Policy)
  - [Target="_blank" - the most underestimated vulnerability ever](https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/)

---

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


## 疑問
1. RFCの探し方について

    HTTPに関するRFCが複数存在する。（例えばRFC2616とRFC7230）
    このような場合、何を参考にRFCを選択するべきなのか？策定された年次だろうか？

2. RFC7230 5.4 Host の記述内容が理解できていない。具体例でいうとつまり？

    そもそも単一のIPアドレスに複数のホスト名を設定できる？
    ```
    The "Host" header field in a request provides the host and port information from the target URI, enabling the origin server to distinguish among resources while servicing requests for multiple host names on a single IP address.
    ```
    https://tools.ietf.org/html/rfc7230#section-5.4