import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  output,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-object-class-general',
  imports: [MultidirectoryUiKitModule, CommonModule, TranslocoModule, FormsModule],
  templateUrl: './object-class-general.component.html',
  styleUrl: './object-class-general.component.scss',
})
export class ObjectClassCreateGeneralComponent implements AfterViewInit {
  private destroyRef = inject(DestroyRef);
  form = viewChild.required<NgForm>('form');
  @Output() stepValid = new EventEmitter<boolean>();
  objectClass = input(new SchemaObjectClass({}));
  kindOptions = ['AUXILARY', 'STRUCTURAL', 'ABSTRACT'];

  ngAfterViewInit(): void {
    this.stepValid.emit(false);
    this.form()
      .valueChanges!.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((x) => {
        this.stepValid.emit(this.form().valid ?? false);
      });
  }
}
