import type { Props } from './StateMachine'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StateMachine } from './StateMachine'

describe('state machine', () => {
  describe('测试 Socket 连接状态机', () => {
    // Socket 连接状态枚举
    enum SocketState {
      DISCONNECTED = 'disconnected',
      CONNECTING = 'connecting',
      CONNECTED = 'connected',
      ERROR = 'error',
    }

    // Socket 事件枚举
    enum SocketEvent {
      CONNECT = 'connect',
      CONNECTED = 'connected',
      DISCONNECT = 'disconnect',
      ERROR = 'error',
    }

    let socketStateMachine: StateMachine<SocketState, SocketEvent>
    let mockEventHandlers: {
      [SocketEvent.CONNECT]: ReturnType<typeof vi.fn>
      [SocketEvent.CONNECTED]: ReturnType<typeof vi.fn>
      [SocketEvent.DISCONNECT]: ReturnType<typeof vi.fn>
      [SocketEvent.ERROR]: ReturnType<typeof vi.fn>
    }

    beforeEach(() => {
    // 创建模拟事件处理器
      mockEventHandlers = {
        [SocketEvent.CONNECT]: vi.fn(),
        [SocketEvent.CONNECTED]: vi.fn(),
        [SocketEvent.DISCONNECT]: vi.fn(),
        [SocketEvent.ERROR]: vi.fn(),
      }

      // Socket 连接状态机配置
      const socketConfig: Props<SocketState, SocketEvent> = {
        initialState: SocketState.DISCONNECTED,
        states: {
          [SocketState.DISCONNECTED]: [
            { to: SocketState.CONNECTING, event: SocketEvent.CONNECT },
          ],
          [SocketState.CONNECTING]: [
            { to: SocketState.CONNECTED, event: SocketEvent.CONNECTED },
            { to: SocketState.ERROR, event: SocketEvent.ERROR },
          ],
          [SocketState.CONNECTED]: [
            { to: SocketState.DISCONNECTED, event: SocketEvent.DISCONNECT },
            { to: SocketState.ERROR, event: SocketEvent.ERROR },
          ],
          [SocketState.ERROR]: [
            { to: SocketState.CONNECTING, event: SocketEvent.CONNECT },
          ],
        },
        events: mockEventHandlers,
      }

      socketStateMachine = new StateMachine(socketConfig)
    })

    describe('初始化', () => {
      it('应该设置正确的初始状态', () => {
        expect(socketStateMachine.getCurrentState()).toBe(SocketState.DISCONNECTED)
      })
    })

    describe('状态转换', () => {
      it('应该能从断开连接状态开始连接', async () => {
        const result = await socketStateMachine.trigger(SocketEvent.CONNECT)

        expect(result).toBe(true)
        expect(socketStateMachine.getCurrentState()).toBe(SocketState.CONNECTING)
        expect(mockEventHandlers[SocketEvent.CONNECT]).toHaveBeenCalledTimes(1)
      })

      it('应该能完成完整的连接流程', async () => {
      // 开始连接
        await socketStateMachine.trigger(SocketEvent.CONNECT)
        expect(socketStateMachine.getCurrentState()).toBe(SocketState.CONNECTING)

        // 连接成功
        await socketStateMachine.trigger(SocketEvent.CONNECTED)
        expect(socketStateMachine.getCurrentState()).toBe(SocketState.CONNECTED)
        expect(mockEventHandlers[SocketEvent.CONNECTED]).toHaveBeenCalledTimes(1)
      })

      it('应该能处理连接错误', async () => {
      // 开始连接
        await socketStateMachine.trigger(SocketEvent.CONNECT)

        // 连接出错
        await socketStateMachine.trigger(SocketEvent.ERROR)
        expect(socketStateMachine.getCurrentState()).toBe(SocketState.ERROR)
        expect(mockEventHandlers[SocketEvent.ERROR]).toHaveBeenCalledTimes(1)
      })

      it('应该能从错误状态重新连接', async () => {
      // 先到错误状态
        await socketStateMachine.trigger(SocketEvent.CONNECT)
        await socketStateMachine.trigger(SocketEvent.ERROR)

        // 从错误状态重新连接
        await socketStateMachine.trigger(SocketEvent.CONNECT)
        expect(socketStateMachine.getCurrentState()).toBe(SocketState.CONNECTING)
        expect(mockEventHandlers[SocketEvent.CONNECT]).toHaveBeenCalledTimes(2)
      })

      it('应该拒绝无效的状态转换', async () => {
      // 尝试在断开连接状态直接触发已连接事件
        const result = await socketStateMachine.trigger(SocketEvent.CONNECTED)

        expect(result).toBe(false)
        expect(socketStateMachine.getCurrentState()).toBe(SocketState.DISCONNECTED)
        expect(mockEventHandlers[SocketEvent.CONNECTED]).not.toHaveBeenCalled()
      })
    })

    describe('查询方法', () => {
      it('应该能检查是否可以触发某个事件', () => {
        expect(socketStateMachine.canTrigger(SocketEvent.CONNECT)).toBe(true)
        expect(socketStateMachine.canTrigger(SocketEvent.CONNECTED)).toBe(false)
      })

      it('应该能获取当前状态可用的事件', () => {
        const availableEvents = socketStateMachine.getAvailableEvents()
        expect(availableEvents).toEqual([SocketEvent.CONNECT])
      })

      it('应该在状态改变后更新可用事件', async () => {
        await socketStateMachine.trigger(SocketEvent.CONNECT)

        const availableEvents = socketStateMachine.getAvailableEvents()
        expect(availableEvents).toContain(SocketEvent.CONNECTED)
        expect(availableEvents).toContain(SocketEvent.ERROR)
        expect(availableEvents).not.toContain(SocketEvent.CONNECT)
      })
    })

    describe('事件监听', () => {
      it('应该能监听状态转换事件', async () => {
        const transitionListener = vi.fn()
        socketStateMachine.on('transition', transitionListener)

        await socketStateMachine.trigger(SocketEvent.CONNECT)

        expect(transitionListener).toHaveBeenCalledWith(
          SocketState.DISCONNECTED,
          SocketState.CONNECTING,
          SocketEvent.CONNECT,
        )
      })

      it('应该能移除状态转换监听器', async () => {
        const transitionListener = vi.fn()
        socketStateMachine.on('transition', transitionListener)
        socketStateMachine.off('transition', transitionListener)

        await socketStateMachine.trigger(SocketEvent.CONNECT)

        expect(transitionListener).not.toHaveBeenCalled()
      })

      it('应该能监听特定事件', async () => {
        const connectListener = vi.fn()
        const connectedListener = vi.fn()

        socketStateMachine.on(SocketEvent.CONNECT, connectListener)
        socketStateMachine.on(SocketEvent.CONNECTED, connectedListener)

        // 触发连接事件
        await socketStateMachine.trigger(SocketEvent.CONNECT)
        expect(connectListener).toHaveBeenCalledWith(
          SocketState.DISCONNECTED,
          SocketState.CONNECTING,
          SocketEvent.CONNECT,
        )
        expect(connectedListener).not.toHaveBeenCalled()

        // 触发已连接事件
        await socketStateMachine.trigger(SocketEvent.CONNECTED)
        expect(connectedListener).toHaveBeenCalledWith(
          SocketState.CONNECTING,
          SocketState.CONNECTED,
          SocketEvent.CONNECTED,
        )
        expect(connectListener).toHaveBeenCalledTimes(1) // 仍然只被调用一次
      })

      it('应该能移除特定事件监听器', async () => {
        const connectListener = vi.fn()

        socketStateMachine.on(SocketEvent.CONNECT, connectListener)
        socketStateMachine.off(SocketEvent.CONNECT, connectListener)

        await socketStateMachine.trigger(SocketEvent.CONNECT)

        expect(connectListener).not.toHaveBeenCalled()
      })

      it('应该同时触发通用监听器和特定事件监听器', async () => {
        const transitionListener = vi.fn()
        const connectListener = vi.fn()

        socketStateMachine.on('transition', transitionListener)
        socketStateMachine.on(SocketEvent.CONNECT, connectListener)

        await socketStateMachine.trigger(SocketEvent.CONNECT)

        // 两个监听器都应该被调用
        expect(transitionListener).toHaveBeenCalledWith(
          SocketState.DISCONNECTED,
          SocketState.CONNECTING,
          SocketEvent.CONNECT,
        )
        expect(connectListener).toHaveBeenCalledWith(
          SocketState.DISCONNECTED,
          SocketState.CONNECTING,
          SocketEvent.CONNECT,
        )
      })

      it('应该支持多个相同事件的监听器', async () => {
        const connectListener1 = vi.fn()
        const connectListener2 = vi.fn()

        socketStateMachine.on(SocketEvent.CONNECT, connectListener1)
        socketStateMachine.on(SocketEvent.CONNECT, connectListener2)

        await socketStateMachine.trigger(SocketEvent.CONNECT)

        expect(connectListener1).toHaveBeenCalledTimes(1)
        expect(connectListener2).toHaveBeenCalledTimes(1)
      })

      it('应该支持首字母大写的事件监听器', async () => {
        const onConnectListener = vi.fn()
        const onConnectedListener = vi.fn()

        socketStateMachine.on('onConnect', onConnectListener)
        socketStateMachine.on('onConnected', onConnectedListener)

        // 触发连接事件
        await socketStateMachine.trigger(SocketEvent.CONNECT)
        expect(onConnectListener).toHaveBeenCalledWith(
          SocketState.DISCONNECTED,
          SocketState.CONNECTING,
          SocketEvent.CONNECT,
        )
        expect(onConnectedListener).not.toHaveBeenCalled()

        // 触发已连接事件
        await socketStateMachine.trigger(SocketEvent.CONNECTED)
        expect(onConnectedListener).toHaveBeenCalledWith(
          SocketState.CONNECTING,
          SocketState.CONNECTED,
          SocketEvent.CONNECTED,
        )
        expect(onConnectListener).toHaveBeenCalledTimes(1) // 仍然只被调用一次
      })

      it('应该能移除首字母大写的事件监听器', async () => {
        const onConnectListener = vi.fn()

        socketStateMachine.on('onConnect', onConnectListener)
        socketStateMachine.off('onConnect', onConnectListener)

        await socketStateMachine.trigger(SocketEvent.CONNECT)

        expect(onConnectListener).not.toHaveBeenCalled()
      })

      it('应该同时触发所有类型的监听器', async () => {
        const transitionListener = vi.fn()
        const connectListener = vi.fn()
        const onConnectListener = vi.fn()

        socketStateMachine.on('transition', transitionListener)
        socketStateMachine.on(SocketEvent.CONNECT, connectListener)
        socketStateMachine.on('onConnect', onConnectListener)

        await socketStateMachine.trigger(SocketEvent.CONNECT)

        // 三个监听器都应该被调用
        expect(transitionListener).toHaveBeenCalledWith(
          SocketState.DISCONNECTED,
          SocketState.CONNECTING,
          SocketEvent.CONNECT,
        )
        expect(connectListener).toHaveBeenCalledWith(
          SocketState.DISCONNECTED,
          SocketState.CONNECTING,
          SocketEvent.CONNECT,
        )
        expect(onConnectListener).toHaveBeenCalledWith(
          SocketState.DISCONNECTED,
          SocketState.CONNECTING,
          SocketEvent.CONNECT,
        )
      })
    })

    describe('重置功能', () => {
      it('应该能重置到指定状态', async () => {
      // 先改变状态
        await socketStateMachine.trigger(SocketEvent.CONNECT)
        expect(socketStateMachine.getCurrentState()).toBe(SocketState.CONNECTING)

        // 重置状态
        socketStateMachine.reset(SocketState.DISCONNECTED)
        expect(socketStateMachine.getCurrentState()).toBe(SocketState.DISCONNECTED)
      })
    })

    describe('异步事件处理器', () => {
      it('应该支持异步事件处理器', async () => {
        const asyncHandler = vi.fn().mockImplementation(() =>
          new Promise(resolve => setTimeout(resolve, 10)),
        )

        const asyncConfig: Props<SocketState, SocketEvent> = {
          initialState: SocketState.DISCONNECTED,
          states: {
            [SocketState.DISCONNECTED]: [
              { to: SocketState.CONNECTING, event: SocketEvent.CONNECT },
            ],
            [SocketState.CONNECTING]: [],
            [SocketState.CONNECTED]: [],
            [SocketState.ERROR]: [],
          },
          events: {
            [SocketEvent.CONNECT]: asyncHandler,
            [SocketEvent.CONNECTED]: vi.fn(),
            [SocketEvent.DISCONNECT]: vi.fn(),
            [SocketEvent.ERROR]: vi.fn(),
          },
        }

        const asyncMachine = new StateMachine(asyncConfig)

        await asyncMachine.trigger(SocketEvent.CONNECT)

        expect(asyncHandler).toHaveBeenCalledTimes(1)
        expect(asyncMachine.getCurrentState()).toBe(SocketState.CONNECTING)
      })
    })

    describe('复杂场景测试', () => {
      it('应该能处理完整的 socket 生命周期', async () => {
        const transitionHistory: Array<{ from: SocketState, to: SocketState, event: SocketEvent }> = []

        socketStateMachine.on('transition', (from, to, event) => {
          transitionHistory.push({ from, to, event })
        })

        // 完整的生命周期：连接 -> 成功 -> 断开 -> 连接 -> 错误 -> 重连
        await socketStateMachine.trigger(SocketEvent.CONNECT)
        await socketStateMachine.trigger(SocketEvent.CONNECTED)
        await socketStateMachine.trigger(SocketEvent.DISCONNECT)
        await socketStateMachine.trigger(SocketEvent.CONNECT)
        await socketStateMachine.trigger(SocketEvent.ERROR)
        await socketStateMachine.trigger(SocketEvent.CONNECT)

        expect(transitionHistory).toHaveLength(6)
        expect(socketStateMachine.getCurrentState()).toBe(SocketState.CONNECTING)

        // 验证所有相关事件处理器都被调用
        expect(mockEventHandlers[SocketEvent.CONNECT]).toHaveBeenCalledTimes(3)
        expect(mockEventHandlers[SocketEvent.CONNECTED]).toHaveBeenCalledTimes(1)
        expect(mockEventHandlers[SocketEvent.DISCONNECT]).toHaveBeenCalledTimes(1)
        expect(mockEventHandlers[SocketEvent.ERROR]).toHaveBeenCalledTimes(1)
      })
    })

    describe('边界情况', () => {
      it('应该处理没有配置转换的状态', () => {
        const limitedConfig: Props<SocketState, SocketEvent> = {
          initialState: SocketState.DISCONNECTED,
          states: {
            [SocketState.DISCONNECTED]: [],
            [SocketState.CONNECTING]: [],
            [SocketState.CONNECTED]: [],
            [SocketState.ERROR]: [],
          },
          events: mockEventHandlers,
        }

        const limitedMachine = new StateMachine(limitedConfig)

        expect(limitedMachine.canTrigger(SocketEvent.CONNECT)).toBe(false)
        expect(limitedMachine.getAvailableEvents()).toEqual([])
      })

      it('应该处理没有事件处理器的情况', async () => {
        const noHandlerConfig: Props<SocketState, SocketEvent> = {
          initialState: SocketState.DISCONNECTED,
          states: {
            [SocketState.DISCONNECTED]: [
              { to: SocketState.CONNECTING, event: SocketEvent.CONNECT },
            ],
            [SocketState.CONNECTING]: [],
            [SocketState.CONNECTED]: [],
            [SocketState.ERROR]: [],
          },
          events: {
            [SocketEvent.CONNECT]: undefined as any,
            [SocketEvent.CONNECTED]: vi.fn(),
            [SocketEvent.DISCONNECT]: vi.fn(),
            [SocketEvent.ERROR]: vi.fn(),
          },
        }

        const noHandlerMachine = new StateMachine(noHandlerConfig)

        const result = await noHandlerMachine.trigger(SocketEvent.CONNECT)
        expect(result).toBe(true)
        expect(noHandlerMachine.getCurrentState()).toBe(SocketState.CONNECTING)
      })
    })
  })
})
