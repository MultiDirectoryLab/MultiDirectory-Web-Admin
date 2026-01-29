import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MdFormComponent, MultidirectoryUiKitModule } from 'multidirectory-ui-kit';
import { debounceTime, Subject } from 'rxjs';
import { UserCreateRequest } from '@models/api/user-create/user-create.request';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LdapAttributes } from '@core/ldap/ldap-attributes/ldap-attributes';

@Component({
  selector: 'app-contact-properties-general',
  standalone: true,
  imports: [TranslocoPipe, MultidirectoryUiKitModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contact-properties-general.component.html',
  styleUrl: './contact-properties-general.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPropertiesGeneralComponent implements OnInit, OnChanges {
  @Input() accessor!: LdapAttributes;
  setupRequest = new UserCreateRequest();
  unsubscribe = new Subject<void>();

  private fb = inject(FormBuilder);
  contactForm!: FormGroup;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['accessor'] && this.accessor.cn) {
      if (!this.contactForm) {
        this.contactForm = this.fb.group({
          cn: [{ value: this.accessor['cn'], disabled: true }, [Validators.required]],
          displayName: [''],
          givenName: [this.accessor['givenName'], [Validators.required]],
          surname: [this.accessor['surname'], [Validators.required]],
        });
      }
    }
  }

  ngOnInit() {
    this.calcDisplayName('givenName', 'surname');
    this.calcDisplayName('surname', 'givenName');
    this.contactForm
      .get('displayName')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((newValue) => {
        this.accessor.displayName = newValue;
      });
  }

  calcDisplayName(name: string, secondName: string) {
    this.contactForm
      .get(name)
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        const surname = this.contactForm.get(secondName)?.value;
        const nameToSet = `${surname} ${value}`;
        if (value) {
          this.contactForm.get('cn')?.setValue(nameToSet); // Пример: преобразуем в верхний регистр
        }
        this.accessor[name] = value;
        this.accessor.cn = [nameToSet];
      });
  }

  get formValid(): boolean {
    if (!this.contactForm) {
      return true;
    }
    return this.contactForm.valid;
  }
}
