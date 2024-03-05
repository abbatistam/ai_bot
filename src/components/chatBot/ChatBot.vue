<template>
  <div class="relative w-full h-full">
    <div class="bg-gradient-to-br from-cyan-600 to-cyan-500 h-14 w-14 rounded-full flex justify-center items-center text-white" @click="handleOpen" v-if="false">
          <font-awesome-icon 
            class="text-2xl" 
            :icon="open ? 'fa fa-solid fa-close' : 'fa fa-solid fa-robot'" 
          />
    </div>
    <div class="w-full h-full rounded-2xl flex flex-col justify-center shadow-2xl bg-white" v-if="true">
      <div class="flex flex-col">
      <div class="rounded-t-2xl py-3 px-6 text-white w-full bg-gradient-to-r from-blue-700 to-blue-500 flex gap-2 justify-between items-center border-b border-blue-500">
        <div class="flex gap-2">
        <div class="bg-gradient-to-br from-cyan-600 to-cyan-500 h-14 w-14 rounded-full flex justify-center items-center">
          <font-awesome-icon class="text-2xl" icon="fa fa-solid fa-robot" />
        </div>
        <div class="flex flex-col justify-center items-start">
          <span>Chat with</span>
          <span>Util IA</span>
        </div>
       </div>
       <div class="flex gap-4" v-if="false">
        <font-awesome-icon icon="fa fa-solid fa-ellipsis-vertical" />
        <font-awesome-icon icon="fa fa-solid fa-angle-down" />
        </div>
      </div>
      <div class="py-3 px-6 text-white w-full bg-gradient-to-r from-blue-700 to-blue-500 flex gap-1 justify-start items-center">
        <span class="capitalize">{{ apiStatus }}</span>
        <div 
          class="w-3 h-3 bg-green-500 rounded-full animate-pulse"
          :class="apiStatus === 'online' ? 'bg-green-500' : 'bg-red-500'"
        >

        </div>
      </div>
    </div>
    <div 
      class="p-4 flex flex-col grow overflow-x-auto"
      v-if="apiStatus === 'online'"
      ref="container"
    >
      <div
        class="flex justify-start p-4 items-center gap-2 mb-2 bg-gray-200 rounded-md h-fit w-fit max-w-[50%] break-words"
      >
        <span>¡Hola! ¿En qué puedo ayudarte hoy?</span>
      </div>
      <span class="text-gray-400 text-xs">
        {{ `${zeroPad(initialTime.getHours())}:${zeroPad(initialTime.getMinutes())}` }}
      </span>
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="msg.type === 'user' ? 'flex justify-end items-center gap-2 mb-2' : 'flex justify-start items-center gap-2 mb-2'"
      >
        <template v-if="msg.type === 'user'">
          <div class="flex flex-col w-full items-end gap-2">
            <div class="p-4 bg-gradient-to-r from-violet-600 to-violet-500 rounded-md text-white max-w-[50%] w-fit break-words">
              {{ msg.text }}
            </div>
            <span class="text-gray-400 text-xs">{{ getTimestamp(msg.timestamp) }}</span>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col w-full">
            <span
              class="flex justify-start p-4 items-center gap-2 mb-2 bg-gray-200 rounded-md max-w-[50%] w-fit break-words"
              v-if="index === messages.length - 1"
            >
              <span v-if="loading" v-html="generateText('Pensando...')"></span>
              <span v-else v-html="generateText(msg.text)"></span>
            </span>
            <span class="flex justify-start p-4 items-center gap-2 mb-2 bg-gray-200 rounded-md max-w-[50%] w-fit break-words" v-else>
              {{ msg.text }}
            </span>
            <span class="text-gray-400 text-xs">{{getTimestamp(msg.timestamp)}}</span>
          </div>
        </template>
      </div>
    </div>
    <div 
      class="w-full h-full flex justify-center items-center flex-col gap-4"
      v-else
    >
      <font-awesome-icon 
        icon="fa fa-solid fa-helmet-safety" 
        class="text-yellow-500 text-6xl"
      />
      <span class="font-semibold">
        El bot está actualmente en mantenimiento. Por favor, vuelve más tarde.
      </span>
    </div>
      <div class="p-4 flex flex-col justify-center items-center gap-4">
        <div class="w-full h-[1px] bg-gray-300"></div>
        <div class=" w-full flex flex-col gap-2">
          <input 
            placeholder="Escribe tu mensaje..." 
            class="outline-none p-2 w-full" 
            :class="apiStatus !== 'online' ? 'cursor-not-allowed' : 'cursor-auto'"
            v-model="message" 
            type="text"
            @keyup.enter="handleNewMessage"
            :disabled="apiStatus !== 'online'"
          >
          <div class="flex pl-2 pr-4 items-center" :class="messages.length > 0 ? 'justify-between' : 'justify-end'"> 
              <font-awesome-icon 
                v-if="messages.length > 0" 
                icon="fa fa-solid fa-trash-can" 
                class="text-gray-400 hover:text-red-500 cursor-pointer"
                @click="handleClearChat"
                  
              />
            <span class="text-gray-400">POWERED BY INITS</span>
          </div>
          <font-awesome-icon 
            v-if="apiStatus === 'online'"
            class="rounded-full h-12 w-12 absolute -right-6 bottom-2 bg-white text-blue-700 shadow-lg hover:text-blue-600 cursor-pointer" 
            :icon="'fa fa-solid fa-circle-right'"  
            @click="handleNewMessage" 
          />
          <font-awesome-icon 
            v-else
            class="rounded-full h-12 w-12 absolute -right-6 bottom-2 bg-red-700 text-white shadow-lg cursor-not-allowed" 
            :icon="'fa fa-solid fa-close'"   
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onUpdated, nextTick, type Ref } from 'vue'
import { predict, upload, listDocuments, editDocument, deleteDocument } from '@/services/MainService';
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';

interface MessageType {
  text: string
  type: string
  timestamp: Date
}

const mainStore = useMainStore()
const { apiStatus } = storeToRefs(mainStore)

const open = ref(false)
const message = ref('')
const messages = ref<MessageType[]>([])
const loading = ref(false)
const initialTime = ref(new Date())

const handleOpen = () => {
  open.value = !open.value
}

const handleNewMessage = async () => {
  if (message.value === '') return
  messages.value.push({ text: message.value, type: 'user', timestamp: new Date() })
  messages.value.push({ text: 'Pensando...', type: 'bot', timestamp: new Date()})
  const botResponse = await obtenerRespuestaGPT(message.value)
  messages.value.pop()
  messages.value.push({ text: botResponse , type: 'bot', timestamp: new Date() })
}

const handleClearChat = () => {
  messages.value = []
}

async function obtenerRespuestaGPT(msg:string) {
  loading.value = true
  message.value = ''
  try {
    const response = await predict(msg)
    return response;
  } catch (error) {
    console.error('Error al obtener respuesta de OpenAI GPT:', error);
    return 'Lo siento, ocurrió un error al obtener la respuesta.';
  } finally {
    loading.value = false
  }
}

const typedText = ref('');
const typingSpeed = 50;

const generateText = (text: string) => {
  return typedText.value;
};

const zeroPad = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`;
};

const getTimestamp = (date: Date): string => {
  //const date = new Date();
  const hours = zeroPad(date.getHours());
  const minutes = zeroPad(date.getMinutes());
  return `${hours}:${minutes}`;
};

watchEffect(() => {
  typedText.value = '';
  if (messages.value.length > 0) {
    let index = 0;
    const typingInterval = setInterval(() => {
      typedText.value += messages.value[messages.value.length - 1].text[index];
      index++;
      if (index === messages.value[messages.value.length - 1].text.length) {
        clearInterval(typingInterval);
      }
    }, typingSpeed);
  }
});

const container : Ref<null | HTMLElement> = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    if(container.value !== null) {
      const containerRef = container.value
      containerRef.scrollTop = containerRef.scrollHeight
    }
  })
}

onMounted(scrollToBottom)
onUpdated(scrollToBottom)
</script>

<style scoped>
</style>