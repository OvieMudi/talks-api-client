<script lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { Socket } from 'socket.io-client';
import { findUserAndPopulateRooms } from '../api';
import { ReactiveApiRequestState } from '../interfaces/reactiveApiRequestState.interface';
import { User } from '../interfaces/user.interface';
import { Talk } from '../interfaces/talk.interface';
import { Message } from '../interfaces/message.interface';

interface State {
  loggedIn: boolean;
  email: string;
  username: string;
  messages: Message[];
}

export default {
  props: {
    socket: Socket,
  },
  setup(props) {
    const { socket } = props;

    const state = reactive<State>({
      username: '',
      email: '',
      loggedIn: false,
      messages: [],
    });

    const userReactiveApiRequestState = reactive<ReactiveApiRequestState<User[]>>({
      data: [],
      error: null,
      hasError: false,
      isLoading: false,
    });

    const userTalksReactiveApiRequestState = reactive<ReactiveApiRequestState<Talk[]>>({
      data: [],
      error: null,
      hasError: false,
      isLoading: false,
    });

    const inputemail = ref('');
    const inputMessage = ref('');
    const selectedRoom = ref<Talk>(userTalksReactiveApiRequestState.data[0]);

    const handleEmailInputChange = async (event: any) => {
      findUserAndPopulateRooms(inputemail.value, userReactiveApiRequestState, userTalksReactiveApiRequestState);
    };

    const joinRoom = () => {
      if (inputemail.value != '' || inputemail.value != null) {
        state.email = inputemail.value;
        inputemail.value = '';

        state.loggedIn = true;
        socket?.emit('joinRoom', {
          ...selectedRoom.value,
        });
      }
    };

    const leaveRoom = () => {
      state.email = '';
      userReactiveApiRequestState.data = [];
    };

    const sendMessage = () => {
      if (inputMessage.value === '' || inputMessage.value === null) {
        return;
      }

      const message: Message = {
        id: Math.random().toString().replace('.', ''),
        username: userReactiveApiRequestState.data[0]?.firstName,
        content: inputMessage.value,
        roomId: selectedRoom.value.id,
      };

      socket?.emit('serverMessage', message);
      inputMessage.value = '';
    };

    onMounted(() => {
      socket?.on('clientMessage', (message: Message) => {
        state.messages.push(message);
      });

      socket?.on('joinedRoom', (room: Talk) => {
        console.log('joinedRoom:', room);
      });
    });

    return {
      inputemail,
      selectedRoom,
      state,
      inputMessage,
      userReactiveApiRequestState,
      userTalksReactiveApiRequestState,
      joinRoom,
      handleEmailInputChange,
      sendMessage,
      leaveRoom,
    };
  },
};
</script>

<template>
  <div class="view login" v-if="state.email === '' || state.email === null || !state.loggedIn">
    <form class="login-form" @submit.prevent="joinRoom">
      <div class="form-inner">
        <h1>Login to Talks</h1>
        <label for="email">Email</label>
        <input
          name="email"
          type="email"
          v-model="inputemail"
          @change="handleEmailInputChange"
          required
          placeholder="Please enter your email..."
        />
        <div v-if="userReactiveApiRequestState.data[0]">
          <label for="rooms">Rooms</label>
          <select name="rooms" v-model="selectedRoom" required>
            <option
              v-for="userTalk in userTalksReactiveApiRequestState.data"
              :key="userTalk.id"
              :value="{ ...userTalk }"
            >
              {{ userTalk.title }}
            </option>
          </select>
        </div>

        <input
          type="submit"
          value="Continue"
          :disabled="userReactiveApiRequestState?.isLoading || userReactiveApiRequestState?.hasError"
        />
      </div>
    </form>
  </div>

  <div class="view chat" v-else>
    <header>
      <button class="leave-room" @click="leaveRoom">Leave</button>
      <h1>Hello, {{ userReactiveApiRequestState.data[0]?.firstName }}</h1>
      <h2>{{ selectedRoom.title }}</h2>
    </header>

    <section class="chat-box">
      <div
        v-for="message in state.messages"
        :key="message.id"
        :class="message.username == userReactiveApiRequestState.data[0]?.firstName ? 'message current-user' : 'message'"
      >
        <div class="message-inner">
          <div class="username">{{ message.username }}</div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>
    </section>

    <footer>
      <form @submit.prevent="sendMessage">
        <input type="text" v-model="inputMessage" placeholder="Type a message..." />
        <input type="submit" value="Send" />
      </form>
    </footer>
  </div>
</template>

<style lang="scss">
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.view {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  max-width: 840px;
  margin: 0 auto;
  background-color: #776cbf;

  &.login {
    align-items: center;
    .login-form {
      display: block;
      width: 100%;
      padding: 15px;

      .form-inner {
        display: block;
        background-color: #fff;
        padding: 50px 15px;
        border-radius: 16px;
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);

        h1 {
          color: #aaa;
          font-size: 28px;
          margin-bottom: 30px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: #aaa;
          font-size: 16px;
          transition: 0.4s;
        }

        input[type='text'],
        input[type='email'],
        select {
          appearance: none;
          border: none;
          outline: none;
          background: none;

          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;

          color: #333;
          font-size: 18px;

          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #f3f3f3;

          transition: 0.4s;

          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }

        input[type='submit'] {
          appearance: none;
          border: none;
          outline: none;
          background: none;

          display: block;
          width: 100%;
          padding: 10px 15px;
          background-color: #776cbf;
          border-radius: 8px;

          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }

        &:focus-within {
          label {
            color: #776cbf;
          }

          input[type='text'] {
            background-color: #fff;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);

            &::placeholder {
              color: #666;
            }
          }
        }
      }
    }
  }

  &.chat {
    flex-direction: column;

    header {
      position: relative;
      display: block;
      width: 100%;
      padding: 50px 30px 10px;

      .leave-room {
        position: absolute;
        top: 15px;
        right: 15px;
        appearance: none;
        border: none;
        outline: none;
        background: none;

        color: #fff;
        font-size: 18px;
        margin-bottom: 10px;
        text-align: right;
      }

      h1 {
        color: #fff;
      }

      h2 {
        color: #ddd;
        font-size: 18px;
        margin-bottom: 10px;
        text-align: center;
      }
    }

    .chat-box {
      background-color: #fff;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      flex: 1 1 100%;
      padding: 30px;

      .message {
        display: flex;
        margin-bottom: 15px;

        .message-inner {
          .username {
            color: #888;
            font-size: 16px;
            margin-bottom: 5px;
            padding-left: 15px;
            padding-right: 15px;
          }

          .content {
            display: inline-block;
            padding: 10px 20px;
            background-color: #f3f3f3;
            border-radius: 999px;

            color: #333;
            font-size: 18px;
            line-height: 1.2em;
            text-align: left;
          }
        }

        &.current-user {
          margin-top: 30px;
          justify-content: flex-end;
          text-align: right;

          .message-inner {
            max-width: 75%;

            .content {
              color: #fff;
              font-weight: 600;
              background-color: #776cbf;
            }
          }
        }
      }
    }

    footer {
      position: sticky;
      bottom: 0px;
      background-color: #fff;
      padding: 30px;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);

      form {
        display: flex;

        input[type='text'] {
          flex: 1 1 100%;

          appearance: none;
          border: none;
          outline: none;
          background: none;

          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px 0px 0px 8px;

          color: #333;
          font-size: 18px;

          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #f3f3f3;

          transition: 0.4s;

          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }

        input[type='submit'] {
          appearance: none;
          border: none;
          outline: none;
          background: none;

          display: block;
          padding: 10px 15px;
          border-radius: 0px 8px 8px 0px;

          background-color: #776cbf;

          color: #fff;
          font-size: 18px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
