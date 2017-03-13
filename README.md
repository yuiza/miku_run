# Miku_run
## なぜ開発されたか
従来のフラッシュを使ったミク横断アプリケーションが現状のブラウザ環境では動作不可能となった．

そこで，現状の技術で再実装しました．このアプリケーションはChrome拡張機能APIが存在する限り動くと思われる．

## 主な技術
- JavaScript
    - JavaScriptバージョン ES6
- Chrome拡張機能API
- TweenMax
    - アニメーション操作
- Glup
    - JavaScriptタスクランナー＆ビルド
        ```
            $ gulp
        ```
## 前準備 - その他
- Miku_runフォルダ内のdistフォルダをGoogle Chrome拡張機能に読み込む
- 読み込み後URL横あたりにアイコンが表示される
    - このアイコンからサーバの接続・ミクとハクの追加ができる
- distフォルダがない場合は一回Gulpを走らせて下さい．生成されます．
## 使用方法
1. electron_wsを各OSに合ったアプリを起動
2. 表記されたマシンIPとポート番号3000を記録・サーバアプリと同じマシンであればlocalhost:3000で良い
3. URL横の拡張機能アイコンをクリック
4. IPアドレスと**ポート番号3000**を入力
```
    ex) 172.0.0.1:3000
```
5. セットボタンをクリック
6. 接続ボタンをクリック
7. **表示画面に適応させるために一度，ページ遷移を行うこと**
8. ミクまたはハクボタンをクリックし，キャラを走らせる．
9. その後はサーバに接続順にキャラが流れていく．
    - サーバアプリで流れる順番を変えられる機能はベータ版です

### 注意事項
+ キャラクターが移動中の画面を落とした場合，そのキャラは消滅します．
+ 基本的にはキャラクターはアクティブウィンドウに移動するようになっています．
+ タイミングにより，消える可能性もあります．
+ 
## 参考文献
[Electronの手習い〜Electron環境からパッケージ化まで〜](http://qiita.com/tagosaku324/items/c720499080d523bbe1d7)

[Google Chrome Extentions](https://developer.chrome.com/extensions)

[ES6チートシート](http://postd.cc/es6-cheatsheet/)

[TweenMax](https://greensock.com/tweenmax)

[glupとは](https://app.codegrid.net/entry/gulp-1)





