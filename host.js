// dsh-angelsanddemon-fatesumphony-skin —— Node host half
// Serves the bundled《弹丸论破：天魔命曲》skin assets without exposing
// arbitrary filesystem paths.

import { readFile } from 'node:fs/promises'

export const name = 'dsh-angelsanddemon-fatesumphony-skin'
export const inject = ['webServer']

const BASE = '/dsh-angelsanddemon-fatesumphony-skin/assets'

const ASSETS = {
  'background.jpg':       { hash: '9b11e97f04d82e8a82f05c080917eb0ebb7d52d5256d9b1183372ba302827762', type: 'image/jpeg' },
  'hero.jpg':             { hash: '825d20941ee9c08908c93d8bc24b3380a6e004b5de8f3ebcd67a0cd3f8b06c84', type: 'image/jpeg' },
  'leftbar-flush.png':    { hash: '6a9d0bd8c91d8b05f5f78b7324065511889861614cc26ac40b1ddc6c411c2504', type: 'image/png' },
  'talkingbar.png':       { hash: '5b783efc7b169875d5727e0c38bfadff91a522085e724e0678d0d882ad8475ff', type: 'image/png' },
  'talkingbar_buttom.png':{ hash: '5ee681a1fc02ba1b97d5842ce228cfeed60ffca06094721c0b32665236a98327', type: 'image/png' },
  'buttom-L.png':        { hash: '9f6ad40f98b56d11d1495b90f80fcda8744b820c02af1879010c446f3c11e0cf', type: 'image/png' },
  'buttom-M.png':        { hash: '3f9a7f101f1469086d57c8122808f01d132a91e55cf9d0699fb2dec18ef0bb4d', type: 'image/png' },
  'buttom-R.png':        { hash: 'a3ce29ed8b5c297f58e524dd9aaca9bb13f91b71b78c74b73ba4286a8a023595', type: 'image/png' },
  'talkingbar_lighter.png':{ hash: 'fc7c7bb6ff44cd3d4bad8256ed8c3b01a12907bafda8969906bf6d433ee2b853', type: 'image/png' },
  'send.png':             { hash: '11e0454b5151acc60af784511ee8f3c9c759a022ca3baa2ffd8fdfb0ccf98530', type: 'image/png' },
  'newsession.png':       { hash: 'eb61c51405b8daf8ca33dc8b6e0de7e3894d4309495fe86ea77a6709b51b8fee', type: 'image/png' },
  'selected.png':         { hash: '0e38b2e284d6067f7f9f5da07dfe1b9605d600ddae40ee1001d9ef6118bb8111', type: 'image/png' },
  'next.png':             { hash: '5c63edcfda2d4d8f131c54b6435420bf6866d6b35ec7c39772af9cb3fc27fa30', type: 'image/png' },
  'rolling.png':          { hash: 'd35a9c77834f599b842bae50735610ee1e02fd7074396cdba20a7ddb87d0dcf5', type: 'image/png' },
  'mouse.cur':            { hash: '514fc4fd81c841c0ea27ef4894f4a79768e44847a5567c6447219205d7511202', type: 'image/x-icon' },
  'mouse-small.cur':      { hash: 'ad621940735d7dbdd95f41e9931026d54fc098dfe2646ed70875aa6b2c6697c8', type: 'image/x-icon' },
}

function assetMeta(name) {
  const meta = ASSETS[name]
  if (meta === undefined) return undefined
  const dot = name.lastIndexOf('.')
  const stem = name.slice(0, dot)
  const ext = name.slice(dot + 1)
  return {
    ...meta,
    name,
    hashedName: `${stem}.${meta.hash.slice(0, 16)}.${ext}`,
    legacyName: name,
  }
}

function createAssetHandler(meta) {
  let cachedBuffer = null
  let inflightRead = null
  const etag = `"${meta.hash}"`

  function load() {
    if (cachedBuffer !== null) return Promise.resolve(cachedBuffer)
    if (inflightRead !== null) return inflightRead
    inflightRead = Promise.resolve()
      .then(() => readFile(new URL(`./assets/${meta.name}`, import.meta.url)))
      .then((buffer) => {
        cachedBuffer = buffer
        inflightRead = null
        return buffer
      }, (error) => {
        inflightRead = null
        throw error
      })
    return inflightRead
  }

  return async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { allow: 'GET, HEAD' })
      res.end()
      return
    }
    try {
      const cached = await load()
      const raw = req && (req.url || req.path) ? String(req.url || req.path) : ''
      const pathname = raw.split('?')[0]
      const immutable = pathname.includes(`.${meta.hash.slice(0, 16)}.`)
      const headers = {
        'content-type': meta.type,
        'cache-control': immutable
          ? 'public, max-age=31536000, immutable'
          : 'no-cache, max-age=0, must-revalidate',
        'etag': etag,
        'content-length': String(cached.byteLength),
      }
      const match = req.headers && (req.headers['if-none-match'] || req.headers['If-None-Match'])
      if (match === etag) {
        res.writeHead(304, headers)
        res.end()
        return
      }
      res.writeHead(200, headers)
      res.end(req.method === 'HEAD' ? undefined : cached)
    } catch (_error) {
      cachedBuffer = null
      inflightRead = null
      res.writeHead(404)
      res.end()
    }
  }
}

export function apply(ctx) {
  const disposers = []
  for (const meta of Object.keys(ASSETS).map(assetMeta)) {
    const handler = createAssetHandler(meta)
    for (const route of [`${BASE}/${meta.hashedName}`, `${BASE}/${meta.legacyName}`]) {
      disposers.push(ctx.webServer.register({
        kind: 'exact',
        path: route,
        handler,
      }))
    }
  }
  ctx.effect(() => () => {
    for (const dispose of disposers) dispose()
  })
}
