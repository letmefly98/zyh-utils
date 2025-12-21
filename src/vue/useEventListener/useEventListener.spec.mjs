import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useEventListener } from './useEventListener'

describe('useEventListener', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('应该监听 window 事件', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')

    const handler = vi.fn()

    // 调用 useEventListener 监听 window 的 click 事件
    useEventListener('click', handler)

    expect(addSpy).toHaveBeenCalledWith('click', handler)
  })

  it('应该监听 window 事件并带选项', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')

    const handler = vi.fn()
    const options = { passive: true }

    useEventListener('click', handler, options)

    expect(addSpy).toHaveBeenCalledWith('click', handler, options)
  })

  it('应该监听指定元素的 Ref 事件', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    const elementRef = ref(mockElement)
    const handler = vi.fn()

    const destroy = useEventListener(elementRef, 'click', handler)

    expect(mockElement.addEventListener).toHaveBeenCalledWith('click', handler)

    destroy()
    expect(mockElement.removeEventListener).toHaveBeenCalledWith('click', handler)
  })

  it('应该监听指定元素的 Ref 事件并带选项', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    const elementRef = ref(mockElement)
    const handler = vi.fn()
    const options = { once: true }

    const destroy = useEventListener(elementRef, 'click', handler, options)

    expect(mockElement.addEventListener).toHaveBeenCalledWith('click', handler, options)

    destroy()
    expect(mockElement.removeEventListener).toHaveBeenCalledWith('click', handler, options)
  })

  it('应该处理 Ref 变化的情况', async () => {
    const mockElement1 = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    const mockElement2 = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    const elementRef = ref(mockElement1)
    const handler = vi.fn()

    const destroy = useEventListener(elementRef, 'click', handler)

    // 初始元素应该被监听
    expect(mockElement1.addEventListener).toHaveBeenCalledWith('click', handler)
    expect(mockElement2.addEventListener).not.toHaveBeenCalled()

    // 更改 Ref 值
    elementRef.value = mockElement2

    // 等待下一个 tick
    await new Promise(resolve => setTimeout(resolve, 0))

    // 新元素应该被监听，旧元素应该移除监听
    expect(mockElement1.removeEventListener).toHaveBeenCalledWith('click', handler)
    expect(mockElement2.addEventListener).toHaveBeenCalledWith('click', handler)

    destroy()
    expect(mockElement2.removeEventListener).toHaveBeenCalledWith('click', handler)
  })

  it('应该处理 null 元素的情况', () => {
    const elementRef = ref(null)
    const handler = vi.fn()

    const destroy = useEventListener(elementRef, 'click', handler)

    // 不应该报错
    destroy()
  })

  it('应该处理元素变为 null 的情况', async () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    const elementRef = ref(mockElement)
    const handler = vi.fn()

    const destroy = useEventListener(elementRef, 'click', handler)

    // 初始元素应该被监听
    expect(mockElement.addEventListener).toHaveBeenCalledWith('click', handler)

    // 设置为 null
    elementRef.value = null

    // 等待下一个 tick
    await new Promise(resolve => setTimeout(resolve, 0))

    // 应该移除监听
    expect(mockElement.removeEventListener).toHaveBeenCalledWith('click', handler)

    destroy()
  })

  it('应该支持各种事件类型', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')

    const clickHandler = vi.fn()
    const keydownHandler = vi.fn()
    const scrollHandler = vi.fn()

    useEventListener('click', clickHandler)
    useEventListener('keydown', keydownHandler)
    useEventListener('scroll', scrollHandler)

    expect(addSpy).toHaveBeenNthCalledWith(1, 'click', clickHandler)
    expect(addSpy).toHaveBeenNthCalledWith(2, 'keydown', keydownHandler)
    expect(addSpy).toHaveBeenNthCalledWith(3, 'scroll', scrollHandler)
  })

  it('应该支持布尔值选项', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')

    const handler = vi.fn()

    useEventListener('click', handler, true)

    expect(addSpy).toHaveBeenCalledWith('click', handler, true)
  })

  it('应该返回清理函数对于 window 事件', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const handler = vi.fn()

    const destroy = useEventListener('click', handler)

    expect(typeof destroy).toBe('function')
    expect(addSpy).toHaveBeenCalledWith('click', handler)

    destroy()
    expect(removeSpy).toHaveBeenCalledWith('click', handler)
  })
})
