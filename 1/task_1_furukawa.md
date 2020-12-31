# よく使うHTTPヘッダを理解する
## TODO
- [x] HTTPの説明
- [x] HTTPメッセージ
- [x] HTTPヘッダーまとめる

[miro](https://miro.com/app/board/o9J_laM8geg=/)

## 課題１（質問）
以下のヘッダーの意味と、役割を説明してください
- Host
- Content-type
- User-agent
- Accept
- Referer
- Accept-Encoding
- Authorization
- Location

- refererについて
  ```
  aタグにtarget="_blank"を設定したところ、先輩エンジニアから「ちゃんと  rel=noreferrerを設定した？」と聞かれました。なぜそのような設定が必要なのでしょう  か？

  rel=noreferrerを設定しなかった場合に起きうる問題を調べて、説明して下さい

  先輩エンジニアに「同じオリジンの時はrefererの情報を全部送って、別オリジンの時は、オリジン情報だけをrefererとして送信するように、HTTPリクエストにヘッダを追加しておいてもらえる？」と頼まれました。HTTPリクエストのヘッダーには、どんな値を追加する必要があるでしょうか？
  ```

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
  - https://tools.ietf.org/html/rfc7231
  - https://web.dev/external-anchors-use-rel-noopener/
  - https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Referrer-Policy
  - https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/

## 課題２（クイズ）
```
HTTPヘッダーに関するクイズを3問、作成してください
例：「User-agentを使って、ユーザがモバイル端末を使用していることを判定しようとした場合、どのような誤検知や問題が想定されるでしょうか？」
```

## 課題２（回答）
### クイズ１
HTTPヘッダーは、一般ヘッダー・リクエストヘッダー・レスポンスヘッダー・エンティティヘッダーに分類できますが、各分類1つずつ具体的なHTTPヘッダーを挙げてください。

### クイズ２
HTTP/1.1にて、Hostヘッダーフィールドを含まないリクエストメッセージをクライアントが送信した場合、サーバはどのような対応をしなければならないか？

### クイズ３


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