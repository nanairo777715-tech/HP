# ホームページ制作 — Produce nail

## 概要
パラジェル認定プライベートネイルサロン「Produce nail」の公式サイト(1ページ構成)。
「大人かわいい」をコンセプトに、甘さより上質さを軸としたデザイン。

**重要: 本サイトは実際に予約を受け付ける本番サイトではなく、「HP制作デモ」として見せるためのサイトです(2026-08-19、ユーザーより明示)。** 予約フォームの見た目・Googleカレンダー連携の実装は本物ですが、実際の送信・カレンダー登録は意図的に無効化されています。詳細は下記「予約フォーム」の項を参照。

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
Hero(今月のカラーパレット付き) / Concept / Menu(パラジェル・ハンドケア・オプション) / Gallery(カラースウォッチ) / Voice(お客様の声) / FAQ(よくあるご質問、7問) / Access(アクセス・予約) / Footer

## 要カスタマイズ箇所(【】で明示)
- 住所・電話番号(Access セクション)。Instagramは `@producenail`(https://www.instagram.com/producenail)で設定済み — Hero・Access(情報欄・CTAボタン)・フッターの計4箇所すべてリンク済み
- メニュー価格・営業時間・定休日は仮の例。実際の内容に合わせて `index.html` を編集
- ロゴ・店名は "Produce nail" で固定表示。変更する場合は `index.html` 内を検索して置換

## 画像について
- `images/` に実際の施術写真18枚を保存済み。うち8枚を Gallery セクションに使用中(`images/thumbs/` にサイズ調整済みJPEGあり、900px幅・軽量圧縮)
- 元画像(`images/*.JPG`、最大20MB)から `sips -Z 900 -s format jpeg -s formatOptions 72` でリサイズ・圧縮したものが `images/thumbs/`。新しい写真を追加する場合も同様の手順で軽量版を作ってから `index.html` の `gallery-swatch` の `background-image:url('images/thumbs/…')` に差し込む
- `images/thumbs/F9A348C6-...jpg` は正式ロゴ画像(丸モチーフの "Pn" マーク+パラジェル認定サロン表記)。現状ナビの店名はテキストロゴのままなので、フッターやAccessセクションの認定バッジとして使うか要検討
- 未使用の残り写真(施術プロセス写真、ネイルチップ単体写真など)は `images/` にそのまま保管中。ConceptやMenuセクションの補足画像として使える

## 予約フォーム(GAS + Googleカレンダー連携)— 実装・検証済み、デモサイトでは無効化中
- Access セクションに `#reservationForm`(氏名・電話・メール・メニュー・希望日時・備考)を実装済み。GAS Webアプリ(`gas/Code.gs`)へPOSTし、営業時間/定休日バリデーション・ダブルブッキング確認・カレンダー登録(`CalendarApp.getDefaultCalendar()`)・お客様&オーナーへの確認メール送信までを行う仕組みは完成・実地確認済み。
- 2026-08-19、ユーザー自身のGoogleアカウントにGASをデプロイし、実データでのテスト予約2件(本日13:00〜/8月20日11:00〜)でカレンダー登録・メール送信・レスポンスの3点を実カレンダー・実メールで確認 → 一度は本番URLを`RESERVATION_ENDPOINT`に設定してpush・本番稼働させた。
- **その後、「本サイトはHP制作デモであり実際の予約サイトではない」との方針が明確になり、同日中に無効化した。** `index.html` の `var RESERVATION_ENDPOINT = '';` は空文字に戻してあり、フォーム送信時は実際には何も送信されず「これはデモサイトです。実際の予約は受け付けていません。」とだけ表示される(`.reservation-msg.is-info`、ゴールド文字色)。GAS側のデプロイ自体(ユーザーのGoogleアカウント上)は生きたままだが、サイトからは呼ばれない。
- 本番運用に戻す場合は、GASのWebアプリURL(`.../exec`)を`RESERVATION_ENDPOINT`に設定し直すだけでよい(`gas/README.md`に手順あり)。カレンダーに残っている2件のテスト予約はユーザーが手動削除する想定(削除確認は未追跡)。
- `gas/Code.gs` の `OWNER_EMAIL` はリポジトリ上ではプレースホルダー(`your-email@gmail.com`)のまま(公開リポジトリのためPIIを書かない方針)。実際にデプロイされているGAS側(ユーザーのGoogleアカウント上、リポジトリ外)では本人のGmailに設定済み。
- 動作確認の注意点: GAS WebアプリURL(`/exec`)は302で`script.googleusercontent.com/macros/echo?...`という一度きり有効なGET専用URLにリダイレクトする。ブラウザの`fetch()`はこれを自動で正しく処理するが、`curl -L`は環境によりPOSTのまま追従してしまい405/無限ループに見える誤検知が起きた(実際はコード側の問題ではなかった)。将来デバッグする際はブラウザの実挙動かPOST→GETを正しく分けたcurlで検証すること。

## ステータス
- 初版デザイン提案 完成(2026-07-29)
- Gallery を実写真8枚に差し替え完了、GitHub Pagesで公開開始(2026-08-19)
- 予約フォーム(GAS + Googleカレンダー連携)実装・実データで動作検証済み。ただし本サイトは制作デモのため、送信自体は無効化して公開(2026-08-19)
- Instagramリンクを実アドレス(https://www.instagram.com/producenail)に設定、FAQセクション(7問、`<details>`アコーディオン)を Voice と Access の間に追加。ナビ・フッターにも FAQ リンク追加(2026-09-02)。**未push**(このリポジトリは https://github.com/nanairo777715-tech/HP で公開中 — 公開サイトに反映するにはユーザーがpushする必要あり)
