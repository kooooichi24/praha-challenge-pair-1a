## 問題1

### 回答

```
curl -H "X-Test: hello" "https://httpbin.org/headers"
```

## 問題2

### 回答

```
curl -H "Content-Type:application/json" -d "{\"name\":\"hoge\"}" "https://httpbin.org/post"
```

## 問題3

### 回答

```
curl -H "Content-Type:application/json" -d "{\"userA\": {\"name\": \"hoge\", \"age\": 29}}" "https://httpbin.org/post"
```

## 問題4

### 回答

```
curl -H "Content-Type:application/x-www-form-urlencoded" -d "{\"name\":\"hoge\"}" "https://httpbin.org/post"
```

## postman

### 問題1~4

https://www.getpostman.com/collections/2686b1be2a5d5cacf181
