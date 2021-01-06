# リクエストをパースするWEBサーバを作ってみる
## 問題
[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/reck0YmhBW8SQ0tBn?blocks=hide)

## 課題1(実装)
[Why streams | nodejs.dev](https://nodejs.dev/learn/nodejs-streams#why-streams)より引用。
> ストリームは基本的に、他のデータ処理方法を使用する場合と比較して、2つの大きな利点を提供します。<br><br>
> ・メモリ効率：処理する前に大量のデータをメモリにロードする必要がありません。<br>
> ・時間効率：データペイロード全体が利用可能になるまで待つのではなく、データを入手したらすぐに処理を開始できるので、データの処理を開始するのにかかる時間が大幅に短縮されます。

### Refferences
1. [Stream | Node.js v15.5.1 Documentation](https://nodejs.org/api/stream.html#stream_stream)

    Node.jsの公式ドキュメント。

2. [Node.jsのstream（ストリーム）の使い方メモ](https://www.kwbtblog.com/entry/2020/06/28/180104)

    ストリームってそもそも何が嬉しいんだっけ? というモヤモヤを解決してくれた分かりやすい文章。
    > データ処理を行う時、ついつい面倒くさくて、全てのデータをメモリに読み込んでから処理しがちです。<br>
    > データサイズが小さい時は問題ないのですが、巨大なデータを扱う場合は、メモリを大量に消費しますし、１つのデータの読み込みや書き込みが完了するまで、他の読み書き作業はブロックされるので、時間がかかってしまいます。<br>
    > そんな時は、少しづつデータを読み込こみながらその都度処理する、いわゆるストリーム処理をすると、メモリはバッファ分だけで済みますし、データの読み書きは並行実行されるので、早く処理が終わり便利です。

3. [Node.jsのStreamのpipeの練習](http://aligach.net/diary/20180924.html)

    この記事も、ストリームのメリットについて記述していた。

    ストリームは何故Node.jsと相性が良いのかもう1段階理解を深めたい。(が、良い問いを与えるきっかけになった記事の作者には感謝。)
    > Streamのメリット <br>
    > 大きなデータを小分けに扱うことができるので、Node.js の特徴であるシングルスレッド、イベントドリブン、ノンブロッキングI/Oの特徴を活かしやすい。<br>
    > もちろんメモリ消費も抑えることができる。

4. [Node.js Streams | nodejs.dev](https://nodejs.dev/learn/nodejs-streams)

    Getting Started に Stream の項目を発見。
    網羅的かつ公式情報なので安心。

    <details><summary>TABLE OF CONTENTS</summary><div>

    - What are streams
    - Why streams
    - An example of a stream
    - pipe()
    - Streams-powered Node.js APIs
    - Different types of streams
    - How to create a readable stream
    - How to create a writable stream
    - How to get data from a readable stream
    - How to send data to a writable stream
    - Signaling a writable stream that you ended writing
    
    </div></details>

## 課題2(質問)
**回答に自信なし**
application/x-www-form-urlencoded はクエリパラメータの形式で送信すべき。

application/json はjson形式で送信すべき。

`バイナリーデータを送信する時は、application/jsonを使用すべき??? 「代わりに multipart/form-data を使用してください」とMDNに記載されていたが、application/jsonの利用はダメ??`

### 例
- 送信データが`{"name": "hoge"}`の場合
  - application/json
    - `{ name: 'hoge' }`
  - application/x-www-form-urlencoded
    - `{ '{"name": "hoge"}': '' }`
- 送信データが`name=hoge`の場合
  - application/json
    - `SyntaxError: Unexpected token n in JSON at position 0`
  - application/x-www-form-urlencoded
      - `{ name: 'hoge' }`

### Refferences
1. [express.urlencoded([options]) | Express](https://expressjs.com/ja/api.html#express.urlencoded)
2. [POST | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods/POST)
3. [パーセントエンコーディング | Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%91%E3%83%BC%E3%82%BB%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%82%B3%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0)
    
    パーセントエンコーディングとURLエンコーディングは同じ。
    > パーセントエンコーディング (英: percent-encoding)とは、URIにおいて使用できない文字を使う際に行われるエンコード（一種のエスケープ）の名称である。一般にURLエンコードとも称される。


## 疑問
1. そもそもparserとは?
  - https://www.slideshare.net/takahashim/what-is-parser
  
2. WebSocketとStreamの関係って?