import { Injectable } from '@angular/core';
import { Observable, Subject, of, pipe, subscribeOn, switchMap, take } from 'rxjs';
import { LdapEntryNode } from '@core/ldap/ldap-entity';
import { NavigationNode } from '@core/navigation/navigation-node';
import { EntityType } from '@core/entities/entities-type';

@Injectable({
  providedIn: 'root',
})
export class AppWindowsService {
  private _openEntityPropertiesModalRx = new Subject<LdapEntryNode>();
  private _closeEntityPropertiesModalRx = new Subject<LdapEntryNode>();
  get openEntityPropertiesModalRx(): Observable<LdapEntryNode> {
    return this._openEntityPropertiesModalRx.asObservable();
  }
  get closeEntityPropertiesModalRx(): Observable<LdapEntryNode> {
    return this._closeEntityPropertiesModalRx.pipe(take(1));
  }
  openEntityProperiesModal(entity: LdapEntryNode): Observable<LdapEntryNode> {
    this._openEntityPropertiesModalRx.next(entity);
    return this.closeEntityPropertiesModalRx;
  }
  closeEntityPropertiesModal(entity: LdapEntryNode) {
    return this._closeEntityPropertiesModalRx.next(entity);
  }

  private _openChangePasswordModalRx = new Subject<LdapEntryNode>();
  get openChangePasswordModalRx(): Observable<LdapEntryNode> {
    return this._openChangePasswordModalRx.asObservable();
  }
  openChangePasswordModal(entity: LdapEntryNode) {
    this._openChangePasswordModalRx.next(entity);
  }

  private _toggleGlobalSpinnerRx = new Subject<boolean>();
  get globalSpinnerRx(): Observable<boolean> {
    return this._toggleGlobalSpinnerRx.asObservable();
  }
  hideSpinner() {
    this._toggleGlobalSpinnerRx.next(false);
  }
  showSpinner() {
    this._toggleGlobalSpinnerRx.next(true);
  }

  private _showContextMenuRx = new Subject<void>();
  get showContextMenuRx() {
    return this._showContextMenuRx.asObservable();
  }
  showContextMenu(node: NavigationNode) {
    this._showContextMenuRx.next();
  }

  private _showCreateOuMenuRx = new Subject<string>();
  private _closeCreateOuMenuRx = new Subject<string>();
  get showCreateOuMenuRx(): Observable<string> {
    return this._showCreateOuMenuRx.asObservable();
  }
  get closeCreateOuMenuRx(): Observable<string> {
    return this._closeCreateOuMenuRx.asObservable();
  }
  openCreateOu(parentDn: string) {
    this._showCreateOuMenuRx.next(parentDn);
    return this.closeCreateOuMenuRx;
  }
  closeCreateOu(parentDn: string) {
    return this._closeCreateOuMenuRx.next(parentDn);
  }

  private _showCreateUserMenuRx = new Subject<string>();
  private _closeCreateUserMenuRx = new Subject<string>();
  get showCreateUserMenuRx(): Observable<string> {
    return this._showCreateUserMenuRx.asObservable();
  }
  get closeCreateUserMenuRx(): Observable<string> {
    return this._closeCreateUserMenuRx.asObservable();
  }
  openCreateUser(parentDn: string) {
    this._showCreateUserMenuRx.next(parentDn);
    return this.closeCreateUserMenuRx;
  }
  closeCreateUser(parentDn: string) {
    return this._closeCreateUserMenuRx.next(parentDn);
  }

  private _showCreateGroupMenuRx = new Subject<string>();
  private _closeCreateGroupMenuRx = new Subject<string>();
  get showCreateGroupMenuRx(): Observable<string> {
    return this._showCreateGroupMenuRx.asObservable();
  }
  get closeCreateGroupMenuRx(): Observable<string> {
    return this._closeCreateGroupMenuRx.asObservable();
  }
  openCreateGroup(parentDn: string) {
    this._showCreateGroupMenuRx.next(parentDn);
    return this.closeCreateGroupMenuRx;
  }
  closeCreateGroup(parentDn: string) {
    return this._closeCreateGroupMenuRx.next(parentDn);
  }

  private _showCreateComputerMenuRx = new Subject<string>();
  private _closeCreateComputerMenuRx = new Subject<string>();
  get showCreateComputerMenuRx(): Observable<string> {
    return this._showCreateComputerMenuRx.asObservable();
  }
  get closeCreateComputerMenuRx(): Observable<string> {
    return this._closeCreateComputerMenuRx.asObservable();
  }
  openCreateComputer(parentDn: string) {
    this._showCreateComputerMenuRx.next(parentDn);
    return this.closeCreateComputerMenuRx;
  }
  closeCreateComputer(parentDn: string) {
    return this._closeCreateComputerMenuRx.next(parentDn);
  }

  private _showDeleteEntryConfirmationRx = new Subject<string[]>();
  private _closeDeleteEntryConfirmationRx = new Subject<string[]>();
  get showDeleteEntryConfirmationRx(): Observable<string[]> {
    return this._showDeleteEntryConfirmationRx.asObservable();
  }
  get closeDeleteEntryConfirmationRx(): Observable<string[]> {
    return this._closeDeleteEntryConfirmationRx.asObservable();
  }
  openDeleteEntryConfirmation(toDeleteDNs: string[]) {
    this._showDeleteEntryConfirmationRx.next(toDeleteDNs);
    return this.closeDeleteEntryConfirmationRx;
  }
  closeDeleteEntryConfirmation(toDeleteDNs: string[]) {
    return this._closeDeleteEntryConfirmationRx.next(toDeleteDNs);
  }

  private _showModifyDnRx = new Subject<string>();
  private _closeModifyDnRx = new Subject<string>();
  get showModifyDnRx(): Observable<string> {
    return this._showModifyDnRx.asObservable();
  }
  get closeModifyDnRx(): Observable<string> {
    return this._closeModifyDnRx.asObservable();
  }
  openModifyDn(modifyDn: string) {
    this._showModifyDnRx.next(modifyDn);
    return this._closeModifyDnRx;
  }
  closeModifyDn(modifyDn: string) {
    return this._closeModifyDnRx.next(modifyDn);
  }

  private _showEntityTypeSelectorRx = new Subject<EntityType[]>();
  private _closeEntityTypeSelectorRx = new Subject<EntityType[]>();
  get showEntityTypeSelectorRx(): Observable<EntityType[]> {
    return this._showEntityTypeSelectorRx.asObservable();
  }
  get closeEntityTypeSelectorRx(): Observable<EntityType[]> {
    return this._closeEntityTypeSelectorRx.asObservable();
  }
  openEntityTypeSelector(selected: EntityType[] = []) {
    this._showEntityTypeSelectorRx.next(selected);
    return this._closeEntityTypeSelectorRx;
  }
  closeEntityTypeSelector(selected: EntityType[] = []) {
    this._closeEntityTypeSelectorRx.next(selected);
  }

  private _showEntitySelectorRx = new Subject<LdapEntryNode[]>();
  private _closeEntitySelectorRx = new Subject<LdapEntryNode[]>();
  get showEntitySelectorRx(): Observable<LdapEntryNode[]> {
    return this._showEntitySelectorRx.asObservable();
  }
  get closeEntitySelectorRx(): Observable<LdapEntryNode[]> {
    return this._closeEntitySelectorRx.asObservable();
  }
  openEntitySelector(selected: LdapEntryNode[]) {
    this._showEntitySelectorRx.next(selected);
    return this.closeEntitySelectorRx;
  }
  closeEntitySelector(result: LdapEntryNode[]) {
    this._closeEntitySelectorRx.next(result);
  }

  private _showCatalogSelectorRx = new Subject<LdapEntryNode[]>();
  private _closeCatalogSelectorRx = new Subject<LdapEntryNode[]>();
  get showCatalogSelectorRx(): Observable<LdapEntryNode[]> {
    return this._showCatalogSelectorRx.asObservable();
  }
  get closeCatalogSelectorRx(): Observable<LdapEntryNode[]> {
    return this._closeCatalogSelectorRx.asObservable();
  }
  openCatalogSelector(selected: LdapEntryNode[]) {
    this._showCatalogSelectorRx.next(selected);
    return this.closeCatalogSelectorRx;
  }
  closeCatalogSelector(result: LdapEntryNode[]) {
    this._closeCatalogSelectorRx.next(result);
  }
}
