// import { bootstrapApplication } from '@angular/platform-browser';
// import { ShoppingListComponent } from './app/Shopping/shopping-list.component';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { FormsModule } from '@angular/forms';
// import { importProvidersFrom } from '@angular/core';
// import { appConfig } from './app/app.config';





// bootstrapApplication(ShoppingListComponent,{
//   providers: [
//     provideAnimations(),
//     importProvidersFrom(FormsModule)
//   ]
// }).catch((err) => console.error(err));
import { bootstrapApplication } from '@angular/platform-browser';
import { ShoppingListComponent } from './app/Shopping/shopping-list.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';
import { appConfig } from './app/app.config';
import { HttpClientModule, provideHttpClient } from '@angular/common/http'; // Import HttpClientModule and provideHttpClient

bootstrapApplication(ShoppingListComponent, {
  providers: [
    provideAnimations(),
    importProvidersFrom(FormsModule),
    provideHttpClient() // Add provideHttpClient here
  ]
}).catch((err) => console.error(err));