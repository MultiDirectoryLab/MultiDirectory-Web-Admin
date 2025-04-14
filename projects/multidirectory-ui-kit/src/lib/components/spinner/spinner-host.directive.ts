import {
  ComponentRef,
  Directive,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { SpinnerComponent } from './spinner.component';

@Directive({
  selector: '[spinnerHost]',
})
export class SpinnerHostDirective implements OnInit {
  renderer2 = inject(Renderer2);
  el = inject(ElementRef);
  viewContainerRef = inject(ViewContainerRef);

  @Input() spinnerName = '';
  @Input() spinnerText = '';

  public spinner?: SpinnerComponent;
  public spinnerRef?: ComponentRef<SpinnerComponent>;

  ngOnInit(): void {
    this.spinnerRef = this.viewContainerRef.createComponent(SpinnerComponent);
    this.spinner = this.spinnerRef.instance;
    this.spinner.name = this.spinnerName;
    this.spinner.spinnerText = this.spinnerText ?? this.spinner.spinnerText;
    this.renderer2.appendChild(this.el.nativeElement, this.spinnerRef.location.nativeElement);
  }

  show() {
    this.spinner?.show();
  }

  hide() {
    this.spinner?.hide();
  }
}
