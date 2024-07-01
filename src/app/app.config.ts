import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { purchaseToken } from './abstractions/purchase.data.service';
import { PurchaseLocalDataService } from './services/purchase-local.data.service';
import { PurchaseApiDataService } from './services/purchase-api.data.service';
import { CategoryLocalDataService } from './services/category-local.data.service';
import { categoryToken } from './abstractions/category.data.service';
import { CategoryApiDataService } from './services/category-api.data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    {provide: purchaseToken, useClass: true ? PurchaseLocalDataService : PurchaseApiDataService},
    {provide: categoryToken, useClass: true ? CategoryLocalDataService : CategoryApiDataService}
  ]
};
