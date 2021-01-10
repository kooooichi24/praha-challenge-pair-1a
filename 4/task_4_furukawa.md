# クッキーを理解する
## 課題内容
[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/rec0KVn1t8J8U1LxJ?blocks=hide)

## 課題１（質問）
### クッキーとは何でしょうか？

```
HTTPはステートレスなプロトコルとして設計されているものの、Webサービスの場合、複数のリクエストにまたがったセッションもあります。
例えば、ユーザー情報やカートに入れた商品情報などの管理が挙げられます。
ブラウザが複数のリクエストをまたいで情報を保持するための仕組みのことをクッキーと言い、セッションの実現にクッキーが利用されます。

簡単なクッキーの仕組みは、以下の通りです。
1. サーバーはレスポンスでSet-cookieレスポンスヘッダーを送信する。
2. ブラウザーは以前格納されたすべてのクッキーを、Cookieヘッダーを使用してサーバーへ送信します。

例えばAmazonのWebページに接続してログインする場合、
1. ログインする。
2. Webサーバーは、ユーザーIDの情報をクッキーとしてWebブラウザに返す。
3. Webブラウザは、クッキーを各自のブラウザのストレージに保存する。
4. Webブラウザで、商品をカートに入れるボタンをクリックする。
5. Webサーバーは、その情報をクッキーとしてWebブラウザに返す。
6. Webブラウザは、クッキーを各自のブラウザのストレージに保存する。
7. 以降4,5,6の繰り返し。
※ クッキーは、レスポンス時はSet-cookieヘッダー、リクエスト時はCookieヘッダーに格納されてやり取りが行われる。
※ クッキーは、ユーザーがログアウトやカートを空にしたり購入するまでブラウザが管理する。
```

**Refference**
- [5.3.2 セッション | Real World HTTP ミニ版](https://www.oreilly.co.jp/books/9784873118789/)
  - 「Real World HTTP」のミニ版で、無料の電子書籍。
- [6.7 HTTPのステートレス性 | Webを支える技術](https://gihyo.jp/dp/ebook/2014/978-4-7741-7074-9)
  - ステートフルとステートレスのメリデメが分かりやすく記述されていました。
- [Set-Cookie | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie)
- [HTTP Cookie の使用 | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies)

### www.hoge.comで発行されたクッキーは、www.fuga.comにも送信されるでしょうか？
送信されない。

理由
```
ドメイン名が異なるため、送信されない。
```

**Refference**
- [Domain (ドメイン) | MDN Web Docs](https://developer.mozilla.org/ja/docs/Glossary/Domain)
  - `developer.mozilla.org`というドメイン名の場合
    - `org`は、 トップレベルドメイン。
    - `mozilla`は、ドメイン。
    - `developer`は、サブドメイン。
- [【勉強会】IPアドレス、ホスト名、ドメインを正しく説明できますか？](https://www.en-pc.jp/blog/archives/480)

### hoge.com:8080のクッキーはhoge.com:9090にも送信されるでしょうか？
送信される。

理由
```
ホスト名が同じため。
```

### www.hoge.comで発行されたクッキーは、www.api.hoge.comにも送信されるでしょうか？
送信されない。

理由
```
サブドメインが異なるため。
```

**Refference**
- [Set-cookie | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie)
  - `Domain=<domain-value>`
    > 複数のホストやドメインの値を指定することはできませんが、ドメインが指定された場合、すべてのサブドメインが常に含まれます。

### クッキーにDomain="hoge.com"を指定した場合、api.hoge.comにもクッキーは送信されるでしょうか？
送信される。

理由
```
Set-cookieレスポンスヘッダーには、Domainオプションが存在する。
Domainオプションは、クッキーを送信する先のホストを指定でき、Domainオプションのデフォルトはホスト名である。
ドメインが指定された場合、全てのサブドメインが常に含まれるため、送信される。
```

### ブラウザで実行されるJavaScriptは場合によってはクッキーの値を取得できます。JavaScriptからクッキーの値が取得されることを防ぐことは可能でしょうか？どうすれば良いのでしょうか？
`Set-cookie`ヘッダーに`HttpOnly`オプションを付与する。

**Refference**
- [HttpOnly / Set-Cookie | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie)
  - JavaScript が Document.cookie プロパティなどを介してこのクッキーにアクセスすることを禁止する。
- [Document.cookie | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/API/Document/cookie)
  - Chromeの検証モードで、`document.cookie` を実行するとクッキーが確認できる。
  - Chromeの検証モードで、`document.cookie = "key=value;"` を実行するとクッキーが追加できる。

### HTTPS（暗号化）通信の時だけクッキーを送信することは可能でしょうか？どうすれば良いのでしょうか？
`Set-cookie`ヘッダーに`Secure`オプションを付与する。

### クッキーにExpiresを設定すると、どのように挙動が変わるでしょうか？
わからない

`Expires=<date>`で指定された日時を過ぎると、クライアントはクッキーを削除する? (実際の挙動としては、常に現在時刻とExpiresで指定された時刻をチェックしている? それとも、リクエスト時に期限切れのクッキーを削除する? それか、サーバーがリクエストごとにExpiresを確認している)

また、指定しない場合は、クッキーの有効期限はセッションクッキーの寿命となる。

**Refference**
- [Expires=<date> / Set-Cookie | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie)
  - クッキーの有効期限を指定する。

### SameSite属性について説明してください

**SameSite属性とは**

今開いているページのドメインから、別のドメインにリクエストを送る際に、クッキーをセットするかどうかを制御する属性。

**SameSite属性の値**
1. Strict
    ```
    他のドメインへのリクエストを送る際、Strictが指定されたクッキーはセットされない。
    ```
2. Lax
    ```
    トップレベルナビゲーションで且つGETメソッドであれば、他のドメインへのリクエストであってもクッキーをセットする。
    最近のブラウザのデフォルト値。
    ```
3. None
    ```
    クッキーはすべてのコンテキストで送信される。つまり、クロスオリジンの送信が許可される。
    ```

**Refference**
- [Same-site | Cookies draft-west-first-party-cookies-07](https://tools.ietf.org/html/draft-west-first-party-cookies-07)
  - SameSite属性とは
    - クロスオリジンの情報漏洩のリスクを軽減
    - CSRFからの保護を提供
- [HTTP クッキーをより安全にする SameSite 属性について (Same-site Cookies)](https://laboradian.com/same-site-cookies/)
  - SameSite 属性の目的
    - > 今開いているページのドメインから、別のドメインにリクエストを送る際に、クッキーをセットするかどうか
  - MDNの記述を読んでもいまいちピンときていなかったが、この記事を読んで理解できた。参考文献が明記されていて信頼できる記事。
- [Cookie の性質を利用した攻撃と Same Site Cookie の効果](https://blog.jxck.io/entries/2018-10-26/same-site-cookie.html)
- [SameSite cookies explained | web.dev](https://web.dev/samesite-cookies-explained/)
- [SameSite cookies | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Set-Cookie/SameSite)

### クッキーに格納しない方が良い情報の例を、3つ以上挙げてください
暗号化の有無に関わらず、ユーザーに関する情報全て。
- ユーザーID
- パスワード
- メールアドレス
- 氏名

**Refferences**
- [解答：まちがった自動ログイン処理](https://blog.ohgaki.net/wrong-auto-login-the-answer)

### クッキーはローカルストレージと混同されることが多々あります。クッキーを使うべきタイミングと、ローカルストレージを使うべきタイミングを挙げてみてください

**クッキーを使うべきタイミング**
**ローカルストレージを使うべきタイミング**

### stack overflowのようなWEB掲示板サービスを開発しているとしましょう。XSS（クロスサイトスクリプティング）により、他ユーザのクッキー情報が抜き出される仕組みを説明してください。どのような対策が考えられますか？

## 課題２（クイズ）
### クイズ１
a

<details><summary>回答</summary><div>

</div></details>

#### クイズ２
b
<details><summary>回答</summary><div>

**Refference**
- [POST | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods/POST)
- [備忘録：Content-typeについて | Qiita](https://qiita.com/bellcrud/items/1c7c73d42df10b4107c0)
- [curl の POST オプション -d と -F の違いから、改めて MIME type を学ぶ | Qiita](https://qiita.com/att55/items/04e8080d1c441837ad42)

</div></details>

#### クイズ３
c

<details><summary>回答</summary><div>

**ポイント**
- `-I` (`--head`)オプション
  - レスポンスヘッダーのみを出力する
- `--http1.1` オプション
  - HTTP/1.1 の指定

</div></details>


## 疑問
1. Set-cookieのHttpOnlyの仕組みについて

    Set-cookieでHttpOnlyオプションを付与することで、JavaScriptがDocument.cookie プロパティなどを介してこのクッキーにアクセスすることを禁止できるが、なぜ禁止することができるのか気になる。

