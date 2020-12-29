# よく使うHTTPヘッダを理解する

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

## TODO
- [x] HTTPの説明
- [x] HTTPメッセージ
- [x] HTTPヘッダーまとめる

## 回答（課題1）
### Host
リクエスト送信先のサーバーのホスト名とポート番号を指定する。

### Content-type

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