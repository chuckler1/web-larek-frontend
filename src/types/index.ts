export interface IProductItem {
	// Структура карточки
	id: string;
	category: string;
	title: string;
	description?: string;
	image: string;
	price: number | string;
}

export interface IAppState {
	// Слой данных приложения
	catalog: IProductItem[];
	order: IOrder | null;
}

export interface IOrderForm
	extends FormOrderErrors,
		FormContactsErrors {} /* { // Структура формы
	email: string;
	phone: string;
	address: string;
	payment: string;
} */

export interface IOrder extends IOrderForm {
	// Структура заказа
	items: string[];
	total: number;
}

export type FormOrderErrors = {
	// Ошибки в форме заказа
	address?: string;
	payment?: string;
};

export type FormContactsErrors = {
	// Ошибки в форме контактов
	email?: string;
	phone?: string;
};

export interface IOrderResult {
	// Результат оформления заказа приходящий с API
	id: string;
	total: number;
}
