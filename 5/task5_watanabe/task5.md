## 課題1

### サードパーティクッキーとファーストパーティクッキーの違いを説明してください

```
ドメインから取得するcookieがファーストクッキー
ドメイン以外からがサードパーティクッキー
```

### サードパーティ Cookie を用いて広告配信ネットワーク（例えばGoogle AdSense など）がどのようにユーザの訪問履歴を把握しているのか、説明してください

```
広告のバナーにクリックすると、ユニークのIDを付与する
下記のようなバナー（画像）をクリックすると、Googleのサーバーを経由するので、
このタイミングで、cookieをセットする。

次回以降の訪問は、このサイトのドメインとcookieの値をみて来訪頻度などを計測している

ex）
https://www.google.com/hello.png
```

### そもそもサードパーティークッキーはどのように生成されるのでしょうか？画像埋め込みやスクリプト埋め込みなど、様々な手法を説明してください

```
1. フロントから
ex） document.cookie

2. サーバーから
ex）
res.cookie("key", "value")
```

### サードパーティクッキーの扱いはブラウザによってどのような差があるのでしょうか？（特にsafariは他のブラウザと挙動が異なるので、ぜひ調べてみてください！）

- google

https://policies.google.com/technologies/cookies?hl=ja

- safari

https://japanese.engadget.com/jp-2020-03-24-safari-13-1-cookie.html

### ドメインは同一で、ポートが異なるクッキーはファーストパーティクッキーでしょうか？サードパーティクッキーでしょうか？（hoge.com:8080とhoge.com:8081など）

```
ファーストパーティクッキー
```