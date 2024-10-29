import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { ShoppingListComponent } from './app/Shopping/shopping-list.component';

const bootstrap = () => bootstrapApplication(ShoppingListComponent, config);

export default bootstrap;
