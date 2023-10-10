import { Component, OnDestroy } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subject, filter, startWith, takeUntil } from "rxjs";

@Component({
    selector: 'app-settings-navigation',
    templateUrl: './app-settings-navigation.component.html',
    styleUrls: ['./app-settings-navigation.component.scss']
})
export class AppSettingsNavigationComponent implements OnDestroy {
    url = '';
    _unsubscribe = new Subject<void>();

    constructor(private router: Router) {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                startWith({})
            )
            .subscribe(() => {
                this.url = this.router.url;
            });
    }


    ngOnDestroy(): void {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }
} 