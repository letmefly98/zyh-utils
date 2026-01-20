import { mount } from '@vue/test-utils'
import { ElButton } from 'element-plus'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import LoadingButton from './loading-button.vue'

function expectLoading(button: any, toBe = true) {
  if (toBe) {
    expect(button.attributes('class')).toContain('is-loading')
  } else {
    expect(button.attributes('class')).not.toContain('is-loading')
  }
}

describe('loading-button.vue', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确渲染组件，且正确传递 props 给 ElButton', async () => {
    wrapper = mount(LoadingButton, {
      props: {
        type: 'primary',
        size: 'large',
        disabled: true,
        plain: true,
      },
      attrs: {
        'data-testid': 'test-button',
      },
      slots: {
        default: '点击按钮',
      },
    })

    await nextTick()

    const button = wrapper.findComponent(ElButton)
    expect(button.exists()).toBe(true)
    expect(button.attributes('class')).toContain('el-button--primary')
    expect(button.attributes('class')).toContain('el-button--large')
    expect(button.attributes('class')).toContain('is-disabled')
    expect(button.attributes('class')).toContain('is-plain')
    expect(button.attributes('data-testid')).toBe('test-button')
    expect(button.text()).toBe('点击按钮')
  })

  it('应该正确处理同步点击事件', async () => {
    const onClick = vi.fn()
    wrapper = mount(LoadingButton, {
      attrs: {
        onClick,
      },
      slots: {
        default: '测试按钮',
      },
    })

    const button = wrapper.findComponent(ElButton)

    expectLoading(button, false)

    button.trigger('click')

    expect(onClick).toHaveBeenCalledTimes(1)
    expectLoading(button, false)
  })

  it('应该正确处理异步点击事件', async () => {
    const mockAsyncFn = vi.fn().mockResolvedValue('success')
    wrapper = mount(LoadingButton, {
      attrs: {
        onClick: mockAsyncFn,
      },
      slots: {
        default: '异步按钮',
      },
    })

    const button = wrapper.findComponent(ElButton)

    // 点击前loading状态为false
    expectLoading(button, false)

    const clickPromise = button.trigger('click')

    // 点击后loading状态应该变为true
    await nextTick()
    expectLoading(button, true)

    // 等待异步操作完成
    await clickPromise

    // 完成后loading状态应该恢复为false
    await nextTick()
    expectLoading(button, false)
    expect(mockAsyncFn).toHaveBeenCalledTimes(1)
  })

  it('应该正确处理loading状态的显示', async () => {
    vi.useFakeTimers()
    const mockAsyncFn = vi.fn().mockImplementation(() => {
      return new Promise(resolve => setTimeout(resolve, 100))
    })

    wrapper = mount(LoadingButton, {
      attrs: {
        onClick: mockAsyncFn,
      },
      slots: {
        default: '加载按钮',
      },
    })

    await nextTick()
    const button = wrapper.findComponent(ElButton)
    expectLoading(button, false)

    // 点击按钮
    const clickPromise = button.trigger('click')

    // 检查loading状态
    await nextTick()
    expectLoading(button, true)

    // 快进时间
    vi.advanceTimersByTime(100)
    await clickPromise

    await nextTick()
    expectLoading(button, false)

    vi.useRealTimers()
  })

  it('应该正确处理异步点击事件中的错误', async () => {
    const mockErrorFn = vi.fn().mockRejectedValue(new Error('Test error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    wrapper = mount(LoadingButton, {
      attrs: {
        onClick: mockErrorFn,
      },
      slots: {
        default: '错误按钮',
      },
    })

    await nextTick()

    const button = wrapper.findComponent(ElButton)

    // 使用expect来处理Promise rejection，但不让它抛出未处理的错误
    try {
      await button.trigger('click')
    } finally {
      // 忽略错误
    }

    // 即使发生错误，loading状态也应该恢复为false
    await nextTick()
    expectLoading(button, false)
    expect(mockErrorFn).toHaveBeenCalledTimes(1)

    consoleSpy.mockRestore()
  })

  it('应该在没有onClick处理器时正常工作', async () => {
    wrapper = mount(LoadingButton, {
      slots: {
        default: '无处理器按钮',
      },
    })

    await nextTick()

    const button = wrapper.findComponent(ElButton)
    await button.trigger('click')

    expectLoading(button, false)
  })

  it('应该正确处理非函数类型的onClick属性', async () => {
    wrapper = mount(LoadingButton, {
      attrs: {
        onClick: 'not-a-function',
      },
      slots: {
        default: '无效处理器按钮',
      },
    })

    await nextTick()

    const button = wrapper.findComponent(ElButton)
    await button.trigger('click')

    expectLoading(button, false)
  })

  it('应该暴露ElButton的实例方法', async () => {
    // 比如 loading-button 的实例其实为 el-button 的实例
    // 而 el-button 的实例上存在 ref 值为 按钮 html 元素
    wrapper = mount(LoadingButton, { slots: { default: '测试按钮' } })
    await nextTick()
    expect(wrapper.vm.ref instanceof HTMLButtonElement).toBeTruthy()
  })
})
