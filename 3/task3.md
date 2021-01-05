## 問題2

### Content-typeにapplication/x-www-form-urlencodedを指定した時と、application/jsonを指定した時で、送信されるデータ形式がどのように異なるのか説明してください

回答

content-typeが、application/x-www-form-urlencodedの場合は、"key=value"
content-typeが、application/jsonの場合は、{"key": "value"}

### これらの使い分け

 application/x-www-form-urlencodedは、バイナリデータには向かないらしい