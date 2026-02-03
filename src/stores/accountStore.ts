import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid' // npm install uuid и npm install --save-dev @types/uuid

export interface Label {
	text: string
}

export type AccountType = 'LDAP' | 'Локальная'

export interface Account {
	id: string
	labels: Label[]
	type: AccountType
	login: string
	password: string | null
}

export const useAccountStore = defineStore('account', () => {
	// Инициализация из LocalStorage или пустой массив
	const accounts = ref<Account[]>(
		JSON.parse(localStorage.getItem('user_accounts') || '[]')
	)

	// Добавление новой пустой записи
	const addAccount = () => {
		const newAccount: Account = {
			id: uuidv4(), // уникальный id для корректной работы списков
			labels: [],
			type: 'Локальная',
			login: '',
			password: '',
		}
		accounts.value.push(newAccount)
	}

	// Удаление записи
	const removeAccount = (id: string) => {
		accounts.value = accounts.value.filter(acc => acc.id !== id)
	}

	const updateAccount = (
		id: string,
		updatedData: Partial<Omit<Account, 'id'>>
	) => {
		const account = accounts.value.find(acc => acc.id === id)
		if (account) {
			Object.assign(account, updatedData)
		}
	}

	// Следим за изменениями и сохраняем в LocalStorage
	watch(
		accounts,
		newAccounts => {
			localStorage.setItem('user_accounts', JSON.stringify(newAccounts))
		},
		{ deep: true }
	)

	return {
		accounts,
		addAccount,
		removeAccount,
		updateAccount,
	}
})
