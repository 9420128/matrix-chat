<script setup>
import { defineProps } from 'vue';

const props = defineProps({
	room: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<div class="room-item">
<!--				<img v-if="room.avatar" :src="room.avatar" alt="Аватар" width="40" height="40" />-->
		<div>
			<p title="Название комнаты">
				<b>{{ room.name }}</b>
			</p>
			<p title="Последнее сообщение">
				{{ room.lastEvent }}
			</p>
			<p title="Количество не прочитанных">
				{{ room.unreadCount }}
			</p>
		</div>
		<div>
			<p title="Дата последнего сообщения">
				<small>{{ room.lastEventDate }}</small>
			</p>
		</div>
	</div>
</template>

<style>
	.room-item {
		display: flex;
		justify-content: space-between;
	}

	.room-item {
		padding: 0 1em;
		box-sizing: border-box;
		border-top: 1px solid var(--solid);
	}

	.room-item > div:first-child {
		flex: 1;
	}

	small {
		color: #666;
	}
</style>