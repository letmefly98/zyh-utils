<script setup lang="ts" name="LoadingButton" inheritAttrs="false">
import type { ComponentInstance } from 'vue'
import { ElButton } from 'element-plus'
import { omit } from 'lodash-es'
import { getCurrentInstance, h, ref, useAttrs } from 'vue'

defineExpose({} as ComponentInstance<typeof ElButton>)
const vm = getCurrentInstance()
function changeRef(exposed: any) {
  if (vm) vm.exposed = exposed
}

const loading = ref(false)
const attrs = useAttrs()
async function handleClick(ev: MouseEvent) {
  try {
    loading.value = true
    const onClickHandler = attrs.onClick as ((ev: MouseEvent) => void | Promise<void>) | undefined
    if (onClickHandler && typeof onClickHandler === 'function') {
      await onClickHandler(ev)
    }
  } catch (error) {
    // 吞掉错误，避免未处理的Promise rejection
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <component :is="h(ElButton, { ...omit(attrs, 'onClick'), loading, ref: changeRef, onClick: handleClick }, $slots)" />
</template>
