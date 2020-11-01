import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FeatureFlagDirective } from './feature-flag.directive';

@NgModule({
	declarations: [
		AppComponent,
		FeatureFlagDirective
	],
	imports: [
		BrowserModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
