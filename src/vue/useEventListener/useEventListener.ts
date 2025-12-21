import type { Ref } from 'vue'
import { unref, watch } from 'vue'

export function useEventListener<K extends keyof WindowEventMap>(event: K, listener: (ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void
export function useEventListener<K extends keyof HTMLElementEventMap>(target: Ref<EventTarget>, event: K, listener: (ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void
export function useEventListener(...args: any[]) {
  const target = typeof args[0] === 'string' ? window : args.shift()
  return watch(() => unref(target), (element, _, onCleanup) => {
    if (!element) return

    element.addEventListener(...args)

    onCleanup(() => {
      element.removeEventListener(...args)
    })
  }, {
    immediate: true,
  })
}
