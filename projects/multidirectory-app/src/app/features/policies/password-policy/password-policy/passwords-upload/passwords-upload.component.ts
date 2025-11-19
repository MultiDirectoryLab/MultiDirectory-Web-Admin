import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-passwords-upload',
  imports: [TranslocoModule, MultidirectoryUiKitModule],
  templateUrl: './passwords-upload.component.html',
  styleUrl: './passwords-upload.component.scss',
})
export class PasswordsUploadComponent {
  @ViewChild('passwordsFile') fileSelector!: ElementRef<HTMLInputElement>;
  @Input() passwords?: File;
  @Output() passwordsChange = new EventEmitter<File>();

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.passwords = input.files[0];
      this.passwordsChange.emit(this.passwords);
    }
  }

  onPasswordsSelecting(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.fileSelector.nativeElement.click();
  }
}
