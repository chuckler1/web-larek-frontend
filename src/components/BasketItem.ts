import { Card, ICardActions } from './Card';

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
