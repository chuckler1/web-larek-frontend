# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Базовый код

## Класс Model 

  Базовая модель, инициализирует приходящие в конструктор данные и события. Имеет метод emitChanges,
который сообщает об изменении модели другим компонентам, подписанным на приходящие в метод события 

## Класс Component

  Базовый компонент слоя отображения, использует методы для работы с DOM в дочерних компонентах:
**toggleClass** - для работы с атрибутом класс, **setText** - установка текста, **setDisabled** - установка атрибута Disabled, 
**setHidden** - скрытие элемента, **setVisible** - показ элемента, **setImage** - установка src и alt элементу изображения,
**render** - рендер DOM-элемента.

## Класс EventEmitter

  Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.

  Класс имеет методы **on** , **off** , **emit** — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.
Дополнительно реализованы методы **onAll** и **offAll** — для подписки на все события и сброса всех
подписчиков.

  Метод **trigger**, генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
классы будут генерировать события, не будучи при этом напрямую зависимыми от
класса  EventEmitter.

## Класс Api

  Базовый класс для работы с API. Конструктор принимает базовый URL и опции заголовка запроса.
Имеет методы **handleResponse** - для обработки ответа, **get** - запрос GET, **post** - запрос POST.

# Модель данных 

## Класс AppState

  Является дочерним класса Model, имеет поля *catalog* - для хранения объектов с данными товаров, 
*order* - сохраняет данные при оформлении заказа, *formOrderErrors* и *formContactsErrors* - хранит 
сообщения ошибок.

	Работает с такими методами, как **toggleOrderedItem** - для записи или удаления в/из order id заказов,
**clearBasket** - для очистки корзины, полного удаления всех id из order, очистка полей формы и инициирование 
события изменения корзины, **getTotal** - для вычисления суммы товаров, **setCatalog** - для занесения в 
каталог единиц товара, приходящих с API, также инициирует событие рендеринга всех карт на странице, 
**getCards** - получаем массив из единиц товара, **setOrderField** - принимет данные из форм и запускает 
методы валидации - **validateOrder** и **validateContacts**, **clearOrderFields()** - очистка полей формы,
**isFilledFieldsOrder()** и **isFilledFieldsContacts()** - проверка полей на заполненность.

# Компонент представления

## Класс ProductAPI

  Дочерний класс Api, работает с запросами и ответами сервера. 
Имеет интерфейс: 
```
export interface IProductAPI {
	getProductList: () => Promise<IProductItem[]>; // для получения списка товаров
	getProductItem: (id: string) => Promise<IProductItem>; // для получения единицы товара
	orderProduct: (order: IOrder) => Promise<IOrderResult>; // для отправки данных оформленного товара
}
```
# Классы отображения 

## Класс Page

  Хранит в себе DOM - элементы, служит для отображения элементов: *_counter* - для счетчика заказов, имеет 
сеттер для установки количества, *_catalog* - обертка для отображения карт товаров, имеет сеттер 
получающий DOM карт, *_wrapper* - обертка с сеттером для установки блокировки скролла страницы,
*_basket* - кнопка корзины.

## Класс Card 

  Является классом, определяющим общий функционал карточки продукта. Он принимает в 
конструкторе название блока, контейнер, в который нужно разместить карточку, и объект действий, которые могут быть 
выполнены на карточке. В классе определены следующие свойства:

- *_title* - HTMLElement, представляющий заголовок карточки.
- *_image* - HTMLImageElement, представляющий изображение карточки.
- *_price* - HTMLElement, представляющий цену карточки.
- *_category* - HTMLElement, представляющий категорию карточки.
- *_description* - HTMLElement, представляющий описание карточки.
- *_button* - HTMLButtonElement, представляющий кнопку для выполнения действий на карточке.
- *_buttonModal* - HTMLButtonElement, представляющий кнопку для вызова модального окна.

Кроме того, класс определяет следующие методы:

- **set id(value: string)** - устанавливает значение атрибута data-id контейнера карточки.
- **get id(): string** - возвращает значение атрибута data-id контейнера карточки.
- **set title(value: string)** - устанавливает значение заголовка карточки.
- **get title(): string** - возвращает значение заголовка карточки.
- **set image(value: string)** - устанавливает значение src изображения карточки.
- **set price(value: number)** - устанавливает значение цены карточки.
- **set category(value: string)** - устанавливает значение категории карточки.
- **set description(value: string | string[])** - устанавливает значение описания карточки.
- **isCartEmpty(value: boolean)** - устанавливает текст кнопки карточки.

## Класс BasketItem 

  Наследуется от класса Card, используется для отображения единиц заказа в корзине,
и дополнительно определяет свойства:

- *_index* - HTMLElement, представляющий индекс карточки в корзине.
- *_button* - HTMLButtonElement, представляющий кнопку удаления карточки из корзины.

Кроме того, класс определяет методы:
- **set index(value: number)** - устанавливает значение индекса карточки в корзине.

## Класс Basket

Наследуется от класса Component, используется для отображения корзины заказа 
на сайте, и дополнительно определяет следующие свойства:

- *_list* - HTMLElement, представляющий список единиц заказа в корзине.
- *_total* - HTMLElement, представляющий общую стоимость заказа в корзине.
- *_button* - HTMLElement, представляющий кнопку оформления заказа.

Кроме того, класс определяет следующие методы:
- **set items(items: HTMLElement[])** - устанавливает список единиц заказа в корзине.
- **get items(): HTMLElement[]** - возвращает список единиц заказа в корзине.
- **set selected(items: string[])** - устанавливает активность/неактивность кнопки.
- **set total(total: number)** - устанавливает общую стоимость заказа в корзине.

Конструктор класса принимает в качестве аргументов контейнер, в который нужно разместить 
компонент, и объект событий, используемый для взаимодействия с другими компонентами 
приложения. В конструкторе инициализируются элементы компонента, добавляется обработчик 
событий на кнопку оформления заказа, а также инициализируются свойства класса. Методы 
класса позволяют устанавливать список единиц заказа, активность кнопки, а также общую 
стоимость заказа.

## Класс Modal 

  Представляет собой модальное окно, которое реализовано на основе класса Component. 
В классе определены следующие свойства:

- *_closeButton* - HTMLButtonElement, представляющий кнопку закрытия модального окна.
- *_content* - HTMLElement, содержимое модального окна.

В конструкторе класса инициализируются элементы модального окна, добавляются 
обработчики событий для закрытия окна по клику на кнопку и на сам контейнер, 
а также для предотвращения закрытия модального окна при клике на его содержимое.

Класс Modal определяет также следующие методы:

- **set content(value: HTMLElement)** - устанавливает содержимое модального окна.
- **open()** - открывает модальное окно.
- **close()** - закрывает модальное окно.
Метод render() класса Modal реализован в соответствии со стандартом Component и позволяет 
отрисовать модальное окно с заданными данными. В этом методе также вызывается метод open() 
для открытия модального окна и возвращается контейнер модального окна.

## Класс Form 

Представляет собой класс формы, который наследуется от класса Component.

В конструкторе класса Form определены следующие свойства:
- *protected _errors: HTMLElement* - элемент, в который будут выводиться ошибки валидации формы.
- *protected container: HTMLFormElement* - форма, в которую будут вставляться поля ввода.
- *protected events: IEvents* - обработчик событий формы.

В классе Form определены следующие методы:
- **protected onInputChange(field: keyof T, value: string)** - метод, вызываемый при изменении 
значения поля формы. Он отправляет событие order:change с обновленными значениями полей формы.
- **protected onPaymentChange(value: string)** - метод, вызываемый при изменении значения поля 
формы "способ оплаты". Он отправляет событие order:change с обновленным значением поля "payment".
- **set errors(value: string)** - метод, устанавливающий текст ошибок валидации формы.
- **render(state: Partial<T> & IFormState)** - метод, рендерирующий форму с указанным состоянием. 
Он вызывает метод render родительского класса Component и присваивает значения полей формы 
свойствам контейнера формы.

Поля формы могут быть любого типа, определенного в шаблоне T. В конструкторе класса Form 
определяется обработчик события input для каждого поля формы. При изменении значения поля 
формы вызывается метод onInputChange с именем поля и его значением в качестве аргументов. 
При изменении значения поля "способ оплаты" вызывается метод onPaymentChange с новым 
значением поля.

## Класс Order 

Наследуется от класса Form и представляет собой класс формы заказа.

В конструкторе класса Order определены следующие свойства:
- *protected _submit: HTMLButtonElement* - кнопка отправки формы заказа.
- *protected _buttonCash: HTMLButtonElement* - кнопка оплаты заказа наличными.
- *protected _buttonCard: HTMLButtonElement* - кнопка оплаты заказа банковской картой.

Конструктор класса Order вызывает конструктор родительского класса Form с двумя 
аргументами: формой заказа container и объектом событий events. Далее в конструкторе 
класса Order инициализируются свойства _submit, _buttonCash и _buttonCard. Если элемент 
с именем cash существует, добавляется обработчик события click на элемент, который 
вызывает метод onPaymentChange с аргументом 'offline' и добавляет класс button_alt-active 
к элементу. Аналогичным образом работает и обработчик события click на элементе с именем card. 
В конце конструктора добавляется обработчик события submit на форму заказа, который вызывает 
метод preventDefault на событии и отправляет событие 'contacts:open' через объект events.

Класс Order определяет также следующие методы:
- **set valid(value: boolean)** - устанавливает доступность кнопки отправки формы заказа в 
зависимости от значения value.
- **set address(value: string)** - устанавливает значение адреса доставки в форме заказа.

## Класс Contacts 

Наследуется от класса Form и представляет собой класс формы для ввода контактной 
информации заказа. 

В конструкторе класса Contacts определены следующие свойства:
- *protected _submit: HTMLButtonElement* - кнопка отправки формы контактной информации.

Конструктор класса Contacts вызывает конструктор родительского класса Form с двумя 
аргументами: формой контактной информации container и объектом событий events. 
Далее в конструкторе класса Contacts инициализируется свойство _submit. 
Затем добавляется обработчик события submit на форму контактной информации, 
который вызывает метод preventDefault на событии и отправляет событие 
order:submit через объект events.

Класс Contacts определяет также следующие методы:
- **set valid(value: boolean)** - устанавливает доступность кнопки отправки формы контактной 
информации в зависимости от значения value.
- **set phone(value: string)** - устанавливает значение номера телефона в форме 
контактной информации.
- **set email(value: string)** - устанавливает значение адреса электронной 
почты в форме контактной информации.

## Класс Success 

Представляет собой класс, который отображает сообщение о успешном оформлении заказа 
и общее количество списанных "синапсов".

В конструкторе класса Success определены следующие свойства:
- *protected _close: HTMLElement* - кнопка закрытия сообщения о успешном оформлении заказа.
- *protected _total: HTMLElement* - элемент для отображения общего количества списанных "синапсов".

Конструктор класса Success вызывает конструктор родительского класса Component с аргументами 
container и actions (объект, содержащий метод onClick для обработки события клика по кнопке закрытия). 
Далее в конструкторе класса Success инициализируются свойства _total и _close. 

Класс Success определяет также следующий метод:
- **set total(total: number)** - устанавливает текстовое содержимое элемента _total 
в виде строки "Списано {total} синапсов".

# Типы данных

```
// Структура карточки заказа
export interface IProductItem {
	id: string; // id заказа
	category: string; // категория Софт-скил, Хард-скил...
	title: string; // Наименование заказа
	description?: string; // Описание, идет в превью
	image: string; // Изображение заказа
	price: number | string; // Его цена
}

// Слой данных приложения
export interface IAppState {
	catalog: IProductItem[]; // Хранит данные заказов
	order: IOrder | null; // Хранит данные заказов, попавших в корзину
}

// Ошибки в форме заказа
export type FormOrderErrors = {
	address?: string; // Инпут адреса
	payment?: string; // Способ оплаты
};

// Ошибки в форме контактов
export type FormContactsErrors = {
	email?: string; // Почта
	phone?: string; // Телефон
};

// Структура формы
export interface IOrderForm extends FormOrderErrors, FormContactsErrors {}

// Структура заказа
export interface IOrder extends IOrderForm {
	items: string[]; // id заказов в корзине
	total: number; // Их сумма
}

// Результат оформления заказа приходящий с API
export interface IOrderResult {
	id: string;
	total: number;
}
```
