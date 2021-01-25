# サードパーティクッキーについて理解する
## 問題
[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recmQLSaOpAgZOkVm?blocks=hide)

## 課題1(質問)
### 1
- 前提
    - Cookie はドメインに関連付けられる。
- ファーストパーティクッキーとは
    - Cookie のドメインが現在閲覧しているページのドメインと**同じ**である場合、その Cookie をファーストパーティクッキーと呼ぶ。
- サードパーティクッキーとは
    - Cookie のドメインが現在閲覧しているページのドメインと**異なる**である場合、その Cookie をサードパーティクッキーと呼ぶ。
- ファーストパーティクッキーとサードパーティクッキーの違い
    - Cookie のドメインが、現在閲覧しているページのドメインと同じか否か。

![cross-site-set-cookie-response-header](./img/cross-site-set-cookie-response-header.png)
[What are first-party and third-party cookies? | web.dev](https://web.dev/samesite-cookies-explained/#what-are-first-party-and-third-party-cookies) (直感的に理解しやすい画像だったので引用)

#### Refferences
- [サードパーティの Cookie | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies#third-party_cookies)
- [What are first-party and third-party cookies? | web.dev](https://web.dev/samesite-cookies-explained/#what-are-first-party-and-third-party-cookies)
- [7.1.  Third-Party Cookies | RFC6265](https://tools.ietf.org/html/rfc6265#section-7.1)

#### 疑問
- `https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies` で確認できる Cookie はそれぞれファーストパーティクッキーかサードパーティクッキーか?

    ![疑問1](./img/1.png)

    特に、`.mozilla.org`から発行されているCookieが、ファーストパーティクッキーかサードパーティクッキーかわからない。

    つまり、`b.a.com` から見た `a.com` は同じドメインか否か。という問題に帰着する。

    @中野さんの回答にはbase domainが同じならば、ファーストパーティクッキー であると記述されていた。ソースを聞こうかな。

### 2
- どのように把握しているか
    - 広告バナーやJavaScriptからサードパーティクッキーを読み込みことで、サイトをまたいで同じクッキーを送信することを可能にし、ユーザの訪問履歴を把握している。
- 例
    1. `site.com` と `other.com` は共に、Google AdSence `ads.com` への広告タグを含むサイトである。
    2. `site.com` へのアクセス時、`ads.com` のサーバーに広告コンテンツをリクエストする。
    3. `ads.com` のサーバーは `site.com` に広告コンテンツを配信(レスポンス)する際に、レスポンスヘッダーに`Set-Cookie: id=123` を設定する。
    4. `site.com`から`other.com`へアクセスしたとする。
    5. `other.com`へのアクセス時に、`ads.com` のサーバーに広告コンテンツをリクエストする際に、`ads.com`で取得したCookie `id=123` は同じドメインなので、リクエストヘッダーにセットされる。
#### Refferences
- [付録: サードパーティ Cookie | JAVASCRIPT.INFO](https://ja.javascript.info/cookie#ref-138)
    - 図があるので直感的に理解できます。
- [サードパーティクッキーの使い方・使い分けまとめメモ](https://kimagureneet.hatenablog.com/entry/2016/02/11/104614)
    - Googleアナリティクス形式のクッキーは、ファーストパーティクッキー。
        - クッキーが発行されるサイトは、アナリティクスのタグを仕込むサイトとなるため。
    - 広告用トラッキングタグ形式のクッキーは、サードパーティクッキー。
        - クッキーが発行されるサイトは、広告用トラッキング情報を収集するサーバーとなるため。
- [AdSense が Cookie を使用する仕組み | AdSenseヘルプ](https://support.google.com/adsense/answer/7549925?hl=ja#:~:text=%E5%BA%83%E5%91%8A%E3%81%8C%E8%A1%A8%E7%A4%BA%E3%81%BE%E3%81%9F%E3%81%AF%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF,%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AB%E4%BF%9D%E5%AD%98%E3%81%95%E3%82%8C%E3%81%BE%E3%81%99%E3%80%82)

### 3
(回答が不十分だと自覚しています。いろいろな手法やソースなどを教えてください!!)
- img
    - `<img src="https://ads.com/" />` のようにサードパーティへのリクエストに対するレスポンス時にレスポンスヘッダーに`Set-cookie`を利用して付与される
- iframe
    - iframeタグとは
        - > HTML のインラインフレーム要素 (`<iframe>`) は、入れ子になった閲覧コンテキストを表現し、現在の HTML ページに他のページを埋め込むことができます。
    - 手法
        - `<iframe src="https://ads.com/">` のようにサードパーティへのリクエストに対するレスポンス時にレスポンスヘッダーに`Set-cookie`を利用して付与される
        - タグが異なるだけで、手法は`img`タグと同じかな。
- JavaScript
    - 例えば初回ログイン時などに、スクリプトから`window.open("https://ads.com/");` を実行する。
#### Refferences
- [`<iframe>`: インラインフレーム要素 | MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/HTML/Element/iframe)
### 4
- Chrome
    - > Chrome 80 以降、SameSite 値が宣言されていない Cookie は SameSite=Lax として扱われます。外部アクセスは、SameSite=None; Secure 設定のある Cookie のみ可能になります。
    - > Chrome でのサードパーティ Cookie のサポートを段階的に廃止する予定です。私たちは、この計画を 2 年以内に行うことを目指しています。
    - Refferences
        - [新しい Cookie 設定 SameSite=None; Secure の準備を始めましょう | Google Developers](https://developers-jp.googleblog.com/2019/11/cookie-samesitenone-secure.html)
        - [ウェブのプライバシー強化: サードパーティ Cookie 廃止への道 | Google Developers](https://developers-jp.googleblog.com/2020/01/cookie.html)
- Firefox
    - SameSite=Noneの場合は、Secure属性が必須(つまりHTTPSが必須)。
    - `バージョン67.0.1`以降、新規ユーザーはサードパーティーcookieのブロックがデフォルト（初期設定）で有効。
    - Refferences
        - [Changing Our Approach to Anti-tracking](https://blog.mozilla.org/futurereleases/2018/08/30/changing-our-approach-to-anti-tracking/)
            - 2018年8月30日 Anti-tracking の解決策として手法を変更すると発表した記事。
        - [Firefox Now Available with Enhanced Tracking Protection by Default Plus Updates to Facebook Container, Firefox Monitor and Lockwise](https://blog.mozilla.org/blog/2019/06/04/firefox-now-available-with-enhanced-tracking-protection-by-default/)
            - 2019年7月4日 Ver.67.0.1 でデフォルトでStandardに設定されているETPがリリースされた。
        - [67.0.1 Firefox Release June 4, 2019 | Firefox Release Notes](https://www.mozilla.org/en-US/firefox/67.0.1/releasenotes/)
        - [Enhanced Tracking Protection in Firefox for desktop](https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop)
            - Enhanced Tracking Protection(ETP) と呼ばれる機能は、閲覧中に自動的にプライバシーを保護します。保護対象には、Cross-siteなCookieも含まれます。
            - 3つのモード
                - Standard (Default)
                - Strict
                - Custom
        - [Changes to SameSite Cookie Behavior – A Call to Action for Web Developers](https://hacks.mozilla.org/2020/08/changes-to-samesite-cookie-behavior/)
            - SameSiteのデフォルトがNoneからLaxへ
            - SameSite=Noneの場合は、Secure属性が必須(つまりHTTPSが必須)
- Safari
    - デフォルトでサードパーティのCookieをブロック。
    - Intelligent Tracking Prevention(ITP)機能は機械学習を使用してトラッキングデータをローカルに分類し、閲覧履歴がAppleに送信されないようにしています。    
        - 例えば、example.com がユーザーのクロスサイトを追跡する機能を持つものとして分類されたとする。
            1. ユーザーが過去30日間にexample.comを操作しなかった場合
                - example.comのWebサイトデータとCookieはすぐに削除され、新しいデータが追加されても引き続き削除されます。
            2. ユーザーがexample.comを過去24時間に操作する場合
                - example.comがサードパーティであるときにそのCookieが利用可能になります。これにより、「YでXアカウントを使用してサインイン」ログインシナリオが可能になります。
            3. ユーザーが過去30日間にexample.comを操作したが、過去24時間は操作しなかった場合
                - example.comはCookieを保持しますが、Cookieは分割されます。パーティション化とは、サードパーティがトッププライベートコントロールドメインまたはTLD + 1ごとに一意の分離されたストレージを取得することを意味します。たとえば、account.example.comとwww.example.comはパーティションexample.comを共有します。これにより、クロスサイト追跡のためのCookieの使用を制限しながら、ユーザーがたまにしかサイトにアクセスしない場合でも、ユーザーはログインしたままになります。
    - Refferences
        - [Safari Privacy Overview ](https://www.apple.com/safari/docs/Safari_White_Paper_Nov_2019.pdf)
            - > In 2005, Safari became the first browser to block third-party cookies by default. 
                - Safariはサードパーティのクッキーをデフォルトでブロックした最初のブラウザ。しかも2005年に。
            - > In iOS 11 and macOS High Sierra, Safari added a feature called Intelligent Tracking Prevention to address this problem.
                - iOS 11とmacOS High Sierra でIntelligent Tracking Prevention(ITP)が機能追加された。
        - [Full Third-Party Cookie Blocking | webkit.org](https://webkit.org/tracking-prevention/#intelligent-tracking-prevention-itp)
            - > ITP by default blocks all third-party cookies. There are no exceptions to this blocking. Third-party cookie access can only be granted through the Storage Access API and the temporary compatibility fix for popups.
                - ITPは、デフォルトですべてのサードパーティCookieをブロックする。このブロッキングに例外はありません。サードパーティのCookieアクセスは、Storage AccessAPIとポップアップの一時的な互換性修正を介してのみ許可できます。
### 5
- 回答
    - ファーストパーティクッキー
#### Refferences
- [サードパーティの Cookie](https://developer.mozilla.org/ja/docs/Web/HTTP/Cookies#third-party_cookies)
    - > Cookie はドメインに関連付けられます。
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

#### Refferences
1. [Express での静的ファイルの提供 | Express](https://expressjs.com/ja/starter/static-files.html)
2. [Documentation | ngrok](https://ngrok.com/docs)