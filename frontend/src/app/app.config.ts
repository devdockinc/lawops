import { ApplicationConfig } from '@angular/core';
import { InMemoryScrollingFeature, InMemoryScrollingOptions, Router, provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from './services/auth/auth.service';
import { authInterceptor } from './auth.interceptor';
import { ProcessService } from './services/process/process.service';
import { FinanceService } from './services/finance/finance.service';
import { ToastService } from './services/toast/toast.service';
import { AnnouncementService } from './services/announcement/announcement.service';
import { ManagementService } from './services/management/management.service';

const scrollOptions: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled'
};

const scrollFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollOptions);


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, scrollFeature),
  provideHttpClient(
    withInterceptors([authInterceptor])
  ),
  AuthService,
  AnnouncementService,
  ManagementService,
  ProcessService,
  FinanceService,
  ToastService,
  Router
  ]
};
