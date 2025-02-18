<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../store/authStore.js'
import RoomItem from './RoomItem.vue'

const authStore = useAuthStore()
const isLoading = computed(() => authStore.isLoading)
const rooms = computed(() => authStore.rooms)
const errorMessage = computed(() => authStore.errorMessage)
const sortType = ref('latest') // Тип сортировки: 'latest' или 'alphabetical'
const isVisibleSortBtn = ref(false)

const sortedRooms = computed(() => {
	if (sortType.value === 'latest') {
		return [...rooms.value].sort((a, b) => b.lastEventTs - a.lastEventTs)
	} else if (sortType.value === 'alphabetical') {
		return [...rooms.value].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
	}
	return rooms.value
})

const setSort = (type) => {
	sortType.value = type
}

onMounted(authStore.loadRooms)
</script>

<template>
	<div class="room__container" v-if="!isLoading">
		<div class="room__nav">
			<button class="btn flex" @click="isVisibleSortBtn = !isVisibleSortBtn">
				<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="28" viewBox="0 0 16 28"><path d="M16 17c0 0.266-0.109 0.516-0.297 0.703l-7 7c-0.187 0.187-0.438 0.297-0.703 0.297s-0.516-0.109-0.703-0.297l-7-7c-0.187-0.187-0.297-0.438-0.297-0.703 0-0.547 0.453-1 1-1h14c0.547 0 1 0.453 1 1zM16 11c0 0.547-0.453 1-1 1h-14c-0.547 0-1-0.453-1-1 0-0.266 0.109-0.516 0.297-0.703l7-7c0.187-0.187 0.438-0.297 0.703-0.297s0.516 0.109 0.703 0.297l7 7c0.187 0.187 0.297 0.438 0.297 0.703z"></path></svg>
				<span>Сортировать</span>
			</button>
			<div class="sort-buttons" v-if="isVisibleSortBtn">
				<button class="btn" @click="setSort('latest')">По дате</button>
				<button class="btn" @click="setSort('alphabetical')">По алфавиту</button>
			</div>
		</div>

		<div class="room__content">
			<div v-for="room in sortedRooms" :key="room.id">
				<RoomItem :room="room" />
			</div>
		</div>
		<div class="room__footer">
		</div>
	</div>
	<div v-else class="room__container room__loading">
		Загрузка...
	</div>
	<div v-if="errorMessage">{{ errorMessage }}</div>
</template>

<style lang="scss">
.room {
	&__container {
		overflow: hidden;
	}

	&__nav {
		background-color: var(--bg-block);
		padding: 1em;
		box-sizing: border-box;
		width: 100%;
		border-top-left-radius: 1em;
		border-top-right-radius: 1em;
		display: flex;
		justify-content: end;
		position: relative;
	}

	&__content {
		background-color: var(--bg-block);
		width: 100%;
	}

	&__footer {
		height: 1em;
		display: block;
		background: var(--bg-block);
		border-bottom-left-radius: 1em;
		border-bottom-right-radius: 1em;
	}

	&__loading {
		padding: 1em;
	}
}

.sort-buttons {
	position: absolute;
	right: 1em;
	top: 3em;
	min-width: 160px;
	width: max-content;
	background: var(--bg-list);
	display: flex;
	flex-direction: column;
	gap: 1px;
	box-shadow: rgba(0, 16, 61, 0.16) 0px 4px 32px 0px;
	border-radius: 0.64em;
	padding: 0.64em 0;
}
</style>
