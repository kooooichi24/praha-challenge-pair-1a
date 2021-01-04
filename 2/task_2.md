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