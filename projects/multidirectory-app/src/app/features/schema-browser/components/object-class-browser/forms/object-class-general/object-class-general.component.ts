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
import { RequiredWithMessageDirective } from '@core/validators/required-with-message.directive';
import { TranslocoModule } from '@jsverse/transloco';
import { SchemaObjectClass } from '@models/api/schema/object-classes/schema-object-class';
import { DropdownOption, MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';

@Component({
  selector: 'app-object-class-general',
  imports: [
    MultidirectoryUiKitModule,
    CommonModule,
    TranslocoModule,
    FormsModule,
    RequiredWithMessageDirective,
  ],
  templateUrl: './object-class-general.component.html',
  styleUrl: './object-class-general.component.scss',
})
export class ObjectClassCreateGeneralComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  form = viewChild.required<MdFormComponent>('form');
  @Output() stepValid = new EventEmitter<boolean>();
  objectClass = input(new SchemaObjectClass({}));
  kindOptions = ['AUXILARY', 'STRUCTURAL', 'ABSTRACT'].map(
    (x) => new DropdownOption({ value: x, title: x }),
  );

  ngOnInit(): void {
    this.stepValid.emit(false);
    this.form()
      .onValidChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((x) => {
        this.stepValid.emit(x ?? false);
      });
  }
}
