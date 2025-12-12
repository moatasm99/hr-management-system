<template>
  <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">
    <Body>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <ClientOnly>
        <Toaster position="top-right" richColors />
      </ClientOnly>
    </Body>
  </Html>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})
</script>

<style>
@import 'assets/css/main.css';
</style>
