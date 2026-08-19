# ホームページ制作 — Produce nail

## 概要
パラジェル認定プライベートネイルサロン「Produce nail」の公式サイト(1ページ構成)。
「大人かわいい」をコンセプトに、甘さより上質さを軸としたデザイン。

- 実ファイル: `index.html`(ブラウザでそのまま開けば表示されます)
- 画像フォルダ: `images/`(施術写真などはここに保存。`index.html` からは `images/ファイル名.jpg` で参照)
- プレビュー(Artifact): https://claude.ai/code/artifact/4af90d51-60c4-482c-aeb5-ca4723bdebee
- 公開サイト: https://nanairo777715-tech.github.io/HP/ (GitHubリポジトリ https://github.com/nanairo777715-tech/HP, `main`ブランチ + GitHub Pages)
- 予約フォームのバックエンド: `gas/`(Google Apps Script、セットアップ手順は `gas/README.md`)

## デザイントークン
- カラー: アイボリー `#FBF6F1` / くすみローズ `#B8707D` / ペールローズ `#EDD9D6` / 深みプラム(文字) `#43303A` / アンティークゴールド `#AD8A54`(ダークモードにも別トークンで対応済み)
- フォント: 欧文見出し・ロゴ = Cormorant Garamond(Regular / Italic, データURIで埋め込み済み・外部読み込みなし) / 和文見出し = 游明朝・ヒラギノ明朝(システムフォント) / 本文 = ヒラギノ角ゴ・游ゴシック(システムフォント)
- モチーフ: 「爪先(アーチ)」の形をスウォッチ・カード・ボタンに一貫使用

## 構成セクション
Hero(今月のカラーパレット付き) / Concept / Menu(パラジェル・ハンドケア・オプション) / Gallery(カラースウォッチ) / Voice(お客様の声) / Access(アクセス・予約) / Footer

## 要カスタマイズ箇所(【】で明示)
- 住所・電話番号・Instagramアカウント名(Access セクション)
- メニュー価格・営業時間・定休日は仮の例。実際の内容に合わせて `index.html` を編集
- ロゴ・店名は "Produce nail" で固定表示。変更する場合は `index.html` 内を検索して置換

## 画像について
- `images/` に実際の施術写真18枚を保存済み。うち8枚を Gallery セクションに使用中(`images/thumbs/` にサイズ調整済みJPEGあり、900px幅・軽量圧縮)
- 元画像(`images/*.JPG`、最大20MB)から `sips -Z 900 -s format jpeg -s formatOptions 72` でリサイズ・圧縮したものが `images/thumbs/`。新しい写真を追加する場合も同様の手順で軽量版を作ってから `index.html` の `gallery-swatch` の `background-image:url('images/thumbs/…')` に差し込む
- `images/thumbs/F9A348C6-...jpg` は正式ロゴ画像(丸モチーフの "Pn" マーク+パラジェル認定サロン表記)。現状ナビの店名はテキストロゴのままなので、フッターやAccessセクションの認定バッジとして使うか要検討
- 未使用の残り写真(施術プロセス写真、ネイルチップ単体写真など)は `images/` にそのまま保管中。ConceptやMenuセクションの補足画像として使える

## 予約フォーム(GAS + Googleカレンダー連携)
- Access セクションに `#reservationForm` を実装済み(氏名・電話・メール・メニュー・希望日時・備考)
- 送信先は `index.html` 内の `var RESERVATION_ENDPOINT = '';`(GASのWebアプリURL)。**未設定の間はフォーム送信時に「準備中」メッセージが出るだけで、実際の送信は行われない**
- バックエンドは `gas/Code.gs`(Googleカレンダーの空き確認・登録、定休日/営業時間バリデーション、確認メール送信)。デプロイ手順は `gas/README.md`
- ユーザーがGoogle Apps Scriptをデプロイし、発行されたWebアプリURL(`.../exec`)を教えてもらったら `RESERVATION_ENDPOINT` に設定してpushする必要あり(2026-08-19時点で未設定・未デプロイ)
- `gas/Code.gs` の `OWNER_EMAIL` はプレースホルダー(`your-email@gmail.com`)のまま。リポジトリが公開のため、実メールアドレスは書き込まずユーザー自身がApps Script上で設定する運用にした

## ステータス
- 初版デザイン提案 完成(2026-07-29)
- Gallery を実写真8枚に差し替え完了、GitHub Pagesで公開開始(2026-08-19)
- 予約フォームのサイト側実装 完成、GAS連携は未デプロイ(2026-08-19)
