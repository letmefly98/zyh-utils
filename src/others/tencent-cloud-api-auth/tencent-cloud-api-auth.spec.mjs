import { describe, expect, it } from 'vitest'
import { getTencentCloudApiAuthorizationHeaders } from './tencent-cloud-api-auth.mjs'

describe('tencent-cloud-api-auth', () => {
  it('normal case', () => {
    const time = 1744771301879
    expect(
      getTencentCloudApiAuthorizationHeaders('cls', 'SearchLog', time, {
        From: 1744214400000,
        To: 1744771301879,
        Query: '',
        TopicId: '16ac9630-673d-43bf-9e40-bcb16dd90fc7',
        Limit: 1,
        Offset: 0,
      }),
    ).toEqual({
      'Authorization':
        'TC3-HMAC-SHA256 Credential=your secret id/2025-04-16/cls/tc3_request, SignedHeaders=content-type;host;x-tc-action, Signature=b5f267be6f2fe6b3423df321658d2ed39d24cf9b5a72db1b2f1b04c2ce68e09b',
      'Content-Type': 'application/json',
      'Host': `cls.internal.tencentcloudapi.com`,
      'X-TC-Action': 'SearchLog',
      'X-TC-Language': 'zh-CN',
      'X-TC-Region': 'ap-beijing',
      'X-TC-Timestamp': '1744771301',
      'X-TC-Version': '2020-10-16',
    })
  })
})
