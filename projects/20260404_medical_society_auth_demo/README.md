# 20260404_medical_society_auth_demo

## このサンプルサイトの目的
- クラウドワークス応募時に提示するための提案用サンプルサイトです。
- 医療系学会サイトらしい信頼感、会員ログイン導線、会員専用ページの雰囲気を伝えることを目的としています。
- 本番認証の代わりに、静的HTML/CSS/JavaScriptで「案件理解が伝わる見せ方」を優先して構成しています。

## 公開ファイル配置
- 既存リポジトリ構成に合わせ、公開用ファイルは `sample-site/medical-society-auth-demo/` に配置しています。
- 想定公開URL: `/medical-society-auth-demo/`

## ページ構成
- `sample-site/medical-society-auth-demo/index.html`
  - 学会トップページ風の公開ページ
  - 学会概要、会員向け案内、お知らせ、対応イメージを掲載
- `sample-site/medical-society-auth-demo/login.html`
  - 会員ログイン画面
  - メールアドレス / 会員番号入力、パスワード入力、注意書きを配置
- `sample-site/medical-society-auth-demo/member/index.html`
  - 会員専用ページ
  - 会員向けお知らせ、学術集会情報、資料ダウンロード風カード、限定コンテンツ一覧を掲載

## 擬似認証の仕組み
- `localStorage` を使ってログイン状態を保存します。
- ログイン画面で入力値を送信すると、形式確認後に擬似ログイン状態を保存します。
- ログイン成功後は `./member/` へ遷移します。
- 未ログインで `member/index.html` に直接アクセスした場合は `login.html` に戻します。
- ログアウト時は保存した状態を削除し、未ログイン状態へ戻します。

## 公開方法
- Cloudflare Pages などの静的ホスティングで `sample-site` をルートに指定して公開できます。
- ビルドコマンドは不要です。
- 公開時は `/medical-society-auth-demo/` にアクセスすることで確認できます。

## 注意点
- 提案用サンプルサイトであり、本番認証実装ではありません。
- 認証処理はデモ用の簡易実装です。
- 実際の外部API接続、セッション管理、WordPress組み込みは含まれていません。
- 団体名・文言・掲載情報は提案用の仮設定です。
