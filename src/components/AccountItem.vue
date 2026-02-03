<script setup lang="ts">
import { ref, computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import type { Account, AccountType } from '@/stores/accountStore'
import { useAccountStore } from '@/stores/accountStore'

const props = defineProps<{
	account: Account
}>()

const store = useAccountStore()

// Локальное состояние для текста меток (чтобы удобно редактировать строку)
const labelsString = ref(props.account.labels.map(l => l.text).join('; '))

// Состояние валидации
const errors = ref({
	login: false,
	password: false,
})

// Типы для селекта
const typeOptions = [
	{ value: 'LDAP', label: 'LDAP' },
	{ value: 'Локальная', label: 'Локальная' },
]

// Обработка меток при потере фокуса
const handleLabelsBlur = () => {
	const labelArray = labelsString.value
		.split(';')
		.map(s => s.trim())
		.filter(s => s.length > 0)
		.map(text => ({ text }))

	store.updateAccount(props.account.id, { labels: labelArray })
}

// Логика смены типа записи
const handleTypeChange = (newType: AccountType) => {
	const update: Partial<Account> = { type: newType }
	if (newType === 'LDAP') {
		update.password = null
		errors.value.password = false // Сбрасываем ошибку, так как поле скроется
	} else {
		update.password = ''
	}
	store.updateAccount(props.account.id, update)
}

// Валидация потере фокуса
const validateField = (field: 'login' | 'password') => {
	if (field === 'login') {
		errors.value.login =
			!props.account.login || props.account.login.length > 100
	}

	if (field === 'password' && props.account.type === 'Локальная') {
		errors.value.password =
			!props.account.password || props.account.password.length > 100
	}

	// Сохраняем актуальное состояние в стор (хотя Pinia через watch в сторе и так подхватит)
	store.updateAccount(props.account.id, { [field]: props.account[field] })
}

const remove = () => {
	store.removeAccount(props.account.id)
}
</script>

<template>
	<div class="account-row">
		<el-input
			v-model="labelsString"
			placeholder="Метки через ;"
			maxlength="50"
			@blur="handleLabelsBlur"
		/>

		<el-select
			v-model="props.account.type"
			@change="handleTypeChange"
			placeholder="Тип"
		>
			<el-option
				v-for="item in typeOptions"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			/>
		</el-select>

		<el-input
			v-model="props.account.login"
			:class="{ 'is-error': errors.login }"
			placeholder="Логин"
			maxlength="100"
			@blur="validateField('login')"
		/>

		<div class="password-wrapper">
			<el-input
				v-if="props.account.type === 'Локальная'"
				v-model="props.account.password"
				:class="{ 'is-error': errors.password }"
				type="password"
				show-password
				placeholder="Пароль"
				maxlength="100"
				@blur="validateField('password')"
			/>
		</div>

		<el-button type="danger" :icon="Delete" circle @click="remove" />
	</div>
</template>

<style scoped>
.account-row {
	display: grid;
	grid-template-columns: 1fr 150px 1fr 1fr 40px;
	gap: 15px;
	align-items: start;
	margin-bottom: 10px;
}

/* Явно подсвечиваем рамку, когда есть ошибка */
:deep(.is-error .el-input__wrapper) {
	box-shadow: 0 0 0 1px #f56c6c inset !important; /* Напрямую красный цвет */
}

/* Добавим небольшой эффект при фокусе на ошибочном поле */
:deep(.is-error .el-input__wrapper:hover) {
	box-shadow: 0 0 0 1px #f56c6c inset !important;
}
</style>
