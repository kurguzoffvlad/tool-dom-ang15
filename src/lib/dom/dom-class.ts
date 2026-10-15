import {ElementRef, Inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {DomElement} from "./dom-element";

/**
 * Класс для работы с классами DOM
 */
export class DomClass {
    public dom: DomElement;

    constructor(
        @Inject(DOCUMENT) public document: Document,
    ) {
        this.dom = new DomElement(this.document)
    }

    //region Управление классами
    /**
     * Проверяет наличие класса у элемента
     *
     * @param {HTMLElement} element - Элемент
     * @param {string} className - Класс
     *
     * @returns {boolean} true, если класс присутствует
     */
    hasClass(element: HTMLElement, className: string): boolean {
        return !!(className && element?.classList.contains(className));
    }

    /**
     * Добавляет класс элементу
     *
     * @param {HTMLElement} element - Элемент
     * @param {string} className - Класс
     *
     * @returns {boolean} true, если класс добавили
     */
    addClass(element: HTMLElement | null, className: string): boolean {
        if (className && element && 'classList' in element) {
            element.classList.add(className);

            return true;
        }

        return false;
    }

    /**
     * Массовое добавление CSS-классов
     *
     * @param {HTMLElement} element - Элемент
     * @param classNames - Массив названий CSS-классов для добавления
     */
    addClasses(element: HTMLElement | null, classNames: string[]): void {
        if (!element || !classNames || classNames.length === 0) {
            return;
        }

        classNames.forEach(className => {
            if (className && className.trim() !== '') {
                this.addClass(element, className.trim());
            }
        });
    }

    /**
     * Создает CSS-классы для margin и padding на основе переменных --evo{n}.
     * Классы генерируются для всех направлений (top, right, bottom, left).
     *
     * @param elementRef - Элемент для которого будут создаваться классы".
     * @param {number[]} arrVars - Значения для генерации классов.
     *
     */
    addClassMarginPadding(elementRef: ElementRef<HTMLElement>, arrVars: number[] = []): void {
        const root = this.dom.elementGetParent(elementRef.nativeElement);

        if (!root) {
            console.error('Root element not found');
            return;
        }

        const properties = ['m', 'p']; // margin, padding
        const directions = ['t', 'r', 'b', 'l']; // top, right, bottom, left
        let style = this.document.querySelector('style[data-dynamic-style]');

        if (!style) {
            style = this.document.createElement('style');
            style.setAttribute('data-dynamic-style', '');
            root.appendChild(style);
        }

        let cssContent = '';

        // Добавляем классы для arrVars (если массив не пустой)
        if (arrVars && arrVars.length > 0) {
            arrVars.forEach(value => {
                properties.forEach(prop => {
                    directions.forEach(dir => {
                        const className = `.evo-${prop}${dir}-${value}`;
                        const cssProperty = prop === 'm' ? 'margin' : 'padding';
                        const cssDirection = this._getCssDirection(dir);

                        cssContent += `${className} { ${cssProperty}-${cssDirection}: var(--evo${value}); }\n`;
                    });
                });
            });
        }

        style.textContent = cssContent;
    }

    /**
     * Удаление всех классов созданных в addClassMarginPadding (<style data-dynamic-style="">)
     *  @see {@link addClassMarginPadding} - Создает CSS-классы для margin и padding на основе переменных --evo{n}.
     */
    deleteClassMarginPadding(): void {
        this.document.querySelector('style[data-dynamic-style]')?.remove();
    }

    /**
     * Удаляет класс у элемента
     *
     * @param {HTMLElement} element - Элемент
     * @param {string} className - Класс
     *
     * @returns {boolean} true, если класс был удален
     */
    removeClass(element: HTMLElement | null, className: string): boolean {
        if (className && element && 'classList' in element) {
            element.classList.remove(className);

            return true;
        }

        return false;
    }

    /**
     * Переключает CSS-класс у корневого элемента
     *
     * @param {HTMLElement} element - Элемент
     * @param className - Название CSS-класса для переключения
     * @param force - Принудительно установить или удалить класс (true - добавить, false - удалить)
     */
    toggleClass(element: HTMLElement | null, className: string, force?: boolean): void {
        if (!element || !className) {
            return;
        }

        const trimmedClassName = className.trim();

        if (force !== undefined) {
            if (force) {
                this.addClass(element, trimmedClassName);
            } else {
                this.removeClass(element, trimmedClassName);
            }
        } else {
            // Переключаем на основе текущего состояния
            if (this.hasClass(element, trimmedClassName)) {
                this.removeClass(element, trimmedClassName);
            } else {
                this.addClass(element, trimmedClassName);
            }
        }
    }

    /**
     * Возвращает массив всех CSS-классов корневого элемента
     *
     * @param {HTMLElement} element - Элемент
     *
     * @returns Массив названий CSS-классов
     */
    getClasses(element: HTMLElement | null): string[] {
        if (element) {
            // Получаем актуальные классы с элемента
            return Array.from(element.classList);
        }

        return [];
    }

    /**
     * Удаляет все CSS-классы у корневого элемента и очищает кэш
     *
     * @param {HTMLElement} element - Элемент
     */
    clearClasses(element: HTMLElement | null): void {
        // Удаляем все классы с элемента
        if (element) {
            element.className = '';
        }
    }

    //endregion

    //region Приватные методы

    /**
     * Преобразует сокращенное направление (t, r, b, l) в полное название CSS-свойства.
     *
     * @param {string} dir - Сокращенное направление (t, r, b, l).
     * @returns {string} Полное название направления (top, right, bottom, left).
     */
    private _getCssDirection(dir: string): string {
        switch (dir) {
            case 't':
                return 'top';
            case 'r':
                return 'right';
            case 'b':
                return 'bottom';
            case 'l':
                return 'left';
            default:
                return '';
        }
    }

    //endregion
}
