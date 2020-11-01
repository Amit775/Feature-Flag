import { Component, Injector } from '@angular/core';
import { featureFlag } from './feature-flag.directive';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent {
	title = 'FeatureFlag';

	constructor(public injector: Injector) { }

	@featureFlag<AppComponent>('false')
	click(event: MouseEvent): void {
		this.title = 'configureable FeatureFlag';
		console.log(event);
	}
	
	alt(event: MouseEvent): void {
		this.title = 'Alternative title';
		console.log(event);
	}
}
