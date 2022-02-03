import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatWordComponent } from './games/wat-word/wat-word.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  { path: 'wordditch', component: WatWordComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
