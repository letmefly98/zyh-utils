/* eslint-disable ts/no-unsafe-function-type */
import { capitalize } from 'lodash-es'

/**
 * 状态机包含四个核心要素：
 * 状态（States）：系统可能处于的各种情况
 * 事件（Events）：触发状态转换的动作
 * 转换（Transitions）：从一个状态到另一个状态的过程
 * 动作（Actions）：状态转换时执行的操作
 */
type TState = string | number
type TEvent = string | number
type TAction = Function
type TTransition<S extends TState, E extends TEvent> = (from: S, to: S, event: E, action?: TAction) => void

/**
 * 状态机入参
 */
export interface Props<S extends TState, E extends TEvent> {
  initialState: S
  states: Record<S, { event: E, to: S, skip?: () => boolean | Promise<boolean>, action?: TAction }[]>
  events?: Partial<Record<E, TAction>>
}

/**
 * 状态机配置
 */
type Config<S extends TState, E extends TEvent> = Required<Props<S, E>>

/**
 * 状态机
 */
export class StateMachine<S extends TState, E extends TEvent> {
  private config: Config<S, E>
  private currentState: S
  private listeners: Map<string, Array<TTransition<S, E>>>

  constructor(props: Props<S, E>) {
    this.config = this.normalizeProps(props)
    this.currentState = this.config.initialState
    this.listeners = new Map()
  }

  // 格式化入参
  private normalizeProps(props: Props<S, E>) {
    const config = { ...props } as Config<S, E>

    if (!config.events) {
      config.events = {}
    }

    // 支持不传 events 对象，靠 states 中的 actions 去填补
    Object.keys(config.states).forEach((stateKey) => {
      const nextEvents = config.states[stateKey as S]
      nextEvents.forEach((item) => {
        const exist = item.event in config.events
        if (!exist && item.action) {
          config.events[item.event] = item.action
          delete item.action
        }
      })
    })

    return config
  }

  /**
   * 获取当前状态
   */
  getCurrentState(): S {
    return this.currentState
  }

  /**
   * 触发事件，尝试状态转换
   */
  async trigger(event: E): Promise<boolean> {
    const currentStateTransitions = this.config.states[this.currentState]
    if (!currentStateTransitions) {
      return false // 当前状态没有配置转换
    }

    // 查找匹配的转换
    const transition = currentStateTransitions.find(t => t.event === event)
    if (!transition) {
      return false // 没有找到对应的转换
    }

    if (transition.skip) {
      const shouldSkip = await transition.skip()
      if (shouldSkip) return false
    }

    const fromState = this.currentState
    this.currentState = transition.to

    // 执行事件处理器
    const actionMethod = this.config.events[event]
    if (actionMethod) {
      await actionMethod()
    }

    // 通知转换变化
    this.notifyListeners(fromState, transition.to, event)

    return true
  }

  /**
   * 检查是否可以触发某个事件
   */
  canTrigger(event: E): boolean {
    const currentStateTransitions = this.config.states[this.currentState]
    if (!currentStateTransitions) {
      return false
    }

    // 查找匹配的转换
    const transition = currentStateTransitions.find(t => t.event === event)
    return !!transition
  }

  /**
   * 获取当前状态可以触发的所有事件
   */
  getAvailableEvents(): E[] {
    const currentStateTransitions = this.config.states[this.currentState]
    if (!currentStateTransitions) {
      return []
    }

    return currentStateTransitions.map(t => t.event)
  }

  /**
   * 添加监听器
   * @param event 监听所有状态转换，支持 transition(通用) 和 event/onEvent(特定) 事件名称
   * @param listener 监听器函数
   */
  on(event: 'transition', listener: TTransition<S, E>): void
  on(event: `${E}`, listener: TTransition<S, E>): void
  on(event: `on${Capitalize<`${E}`>}`, listener: TTransition<S, E>): void
  on(event: string, listener: TTransition<S, E>): void {
    const eventKey = String(event)
    if (!this.listeners.has(eventKey)) {
      this.listeners.set(eventKey, [])
    }
    this.listeners.get(eventKey)!.push(listener)
  }

  /**
   * 移除监听器
   * @param event 取消监听所有状态转换，支持 transition(通用) 和 event/onEvent(特定) 事件名称
   * @param listener 监听器函数
   */
  off(event: 'transition', listener: TTransition<S, E>): void
  off(event: `${E}`, listener: TTransition<S, E>): void
  off(event: `on${Capitalize<`${E}`>}`, listener: TTransition<S, E>): void
  off(event: string, listener: TTransition<S, E>): void {
    const eventKey = String(event)
    const listeners = this.listeners.get(eventKey)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * 重置到初始状态
   */
  reset(initialState?: S): void {
    this.currentState = initialState || this.config.initialState
  }

  private notifyListeners(from: S, to: S, event: E): void {
    // 通知通用状态转换监听器
    const transitionListeners = this.listeners.get('transition')
    if (transitionListeners) {
      transitionListeners.forEach(listener => listener(from, to, event))
    }

    // 通知特定事件监听器
    const eventKey = String(event)
    const eventListeners = this.listeners.get(eventKey)
    if (eventListeners) {
      eventListeners.forEach(listener => listener(from, to, event))
    }

    // 通知首字母大写的事件监听器 (onConnect, onDisconnect 等)
    const capitalizedEventKey = `on${capitalize(eventKey)}`
    const capitalizedEventListeners = this.listeners.get(capitalizedEventKey)
    if (capitalizedEventListeners) {
      capitalizedEventListeners.forEach(listener => listener(from, to, event))
    }
  }
}
