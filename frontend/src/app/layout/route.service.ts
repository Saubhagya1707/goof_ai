import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map, Subject, tap } from 'rxjs';
import { SidebarItem } from './sidebar.component';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  routeData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  routeData$ = this.routeData.asObservable();
  breadcrumbItems: BehaviorSubject<SidebarItem[]> = new BehaviorSubject<SidebarItem[]>([]);
  breadcrumbItems$ = this.breadcrumbItems.asObservable();
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }
    )).subscribe(route => {
      const pathSegments = route.pathFromRoot
      .flatMap(r => r.snapshot.url.map(segment => segment.path));
      const breadcrumbItems = this.updateBreadcrumb(pathSegments);
      console.log('Full path:', breadcrumbItems);
      this.breadcrumbItems.next(breadcrumbItems)
      route.data.subscribe(data => {
          console.log('in route service: data', data)
          this.routeData.next(data);
        });
      }
    );
  }
  updateBreadcrumb(pathSegments: string[]): SidebarItem[] {
    return pathSegments.map(seg => {
      let label = seg[0].toUpperCase() + seg.slice(1,seg.length)
      return { label: label, iconClass: '', path: seg}
    }).flatMap((item) => item);
  }
}
