import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WatWordComponent } from './games/wat-word/wat-word.component';
import { KeyboardComponent } from './games/wat-word/components/keyboard/keyboard.component';
import { IconsModule } from './modules/icons/icons.module';
import { WinModalComponent } from './games/wat-word/components/modal/modal.component';
import { HomeComponent } from './views/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { HangmanComponent } from './games/hangman/hangman.component';
import { HeaderComponent } from './components/shared/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    WatWordComponent,
    KeyboardComponent,
    WinModalComponent,
    HomeComponent,
    HangmanComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
