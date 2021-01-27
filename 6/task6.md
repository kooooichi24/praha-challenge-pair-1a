## 課題1

### 1.以下の単語を使ってCORSの仕組みを説明してください


corsはブラウザーの機能で、ブラウザーがサーバーにリクエストを送っていいか確認する仕組み

ブラウザーからサーバーにリクエストを送る際に、preflight requestを行い、サーバーにリクエストを送って良いか確認する。
サーバー側は、リクエストを送って良い対象にはいっているか（access-control-allow-origin）を確認し、リクエスト可否を返す

また、simple-requretは、prefligt-requestを行わないリクエストで、特定のリクエスト条件下でのみ実行できる

- 条件
  - HTTPメソッド
    - GET
    - HEAD
    - POST
  - 手動で追加できるヘッダー
    - Accpect
    - Accept-Language
    - など。。
    - 参照　https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#simple_requests
  - Content-Type
    - application/x-www-form-urlencoded
    - multipart/form-data
    - text/plain

#### 参照

- simple-request

https://developer.mozilla.org/ja/docs/Web/HTTP/CORS#functional_overview



### メモ

- 同一生成元ポリシー

オリジン つまりスキーム(http://,https://など)、ホスト(sample.com)、ポート(80,443)の組み合わせが全て一緒でないと情報は共有しませんというポリシー
- Content-Typeにjsonがないので最近のリクエストだと
基本的にはcorsに引っかかる

- Access-Control-Allow-Credentials

サーバー側 (Access-Control-Allow-Credentials ヘッダーを使用) とクライアント側 (XHR, Fetch Ajax リクエストの資格情報モードの設定) の両方が、資格情報を含むことを承認しなければなりません

### 2.CORSの仕組みが無い場合、どのような不都合が生じるのでしょうか？

同一生成元ポリシーで別オリジン間のリクストは禁止されているので、
corsがなくなると、別オリジン間のリクストができなくなるので、外部サービスを利用できなくなるのかな

### 3. Access-Control-Allow-Origin: *

事例を探せませんでした。
純粋にどこからでもリクエストを送れる様になるので、危なそう。。!笑

関係ありそうな記事が下記が見つかったので添付しておきます。

#### 参照記事

https://at-virtual.net/securecoding/access-control-allow-origin%E3%81%AF%E3%81%A9%E3%82%8C%E3%81%BB%E3%81%A9%E8%84%86%E5%BC%B1%E3%81%AA%E3%81%AE%E3%81%8B%E8%84%86%E5%BC%B1%E3%81%AAcors%E8%A8%AD%E5%AE%9A%E3%81%97%E3%81%A6/

#### 参照記事

https://at-virtual.net/securecoding/access-control-allow-origin%E3%81%AF%E3%81%A9%E3%82%8C%E3%81%BB%E3%81%A9%E8%84%86%E5%BC%B1%E3%81%AA%E3%81%AE%E3%81%8B%E8%84%86%E5%BC%B1%E3%81%AAcors%E8%A8%AD%E5%AE%9A%E3%81%97%E3%81%A6/

## 課題2（クイズ）

1. http://example.com/app1から、https://example.com/app2にリクエストを送る場合に、corsの設定をしないでも送れるでしょうか？

<details>
 <summary>回答</summary>
</details>

2. シンプルリクエストを送る際に、Viewport-Widthは変更可能か？

<details>
 <summary>回答</summary>
</details>

3. リクエストのContent-Typeがjsonだった場合、シンプルリクエストの対象になりますか？

<details>
 <summary>回答</summary>
</details>

## 課題3

mockを作成

- サンプルパス
praha-challenge-pair-1a/6/mock

## 課題4

- 4-1

content-typeを、jsonにしてポストリクエストを送りました。

- 4-2

CORS制約を受けなかったです。

- 4-3

理由はわかりませんでした。。！