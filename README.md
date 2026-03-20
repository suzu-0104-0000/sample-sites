# sample-sites

クラウドワークス応募用の提案サンプルサイトを管理するリポジトリです。

## ディレクトリ方針
- `sample-site/`: Cloudflare Pages の公開ルート
- `projects/`: 案件ごとのメモ、管理情報、内部ID管理

## Cloudflare Pages 設定
- Root directory: `sample-site`
- Build command: 空欄
- Framework preset: `None`

## 公開URL方針
- 一覧ページ: `/portal/`
- 案件ページ: `/<slug>/`

## 認証方針
- 一覧ページは `sample-site/functions/_middleware.js` で BASIC 認証
- Cloudflare Pages の Secrets に `BASIC_AUTH_USER` と `BASIC_AUTH_PASS` を設定して運用

## 現在の公開サンプル
- `/basketball-association/`

## 補足
- サイト本体は静的 HTML / CSS / JavaScript で構成
- 提案用サンプルのため、一部にダミー表現を含みます
