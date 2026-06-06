# AXT-AyaKoto/competitive-programming-portfolio

- 大学の制作課題です
- 私の競技プログラミングに絞ったポートフォリオです

## データ更新

AtCoder のデータは [AtCoder Problems API](https://github.com/kenkoooo/AtCoderProblems/blob/master/doc/api.md) から取得し、`data/` に JSON として保存しています。

- **自動更新**: GitHub Actions が毎週日曜 04:00（JST）に実行
- **手動更新**: `node scripts/fetch-atcoder-data.mjs`

API へのアクセスは 1 秒以上の間隔を空けてください。
