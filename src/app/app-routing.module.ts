import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from "./page/landing/landing.component";
import { GalleryComponent } from "./page/gallery/gallery.component";

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'gallery', component: GalleryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
