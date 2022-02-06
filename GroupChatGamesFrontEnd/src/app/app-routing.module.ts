import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodeBreakerComponent } from './games/code-breaker/code-breaker.component';
import { HangmanComponent } from './games/hangman/hangman.component';
import { WatWordComponent } from './games/wat-word/wat-word.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  { path: 'wordditch', component: WatWordComponent },
  { path: 'hangman', component: HangmanComponent },
  { path: 'hackitch', component: CodeBreakerComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
