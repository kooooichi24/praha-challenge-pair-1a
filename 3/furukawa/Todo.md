# TODO
## Requirements
エンドポイントを2つ開発する。

（仮にlocalhost:8080で起動していると仮定した場合）
1. localhost:8080に対してGETリクエスト受けた時、{text: hello world}とjsonをHTTPステータス200で返す。
2. localhost:8080に対してPOSTリクエストを受けた時、リクエストbodyに含まれるjsonデータを、レスポンスのbodyに含めて、HTTPステータス201で返す。POSTリクエストを受け付けるエンドポイントは、Content-Typeがapplication/json以外の時は、HTTPステータス400を返す。

## TODO List
### エンドポイント1
- [x] ExpressでHelloWorld
- [x] / GET のとき、{text: hello world}を返す
- [x] Content-Type の指定
- [x] ステータスコード の指定

### エンドポイント2
- [x] postでHelloWorld
- [x] リクエストボディの値をレスポンスボディへ
- [x] ステータスコード の指定
- [x] Content-Type の指定
- [x] Content-Typeがapplication/json以外の時は、400