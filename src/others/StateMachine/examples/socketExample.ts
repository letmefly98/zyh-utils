/**
 * Socket 连接状态机示例
 */

import type { Props } from '../StateMachine'
import { StateMachine } from '../StateMachine'

// 定义状态和事件类型
enum SocketState {
  STANDBY = 'standby', // 待机中
  CONNECTING = 'connecting', // 连接中
  CONNECTED = 'connected', // 已连接使用中
  ERROR = 'error', // 错误
  RECONNECTING = 'reconnecting', // 重连中
}

enum SocketEvent {
  CONNECT = 'connect', // 开启连接
  CONNECTED = 'connected', // 连接完成
  DISCONNECT = 'disconnect', // 断开连接
  ERROR = 'error', // 连接报错
  RECONNECT = 'reconnect', // 重新连接
}

export function socketExample() {
  const socketConfig: Props<SocketState, SocketEvent> = {
    initialState: SocketState.STANDBY,
    states: {
      [SocketState.STANDBY]: [
        { event: SocketEvent.CONNECT, to: SocketState.CONNECTING },
      ],
      [SocketState.CONNECTING]: [
        { event: SocketEvent.CONNECTED, to: SocketState.CONNECTED },
        { event: SocketEvent.ERROR, to: SocketState.ERROR },
      ],
      [SocketState.CONNECTED]: [
        { event: SocketEvent.DISCONNECT, to: SocketState.STANDBY },
        { event: SocketEvent.ERROR, to: SocketState.ERROR },
      ],
      [SocketState.ERROR]: [
        { event: SocketEvent.RECONNECT, to: SocketState.RECONNECTING },
      ],
      [SocketState.RECONNECTING]: [
        { event: SocketEvent.CONNECTED, to: SocketState.CONNECTED },
        { event: SocketEvent.ERROR, to: SocketState.ERROR },
      ],
    },
    events: {
      [SocketEvent.CONNECT]: async () => {
        console.log('🔌 开始连接...')
        // 模拟异步连接操作
        await new Promise(resolve => setTimeout(resolve, 100))
      },
      [SocketEvent.CONNECTED]: () => console.log('✅ 连接成功'),
      [SocketEvent.DISCONNECT]: () => console.log('🔌 连接已断开'),
      [SocketEvent.ERROR]: () => console.log('❌ 连接失败'),
      [SocketEvent.RECONNECT]: () => console.log('🔄 开始重连...'),
    },
  }

  const socketMachine = new StateMachine(socketConfig)

  console.log('Socket 状态机示例:')
  console.log('初始状态:', socketMachine.getCurrentState())

  // 监听所有状态转换
  socketMachine.on('transition', (from, to, event) => {
    console.log(`Socket 状态转换: ${from} --[${event}]--> ${to}`)
  })

  // 监听特定事件
  socketMachine.on(SocketEvent.CONNECT, (from, to, _event) => {
    console.log(`🔌 监听到连接事件: ${from} -> ${to}`)
  })

  socketMachine.on(SocketEvent.CONNECTED, (from, to, _event) => {
    console.log(`✅ 监听到连接成功事件: ${from} -> ${to}`)
  })

  socketMachine.on(SocketEvent.ERROR, (from, to, _event) => {
    console.log(`❌ 监听到错误事件: ${from} -> ${to}`)
  })

  return socketMachine
}
