# TODO
## Requirements
エンドポイントを2つ開発する。

（仮にlocalhost:8080で起動していると仮定した場合）
1. localhost:8080に対してGETリクエスト受けた時、{text: hello world}とjsonをHTTPステータス200で返す。
2. localhost:8080に対してPOSTリクエストを受けた時、リクエストbodyに含まれるjsonデータを、レスポンスのbodyに含めて、HTTPステータス201で返す。POSTリクエストを受け付けるエンドポイントは、Content-Typeがapplication/json以外の時は、HTTPステータス400を返す。

## TODO List
- [x] ExpressでHelloWorld
- [x] / GET のとき、{text: hello world}を返す
- [x] Content-Type の指定
- [ ] ステータスコード の指定
