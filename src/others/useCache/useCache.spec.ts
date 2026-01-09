import { assertType, describe, expect, it, vi } from 'vitest'
import { useCache } from './useCache'

describe('useCache', () => {
  // 测试基本缓存功能
  it('应该正确缓存函数结果', () => {
    let counter = 0
    const mockFn = vi.fn(() => ++counter)
    const cachedFn = useCache(mockFn)

    // 多次调用应该返回相同结果
    expect(cachedFn()).toBe(1)
    expect(cachedFn()).toBe(1)
    expect(cachedFn()).toBe(1)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  // 测试有参数函数
  it('应该正确处理有参数函数', () => {
    const mockFn = vi.fn((x: number) => x * 2)
    const cachedFn = useCache(mockFn)

    // 第一次调用
    const result1 = cachedFn(5)
    expect(result1).toBe(10)
    expect(mockFn).toHaveBeenCalledTimes(1)

    // 第二次调用相同参数，应该返回缓存
    const result2 = cachedFn(5)
    expect(result2).toBe(10)
    expect(mockFn).toHaveBeenCalledTimes(1) // 不应该再次调用

    // 不同参数应该重新调用
    const result3 = cachedFn(3)
    expect(result3).toBe(6)
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  // 测试多参数函数
  it('应该正确处理多参数函数', () => {
    const mockFn = vi.fn((a: number, b: number, c: number) => a + b + c)
    const cachedFn = useCache(mockFn)

    // 相同参数应该使用缓存
    expect(cachedFn(1, 2, 3)).toBe(6)
    expect(cachedFn(1, 2, 3)).toBe(6)
    expect(mockFn).toHaveBeenCalledTimes(1)

    // 不同参数应该重新计算
    expect(cachedFn(1, 2, 4)).toBe(7)
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  // 测试复杂对象参数
  it('应该正确处理复杂对象参数', () => {
    interface Config {
      name: string
      version: string
      extra?: { debug: boolean }
    }

    const mockFn = vi.fn((config: Config) => `${config.name}-${config.version}`)
    const cachedFn = useCache(mockFn, (config: Config) => `${config.name}@${config.version}`)

    const config1: Config = { name: 'app', version: '1.0.0', extra: { debug: true } }
    const config2: Config = { name: 'app', version: '1.0.0', extra: { debug: false } }

    expect(cachedFn(config1)).toBe('app-1.0.0')
    expect(cachedFn(config2)).toBe('app-1.0.0') // 使用缓存
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  // 测试返回不同类型的值
  it('应该正确缓存不同类型的返回值', () => {
    // 返回对象
    interface DataItem {
      id: number
      data: string
    }

    const mockFn1 = vi.fn((id: number): DataItem => ({ id, data: `data-${id}` }))
    const cachedFn1 = useCache(mockFn1)

    const result1 = cachedFn1(1)
    const result2 = cachedFn1(1)
    expect(result1).toBe(result2) // 应该是同一个对象引用
    expect(mockFn1).toHaveBeenCalledTimes(1)

    // 返回数组
    const mockFn2 = vi.fn((size: number): number[] => Array.from({ length: size }).fill(0) as number[])
    const cachedFn2 = useCache(mockFn2)

    const arr1 = cachedFn2(3)
    const arr2 = cachedFn2(3)
    expect(arr1).toBe(arr2) // 应该是同一个数组引用
    expect(mockFn2).toHaveBeenCalledTimes(1)
  })

  // 测试 undefined 和 null 返回值
  it('应该正确缓存 undefined 和 null 值', () => {
    const mockFn1 = vi.fn((): undefined => undefined)
    const cachedFn1 = useCache(mockFn1)

    expect(cachedFn1()).toBeUndefined()
    expect(cachedFn1()).toBeUndefined()
    expect(mockFn1).toHaveBeenCalledTimes(1)

    const mockFn2 = vi.fn((): null => null)
    const cachedFn2 = useCache(mockFn2)

    expect(cachedFn2()).toBeNull()
    expect(cachedFn2()).toBeNull()
    expect(mockFn2).toHaveBeenCalledTimes(1)
  })

  // 测试异常情况
  it('应该正确处理函数抛出异常的情况', () => {
    const mockFn = vi.fn((shouldThrow: boolean): string => {
      if (shouldThrow) {
        throw new Error('Test error')
      }
      return 'success'
    })
    const cachedFn = useCache(mockFn)

    // 正常情况
    expect(cachedFn(false)).toBe('success')
    expect(cachedFn(false)).toBe('success') // 使用缓存
    expect(mockFn).toHaveBeenCalledTimes(1)

    // 异常情况 - 异常不会被缓存，每次都重新抛出
    expect(() => cachedFn(true)).toThrow('Test error')
    expect(mockFn).toHaveBeenCalledTimes(2)

    // 再次调用相同参数，异常不会被缓存，会再次调用
    expect(() => cachedFn(true)).toThrow('Test error')
    expect(mockFn).toHaveBeenCalledTimes(3) // 会再次调用，因为异常没有被缓存
  })

  // 测试边界情况：特殊参数值
  it('应该正确处理特殊参数值', () => {
    const mockFn = vi.fn((value: unknown) => String(value))
    const cachedFn = useCache(mockFn)

    // 测试各种特殊值
    expect(cachedFn(0)).toBe('0')
    expect(cachedFn(0)).toBe('0') // 缓存

    expect(cachedFn('')).toBe('')
    expect(cachedFn('')).toBe('') // 缓存

    expect(cachedFn(false)).toBe('false')
    expect(cachedFn(false)).toBe('false') // 缓存

    expect(cachedFn(null)).toBe('null')
    expect(cachedFn(null)).toBe('null') // 缓存

    expect(cachedFn(undefined)).toBe('undefined')
    expect(cachedFn(undefined)).toBe('undefined') // 缓存

    // 每个不同的值都应该只调用一次
    expect(mockFn).toHaveBeenCalledTimes(5)

    // 验证自定义序列化正确处理了 null 和 undefined
    // 现在 null 和 undefined 会产生不同的缓存键
  })

  // 测试类型推断
  it('应该正确推断函数类型', () => {
    // 测试基本函数类型推断
    const stringFn = (x: number): string => String(x)
    const cachedStringFn = useCache(stringFn)

    // 使用 assertType 检查类型推断
    assertType<(x: number) => string>(cachedStringFn)
    // 测试错误的类型断言（应该会在 TypeScript 编译时报错）
    // assertType<(x: string) => number>(cachedStringFn)

    const result = cachedStringFn(42)
    assertType<string>(result)
    expect(result).toBe('42')

    // 测试泛型函数类型推断
    const genericFn = <T>(value: T): T[] => [value]
    const cachedGenericFn = useCache(genericFn)

    // 检查泛型函数类型是否正确保持
    assertType<typeof genericFn>(cachedGenericFn)

    const numberArray = cachedGenericFn(123)
    const stringArray = cachedGenericFn('hello')

    // 检查返回值类型
    assertType<number[]>(numberArray)
    assertType<string[]>(stringArray)

    expect(numberArray).toEqual([123])
    expect(stringArray).toEqual(['hello'])

    // 测试复杂函数签名
    const complexFn = (a: number, b: string, c?: boolean): { a: number, b: string, c?: boolean } => ({ a, b, c })
    const cachedComplexFn = useCache(complexFn)

    // 检查复杂函数类型是否正确保持
    assertType<typeof complexFn>(cachedComplexFn)

    const complexResult = cachedComplexFn(1, 'test', true)
    assertType<{ a: number, b: string, c?: boolean }>(complexResult)
    expect(complexResult).toEqual({ a: 1, b: 'test', c: true })
  })

  // 测试自定义 getKey 函数的类型安全
  it('应该确保 getKey 函数类型安全', () => {
    interface User {
      id: number
      name: string
      email: string
    }

    const getUserInfo = vi.fn((user: User) => `${user.name} <${user.email}>`)

    // getKey 函数必须接受与原函数相同的参数
    const cachedGetUserInfo = useCache(
      getUserInfo,
      (user: User) => `user:${user.id}`, // 只根据 id 缓存
    )

    const user1: User = { id: 1, name: 'Alice', email: 'alice@example.com' }
    const user2: User = { id: 1, name: 'Alice Updated', email: 'alice.new@example.com' }

    const result1 = cachedGetUserInfo(user1)
    const result2 = cachedGetUserInfo(user2)

    // 检查返回值类型
    assertType<string>(result1)
    assertType<string>(result2)

    expect(result1).toBe('Alice <alice@example.com>')
    expect(result2).toBe('Alice <alice@example.com>') // 使用缓存，因为 id 相同
    expect(getUserInfo).toHaveBeenCalledTimes(1)

    // 测试 getKey 函数的类型约束
    const numericFn = (x: number, y: number) => x + y
    const cachedNumericFn = useCache(
      numericFn,
      (x: number, y: number) => `${x}-${y}`,
    )

    assertType<(x: number, y: number) => number>(cachedNumericFn)

    const numResult = cachedNumericFn(1, 2)
    assertType<number>(numResult)
    expect(numResult).toBe(3)
  })
})
