import { provideTransloco, TranslocoModule } from '@jsverse/transloco';
import { NgModule } from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';
import { environment } from '../environments/environment';

@NgModule({
  exports: [TranslocoModule],
  providers: [
    provideTransloco({
      config: {
        availableLangs: ['en-US', 'ru-RU'],
        defaultLang: localStorage.getItem('locale') ?? 'en-US',
        prodMode: environment.production,
        reRenderOnLangChange: true,
      },
      loader: TranslocoHttpLoader,
    }),
  ],
})
export class TranslocoRootModule {}
