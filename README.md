# DOM Playground (`lib-tool-dom-ang15`)

Демонстрационный Angular-компонент, показывающий работу трёх сервисов для манипуляции DOM:

- **`DomElement`** — создание, вставка, удаление и поиск элементов;
- **`DomClass`** — управление CSS-классами, включая генерацию утилит отступов `margin/padding`;
- **`DomStyle`** — работа с инлайн-стилями элемента.

Компонент представляет собой интерактивную «песочницу» с кнопками для вызова каждого метода и журналом операций.

---

## Содержание

- [Установка и запуск](#установка-и-запуск)
- [Структура](#структура)
- [Разметка (HTML)](#разметка-html)
- [Компонент (TS)](#компонент-ts)
- [Демонстрации по сервисам](#демонстрации-по-сервисам)
    - [DomElement](#domelement)
    - [DomClass](#domclass)
    - [DomStyle](#domstyle)
- [Утилиты и сброс](#утилиты-и-сброс)
- [Логирование](#логирование)

---

## Установка и запуск

Компонент предполагает наличие зависимостей:

```ts
import { DomClass }   from './dom/dom-class';
import { DomElement } from './dom/dom-element';
import { DomStyle }   from './dom/dom-style';
import { green }      from 'tool-log';
```

Селектор компонента: `lib-tool-dom-ang15`.

```html
<lib-tool-dom-ang15></lib-tool-dom-ang15>
```

---

## Структура

```
tool-dom-ang15/
├── tool-dom-ang15.component.ts     # логика песочницы
├── tool-dom-ang15.component.html   # шаблон (панели + лог)
├── tool-dom-ang15.component.scss   # стили
└── dom/
    ├── dom-tools.ts               # сервис DomToolsService
    ├── root
        ├── dom-element.ts              # сервис DomElement
        ├── dom-class.ts                # сервис DomClass
        └── dom-style.ts                # сервис DomStyle
```

---

## Разметка (HTML)

Шаблон состоит из двух колонок:

**Левая колонка** — песочница и группы кнопок:

- `#sandbox` — корневой контейнер, к которому применяется `addClassMarginPadding`;
- `#target` — целевой элемент для классов и стилей;
- `#dynamicHost` — контейнер для динамически создаваемых элементов;
- три группы кнопок: **DomElement**, **DomClass**, **DomStyle**;
- кнопки **Reset All** и **Clear Log**.

**Правая колонка** — журнал операций (`logHtml`), выводится через `*ngFor`, с плейсхолдером при пустом логе.

---

## Компонент (TS)

Реализует `OnInit` и `AfterViewInit`.

**ViewChild-ссылки:**

| Ссылка | Назначение |
|---|---|
| `sandboxRef` | корень для генерации утилит отступов |
| `targetRef` | целевой элемент для классов/стилей |
| `dynamicHostRef` | хост динамических элементов |

**Публичные поля:**

- `logHtml: string[]` — массив строк лога;
- `dom: DomElement`, `cls: DomClass`, `style: DomStyle` — экземпляры сервисов.

**Инициализация (`ngOnInit`):**

```ts
this.elt   = new DomElement(this.document);
this.cls   = new DomClass(this.document);
this.style = new DomStyle();
```

`DOCUMENT` внедряется через `@Inject(DOCUMENT)`.

---

## Демонстрации по сервисам

### DomElement

| Метод | Демо | Что делает |
|---|---|---|
| `createElement(tag, class)` | `demoCreateElement()` | создаёт `<div class="created-box">` и добавляет в `#dynamicHost` |
| `elementCreate(host, tag, mode, text, class, event, handler)` | `demoElementCreate()` | создаёт `<button>` с обработчиком `click` |
| `elementAdd(host, mode, class, event, handler, el)` | `demoElementAdd()` | вставляет `<span>` через `insertBefore`, вешает `mouseenter` |
| `elementRemove(host, el)` | `demoElementRemove()` | удаляет последний дочерний элемент |
| `elementGet(selector)` | `demoElementGet()` | асинхронно ждёт появления `.appears-later` (создаётся через 1 с) |
| `getElementByDataAttribute(attr, value?)` | `demoGetByDataAttr()` | ищет по `data-id`, затем уточняет по значению |
| `getCoordinates(el)` | `demoGetCoordinates()` | возвращает `{top, left, width, height}` |
| `elementGetParent(el)` | `demoGetParent()` | родительский узел |
| `elementsGetSiblingAll(el)` | `demoSiblingsAll()` | все соседи |
| `elementGetSiblingNext(el)` | `demoSiblingsNext()` | следующий сосед |
| `elementGetSiblingPrevious(el)` | `demoSiblingsPrevious()` | предыдущий узел (включая текстовые) |
| `elementGetChildren(el)` | `demoGetChildren()` | дочерние элементы |

### DomClass

| Метод | Демо | Что делает |
|---|---|---|
| `hasClass(el, cls)` | `demoHasClass()` | проверяет наличие `demo-active` |
| `addClass(el, cls)` | `demoAddClass()` | добавляет `demo-active` |
| `addClasses(el, list)` | `demoAddClasses()` | массово добавляет `demo-a`, `demo-b`, `demo-c` |
| `addClassMarginPadding(rootRef, values)` | `demoAddClassMarginPadding()` | генерирует `.evo-{m\|p}{t\|r\|b\|l}-{1..5}` и применяет `evo-mt-2`, `evo-pl-3` |
| `deleteClassMarginPadding()` | `demoDeleteClassMarginPadding()` | удаляет `<style data-dynamic-style>` |
| `removeClass(el, cls)` | `demoRemoveClass()` | удаляет `demo-active` |
| `toggleClass(el, cls, force?)` | `demoToggleClass()` / `demoToggleForce()` | переключает класс (в т.ч. с `force=true`) |
| `getClasses(el)` | `demoGetClasses()` | возвращает список классов |
| `clearClasses(el)` | `demoClearClasses()` | удаляет все классы |

### DomStyle

| Метод | Демо | Что делает |
|---|---|---|
| `applyStyleProperty(el, prop, value)` | `demoApplyStyle()` | задаёт `background-color` и `border` |
| `getStyle(el, prop)` | `demoGetStyle()` | читает `background-color` |
| `removeStyle(el, prop)` | `demoRemoveStyle()` | удаляет `background-color` |

---

## Утилиты и сброс

**`resetAll()`** — полный сброс состояния песочницы:

1. `clearClasses(target)` — снять все классы;
2. удалить инлайн-стили (`removeAttribute('style')`);
3. очистить `#dynamicHost`;
4. `deleteClassMarginPadding()` — убрать динамический `<style>`;
5. обнулить `_createdCounter`.

**`clearLog()`** — очищает `logHtml`.

---

## Логирование

Внутренний метод `_log(message)`:

- добавляет запись с временной меткой в начало `logHtml` (`unshift`);
- ограничивает массив 200 элементами;
- дублирует сообщение в `console.log`.

Каждое демо-действие пишет в лог результат: имя метода, аргументы и итог (например, количество найденных элементов, значение класса, координаты).

---

## Примечания

- `DomClass` и `DomElement` принимают `Document` в конструкторе (для тестируемости и SSR-совместимости).
- `DomStyle` не требует `Document` — работает напрямую со `style` элемента.
- Генерация утилит отступов (`addClassMarginPadding`) опирается на CSS-переменные `--evo1..5`, ожидаемые в глобальных стилях проекта.
- Для асинхронного поиска `elementGet` использует повторные попытки, что позволяет дождаться появления элемента в DOM.
