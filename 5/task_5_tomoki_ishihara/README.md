# サードパーティクッキーについて理解する

## 課題1 (質問)

### 1

ユーザーから見て、現在訪問しているサイトとの間で送受信されるクッキーがファーストパーティークッキーで、それ以外のサイトと送受信されるクッキーがサードパーティークッキー。

1st party / 3rd party はドメイン名のみで区別し、ポートやプロトコルによっては区別しない。

### 2

1. `shop.example.com` （通販サイト）で商品を見る
  - -> ページに埋め込まれたiframeから 広告配信用サーバーに `ad.example.com?page=ultraWideMonitor`のような形でリクエストが飛ぶ
  - -> 広告配信用サーバーでユーザーID発行し、そのIDをクッキーに保存させる (`Set-Coookie: ID=hogehoge`)
1. その後、 `sns.example.co.jp` （SNSサイト）にアクセスする（同じく `ad.example.com` の広告が埋め込まれている）
  - -> 埋め込まれたiframeから `ad.example.com` にリクエストを送る際に、`Cookie: ID=hogehoge` が送信される
  - -> サーバーはクッキーを元に、ユーザーの情報を検索し、ウルトラワイドディスプレイの広告を返す
  - -> ウルトラワイドディスプレイの広告が iframe 上に表示される

[牧歌的 Cookie の終焉 | blog.jxck.io](https://blog.jxck.io/entries/2020-02-25/end-of-idyllic-cookie.html#analytics) がとても参考になりました。

### 3

サードパーティークッキーを生成するためには、サードパーティーなサイトにリクエストを送り、レスポンスとともに `Set-Cookie` ヘッダーを送信する必要がある。  
また、Chromeではバージョン84以降、 `Same-Site` 属性のないクッキーを `SameSite=Lax` として扱うため、`SameSite=None` および `Secure` 属性を付与しなければならない。


1. `img`や`iframe`を埋め込む方法
  - `src`に指定したURLとクッキーをやりとりできる
1. `<script src="~~">` を埋め込む方法
1. `<script>~</script>` を埋め込む方法？
  - どうやってクッキーをやりとりするのかがわからない。XHRやfetchを使用する？
1. リダイレクトによるSSO
  - 異なるサイトでログイン情報を共有したい時に、認証用の `auth.example.com` を用意して、各サイトからリダイレクトさせる
    - `a.com` にアクセスすると、認証用の `auth.example.com` にリダイレクト
    - `auth.example.com` でログインパスワードを入力し、クッキーを発行
    - その後、別のサイト (`b.com`) からアクセスした時、`auth.example.com` にリダイレクト & クッキーを送信して認証
    - 認証に成功したので、`auth.example.com` から `b.com` にトークン付きでリダイレクト
  - [牧歌的 Cookie の終焉 | blog.jxck.io](https://blog.jxck.io/entries/2020-02-25/end-of-idyllic-cookie.html#sso) で紹介されていた。
  - 1st partyなサイト上でクッキーが直接やりとりされるわけではないが、ユーザーがアクセスしたいサイト (`a.com`や`b.com`)からみて、`auth.example.com`は 3rd partyなので、やりとりされるCookieは 3rd party cookie となるらしい
1. 他にもXHRやfetchでCORSを許可してクッキーを送信する方法がありそう？

### 4

[牧歌的 Cookie の終焉 | blog.jxck.io](https://blog.jxck.io/entries/2020-02-25/end-of-idyllic-cookie.html#tracking-prevention) より、

> いずれにせよ、 3rdPC から脱していくことは、ほぼすべてのブラウザで合意が取れており、こうした方法を使うと、結局 3rdPC 自体が、それがどういう使われ方をしているかに関わらずブロックされる。

- RFC 6265bis
  -  `Same-Site`のデフォルト値を`Lax`として定義している（Chrome以外のブラウザも対応していく？）
  - [Cookies: HTTP State Management Mechanism （日本語訳）](https://triple-underscore.github.io/http-cookie-ext-ja.html#attribute-samesite)
- Chrome
  - バージョン86以降、 `Same-Site` 属性のないクッキーを `SameSite=Lax` として扱う（`img`や`iframe`でクッキーを送受信できなくなる）
- Safari
  - ITP (Intelligent Tracking Prevention)
    - 機械学習を用いて、トラッキングに使用されていそうなクッキーを削除する機能
    - トラッキングに使用されていると判定されても、過去24時間以内に訪問したサイトのクッキーであれば、30日間クッキーが保持される（一時的に制限が緩和される）
  - [Intelligent Tracking Prevention | WebKit](https://webkit.org/blog/7675/intelligent-tracking-prevention/)
  - [ITPの概要と対策について | 株式会社マルジュ](https://www.maru.jp/itp/#:~:text=ITP%EF%BC%88Intelligent%20Tracking%20Prevention%EF%BC%89%E3%81%A8,%E3%83%88%E3%83%A9%E3%83%83%E3%82%AD%E3%83%B3%E3%82%B0%E3%81%AE%E6%8A%91%E6%AD%A2%E6%A9%9F%E8%83%BD%E3%81%A7%E3%81%99%E3%80%82&text=%E3%81%BE%E3%81%9F%E3%80%81Cookie%E3%81%A8%E3%81%AF%E3%80%81Web,%E4%BB%95%E7%B5%84%E3%81%BF%E3%81%AE%E4%B8%80%E3%81%A4%E3%81%A7%E3%81%99%E3%80%82)
  - [牧歌的 Cookie の終焉 | blog.jxck.io](https://blog.jxck.io/entries/2020-02-25/end-of-idyllic-cookie.html#tracking-prevention)
- FireFox
  - ブラックリスト方式で、許可しないサイトからのクッキーをブロックする。
  - [デスクトップ版 Firefox の強化型トラッキング防止 | Firefox ヘルプ](https://support.mozilla.org/ja/kb/enhanced-tracking-protection-firefox-desktop)
- Edge
  - FireFoxと同様に、ブラックリスト方式？
  - [Introducing tracking prevention, now available in Microsoft Edge preview builds - Microsoft Edge Blog](https://blogs.windows.com/msedgedev/2019/06/27/tracking-prevention-microsoft-edge-preview/)

### 5

ドメイン名で判断するため、ファーストパーティークッキー。

[SameSite cookies explained](https://web.dev/samesite-cookies-explained/#what-are-first-party-and-third-party-cookies) より、

> 現在のサイトのドメインに一致するクッキー、つまりブラウザのアドレスバーに表示されているクッキーをファーストパーティクッキーと呼びます。同様に、現在のサイト以外のドメインからのクッキーをサードパーティクッキーと呼びます。

[HTTP cookie - Wikipedia](https://en.wikipedia.org/wiki/HTTP_cookie#Third-party_cookie#Third-party_cookie) より、

> 通常、クッキーのドメイン属性は、ウェブブラウザのアドレスバーに表示されているドメインと一致します。これをファースト・パーティ・クッキーと呼びます。ただし、サードパーティクッキーは、アドレスバーに表示されているドメインとは異なるドメインに属します。(DeepL翻訳)

---

ちなみに、Same-Siteもドメイン名で判断する。

> オリジンではなくドメインで判断するので、注意する。例えばhttp://a.com/からhttps://a.com/mypageにリクエストが発生する場合は、プロトコルが違うのでオリジンは異なるが、ドメインはどちらもa.comなので、これはsame-siteになる。

[SameSite 属性を使った Cookie のセキュアな運用を考える - 30歳からのプログラミング](https://numb86-tech.hatenablog.com/entry/2020/01/26/112607)

## 課題2 (実装)

