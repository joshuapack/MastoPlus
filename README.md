# MastoPlus

Preview link: [https://mastoplus.com](https://mastoplus.com)

Requires Node 22.12+ (needed by wrangler).

Start project.
```
npm i
npm run dev
```
then open [localhost:3000](http://localhost:3000) in the browser.

Build project.
```
npm run build
```
the files located in public folder are all you need

Deploy to Cloudflare (Workers static assets, config in `wrangler.jsonc`).
```
npx wrangler login
npm run deploy
```

## Notes

If you find any issues, please add it here on GitHub.

Mastodon link: [@joshuapack@gaminginthe.cloud](https://gaminginthe.cloud/@joshuapack)

## Licence
MIT.
