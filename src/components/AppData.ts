import { Model } from './base/Model';
import {
	FormOrderErrors,
	FormContactsErrors,
	IAppState,
	IProductItem,
	IOrder,
	IOrderForm,
} from '../types';

export class AppState extends Model<IAppState> {
	catalog: IProductItem[];
	order: IOrder = {
		email: '',
		phone: '',
		address: '',
		payment: '',
		total: null,
		items: [],
	};
	formOrderErrors: FormOrderErrors = {};
	formContactsErrors: FormContactsErrors = {};

	toggleOrderedItem(id: string, isIncluded: boolean) {
		if (isIncluded) {
			if (!this.order.items.includes(id)) {
				this.order.items.push(id);
			}
		} else {
			this.order.items = this.order.items.filter((it) => it !== id);
		}
	}

	clearBasket() {
		this.order.items.forEach((id) => {
			this.toggleOrderedItem(id, false);
		});
		// Очищаем поля формы
		this.clearOrderFields();
		// Обновляем корзину
		this.emitChanges('basket:changed', { order: this.order });
	}

	getTotal() {
		return (this.order.total = this.order.items.reduce(
			(a, c) => a + Number(this.catalog.find((it) => it.id === c).price),
			0
		));
	}

	setCatalog(items: IProductItem[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	getCards(): IProductItem[] {
		return this.catalog.filter((item) => this.order.items.includes(item.id));
	}
	// Проверка заполненности полей формы
	isFilledFieldsOrder(): boolean {
		return !!this.order.address && !!this.order.payment;
	}
 // Проверка заполненности полей формы
	isFilledFieldsContacts(): boolean {
		return !!this.order.email && !!this.order.phone;
	}

	clearOrderFields() {
		this.order.email = '';
		this.order.address = '';
		this.order.payment = '';
		this.order.phone = '';
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (field === 'address' || field === 'payment') {
			this.validateOrder();
		}

		if (field === 'email' || field === 'phone') {
			this.validateContacts();
		}
	}

	validateOrder() {
		const errors: typeof this.formOrderErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		this.formOrderErrors = errors;
		this.events.emit('formOrderErrors:change', this.formOrderErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formContactsErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formContactsErrors = errors;
		this.events.emit('formContactsErrors:change', this.formContactsErrors);
		return Object.keys(errors).length === 0;
	}
}
