import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Contacts extends Form<IOrderForm> {
	protected _submit: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`order:submit`);
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
