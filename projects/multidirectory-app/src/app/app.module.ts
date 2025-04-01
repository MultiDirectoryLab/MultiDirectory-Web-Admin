import { Translation, TranslocoService } from '@jsverse/transloco';
import { lastValueFrom } from 'rxjs';

export function appInitializerFactory(translateService: TranslocoService) {
  return (): Promise<Translation> => {
    return lastValueFrom(translateService.load('ru-RU'));
  };
}
