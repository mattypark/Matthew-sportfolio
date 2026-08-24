// Loading the product, shared by the download route and the purchase webhook.
// (Underscore prefix: Vercel treats this as a helper module, not a route.)
//
// This repo is public, so the .cube is gitignored and production reads it from
// LUT_FILE_URL — an unlisted direct-download link. The local private/ path is
// the fallback for `vercel dev`.

import { readFile } from 'node:fs/promises'
import path from 'node:path'

const LOCAL_FILE = path.join(process.cwd(), 'private', 'matthew-lut.cube')

// Matches the product name on the Stripe checkout, so the file a buyer saves
// is recognisably the thing they paid for.
export const DOWNLOAD_NAME = 'Matthews-Cinematic-LUT.cube'

// A .cube is plain text and opens with a directive or a comment. Google Drive
// will happily answer a download URL with an HTML consent or quota page and a
// 200, and passing that off as the product would hand a buyer a file that
// silently does nothing in Premiere. Better to fail here and say why.
export function assertLooksLikeCube(buffer) {
  const head = buffer.subarray(0, 200).toString('utf8').trimStart()
  if (/^(TITLE|LUT_3D_SIZE|LUT_1D_SIZE|DOMAIN_(MIN|MAX)|#)/i.test(head)) return
  throw new Error(`source did not return a .cube (starts with ${JSON.stringify(head.slice(0, 60))})`)
}

export async function loadLut() {
  if (process.env.LUT_FILE_URL) {
    const upstream = await fetch(process.env.LUT_FILE_URL)
    if (!upstream.ok) throw new Error(`lut source responded ${upstream.status}`)
    const buffer = Buffer.from(await upstream.arrayBuffer())
    assertLooksLikeCube(buffer)
    return buffer
  }
  return readFile(LOCAL_FILE)
}
