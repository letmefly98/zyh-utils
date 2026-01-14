import { describe, expect, it } from 'vitest'
import { arrayJoin } from './arrayJoin'

describe('arrayJoin', () => {
  it('normal case with string key', () => {
    const arr = [{ name: 'a' }, { name: 'b' }, { name: 'c' }]
    expect(arrayJoin(arr, 'name')).toBe('a,b,c')

    const users = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(arrayJoin(users, 'id')).toBe('1,2,3')
  })

  it('normal case with function key', () => {
    const arr = [{ user: { name: 'a' } }, { user: { name: 'b' } }, { user: { name: 'c' } }]
    expect(arrayJoin(arr, item => item.user?.name)).toBe('a,b,c')

    const users = [{ profile: { id: 1 } }, { profile: { id: 2 } }, { profile: { id: 3 } }]
    expect(arrayJoin(users, item => item.profile.id.toString())).toBe('1,2,3')

    const numbers = [1, 2, 3, 4, 5]
    expect(arrayJoin(numbers, item => item % 2 === 0 ? item.toString() : undefined)).toBe('2,4')
  })

  it('normal case without key', () => {
    expect(arrayJoin(['a', 'b', 'c'])).toBe('a,b,c')
    expect(arrayJoin([1, 2, 3])).toBe('1,2,3')

    // 使用 undefined 作为 key，传入自定义分隔符
    expect(arrayJoin(['a', 'b', 'c'], undefined, '-')).toBe('a-b-c')
    expect(arrayJoin([1, 2, 3], undefined, ' | ')).toBe('1 | 2 | 3')
  })

  it('custom separator', () => {
    const arr = [{ name: 'a' }, { name: 'b' }, { name: 'c' }]
    expect(arrayJoin(arr, 'name', '-')).toBe('a-b-c')
    expect(arrayJoin(arr, 'name', ' | ')).toBe('a | b | c')

    expect(arrayJoin(['x', 'y', 'z'], undefined, '/')).toBe('x/y/z')

    expect(arrayJoin(arr, item => item.name, ' -> ')).toBe('a -> b -> c')
  })

  it('filter undefined, null, NaN, boolean and empty string values', () => {
    const arr = [{ name: 'a' }, { name: undefined }, { name: 'c' }, { name: null }]
    expect(arrayJoin(arr, 'name')).toBe('a,c')

    expect(arrayJoin(['a', undefined, 'c', null, Number.NaN])).toBe('a,c')

    // boolean 值和空字符串会被过滤，0 不会被过滤
    expect(arrayJoin(['a', '', 'c', 0, false, true])).toBe('a,c,0')

    const withNaN = [{ value: 1 }, { value: Number.NaN }, { value: 3 }]
    expect(arrayJoin(withNaN, 'value')).toBe('1,3')

    // 测试空字符串过滤
    const withEmptyString = [{ text: 'hello' }, { text: '' }, { text: 'world' }, { text: '   ' }]
    expect(arrayJoin(withEmptyString, 'text')).toBe('hello,world')
  })

  it('function key returning undefined', () => {
    const arr = [{ age: 20 }, { age: 15 }, { age: 30 }, { age: 12 }]
    expect(arrayJoin(arr, item => item.age >= 18 ? item.age.toString() : undefined)).toBe('20,30')

    const mixed = [{ type: 'user', name: 'Alice' }, { type: 'admin', name: 'Bob' }, { type: 'guest' }]
    expect(arrayJoin(mixed, item => item.type === 'user' ? item.name : undefined)).toBe('Alice')
  })

  it('empty array', () => {
    expect(arrayJoin([])).toBe('')

    // 为空数组指定类型以避免类型推断问题
    expect(arrayJoin([], 'name')).toBe('')
    expect(arrayJoin([], item => (item as any).name)).toBe('')
  })

  it('missing key in objects', () => {
    const arr = [{ name: 'a' }, { age: 20 }, { name: 'c' }]
    expect(arrayJoin(arr, 'name')).toBe('a,c')

    const mixed = [{ id: 1 }, {}, { id: 3 }]
    expect(arrayJoin(mixed, 'id')).toBe('1,3')
  })

  it('function key with complex logic', () => {
    const products = [
      { name: 'Apple', price: 1.5, category: 'fruit' },
      { name: 'Banana', price: 0.8, category: 'fruit' },
      { name: 'Carrot', price: 2.0, category: 'vegetable' },
      { name: 'Broccoli', price: 3.0, category: 'vegetable' },
    ]

    const format = (item: any) => item.category === 'fruit' ? `${item.name}($${item.price})` : undefined
    expect(arrayJoin(products, format)).toBe('Apple($1.5),Banana($0.8)')
  })

  it('nested path support with lodash get', () => {
    const users = [
      { profile: { name: 'Alice', settings: { theme: 'dark' } } },
      { profile: { name: 'Bob', settings: { theme: 'light' } } },
      { profile: { settings: { theme: 'auto' } } }, // 缺少 name
      { profile: { name: 'Charlie' } }, // 缺少 settings.theme
    ]

    // 测试嵌套路径
    expect(arrayJoin(users, 'profile.name')).toBe('Alice,Bob,Charlie')
    expect(arrayJoin(users, 'profile.settings.theme')).toBe('dark,light,auto')

    // 测试深层嵌套
    const data = [
      { a: { b: { c: { d: 'value1' } } } },
      { a: { b: { c: { d: 'value2' } } } },
      { a: { b: {} } }, // 缺少 c.d
    ]
    expect(arrayJoin(data, 'a.b.c.d')).toBe('value1,value2')
  })
})
