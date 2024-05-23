
elmバイナリの入手
```
curl -L https://github.com/elm/compiler/releases/download/0.19.1/binary-for-linux-64-bit.gz | gunzip > elm
chmod a+x elm
```

ソースのコンパイル
```
./elm make src/Main.elm --debug --output=dist/app.js
```

実行
```
./elm reactor
```

ブラウザで http://localhost:8000 にアクセスし /dist/index.html を開く
