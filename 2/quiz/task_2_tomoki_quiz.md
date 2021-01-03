# curlとpostmanに慣れる

## クイズ

### curl

#### クイズ1

`https://httpbin.org/anything`からステータスコード400が返ってくるようなcurlコマンドを記述してください。

<details><summary>回答例</summary>

```sh
curl -H "Host:" "https://httpbin.org/anything"
```

`"[ヘッダー名]:"`とすることでヘッダー自体を削除できる。  
必須のヘッダーであるHostヘッダーを削除することでステータスコード400を発生させた。

</details>

#### クイズ2

`https://httpbin.org/cookies`から
```sh
{
  "cookies": {
    "hoge": "fuga", 
    "mugi": "kome"
  }
}
```

が返ってくるようなcurlコマンドを記述してください。

<details><summary>回答例</summary>

```sh
curl -b "hoge=fuga;mugi=kome" "https://httpbin.org/cookies"
or
curl --cookie "hoge=fuga;mugi=kome" "https://httpbin.org/cookies"
or
curl -H "Cookie:hoge=fuga;mugi=kome" "https://httpbin.org/cookies"
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
or
curl -b "" -L "https://httpbin.org/cookies/set?hoge=123456789&fuga=202101013734649"
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

Postmanでは変数を設定することができ、URLやQuery Params、Headers等様々な箇所で設定した変数を使用できます。

`https://httpbin.org`を変数に格納し、`https://httpbin.org/anything`にリクエストを送信してください。

<details><summary>回答例</summary>

Collection variablesに `base_url=https://httpbin.org`を追加して、  
`{{base_url}}/anything`にリクエストを送信する。
</details>

#### クイズ2

Postmanではリクエストの前後でJavaScriptコードを実行することができます。動的なリクエストを作成したり、リクエストの結果をテストするのに便利です。

`https://httpbin.org/status/200`からステータスコード200が返ってくることを確認するテストを記述してください。

<details><summary>回答例(テストコードのみ)</summary>

```js
pm.test("Status code is 200", () => {
    pm.response.to.have.status(200)
})
```
</details>

#### クイズ3

`https://httpbin.org/base64/{value}`から、

```sh
PrAha Challenge is Awesome!!!
```

が返ってくるようなリクエストを作成してください。

<details><summary>回答例</summary>

`Pre-request Script`に以下を記述。

```js
pm.collectionVariables.set("text", btoa("PrAha Challenge is Awesome!!!"))
```

その後、`https://httpbin.org/base64/{{text}}`にリクエストを送信する。

</details>
