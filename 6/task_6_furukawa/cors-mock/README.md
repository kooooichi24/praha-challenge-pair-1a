# 課題3(実装)
CORSを説明するためのモック

![デモ動画](./static/cors-demo.mov)

## Usage
### Prerequisites
開発マシンに以下の前提条件がすべてインストールされていることを確認してください。

- Git
- Node.js
- ngrok

### Run Application

1. cors-client

    ```bash
    $ cd cors-client
    $ npm init
    $ yarn start
    $ ngrok http 3000
    ```
    ngrokで取得したurl を cors-serverの`index.js 5行目` に代入してください。(すみません；；)
    
2. cors-server

    ```bash
    $ cd cors-server
    $ npm init
    $ yarn start
    $ ngrok http 3001
    ```
    ngrokで取得したurl を cors-clientの`index.html 56行目` に代入してください。(すみません；；)

### Refferences
1. [オリジン間リソース共有 (CORS) | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)
2. [Documentation | ngrok](https://ngrok.com/docs)
3. [cors | Express](https://expressjs.com/en/resources/middleware/cors.html)
4. [node-cors-client | Github](https://github.com/troygoode/node-cors-client)
5. [node-cors-server | Github](https://github.com/troygoode/node-cors-server)
6. [Fetch の使用 | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch)