import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'tooltip-panel',
  templateUrl: './tooltip-panel.component.html',
  styleUrls: ['./tooltip-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipPanelComponent {
  value = input<SafeHtml | string>();
  extended = input<boolean>(false);
}
