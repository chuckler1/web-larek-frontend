import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ProductAPI } from './components/ProductAPI';
import { CDN_URL, API_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { Card, BasketItem } from './components/Card';
import { Modal } from './components/common/Modal';
import { IProductItem, IOrderForm } from './types/index';
import { Basket } from './components/common/Basket';
import {Order} from "./components/Order";
import { Success } from './components/common/Success';
import { Contacts } from './components/Contacts';

const events = new EventEmitter();
const api = new ProductAPI(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Изменились элементы каталога
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
  });
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});

	page.counter = appData.order.items.length;
});

// Открыть превью
events.on('card:select', (item: IProductItem) => {
  if (item) {
      api.getProductItem(item.id)
          .then((result) => {
              const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
                onClick: (event) => {
                  const button = event.target as HTMLButtonElement;
                  if (button.textContent === 'Купить') {
                    button.textContent = 'В Корзину'; // Меняем текст кнопки
                    appData.toggleOrderedLot(item.id, true); // Добавлем id заказа в поле appData.order.items
                    page.counter = appData.order.items.length;
                  } else if (button.textContent === 'В Корзину') {
                    events.emit('basket:open', item);
                  }
                }
            });
              modal.render({
                  content: card.render({
                      title: result.title,
                      image: result.image,
                      description: result.description,
                      price: result.price,
                      category: result.category
                  })
              });
          })
          .catch((err) => {
              console.error(err);
          })
  } else {
      modal.close();
  }
});

// Открыть корзину
events.on('basket:open', () => {
  basket.items = appData.getCards().map((item, i) => {
    const card = new BasketItem(cloneTemplate(basketCardTemplate), {
      onClick: () => { // Обработчик удаления из корзины заказа
        appData.toggleOrderedLot(item.id, false);
        page.counter = appData.order.items.length;
        basket.items = basket.items.filter(i => i.dataset.id !== item.id);
      }
    });
    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: i + 1
    })
  });
  basket.total = appData.getTotal();
  basket.selected = appData.order.items;
  modal.render({
    content: basket.render()
  });
})

// Открыть форму заказа 
events.on('order:open', () => {
  modal.render({
      content: order.render({
          address: '',
          valid: false,
          errors: []
      })
  });
});

// Открыть форму контактов
events.on('contacts:open', () => {
  modal.render({
      content: contacts.render({
          email: '',
          phone: '',
          valid: false,
          errors: []
      })
  });
});

// Отправлена форма заказа
events.on('order:submit', () => {
  api.orderProduct(appData.order)
      .then((result) => {
          appData.clearBasket();
          const success = new Success(cloneTemplate(successTemplate), {
              onClick: () => {
                  modal.close();
              }
          });
          modal.render({
              content: success.render({
                total: result.total
              })
          });
      })
      .catch(err => {
          console.error(err);
      });
});

// Изменилось состояние валидации формы адреса и способа оплаты
events.on('formOrderErrors:change', (errors: Partial<IOrderForm>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации формы контактных данных
events.on('formContactsErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on('order:change', (data: { field: keyof IOrderForm, value: string}) => {
  appData.setOrderField(data.field, data.value);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});
// Получаем заказы с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
