import Hex from 'crypto-js/enc-hex.js'
import HMAC_SHA256 from 'crypto-js/hmac-sha256.js'
import SHA256 from 'crypto-js/sha256.js'
import dayjs from 'dayjs'
import { pick } from 'lodash-es'

const SecretId = 'your secret id'
const SecretKey = 'your secret key'

/**
 * 生成腾讯云 API 请求带授权数据的 headers
 *
 * @param {string} Service 服务名称，比如 cls
 * @param {string} Action 接口名称，比如 SearchLog
 * @param {number} date 时间戳，一般为 Date.now()
 * @param {object} params 接口入参
 * @param {object} [customHeader] 其他请求 headers
 * @returns {object} 加密后的请求 headers
 */
export function getTencentCloudApiAuthorizationHeaders(Service, Action, date, params, customHeader) {
  const Day = dayjs(date).format('YYYY-MM-DD')
  const Timestamp = date.toString().slice(0, -3)
  const Algorithm = 'TC3-HMAC-SHA256'
  const RequestPayload = JSON.stringify(params)

  const headers = {
    'Content-Type': 'application/json',
    'Host': getTencentCloudHost(Service),
    'X-TC-Action': Action,
    'X-TC-Timestamp': Timestamp,
    'X-TC-Version': '2020-10-16',
    'X-TC-Region': 'ap-beijing',
    'X-TC-Language': 'zh-CN',
    'Authorization': '',
    ...customHeader,
  }

  const tmp = pick(headers, ['Content-Type', 'Host', 'X-TC-Action'])
  const SignedHeaders = Object.keys(tmp).join(';').toLowerCase()
  const CanonicalHeaders = Object.keys(tmp)
    .reduce((re, k) => [...re, `${k}:${tmp[k]}`.toLowerCase()], [])
    .concat([''])
  const HashedRequestPayload = Lowercase(HexEncode(SHA256(RequestPayload)))
  const CanonicalRequest = [
    'POST', // HTTPRequestMethod
    '/', // CanonicalURI
    '', // CanonicalQueryString
    ...CanonicalHeaders,
    SignedHeaders, // SignedHeaders
    HashedRequestPayload, // HashedRequestPayload Lowercase(HexEncode(Hash.SHA256(RequestPayload)))
  ]

  const CredentialScope = `${Day}/${Service}/tc3_request`
  const HashedCanonicalRequest = Lowercase(HexEncode(SHA256(CanonicalRequest.join('\n'))))
  const StringToSign = [
    Algorithm, // Algorithm
    Timestamp, // RequestTimestamp
    CredentialScope, // CredentialScope
    HashedCanonicalRequest, // HashedCanonicalRequest Lowercase(HexEncode(Hash.SHA256(CanonicalRequest)))
  ]

  const SecretDate = HMAC_SHA256(Day, `TC3${SecretKey}`)
  const SecretService = HMAC_SHA256(Service, SecretDate)
  const SecretSigning = HMAC_SHA256('tc3_request', SecretService)
  const Signature = HMAC_SHA256(StringToSign.join('\n'), SecretSigning).toString(Hex)
  const Authorization = `${Algorithm} Credential=${SecretId}/${CredentialScope}, SignedHeaders=${SignedHeaders}, Signature=${Signature}`

  headers.Authorization = Authorization

  return headers
}

/**
 * SHA256 加密
 * @param {string} str 待加密的字符串
 * @returns 加密后字符串
 */
function HexEncode(str) {
  return Hex.stringify(str)
}

/**
 * 转小写
 * @param {string} str 待转小写的字符串
 * @returns 小写字符串
 */
function Lowercase(str) {
  return str.toLowerCase()
}

/**
 * 获取腾讯云API请求域名
 *
 * @param {string} Service 服务名，比如 cls
 * @returns 腾讯云API请求域名
 */
export function getTencentCloudHost(Service) {
  return `${Service}.internal.tencentcloudapi.com`
}
