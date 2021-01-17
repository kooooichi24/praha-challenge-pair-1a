# サードパーティクッキーについて理解する
## 問題
[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recmQLSaOpAgZOkVm?blocks=hide)

## 課題1(質問)

## 課題2(実装)
ページの読み込みと同時に、ファーストパーティクッキーと、サードパーティクッキーが設定されるようなWEBサイトのデモ

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
