import { describe, expect, it } from 'vitest'
import { svg2base64 } from './svg2base64.mjs'

describe('svg2base64', () => {
  it('normal case', () => {
    const svgStr = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="red" /></svg>'
    const base64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzNiIgZmlsbD0icmVkIiAvPjwvc3ZnPg=='
    expect(svg2base64(svgStr)).toBe(base64)
  })
})
