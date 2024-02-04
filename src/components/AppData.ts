import _ from 'lodash';
import { Model } from './base/Model';
import {
	FormOrderErrors,
	FormContactsErrors,
	IAppState,
	IProductItem,
	IOrder,
	IOrderForm,
} from '../types';

export class ProductItem extends Model<IProductItem> {
	id: string;
	category: string;
	title: string;
	description?: string;
	image: string;
	price: number;
}

export class AppState extends Model<IAppState> {
	catalog: ProductItem[];
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
			this.order.items = _.uniq([...this.order.items, id]);
		} else {
			this.order.items = _.without(this.order.items, id);
		}
	}

	clearBasket() {
		this.order.items.forEach((id) => {
			this.toggleOrderedItem(id, false);
		});
	}

	getTotal() {
		return (this.order.total = this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		));
	}

	setCatalog(items: IProductItem[]) {
		this.catalog = items.map((item) => new ProductItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	getCards(): ProductItem[] {
		return this.catalog.filter((item) => this.order.items.includes(item.id));
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
