import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { DomClass } from './dom/dom-class';
import { DomElement } from './dom/dom-element';
import { DomStyle } from './dom/dom-style';

@Component({
  selector: 'lib-tool-dom-ang15',
  templateUrl: './tool-dom-ang15.component.html',
  styleUrls: ['./tool-dom-ang15.component.scss'],
})
export class ToolDomAng15Component  implements OnInit, AfterViewInit {

  /** Ссылка на контейнер-песочницу (корень для addClassMarginPadding) */
  @ViewChild('sandbox', { static: true }) sandboxRef!: ElementRef<HTMLElement>;

  /** Ссылка на целевой элемент для манипуляций классами/стилями */
  @ViewChild('target', { static: true }) targetRef!: ElementRef<HTMLElement>;

  /** Ссылка на контейнер для динамически создаваемых элементов */
  @ViewChild('dynamicHost', { static: true }) dynamicHostRef!: ElementRef<HTMLElement>;

  /** Лог операций */
  public logHtml: string[] = [];

  /** Публичные экземпляры сервисов */
  public dom!: DomElement;
  public cls!: DomClass;
  public style!: DomStyle;

  /** Счётчик созданных элементов */
  private _createdCounter = 0;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    // Инициализация — DomClass зависит от DomElement
    this.dom = new DomElement(this.document);
    this.cls = new DomClass(this.document);
    this.style = new DomStyle();

    this._log('✅ ToolDomComponent: сервисы инициализированы');
  }

  ngAfterViewInit(): void {
    this._log('✅ ToolDomComponent: view инициализирован, DOM доступен');
  }

  // ============================================================
  // DOM ELEMENT — демонстрации
  // ============================================================

  /** createElement */
  demoCreateElement(): void {
    const el = this.dom.createElement('div', 'created-box');
    el.textContent = `createElement #${++this._createdCounter}`;
    this.dynamicHostRef.nativeElement.appendChild(el);
    this._log(`createElement → <div class="created-box">`);
  }

  /** elementCreate (создание + вставка + событие) */
  demoElementCreate(): void {
    this.dom.elementCreate(
      this.dynamicHostRef.nativeElement,
      'button',
      'appendChild',
      `Кнопка #${++this._createdCounter} — кликни меня`,
      `btn-${this._createdCounter}`,
      'click',
    );
    this._log('elementCreate → <button> c обработчиком click');
  }

  /** elementAdd (вставка существующего) */
  demoElementAdd(): void {
    const el = this.dom.createElement('span', 'added-span');
    el.textContent = ` insertBefore #${++this._createdCounter} `;

    this.dom.elementAdd(
      this.dynamicHostRef.nativeElement,
      'insertBefore',
      'span-x',
      'mouseenter',
      () => this._log('🖱 mouseenter на вставленном <span>'),
      el
    );
    this._log('elementAdd → insertBefore <span>');
  }

  /** elementRemove */
  demoElementRemove(): void {
    const host = this.dynamicHostRef.nativeElement;
    const last = host.lastElementChild as HTMLElement;
    if (last) {
      this.dom.elementRemove(host, last);
      this._log(`elementRemove → удалён <${last.tagName.toLowerCase()}>`);
    } else {
      this._log('elementRemove → нечего удалять');
    }
  }

  /** elementGet (асинхронный поиск с повторными попытками) */
  async demoElementGet(): Promise<void> {
    this._log('elementGet → ждём появления .appears-later ...');

    // Создадим элемент через 1 секунду
    setTimeout(() => {
      const el = this.dom.createElement('div', 'appears-later');
      el.textContent = 'Я появился позже!';
      this.dynamicHostRef.nativeElement.appendChild(el);
    }, 1000);

    const found = await this.dom.elementGet('.appears-later');
    this._log(`elementGet → найден: "${found?.textContent ?? 'null'}"`);
  }

  /** getElementByDataAttribute */
  demoGetByDataAttr(): void {
    const all = this.dom.getElementByDataAttribute('data-id');
    this._log(`getElementByDataAttribute('data-id') → найдено: ${all.length}`);

    if (all.length) {
      const first = this.dom.getElementByDataAttribute('data-id', all[0].dataset['id']!);
      this._log(`getElementByDataAttribute('data-id', '${all[0].dataset['id']}') → найдено: ${first.length}`);
    }
  }

  /** getCoordinates */
  demoGetCoordinates(): void {
    const rect = this.dom.getCoordinates(this.targetRef.nativeElement);
    this._log(
      `getCoordinates → top=${rect.top.toFixed(1)}, left=${rect.left.toFixed(1)}, ` +
      `w=${rect.width.toFixed(1)}, h=${rect.height.toFixed(1)}`
    );
  }

  /** elementGetParent */
  demoGetParent(): void {
    const parent = this.dom.elementGetParent(this.targetRef.nativeElement);
    this._log(
      `elementGetParent → <${parent && 'tagName' in parent ? (parent as HTMLElement).tagName.toLowerCase() : 'null'}>`
    );
  }

  /** elementsGetSiblingAll */
  demoSiblingsAll(): void {
    const all = this.dom.elementsGetSiblingAll(this.targetRef.nativeElement);
    this._log(`elementsGetSiblingAll → ${all.length} элемент(ов): ${all.map(e => e.tagName.toLowerCase()).join(', ')}`);
  }

  /** elementGetSiblingNext */
  demoSiblingsNext(): void {
    const next = this.dom.elementGetSiblingNext(this.targetRef.nativeElement);
    this._log(`elementGetSiblingNext → ${next.length} элемент(ов)`);
  }

  /** elementGetSiblingPrevious */
  demoSiblingsPrevious(): void {
    const prev = this.dom.elementGetSiblingPrevious(this.targetRef.nativeElement);
    this._log(`elementGetSiblingPrevious → ${prev.length} узел(ов) (включая текстовые)`);
  }

  /** elementGetChildren */
  demoGetChildren(): void {
    const kids = this.dom.elementGetChildren(this.dynamicHostRef.nativeElement);
    this._log(`elementGetChildren → ${kids.length} дочерних элемент(ов)`);
  }

  // ============================================================
  // DOM CLASS — демонстрации
  // ============================================================

  /** hasClass */
  demoHasClass(): void {
    const has = this.cls.hasClass(this.targetRef.nativeElement, 'demo-active');
    this._log(`hasClass('demo-active') → ${has}`);
  }

  /** addClass */
  demoAddClass(): void {
    const ok = this.cls.addClass(this.targetRef.nativeElement, 'demo-active');
    this._log(`addClass('demo-active') → ${ok}`);
  }

  /** addClasses (массово) */
  demoAddClasses(): void {
    this.cls.addClasses(this.targetRef.nativeElement, ['demo-a', 'demo-b', 'demo-c']);
    this._log('addClasses([demo-a, demo-b, demo-c]) → добавлены');
  }

  /** addClassMarginPadding — генерация утилит отступов */
  demoAddClassMarginPadding(): void {
    // Генерируем классы для значений 1..5 (соответствуют var(--evo1..5))
    this.cls.addClassMarginPadding(this.sandboxRef, [1, 2, 3, 4, 5]);

    // Применим один из сгенерированных классов
    this.cls.addClass(this.targetRef.nativeElement, 'evo-mt-2');
    this.cls.addClass(this.targetRef.nativeElement, 'evo-pl-3');

    this._log('addClassMarginPadding → сгенерированы .evo-{m|p}{t|r|b|l}-{1..5}, применены evo-mt-2, evo-pl-3');
  }

  /** deleteClassMarginPadding */
  demoDeleteClassMarginPadding(): void {
    this.cls.deleteClassMarginPadding();
    this._log('deleteClassMarginPadding → <style data-dynamic-style> удалён');
  }

  /** removeClass */
  demoRemoveClass(): void {
    const ok = this.cls.removeClass(this.targetRef.nativeElement, 'demo-active');
    this._log(`removeClass('demo-active') → ${ok}`);
  }

  /** toggleClass */
  demoToggleClass(): void {
    this.cls.toggleClass(this.targetRef.nativeElement, 'demo-toggled');
    this._log(`toggleClass('demo-toggled') → сейчас: ${this.cls.hasClass(this.targetRef.nativeElement, 'demo-toggled')}`);
  }

  /** toggleClass с force */
  demoToggleForce(): void {
    this.cls.toggleClass(this.targetRef.nativeElement, 'demo-forced', true);
    this._log("toggleClass('demo-forced', true) → принудительно добавлен");
  }

  /** getClasses */
  demoGetClasses(): void {
    const list = this.cls.getClasses(this.targetRef.nativeElement);
    this._log(`getClasses → [${list.join(', ')}]`);
  }

  /** clearClasses */
  demoClearClasses(): void {
    this.cls.clearClasses(this.targetRef.nativeElement);
    this._log('clearClasses → все классы удалены');
  }

  // ============================================================
  // DOM STYLE — демонстрации
  // ============================================================

  /** applyStyleProperty */
  demoApplyStyle(): void {
    this.style.applyStyleProperty(this.targetRef.nativeElement, 'background-color', '#ffe08a');
    this.style.applyStyleProperty(this.targetRef.nativeElement, 'border', '2px dashed #d97706');
    this._log("applyStyleProperty → 'background-color', 'border'");
  }

  /** getStyle */
  demoGetStyle(): void {
    const bg = this.style.getStyle(this.targetRef.nativeElement, 'background-color');
    this._log(`getStyle('background-color') → "${bg ?? 'null'}"`);
  }

  /** removeStyle */
  demoRemoveStyle(): void {
    this.style.removeStyle(this.targetRef.nativeElement, 'background-color');
    this._log("removeStyle('background-color') → удалён");
  }

  // ============================================================
  // Сброс / утилиты
  // ============================================================

  /** Полный сброс состояния песочницы */
  resetAll(): void {
    this.cls.clearClasses(this.targetRef.nativeElement);
    this.targetRef.nativeElement.removeAttribute('style');

    const host = this.dynamicHostRef.nativeElement;
    while (host.firstChild) { host.removeChild(host.firstChild); }

    this.cls.deleteClassMarginPadding();
    this._createdCounter = 0;

    this._log('🧹 Сброс: классы, стили, динамические элементы, dynamic-style');
  }

  /** Очистить лог */
  clearLog(): void {
    this.logHtml = [];
  }

  /** Внутреннее логирование */
  private _log(message: string): void {
    const time = new Date().toLocaleTimeString();

    this.logHtml.unshift(`[${time}] ${message}`);

    if (this.logHtml.length > 200) { this.logHtml.length = 200; }
      // eslint-disable-next-line no-console
      console.log(message);
  }
}
