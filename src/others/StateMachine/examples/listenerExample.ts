/**
 * 监听器功能演示 - 交通灯状态机
 */

import type { Props } from '../StateMachine'
import { StateMachine } from '../StateMachine'

// 定义状态和事件类型
type TrafficLightState = 'red' | 'green' | 'yellow'

type TrafficLightEvent = 'next'

export function listenerExample() {
  const trafficLightConfig: Props<TrafficLightState, TrafficLightEvent> = {
    initialState: 'red',
    states: {
      red: [
        { event: 'next', to: 'green', action: () => console.log('🔴 切换信号灯') },
      ],
      green: [
        { event: 'next', to: 'yellow', action: () => console.log('🔴 切换信号灯') },
      ],
      yellow: [
        { event: 'next', to: 'red', action: () => console.log('🔴 切换信号灯') },
      ],
    },
    events: {},
  }

  const trafficLight = new StateMachine(trafficLightConfig)

  console.log('=== 监听器功能演示 ===')

  // 1. 通用状态转换监听器
  trafficLight.on('transition', (from, to) => {
    console.log(`[通用监听器] 状态转换: ${from} -> ${to}`)
  })

  // 2. 特定事件监听器 - 监听 NEXT 事件
  trafficLight.on('next', (from, to, _event) => {
    console.log(`[特定事件监听器] 检测到 NEXT 事件: ${from} -> ${to}`)

    // 根据目标状态执行不同逻辑
    switch (to) {
      case 'red':
        console.log('  🔴 红灯亮起，停止通行')
        break
      case 'yellow':
        console.log('  🟡 黄灯亮起，准备停车')
        break
      case 'green':
        console.log('  🟢 绿灯亮起，可以通行')
        break
    }
  })

  // 3. 首字母大写的事件监听器
  trafficLight.on('onNext', (from, to, _event) => {
    console.log(`[onNext 监听器] 检测到 onNext 事件: ${from} -> ${to}`)
  })

  // 4. 多个相同事件的监听器
  trafficLight.on('next', (_from, _to, _event) => {
    console.log(`[第二个 NEXT 监听器] 记录状态变化到日志系统`)
  })

  console.log('初始状态:', trafficLight.getCurrentState())

  // 演示状态转换和监听器触发
  console.log('\n--- 开始状态转换演示 ---')
  trafficLight.trigger('next') // RED -> GREEN
  trafficLight.trigger('next') // GREEN -> YELLOW
  trafficLight.trigger('next') // YELLOW -> RED

  return trafficLight
}
