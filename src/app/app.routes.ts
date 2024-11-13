import { Routes } from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {ArticlesComponent} from './views/articles/articles.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'articles', component: ArticlesComponent },
  { path: 'home', component: HomeComponent },
];
