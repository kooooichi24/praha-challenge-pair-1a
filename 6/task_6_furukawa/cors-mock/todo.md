# TODO
## 要件
特定のオリジンからのPOSTリクエストのみ許可して、それ以外のオリジンからPOSTリクエストを受けた時は、CORS制約によりアクセスが制限されるようなサーバを作成する

### 条件
- 「Simple request」の時はpreflightが行われない
- 「Simple request」に該当しないときはpreflightが行われること

## 整理
- origin-a       -> origin-b の POST リクエストのみ許可
- not (origin-a) -> origin-b の POST リクエストは CORS 制約によりアクセス制限

## todo
- [x] origin-b のサーバを作成する

- [x] origin-a から origin-b へ POST リクエストを送信する
- [x] origin-b は 定型文のレスポンスを返す

- [x] origin-a -> origin-b の POST リクエストのみ許可
  - [x] origin-b は レスポンスヘッダーに `Access-Control-Allow-Origin: origin-a` を付与してレスポンスを返す

- [x] not (origin-a) -> origin-b の POST リクエストは却下
  - [x] origin-a から origin-b へ Origin リクエストヘッダーを付与して POST リクエストを送信する
  - [x] origin-b は レスポンスヘッダーに `Access-Control-Allow-Origin: origin-c` を付与してレスポンスを返す

- [x] not (origin-a) -> origin-b の POST リクエストは CORS 制約によりアクセス制限
