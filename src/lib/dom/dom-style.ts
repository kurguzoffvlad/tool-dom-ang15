/**
 * Класс для работы с DOM элементами
 */

export class DomStyle {
    //region Управление стилями


    applyStyleProperty(element: HTMLElement | null, property: string, value: string): void {
        if (!element || !property || !value) {
            return;
        }

        const trimmedProperty = property.trim();

        // Применяем к элементу
        element.style.setProperty(trimmedProperty, value);
    }

    removeStyle(element: HTMLElement | null, property: string): void {
        if (!element || !property) {
            return;
        }

        const trimmedProperty = property.trim();

        // Удаляем из элемента
        element.style.removeProperty(trimmedProperty);
    }

    getStyle(element: HTMLElement | null, property: string): string | null {
        if (!element || !property) {
            return null;
        }

        const trimmedProperty = property.trim();

        // Или получаем непосредственно с элемента
        return element.style.getPropertyValue(trimmedProperty) || null;
    }

    /**
     * Применение CSS-стилей через строку
     *
     * !!! очень осторожно так как метод стирает старое и присваивает значение для cssText
     *
     * @param {HTMLElement} element - элемент
     * @param stringStyles - строка со стилями
     *
     * @example
     * const root = document.documentElement as any;
     * const styles = `--big-page-width:${width}; --z-index: ${zIndex}`;
     *
     * this.setStylesString(root, styles);
     */
    // public setStylesString(element: HTMLElement | null, stringStyles: string | null): void {
    //     if (!element || !stringStyles) return;
    //
    //     element.style.cssText = stringStyles;
    // }

    //endregion
}
