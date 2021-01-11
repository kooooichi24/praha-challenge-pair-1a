# Third-Party-Cookie
ページの読み込みと同時に、ファーストパーティクッキーと、サードパーティクッキーが設定されるようなWEBサイトのデモ

![デモ](./img/demo.png)

## Usage
### Prerequisites
開発マシンに以下の前提条件がすべてインストールされていることを確認してください。

- Git
- Node.js
- ngrok

### Run Application
1. server1

    ```bash
    $ cd server1
    $ npm init
    $ node index.js
    ```

2. server2

    ```bash
    $ cd server2
    $ npm init
    $ node index.js
    $ ngrok http 3001
    ```
