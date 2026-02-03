<script setup lang="ts">
import { useAccountStore } from '@/stores/accountStore'
import AccountItem from '@/components/AccountItem.vue'

const store = useAccountStore()

const addNewAccount = () => {
	store.addAccount()
}
</script>

<template>
	<main class="container">
		<header class="header">
			<h1>Учетные записи</h1>
			<button class="add-btn" @click="addNewAccount">+</button>
		</header>

		<section class="info-banner">
			<p>
				<span class="icon">ℹ️</span>
				Для ввода нескольких меток используйте разделитель <strong>;</strong>
			</p>
		</section>

		<div class="account-list">
			<div v-if="store.accounts.length > 0" class="list-labels">
				<span>Метки</span>
				<span>Тип записи</span>
				<span>Логин</span>
				<span v-if="store.hasLocalType">Пароль</span>
			</div>

			<AccountItem
				v-for="(account, index) in store.accounts"
				:key="account.id"
				:account="account"
				:index="index"
			/>
		</div>
	</main>
</template>

<style scoped>
.container {
	max-width: 1000px;
	margin: 40px auto;
	padding: 0 20px;
	font-family: sans-serif;
}

.header {
	display: flex;
	align-items: center;
	gap: 20px;
	margin-bottom: 20px;
}

.add-btn {
	width: 40px;
	height: 40px;
	font-size: 24px;
	cursor: pointer;
	border: 1px solid #ccc;
	background: #fff;
	border-radius: 4px;
	transition: background 0.2s;
}

.add-btn:hover {
	background: #f0f0f0;
}

.info-banner {
	background-color: #e3f2fd;
	padding: 10px 15px;
	border-radius: 4px;
	margin-bottom: 30px;
	color: #1976d2;
}

.list-labels {
	display: grid;
	/* Сетка подстраивается под наличие пароля */
	grid-template-columns: 1fr 1fr 1fr 1fr 40px;
	gap: 15px;
	padding: 10px;
	font-weight: bold;
	color: #666;
}

.account-list {
	display: flex;
	flex-direction: column;
	gap: 15px;
}
</style>
