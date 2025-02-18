<script setup>
import { useAuthStore } from '../../store/authStore'

const authStore = useAuthStore()
</script>

<template>
	<button class="btn logout flex" @click="authStore.logout">
		Выйти
	</button>
</template>

<style scoped>
.logout {
	margin-bottom: 1em;
}
</style>