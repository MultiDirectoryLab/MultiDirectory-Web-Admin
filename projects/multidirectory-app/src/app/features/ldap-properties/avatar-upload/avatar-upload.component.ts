import { ChangeDetectorRef, Component, ElementRef, inject, Input, viewChild } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { DialogRef } from '@angular/cdk/dialog';
import { EntityPropertiesDialogReturnData } from '../../../components/modals/interfaces/entity-properties-dialog.interface';
import { EntityPropertiesDialogComponent } from '../../../components/modals/components/dialogs/entity-properties-dialog/entity-properties-dialog.component';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss'],
})
export class AvatarUploadComponent {
  private dialogRef: DialogRef<
    EntityPropertiesDialogReturnData,
    EntityPropertiesDialogComponent
  > | null = inject(DialogRef, { optional: true }) ?? null;
  private cdr = inject(ChangeDetectorRef);

  @Input() accessor: LdapAttributes | null = null;
  readonly fileSelector = viewChild.required<ElementRef<HTMLInputElement>>('fileSelector');
  selectedFile?: {
    name: string;
    size: number;
    base64Data: string;
  };
  fileSelected = false;

  onFileSelected(event: any) {
    if (!event?.target?.files || !this.accessor) {
      return;
    }
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64Data = e.target.result.split(',')[1];
        this.selectedFile = {
          name: file.name,
          size: file.size,
          base64Data: base64Data,
        };
        if (this.accessor) {
          this.accessor.photoBase64 = base64Data;
        }
        this.dialogRef?.componentInstance?.dialogComponent?.hideSpinner();
        this.cdr.detectChanges();
      };

      reader.onerror = () => {
        this.dialogRef?.componentInstance?.dialogComponent?.hideSpinner();
      };

      reader.onabort = () => {
        this.dialogRef?.componentInstance?.dialogComponent?.hideSpinner();
      };
      this.dialogRef?.componentInstance?.dialogComponent?.showSpinner();
      reader.readAsDataURL(file);
      this.fileSelected = true;
    }
  }

  onAvatarSelecting(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.fileSelector().nativeElement.click();
  }
}
