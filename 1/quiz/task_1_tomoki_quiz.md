#### クイズ1

Referrer-Policyヘッダーを設定しなかった場合、デフォルトではどのような場合にreferrer情報が送信されますか？

<details><summary>回答</summary><div>

Referrer-Policyの既定値は `no-referrer-when-downgrade` 。これはプロトコルのセキュリティ水準が同一か改善される場合はreferrerを送信し、低下する場合は送信しないという設定。

* HTTP -> HTTP, HTTPS -> HTTPS 送信
* HTTP -> HTTPS 送信
* HTTPS -> HTTP 送信しない

ブラウザーはより厳格な値である `strict-origin-when-cross-origin` を規定値にしたいらしい。
</div></details>

#### クイズ2

img要素にはrel="noreferrer"が使用できません。img要素でreferrer情報を送信したくない場合、どうすればよいでしょうか？

<details><summary>回答</summary><div>

同じページに `<meta name="referrer" content="noreferrer">` を設置する or `referrerpolicy="noreferrer"` を使用する
</div></details>

#### クイズ3

「 `<meta name="referrer" content="unsafe-url">` 」が設定されているページで、「 `<a href="~~~" rel="noreferrer">...</a>` 」から遷移した場合、Refererは送信されますか？されませんか？

<details><summary>回答</summary><div>

`rel="noreferrer"` が優先されるため、送信されない。

優先順位があり、高い順に以下のようになっている。

> 1. `rel=noreferrer`

> 1. referrerpolicy 属性
> 1. `<meta>` の referrer 属性
> 1. HTTP の Referrer-Policy ヘッダ

* [Referrer-Policy によるリファラ制御 | blog.jxck.io](https://blog.jxck.io/entries/2018-10-08/referrer-policy.html)
* [HTML Standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#referrer-policy-attribute)

</div></details>
