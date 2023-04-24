<script lang="ts">
import io from 'socket.io-client';
import ChatApp from './components/ChatApp.vue';

export default {
  components: {
    ChatApp,
  },
  setup() {
    const socket = io('/sockets/chat');

    socket.on('connect', () => {
      console.log('=== connected to WS server ===');
    });

    socket.on('disconnet', () => {
      console.log('=== Disconnected from WS server ===');
    });

    return { socket };
  },
};
</script>

<template>
  <ChatApp :socket="socket" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
