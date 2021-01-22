# 課題3(実装)
CORSを説明するためのモック

![デモ](./img/demo.png)

### Usage
#### Prerequisites
開発マシンに以下の前提条件がすべてインストールされていることを確認してください。

- Git
- Node.js
- ngrok

#### Run Application
1. server1

    ```bash
    $ cd server1
    $ npm init
    $ yarn start
    ```

2. server2

    ```bash
    $ cd server2
    $ npm init
    $ yarn start
    $ ngrok http 3001
    ```

#### Refferences
1. [Express での静的ファイルの提供 | Express](https://expressjs.com/ja/starter/static-files.html)
2. [Documentation | ngrok](https://ngrok.com/docs)