<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../store/authStore'

const authStore = useAuthStore()

const homeServer = ref('https://matrix-client.matrix.org')
const username = ref('evgeniy_ko_spb')
const password = ref('%#;3!k_^9q8hTrV')
const errorMessage = ref('')
const isLoading = ref(false)

const login = async () => {
	isLoading.value = true
	try {
		await authStore.login(homeServer.value, username.value, password.value)
	} catch (error) {
		errorMessage.value = error.message
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<div class="login__container">
		<h2>Вход в Matrix</h2>
		<input v-model="homeServer" type="text" placeholder="Домашний сервер" />
		<input v-model="username" type="text" placeholder="Логин" />
		<input v-model="password" type="password" placeholder="Пароль" />
		<button @click="login" :disabled="isLoading" class="btn">
			{{ isLoading ? "Вход..." : "Войти" }}
		</button>
		<p v-if="errorMessage" class="error">{{ errorMessage }}</p>
	</div>
</template>

<style scoped>
.login__container {
	max-width: 300px;
	margin: auto;
	text-align: center;
}

input {
	display: block;
	width: 100%;
	margin-bottom: 10px;
	padding: 8px;
}

.error {
	color: red;
}
</style>