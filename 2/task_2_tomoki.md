# curlとpostmanに慣れる

## curl

### 問題1

回答
```sh
curl -X GET -H "X-Test:hello" "https://httpbin.org/headers"
or
curl -H "X-Test:hello" "https://httpbin.org/headers"
```

#### -X, (--request)

メソッドを指定するオプション。デフォルトは`GET`。

#### -H, (--header)

追加のヘッダーを指定するオプション。複数指定可能。  
内部ヘッダーと同じ名前のヘッダーがある場合は、こっちの指定が優先される。

`[Name]:`で内部ヘッダーの削除もできる。空白の値を送信したい場合は、`[Name];`のようにする。

---

<details><summary>補足</summary>

自分の環境(httpbin.orgに直接リクエスト)では以下のようなレスポンスが得られた。

```sh
{
  "headers": {
    "Accept": "*/*", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.64.1", 
    "X-Amzn-Trace-Id": "Root=1-5fed8ee7-070240070b2601f84d41bde8", 
    "X-Test": "hello"
  }
}
```

#### `X-Amzn-Trace-Id`とは？

[X-Amzn-Trace-Id を使用して Application Load Balancer リクエストをトレースする](https://aws.amazon.com/jp/premiumsupport/knowledge-center/trace-elb-x-amzn-trace-id/)

> Elastic Load Balancing で Application Load Balancer によってリクエストが処理されると、トレース情報が X-Amzn-Trace-Id ヘッダーに追加されます。

間にロードバランサーが挟まっているから付与されている？  
試しに`-H "X-Amzn-Trace-Id:"`で削除しようとしても消えなかったのでそうっぽい。
</details>

### 問題2

回答
```sh
curl -X POST -H "Content-Type:application/json" -d '{"name": "hoge"}' "https://httpbin.org/post"
```

#### -d, (--data)

POSTリクエストのデータを送るためのオプション。デフォルトで`Content-Type: application/x-www-form-urlencoded`ヘッダーが追加される。

---

<details><summary>補足</summary>

- -dと-fの違いは？
- `application/json`と`application/x-www-form-urlencoded`の違いは？
</details>

### 問題3

回答
```sh
curl -X POST -H "Content-Type:application/json" -d '{"userA": {"name": "hoge", "age": 29}}' "https://httpbin.org/post"
```

レスポンス(一部略)
```sh
{
  "args": {}, 
  "data": "{\"userA\": {\"name\": \"hoge\", \"age\": 29}}", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Accept": "*/*", 
    "Content-Length": "38", 
    "Content-Type": "application/json", 
    "Host": "httpbin.org", 
    "User-Agent": "curl/7.64.1", 
    "X-Amzn-Trace-Id": "Root=1-5feda4e1-32180b4d71cc149d7ff723a8"
  }, 
  "json": {
    "userA": {
      "age": 29, 
      "name": "hoge"
    }
  }, 
  "url": "https://httpbin.org/post"
}
```

### 問題4

回答
```sh
curl -X POST -H "Content-Type:application/x-www-form-urlencoded"  -d '{"name": "hoge"}' "https://httpbin.org/post"
or
curl -X POST -d '{"name": "hoge"}' "https://httpbin.org/post"
```

## postman

<details><summary>感想</summary>

- インストールの時に`brew cask`初めて使ったけど便利だった。
- postman、ヘッダーの補完もしてくれる（便利）
- body用のエディターもある（JSON書きやすい）
</details>

### 問題1

レスポンス

```sh
{
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Host": "httpbin.org",
        "Postman-Token": "b2272aa9-6172-4302-a13e-fdbc6a69119b",
        "User-Agent": "PostmanRuntime/7.26.8",
        "X-Amzn-Trace-Id": "Root=1-5feda943-40faf906190f1865433cdeaf",
        "X-Test": "hello"
    }
}
```

### 問題2

レスポンス(一部略)

```sh
{
    "args": {},
    "data": "{\n    \"name\": \"hoge\"\n}",
    "files": {},
    "form": {},
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Length": "22",
        "Content-Type": "application/json",
        "Host": "httpbin.org",
        "Postman-Token": "c3423365-776d-48dd-bdb1-c09e66ee3ac0",
        "User-Agent": "PostmanRuntime/7.26.8",
        "X-Amzn-Trace-Id": "Root=1-5fedaa8e-43384de504176ca919568809"
    },
    "json": {
        "name": "hoge"
    },
    "url": "https://httpbin.org/post"
}
```


### 問題3

レスポンス(一部略)

```sh
{
    "args": {},
    "data": "{\n    \"userA\": {\n        \"name\": \"hoge\",\n        \"age\": 29\n    }\n}",
    "files": {},
    "form": {},
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Length": "66",
        "Content-Type": "application/json",
        "Host": "httpbin.org",
        "Postman-Token": "54ed4c52-4242-4548-8ab8-cf055fd1a33f",
        "User-Agent": "PostmanRuntime/7.26.8",
        "X-Amzn-Trace-Id": "Root=1-5fedaae3-17f183c713a243997817710e"
    },
    "json": {
        "userA": {
            "age": 29,
            "name": "hoge"
        }
    },
    "url": "https://httpbin.org/post"
}
```


### 問題4

レスポンス(一部略)

```sh
{
    "args": {},
    "data": "",
    "files": {},
    "form": {
        "{\n    \"name\": \"hoge\"\n}": ""
    },
    "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Length": "22",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "httpbin.org",
        "Postman-Token": "9bc3b5a7-63ef-4a2e-9def-ed5ad2973f2f",
        "User-Agent": "PostmanRuntime/7.26.8",
        "X-Amzn-Trace-Id": "Root=1-5fedab5c-3e9a35eb2f4172bf39d0bb35"
    },
    "json": null,
    "url": "https://httpbin.org/post"
}
```

## クイズ

### curl

#### クイズ1

`https://httpbin.org/anything`からステータスコード400が返ってくるようなcurlコマンドを記述してください。

<details><summary>回答例</summary>

```sh
curl -H "Host:" "https://httpbin.org/anything"
```

`"[ヘッダー名]:"`とすることでヘッダー自体を削除できる。  
必須のヘッダーであるHostヘッダーを削除することでステータスコード400を起こした。

</details>

#### クイズ2

`https://httpbin.org/cookies`から
```sh
{
  "cookies": {
    "hoge": "fuga", 
    "piyo": "poyo"
  }
}
```

が返ってくるようなcurlコマンドを記述してください。

<details><summary>回答例</summary>

```sh
curl -b "hoge=fuga;piyo=poyo" "https://httpbin.org/cookies"
or
curl --cookie "hoge=fuga;piyo=poyo" "https://httpbin.org/cookies"
or
curl -H "Cookie:hoge=fuga;piyo=poyo" "https://httpbin.org/cookies"
```

`-b`, `--cookie`オプションでクッキーを送信できる。複数送信する場合は`;`で区切る。

</details>

#### クイズ3

`https://httpbin.org/cookies/set?hoge=123456789&fuga=202101013734649`にリクエストを送信して

```sh
{
  "cookies": {
    "fuga": "202101013734649", 
    "hoge": "123456789"
  }
}
```

のような出力を得るcurlコマンドを記述してください。

<details><summary>回答例</summary>

```sh
curl -c "" -L "https://httpbin.org/cookies/set?hoge=123456789&fuga=202101013734649"
```

`https://httpbin.org/cookies/set?[name]=[value]`は`[name]=[value]`クッキーをセットした後に、`https://httpbin.org/cookies`にリダイレクトする。

なので、受け取ったクッキーを保存してリダイレクト先に送信したい。

---

`-L`, `--location`オプションを使用すると、リダイレクト先でもリクエストを送ってくれる。

`-c`, `--cookie-jar` オプションを使用するとCookieエンジンが有効になり、受け取ったクッキーがcurlに保存され、処理が終わった後に指定されたファイルにもクッキーが保存される。

Cookieエンジンが有効になると、リダイレクト先や複数のURLで保存したクッキーを送信してくれるようになる。`--cookie`オプション使用時にも有効になる。

</details>

### postman

#### クイズ1
#### クイズ2
#### クイズ3
