import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {IEvents} from "./base/events";
import { ensureElement } from "../utils/utils";

export class Order extends Form<IOrderForm> {
    protected _submit: HTMLButtonElement;    
    protected _buttonCash: HTMLButtonElement;
    protected _buttonCard: HTMLButtonElement;
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._buttonCash = container.querySelector('[name=cash]');
        this._buttonCard = container.querySelector('[name=card]');

        if (this._buttonCash) {
            this._buttonCash.addEventListener('click', () => {
                this.onPaymentChange('offline');
                this._buttonCash.classList.add('button_alt-active');
                this._buttonCard.classList.remove('button_alt-active');
            })
        }

        if (this._buttonCard) {
            this._buttonCard.addEventListener('click', () => {
                this.onPaymentChange('online');
                this._buttonCard.classList.add('button_alt-active');
                this._buttonCash.classList.remove('button_alt-active');
            })
        }

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit('contacts:open');
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}