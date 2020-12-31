## 課題1

### task1-1 以下のヘッダーの意味と役割について

- Host

リクエストが送信される先のサーバーのホスト名とポート番号を指定

- Content-type

Content-Type ヘッダーはクライアントに返されたコンテンツが実際にはどのような種類のものであるかを伝えます

- User-agent

リクエストしているユーザーエージェントのバージョン等を識別できるようにする特性文字列

- Accept

クライアントが理解できるコンテンツタイプを MIME タイプで伝えます

```
ex）
Accept: text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8
```

- Referer

現在リクエストされているページへのリンク先を持った直前のウェブページのアドレスが含まれるモノ

- Accept-Encoding

コンテンツのエンコーディング、ふつうは圧縮アルゴリズムのどれをクライアントが理解することができるかを示す

- Authorization

サーバが要求する認証の種類を示す

```
ex）
Authorization: <type> <credentials>

## Basic（ベーシック認証  ）
Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l

```

- Location

レスポンスヘッダーはリダイレクト先のURL を示す

### task1-2 refererについて

- rel=noreferrerを設定をする必要性
 && rel=noreferrerを設定しなかった場合に起きうる問題

referrerはリクエスト元のurlがわかるので、
受け取り個人情報の漏洩につながる可能性がある

- 同じオリジンの時はrefererの情報を全部送って、別オリジンの時は、オリジン情報だけをrefererとして送信するように、HTTPリクエストにヘッダを追加する方法

`<meta name="referrer" content="origin">`


## 課題2 クイズ

- 1.Accept-Encodingを設定する理由はなに？

- 2.User-agentは、リクエスト元のUser-agentを表記しているけど、User-agentは具体的には何を指す？

- 3.Authorizationはサーバが要求する認証の種類」を知らせる働きがあるけど、ベーシック認証の他になにがある？