<template>
  <DefaultLayout />
  <Giscus
    v-if="showComments"
    repo="themycode/themycode.github.io"
    repo-id="MDEwOlJlcG9zaXRvcnkxNjQ1ODkxOTU="
    category="Announcements"
    category-id="DIC_kwDOCc9ui84C5HGB"
    mapping="pathname"
    strict="0"
    reactions-enabled="1"
    emit-metadata="0"
    input-position="bottom"
    theme="preferred_color_scheme"
    lang="zh-CN"
    crossorigin="anonymous"
    style="max-width: 900px; margin: 0 auto; padding: 20px"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Giscus from '@giscus/vue'
import DefaultLayout from 'vitepress/theme'
const { Layout } = DefaultTheme

const route = useRoute()

const showComments = computed(() => {
  const excludePaths = ['/', '/404.html']
  return !excludePaths.includes(route.path)
})
</script>
