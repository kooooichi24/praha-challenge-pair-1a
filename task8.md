## 課題1

### xss

- 仕組み

何かの投稿サイトなどで、悪意のある投稿をする。
その投稿に、javascriptを埋め込み、別ページへ遷移させて、
偽のページへリンクさせる。
偽ページでcookieを送信させて、そこに、session_idが入っていた場合、
悪意のあるユーザーにログインされるかも

- 被害

なりすましに利用をさえてしまう。

- 対処法

<」、「&」などは文字列として出力される様にする

※参考サイト

https://www.shadan-kun.com/blog/measure/1052/#:~:text=%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%EF%BC%88XSS%EF%BC%89%E3%81%A8%E3%81%AF%E3%80%81%E6%8E%B2%E7%A4%BA%E6%9D%BF%E3%82%B5%E3%82%A4%E3%83%88%E3%82%84,%E3%81%AE%E7%BD%A0%E3%82%92%E4%BB%95%E6%8E%9B%E3%81%91%E3%81%BE%E3%81%99%E3%80%82

### コマンドインジェクション

- 仕組み

検索画面などで、OSコマンドを実行する
ex）;や|の後に、OSコマンドを実行できるので、いろんな情報を閲覧できる。

- 被害

ログの中身もみれるので、
例えば決済ログなどにも個人情報が含まれていそう

- 対処

;や|などのsqlを実行できてしまうモノをエスケープする

### SQLインジェクション

検索画面などで、SQLコマンドを実行する

パターンは大きく3つで、
コメントアウト、サブクエリ、セミコロンで、SQL文を連結できるらしい

※youtube
https://www.youtube.com/watch?v=Lqo-K5fhvQ4

- 被害

管理者ユーザーなどでログインできる為個人情報などが抜き取られる可能性がある

- 対処

プレースホルダーを設定すると不正な値が文字列と認識されて大丈夫らしいです

※なんかphpが脆弱性の例で使われてますね。
 railsだと、そんな心配いらないのにみたいな感じです

### 解説動画

※youtube（分かりやすかったです！）

https://www.youtube.com/watch?v=SPIiVKXB818

### CSRF

- 仕組み

何かの投稿サイトなどで、悪意のある投稿をする。
その投稿に、javascriptを埋め込み、別ページへ遷移させて、
偽のページへリンクさせる。

その偽サイトから、本物サイトに実行リクエストを送れてしまう

- 被害

第三者が、自分のアカウントで、特定の処理を実行してしまう事

- 対処

tokenををリクエストに求める

例えば、
投稿作成画面 => 確認画面 => 投稿POSTリクエストのフローで、
各ステップでtokenをもたせておく事により、下記の様に
偽サイトからはtokenがないので、不正なPOSTリクエストが実行できなくなる
投稿作成画面 => 偽サイト => 投稿POSTリクエスト

### xssとcsrfの違い

※理解しやすい
https://qiita.com/wanko5296/items/142b5b82485b0196a2da


## 課題2

1. XSSとCSRFの違いはなんでしょうか？

<details>
  <summary>
    解答
  </summary>
  正直明確には解答できないでの、下記の記事を参照ください！

  ※参考記事
  https://qiita.com/wanko5296/items/142b5b82485b0196a2da#xss%E3%81%A8csrf%E3%81%AE%E9%81%95%E3%81%84　　


  被害になるトリガーは同じですが、目的は事なるのが大きな違いなのかな？とも思いました。
  XSSはなりすまし目的
  CSRFは利用者の意図しないWebアプリケーション上の処理実行目的
</details>

## 課題3

### コマンドラインインジェクション

```
;  ls ../../../etc/passwd

root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
libuuid:x:100:101::/var/lib/libuuid:
syslog:x:101:104::/home/syslog:/bin/false
mysql:x:102:105:MySQL Server,,,:/nonexistent:/bin/false
```

### sql インジェクション

http://localhost/vulnerabilities/sqli/

```
aa'or'a'='a

ID: aa'or'a'='a
First name: admin
Surname: admin
ID: aa'or'a'='a
First name: Gordon
Surname: Brown
ID: aa'or'a'='a
First name: Hack
Surname: Me
ID: aa'or'a'='a
First name: Pablo
Surname: Picasso
ID: aa'or'a'='a
First name: Bob
Surname: Smith
```

- 対策

エスケープするのだと思う

### CSRF

1.下記のようなhtmlを作成する

※actionを指定

```
<form action="http://localhost/vulnerabilities/csrf" method="GET">
    New password:<br />
    <input type="password" AUTOCOMPLETE="off" name="password_new"><br />
    Confirm new password:<br />
    <input type="password" AUTOCOMPLETE="off" name="password_conf"><br />
    <br />
    <input type="submit" value="Change" name="Change">

</form>

```

2.passeordをadminに変更

3.パスワード変更のページへ移動した


- 対策コード

```
## before そのまま受け取っている
$pass_new  = $_GET[ 'password_new' ];
$pass_conf = $_GET[ 'password_conf' ];

## after
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

```


### XSS

cookieなどを値を送る事はできなかったのですが、scriptタグは実行できました。（alertメソッド）

こちらではscriptが文字列になる事を確認
https://blog1127.herokuapp.com/blogs/4

※参考
https://qiita.com/KPenguin/items/783caef6a43e594ed7cd

- 対策コード

コードをみると

下記のところでエスケープが上手くできていない様子で、特定の文字はエスケープする

```
## セキュリティ Lowの場合
 $name = mysql_real_escape_string( $name );

## セキュリティ hightの場合
$name = preg_replace( '/<(.*)s(.*)c(.*)r(.*)i(.*)p(.*)t/i', '', $name );
    $name = mysql_real_escape_string( $name );

```