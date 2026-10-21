export type TSelector = 'querySelector' | 'querySelectorAll';
export type TTypeAppend = 'insertBefore' | 'appendChild';
export type TMouseEvents =
	'click'
	| ' dblclick'
	| ' mousedown'
	| ' mouseup'
	| ' contextmenu'
	| ' mouseout'
	| ' mousewheel'
	| ' mouseover'
	| 'mouseenter';
export type TTouchEvents = 'touchstart' | ' touchend' | ' touchmove' | ' touchcancel';
export type TKeyboardEvents = 'keydown' | ' keyup' | ' keypress';
export type TFormEvents = 'focus' | ' blur' | ' change' | ' submit';
export type TWindowEvents = 'resize' | ' scroll' | ' load' | ' unload' | ' hashchange';
export type TAllEvents = TMouseEvents | TTouchEvents | TKeyboardEvents | TFormEvents | TWindowEvents;
