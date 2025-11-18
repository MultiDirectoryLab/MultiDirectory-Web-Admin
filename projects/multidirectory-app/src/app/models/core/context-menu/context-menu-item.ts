export type ContextMenuAction = string;

export type SetContextMenuActions<T extends ContextMenuAction> = T;

/**
 * Элемент контекстного меню
 * @param actionId уникальный ID действия, назначается произвольно
 * @param title заголовок пункта меню. Передавайте переведенное значение, если нужно
 */
export class ContextMenuItem {
  constructor(
    public actionId: ContextMenuAction,
    public title: string
  ) {}
}
