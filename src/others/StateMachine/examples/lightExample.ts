/**
 * 电灯状态机示例
 */

import type { Props } from '../StateMachine'
import { StateMachine } from '../StateMachine'

// 定义状态和事件类型
enum LightState {
  OFF = 'off', // 熄灭
  ON = 'on', // 全亮
  DIMMED = 'dimmed', // 半亮
}

enum LightEvent {
  TURN_ON = 'turn_on', // 开灯
  TURN_OFF = 'turn_off', // 关灯
  DIM = 'dim', // 调暗
  BRIGHTEN = 'brighten', // 调亮
}

// 创建电灯状态机配置
const lightConfig: Props<LightState, LightEvent> = {
  initialState: LightState.OFF,
  // 状态配置：每个状态定义可以转换到的目标状态和触发事件
  states: {
    [LightState.OFF]: [
      { event: LightEvent.TURN_ON, to: LightState.ON },
    ],
    [LightState.ON]: [
      { event: LightEvent.TURN_OFF, to: LightState.OFF },
      { event: LightEvent.DIM, to: LightState.DIMMED },
    ],
    [LightState.DIMMED]: [
      { event: LightEvent.BRIGHTEN, to: LightState.ON },
      { event: LightEvent.TURN_OFF, to: LightState.OFF },
    ],
  },
  // 事件配置：每个事件对应一个处理函数
  events: {
    [LightEvent.TURN_ON]: () => console.log('💡 开灯'),
    [LightEvent.TURN_OFF]: () => console.log('🌑 关灯'),
    [LightEvent.DIM]: () => console.log('🔅 调暗'),
    [LightEvent.BRIGHTEN]: () => console.log('💡 调亮'),
  },
}

// 使用示例
export function lightExample() {
  const lightMachine = new StateMachine(lightConfig)

  console.log('初始状态:', lightMachine.getCurrentState()) // off

  // 监听状态转换
  lightMachine.on('transition', (from, to, event) => {
    console.log(`状态转换: ${from} --[${event}]--> ${to}`)
  })

  // 执行状态转换
  lightMachine.trigger(LightEvent.TURN_ON) // 开灯
  console.log('当前灯泡状态:', lightMachine.getCurrentState()) // on;
  lightMachine.trigger(LightEvent.DIM) // 调暗
  console.log('当前灯泡状态:', lightMachine.getCurrentState()) // dimmed;
  lightMachine.trigger(LightEvent.DIM) // 调暗
  console.log('当前灯泡状态:', lightMachine.getCurrentState()) // dimmed 不变
  lightMachine.trigger(LightEvent.BRIGHTEN) // 调亮
  console.log('当前灯泡状态:', lightMachine.getCurrentState()) // on;
  lightMachine.trigger(LightEvent.TURN_OFF) // 关灯
  console.log('当前灯泡状态:', lightMachine.getCurrentState()) // off;
  lightMachine.trigger(LightEvent.DIM) // 调暗
  console.log('当前灯泡状态:', lightMachine.getCurrentState()) // off 不变

  // 查询可用操作
  console.log('当前可用操作:', lightMachine.getAvailableEvents())
}
