import { Component } from './base/Component';
import { IProductItem } from '../types';
import { bem, createElement, ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card<T extends IProductItem | {}> extends Component<
	T | IProductItem
> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _buttonModal?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._category = container.querySelector(`.${blockName}__category`);
		this._buttonModal = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);

		if (actions?.onClick) {
			if (this._buttonModal) {
				// Ставим событие на кнопку купить в превью заказа
				this._buttonModal.textContent = 'Купить';
				this._buttonModal.addEventListener('click', actions.onClick);
			} else {
				// Ставим событие на заказ в гадерее
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number) {
		if (value) {
			this.setText(this._price, value + ' синапсов');
		} else {
			// Если нет цены
			this._price.textContent = '';
			this.setDisabled(this._buttonModal, true);
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
		const category: Record<string, string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			кнопка: 'button',
			другое: 'other',
			дополнительное: 'additional',
		};
		this.toggleClass(
			this._category,
			bem(this.blockName, 'category', category[value]).name,
			true
		);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set textButton(value: string) {
		this.setText(this._buttonModal, value);
	}
}

export type BasketItemIndex = {
	index: number;
};

export class BasketItem extends Card<BasketItemIndex> {
	protected _index: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container);

		this._index = container.querySelector('.basket__item-index');
		this._button = container.querySelector('.basket__item-delete');

		if (this._button) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}
