/**
 * 游戏状态机示例
 */

import type { Props } from '../StateMachine'
import { StateMachine } from '../StateMachine'

// 定义状态和事件类型
enum GameState {
  MENU = 'menu', // 显示菜单中
  PLAYING = 'playing', // 游戏进行中
  PAUSED = 'paused', // 暂停中
  GAME_OVER = 'game_over', // 游戏结束
  LOADING = 'loading', // 进入游戏中
}

enum GameEvent {
  START_GAME = 'start_game', // 开始游戏
  PAUSE = 'pause', // 暂停
  RESUME = 'resume', // 继续游戏
  GAME_OVER = 'game_over', // 结束游戏
  RESTART = 'restart', // 重新开始
  BACK_TO_MENU = 'back_to_menu', // 打开菜单
}

export function gameExample() {
  const gameConfig: Props<GameState, GameEvent> = {
    initialState: GameState.MENU,
    states: {
      [GameState.MENU]: [
        { event: GameEvent.START_GAME, to: GameState.LOADING },
      ],
      [GameState.LOADING]: [
        { event: GameEvent.START_GAME, to: GameState.PLAYING },
      ],
      [GameState.PLAYING]: [
        { event: GameEvent.PAUSE, to: GameState.PAUSED },
        { event: GameEvent.GAME_OVER, to: GameState.GAME_OVER },
      ],
      [GameState.PAUSED]: [
        { event: GameEvent.RESUME, to: GameState.PLAYING },
        { event: GameEvent.BACK_TO_MENU, to: GameState.MENU },
      ],
      [GameState.GAME_OVER]: [
        { event: GameEvent.RESTART, to: GameState.LOADING },
        { event: GameEvent.BACK_TO_MENU, to: GameState.MENU },
      ],
    },
    events: {
      [GameEvent.START_GAME]: async () => {
        console.log('🎮 开始游戏...')
        // 模拟加载过程
        await new Promise(resolve => setTimeout(resolve, 200))
      },
      [GameEvent.PAUSE]: () => console.log('⏸️ 游戏暂停'),
      [GameEvent.RESUME]: () => console.log('▶️ 游戏继续'),
      [GameEvent.GAME_OVER]: () => console.log('💀 游戏结束'),
      [GameEvent.RESTART]: () => console.log('🔄 重新开始'),
      [GameEvent.BACK_TO_MENU]: () => console.log('🏠 返回主菜单'),
    },
  }

  const gameMachine = new StateMachine(gameConfig)

  console.log('游戏状态机示例:')
  console.log('初始状态:', gameMachine.getCurrentState())

  // 监听状态转换
  gameMachine.on('transition', (from, to, event) => {
    console.log(`游戏状态转换: ${from} --[${event}]--> ${to}`)
  })

  return gameMachine
}
