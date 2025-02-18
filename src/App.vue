<script setup>
import { useAuthStore } from './store/authStore';
import LoginForm from './components/users/LoginForm.vue';
import RoomList from './components/chat/RoomList.vue';
import Logout from './components/users/Logout.vue';
import { onMounted } from 'vue'

const authStore = useAuthStore();
onMounted(authStore.isLoggedIn)
</script>

<template>
	<Logout v-if="authStore.isLogged" />
	<LoginForm v-else />
	<RoomList v-if="authStore.isLogged" />
</template>