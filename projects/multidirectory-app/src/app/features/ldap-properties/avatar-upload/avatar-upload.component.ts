import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';
import { ModalInjectDirective } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss'],
})
export class AvatarUploadComponent {
  private modalControl = inject<ModalInjectDirective>(ModalInjectDirective);
  private cdr = inject(ChangeDetectorRef);

  @Input() accessor: LdapAttributes | null = null;
  @ViewChild('fileSelector') fileSelector!: ElementRef<HTMLInputElement>;
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
        this.modalControl.modal?.hideSpinner();
        this.cdr.detectChanges();
      };
      reader.onerror = () => {
        this.modalControl.modal?.hideSpinner();
      };
      reader.onabort = () => {
        this.modalControl.modal?.hideSpinner();
      };
      this.modalControl.modal?.showSpinner();
      reader.readAsDataURL(file);
      this.fileSelected = true;
    }
  }

  onAvatarSelecting(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.fileSelector.nativeElement.click();
  }
}
