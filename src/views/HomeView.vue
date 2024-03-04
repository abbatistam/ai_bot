<template>
  <div class="h-screen w-screen flex justify-center items-center bg-gray-200 p-8">
    <ChatBot />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import ChatBot from '@/components/chatBot/ChatBot.vue';
</script>

<style scoped>

</style>