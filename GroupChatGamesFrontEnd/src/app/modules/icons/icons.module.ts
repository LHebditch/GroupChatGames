import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { Delete, Play, Home, X, Share2 } from 'angular-feather/icons';

const icons = {
  Delete,
  Play,
  Home,
  X,
  Share2
};

@NgModule({
  imports: [
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }
