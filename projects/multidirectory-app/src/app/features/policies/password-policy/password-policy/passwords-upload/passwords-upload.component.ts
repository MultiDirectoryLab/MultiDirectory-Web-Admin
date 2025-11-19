import { ChangeDetectionStrategy, Component, ElementRef, inject, model, viewChild } from '@angular/core';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-passwords-upload',
  imports: [TranslocoModule, MultidirectoryUiKitModule],
  templateUrl: './passwords-upload.component.html',
  styleUrl: './passwords-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordsUploadComponent {
  passwords = model<File | undefined>(undefined);

  private fileSelector = viewChild.required<ElementRef<HTMLInputElement>>('passwordsFile');

  private toastr = inject(ToastrService);

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input && input.files && input.files.length) {
      this.passwords.set(input.files[0]);
      this.toastr.success(translate('passwords-upload.forbidden-passwords-file-uploaded-successfully'));
    } else {
      this.toastr.error(translate('passwords-upload.forbidden-passwords-file-upload-error'));
    }

    input.value = '';
  }

  protected onPasswordsSelecting(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.fileSelector()?.nativeElement.click();
  }

  protected onPasswordsClearing() {
    const input = this.fileSelector()?.nativeElement;
    this.passwords.set(undefined);

    if (input) {
      input.value = '';
    }
  }
}
