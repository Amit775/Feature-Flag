import { Directive, Inject, Injectable, InjectionToken, Injector, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AppComponent } from './app.component';

const features = ['true', 'false'] as const;
export type FeatureName = typeof features[number];
export type Flags = { [name in FeatureName]: boolean }

const FEATURE_FLAG = new InjectionToken<Flags>('features flags', {
	providedIn: 'root',
	factory: () => { return { 'true': true, 'false': false } }
});

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
	constructor(@Inject(FEATURE_FLAG) private featureFlags: Flags) { }

	isFeatureOn(name: FeatureName): boolean {
		if (this.featureFlags[name] == null)
			throw `feature '${name}' is not recognized!`;

		return this.featureFlags[name]
	}

}

@Directive({ selector: '[featureFlag]' })
export class FeatureFlagDirective<T> implements OnInit {

	@Input('featureFlag') public name: FeatureName;
	constructor(private vcr: ViewContainerRef, private tpl: TemplateRef<T>, private service: FeatureFlagService) { }

	ngOnInit(): void {
		if (this.service.isFeatureOn(this.name)) {
			this.vcr.createEmbeddedView(this.tpl);
		}
	}
}

type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];

export function featureFlag<T extends { injector: Injector }>(name: FeatureName, alt?: FunctionPropertyNames<T>) {
	return function (target: T, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;
		descriptor.value = function (this: T) {
			const service: FeatureFlagService = this.injector.get(FeatureFlagService);
			if (service.isFeatureOn(name)) {
				originalMethod.apply(this, arguments)
			} else {
				if (alt == null) return;

				const alter = target[alt];

				if (typeof alter !== 'function')
					throw `alternative '${alt}' should be a function`;

				alter.apply(this, arguments);
			}
		}
	}
}
