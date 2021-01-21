## 課題1

### 1-1 なぜキャッシュが必要なのか、説明してください

キャッシュの仕組みがないと、
画像などのデータはサーバーに都度リクエストが必要になるのでその分画面表示速度に影響する。

キャッシュは、スマホやPC内などにデータを一時保存できる為、
サーバーへのリクエストが必要ないので、その分画面表示速度が早くなる

#### 参考記事

キャッシュは

https://time-space.kddi.com/ict-keywords/20191210/2798

### 1-2 キャッシュには様々な種類があります。いくつか例を挙げてそれぞれのキャッシュの違いを説明してください（「ブラウザキャッシュ」「プロキシキャッシュ」など）

色々ありすぎて、イメージつかないモノも多かったので、
イメージ付きそうな下記の3つを調べました

- プロキシキャッシュ

プロキシキャッシュ
画像や、動画などをキャッシュする、キャッシュサーバーを立てて、
レスポンス速度を上げるみたい

#### 参照記事

https://www.amiya.co.jp/column/web_proxy_20200911.html

- クライアントサイドキャッシュ（ブラウザーキャッシュ）

デバイスに保存するらしい

レスポンスヘッダーにCache-Controlの値が,no-storeでない限り、
ブラウザーにキャッシュされる
#### 参照記事

- デバイスに保存する
https://digitalidentity.co.jp/blog/seo/seo-tech/cash-speed-up.html#i-4

- ブラウザーキャッシュについて、

https://qiita.com/shirauix/items/cbaa4fed86f42a0c27ec

- ブラウザーにキャッシュさせる仕組み

https://qiita.com/shirauix/items/cbaa4fed86f42a0c27ec#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AB%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E3%82%92%E3%82%AD%E3%83%A3%E3%83%83%E3%82%B7%E3%83%A5%E3%81%95%E3%81%9B%E3%82%8B%E4%BB%95%E7%B5%84%E3%81%BF


- データベースキャッシュ

クエリをキャッシュできるらしい。
よく投げるクエリに対してキャッシュするのだろう

### 参照記事

https://academy.gmocloud.com/know/20160125/1584


### メモ

- プロキシとは？

https://www.amiya.co.jp/column/web_proxy_20200911.html

キャッシュサーバを立てて画像、動画などをキャッシュしているらしい

### 1-3 ブラウザのキャッシュサイズの上限は、ユーザが自由に変更できます

- 最大容量はどの程度でしょうか？
  - chrome は2GB〜2000000000未満
  - IE 1024MB
- 上限を超えると何が起きるでしょうか？
  - chrome 無視
  - IE

Chromeは2GB〜2000000000
### 1-4 動的なコンテンツにはexpiresを使わない方がいい理由

- 良くない理由
expiresをつけると期限がくるまでは、
サーバーに問い合わせをしない為、古い情報のままキャシュされてしまう可能性がある

- 対応

expiresを過去の日付にすると良いらしい。
原理はいまいちわからず

https://blog.redbox.ne.jp/http-header-expires.html

#### 参考記事

https://qiita.com/hkusu/items/d40aa8a70bacd2015dfa#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AB%E3%82%AD%E3%83%A3%E3%83%83%E3%82%B7%E3%83%A5%E3%81%95%E3%81%9B%E9%83%BD%E5%BA%A6%E7%A2%BA%E8%AA%8D%E3%81%AF%E3%81%9D%E3%82%8C%E3%81%BB%E3%81%A9%E5%BF%85%E8%A6%81%E3%81%AA%E3%81%84

- if-Modified-Since

サーバーは最後にリソースが変更された時刻が、リクエストにより与えられた時刻より後の場合にのみ、リクエストされたリソースを 200 ステータスと共に返却

https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/If-Modified-Since

### 1-5 ブラウザのキャッシュがWEBサービスに用いられている実例を、3つ以上見つけて、共有してください。なぜキャッシュが効いているのか、説明してみてください

- qiita

画像をキャッシュしてた

https://qiita.com/mizukicker/items/052d0c6043a54bef4f64

![Qiita](../qiita_cache.png)


- kibela（メモアプリ）

https://a-watanabe.kibe.la/

#### 参考記事

- キャッシュされているかどうか

https://blog.ideamans.com/2018/01/google-chrome-network.html

## 課題2

### ディレクトリ

mock

### 実行コマンド

```
npm install
npm start
```

### 説明

エンドポイントを、endpoint1とendpoint2を作成し、
endpoint2の場合は、setCustomCacheControl関数で、画像をキャッシュする設定をしています

## 課題3 ブラウザキャッシュを使うべきではないケースを３つ考えて、ペアと会話してみてください

- どんなサービスで？

qiitなど同じページを何回も見るサイトなのかなと

- どんなページで？

静的ページ

- どんなファイルを？

画像ファイルなのかな。
調べてみたらキャッシュされているモノはすべて画像データだったので

- キャッシュしてはいけない？

技術的に、キャッシュしてはいけないモノはないのではないかと思いました。
ただ、リアルタイムでデータの情報の正確性が求められる場合のデータはキャッシュしない方がよいのではと思いました。

## 課題4

- 問題1

Cache-Control: no-cacheをレスポンスヘッダーに含めた場合、ブラウザーにキャッシュされるか？

<details>
  <summary>回答</summary>
  キャシュ自体はされるようで、キャッシュする時は、オリジンサーバーに問い合わせをするらしい
　完全にキャッシュさせない場合、Cache-Controlにno-storeを設定する必要がるらしい

  - no-cacheのところ
  https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Cache-Control

  https://blog.idcf.jp/entry/cdn2

</details>

- 問題2

Expiresとmax-ageの両方を設定した場合、どちらが優先されますか？

<details>
  <summary>回答</summary>
  max-ageが優先される

  - 有効期限の箇所
  https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Cache-Control
</details>

## メモ

- chromeのブラウザーはデフォルトでキャッシュを無効化してるっぽい？

- express ミドルウエアの使い方

関数をいれると、すべてのリクエスト前に、この関数が読み込まれる

```javascript
app.use((req, res) => {
  
})
```

下記の様にすると、特定のパスにだけ、特定の関数を読み込ませる事ができる

```javascript
app.use("/endpoint1",(req, res) => {
  
})

app.use("/endpoint2",(req, res) => {
  
})
```