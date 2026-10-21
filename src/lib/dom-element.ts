import {DOCUMENT} from '@angular/common';
import {Inject} from '@angular/core';

import {TAllEvents, TSelector, TTypeAppend} from './dom.interface';


/**
 * Предоставляет методы для манипуляции DOM элементами
 *
 * Класс включает функционал для:
 * - Создания элементов
 * - Добавления и удаления элементов из DOM
 * - Поиска элементов с повторными попытками
 * - Навигации по DOM дереву
 * - Работы с data-атрибутами
 */
export class DomElement {

	private _countGetElement = 0;

	constructor(@Inject(DOCUMENT) public document: Document) {
	}

	/**
	 * Создает новый DOM элемент с указанным тегом и CSS классом
	 *
	 * @param tagName - HTML тег создаваемого элемента (div, span, button и т.д.)
	 * @param className - CSS класс для элемента (опционально)
	 * @returns Новый DOM элемент
	 *
	 * @example
	 * const div = worker.createElement('div', 'container');
	 * const span = worker.createElement('span');
	 */
	createElement(tagName: string, className?: string): HTMLElement {
		const element = this.document.createElement(tagName);
		if (className) {
			element.className = className;
		}
		return element;
	}

	/**
	 * Создает и добавляет новый HTML элемент в DOM
	 *
	 * @param parentElement - Родительский элемент, к которому будет добавлен новый
	 * @param newElement - HTML тег создаваемого элемента
	 * @param typeAppend - Способ добавления ('appendChild' или 'insertBefore')
	 * @param strInnerHTML - Внутреннее HTML содержимое (опционально)
	 * @param dataId - Значение для атрибута data-id (опционально)
	 * @param eventName - Тип события для добавления слушателя
	 * @param fn - Функция-обработчик события (опционально)
	 *
	 * @example
	 * worker.elementCreate(
	 *   this.document.body,
	 *   'button',
	 *   'appendChild',
	 *   'Click me',
	 *   123,
	 *   'click',
	 *   () => console.log('Clicked')
	 * );
	 */
	elementCreate(
		parentElement: HTMLElement,
		newElement: string,
		typeAppend: TTypeAppend,
		strInnerHTML: string = '',
		dataId: number | string = '',
		eventName: TAllEvents,
		fn: ((event: Event, ...args: any[]) => void) | null = null
	): void {
		if (!parentElement || !newElement) {
			return;
		}

		const el$ = this.document.createElement(newElement);

		if (dataId !== null) {
			el$.setAttribute('data-id', String(dataId));
		}

		if (strInnerHTML) {
			el$.innerHTML = strInnerHTML;
		}

		this.elementAdd(parentElement, typeAppend, dataId, eventName, fn, el$);
	}

	/**
	 * Добавляет существующий HTML элемент в DOM
	 *
	 * @param parentElement - Родительский элемент
	 * @param typeAppend - Способ добавления ('appendChild' или 'insertBefore')
	 * @param dataId - Идентификатор для атрибута data-id
	 * @param eventName - Тип события для слушателя
	 * @param fn - Функция-обработчик события
	 * @param el$ - Добавляемый DOM элемент
	 *
	 * @remarks
	 * Если typeAppend равен 'insertBefore', элемент добавляется в начало родителя.
	 * В противном случае элемент добавляется в конец.
	 */
	elementAdd(
		parentElement: HTMLElement,
		typeAppend: TTypeAppend,
		dataId: number | string,
		eventName: TAllEvents,
		fn: ((event: Event, ...args: any[]) => void) | null,
		el$: HTMLElement
	): void {
		if ('firstChild' in parentElement) {
			if (typeAppend === 'insertBefore') {
				(parentElement as Node).insertBefore(el$, parentElement.firstChild);
			} else {
				(parentElement as Node).appendChild(el$);
			}
		} else {
			(parentElement as Node).appendChild(el$);
		}

		if (fn) {
			el$.addEventListener(eventName, event => {
				fn.call(null, event, null, el$, dataId);
			});
		}
	}

	/**
	 * Удаляет HTML элемент из DOM
	 *
	 * @param parentElement - Родительский элемент, содержащий удаляемый элемент
	 * @param el$ - Удаляемый DOM элемент
	 *
	 * @remarks
	 * Метод безопасно завершается, если parentElement или el$ отсутствуют
	 */
	elementRemove(parentElement: HTMLElement, el$: HTMLElement): void {
		if (parentElement && el$) {
			(parentElement as Node).removeChild(el$);
		}
	}

	/**
	 * Асинхронно получает HTML элемент с повторными попытками
	 *
	 * @param identifier - Селектор для поиска элемента
	 * @param selector - Метод поиска ('querySelector' или 'querySelectorAll')
	 * @param node - DOM узел для поиска (по умолчанию this.document)
	 * @param time - Задержка между попытками в мс (по умолчанию 300)
	 * @param max - Максимальное количество попыток (по умолчанию 10)
	 * @returns Промис с найденным DOM элементом
	 *
	 * @remarks
	 * Метод полезен для ожидания появления динамически создаваемых элементов
	 */
	async elementGet(
		identifier: string,
		selector: TSelector = 'querySelector',
		node: Document | HTMLElement | null = this.document,
		time: number = 300,
		max: number = 10
	): Promise<HTMLElement> {
		let result = await this._getElementResult(identifier, selector, node, time);

		if ((!result || (result instanceof NodeList && result.length < 1)) && this._countGetElement < max) {
			this._countGetElement++;
			result = await this.elementGet(identifier, selector, node, time, max);
		}

		return result;
	}

	/**
	 * Находит элементы по data-атрибуту или его значению
	 *
	 * @param elementToSelect - Название data-атрибута (например, 'data-id')
	 * @param dataValue - Значение атрибута для фильтрации (опционально)
	 * @returns Массив найденных элементов
	 * @throws {Error} Если elementToSelect не указан
	 *
	 * @example
	 * // Найти все элементы с data-id
	 * const items = worker.getElementByDataAttribute('data-id');
	 *
	 * // Найти элемент с конкретным значением
	 * const item = worker.getElementByDataAttribute('data-id', '123');
	 */
	getElementByDataAttribute(elementToSelect: string, dataValue: string | null = null): HTMLElement[] {
		if (!elementToSelect) {
			throw new Error('elementToSelect is required for getElementByDataAttribute');
		}
		const selector = dataValue ? `[${elementToSelect}='${dataValue}']` : `[${elementToSelect}]`;
		const elements = this.document.querySelectorAll(selector);
		return Array.from(elements) as HTMLElement[];
	}

	/**
	 * Внутренний метод для получения элемента с задержкой
	 *
	 * @param identifier - Селектор элемента
	 * @param selector - Метод поиска
	 * @param node - Корневой узел
	 * @param time - Время задержки в мс
	 * @returns Промис с результатом поиска
	 * @private
	 */
	private async _getElementResult(
		identifier: string,
		selector: TSelector,
		node: Document | HTMLElement | null,
		time: number
	): Promise<HTMLElement> {
		return this._setDelay(time)
			.then(_ => {
				if (!node) {
					return null;
				}
				// Используем type assertion для вызова метода
				const result = (node as any)[selector](identifier);
				return result || null;
			})
			.catch(error => console.log('Ошибка в _getElementResult', error));
	}

	/**
	 * Создает Promise с задержкой
	 *
	 * @param ms - Время задержки в миллисекундах
	 * @returns Promise, который разрешается через указанное время
	 * @private
	 */
	private _setDelay(ms: number): Promise<unknown> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 * Возвращает размеры элемента и его положение относительно viewport
	 *
	 * @param element - Целевой DOM элемент
	 * @returns DOMRect объект с координатами (top, left, right, bottom) и размерами (width, height)
	 * @throws {Error} Если element не указан
	 *
	 * @example
	 * const rect = worker.getCoordinates(buttonElement);
	 * console.log(rect.top, rect.left, rect.width);
	 */
	getCoordinates(element: HTMLElement): DOMRect {
		if (!element) {
			throw new Error('Element is required for getCoordinates');
		}
		return element.getBoundingClientRect();
	}

	/**
	 * Возвращает родительский элемент указанного DOM узла
	 *
	 * @param el - DOM элемент или NodeList
	 * @returns Родительский элемент или null, если родителя нет
	 */
	elementGetParent(el: Element | NodeList): Node & ParentNode | null {
		if (el && 'parentNode' in el) {
			return el.parentNode as Node & ParentNode;
		}

		return null;
	}

	/**
	 * Возвращает все соседние элементы (включая сам элемент)
	 *
	 * @param el - Исходный DOM элемент
	 * @returns Массив всех элементов в текущей ветке DOM дерева
	 *
	 * @remarks
	 * Метод собирает все элементы на одном уровне вложенности
	 */
	elementsGetSiblingAll(el: Element | NodeList): Element[] {
		if (el && 'parentNode' in el) {
			const parent = el.parentNode as Node & ParentNode;
			const firstElement = parent.firstChild as Element;
			return this.elementGetSiblingNext(firstElement);
		}
		return [];
	}

	/**
	 * Возвращает все следующие соседние элементы (nextElementSibling)
	 *
	 * @param el - Исходный DOM элемент
	 * @returns Массив элементов, начиная с указанного и включая все следующие
	 *
	 * @example
	 * const nextElements = worker.elementGetSiblingNext(currentElement);
	 * // Возвращает [currentElement, nextElement, nextNextElement, ...]
	 */
	elementGetSiblingNext(el: Element | NodeList): Element[] {
		const result: Element[] = [];

		while (el) {
			if ('nextElementSibling' in el) {
				result.push(el as Element);
				el = (el as Element).nextElementSibling as Element;
			} else {
				break;
			}
		}

		return result;
	}

	/**
	 * Возвращает все предыдущие соседние элементы (previousSibling)
	 *
	 * @param el - Исходный DOM элемент
	 * @returns Массив предыдущих элементов
	 *
	 * @remarks
	 * Возвращает все элементы, включая указанный, в обратном порядке
	 */
	elementGetSiblingPrevious(el: Element | NodeList | Node): Element[] {
		const result: Element[] = [];
		let current: Node | null = el as Node;

		while (current) {
			result.push(current as Element);
			current = current.previousSibling;
		}

		return result;
	}

	/**
	 * Возвращает все прямые дочерние элементы указанного родителя
	 *
	 * @param el - Родительский DOM элемент
	 * @returns Массив дочерних элементов
	 *
	 * @example
	 * const children = worker.elementGetChildren(parentElement);
	 * children.forEach(child => console.log(child.tagName));
	 */
	elementGetChildren(el: Element): Element[] {
		return Array.from(el.children) as Element[];
	}
}
