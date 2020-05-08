import { Component, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbToastrService } from '@nebular/theme';
import {NbMenuItem} from '@nebular/theme'
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentTheme = 'default';
  private destroy$: Subject<void> = new Subject<void>();

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];
  user_items: NbMenuItem[] = [
    {
      title: 'Candidates List',
      icon: 'bookmark-outline',
      link:'voter'
    },
    {
      title: 'Candidacy',
      icon: 'bulb-outline',
      link:'candidacy'
    },
    {
      title: 'vote',
      icon: 'checkmark-circle-outline',
      link:'voting'
    },
    
    {
      title: 'Logout',
      icon: 'unlock-outline',
    },
  ];
  constructor(private router:Router,private toastService:NbToastrService ,private themeService:NbThemeService,private authService:AuthService,private menuService:NbMenuService) { }

  ngOnInit(): void {
    this.menuService.onItemClick()
    .pipe(
      filter((bag) => (bag.tag === 'navbar_menu'&& bag.item.title==='Logout')),
    )
    .subscribe(item => 
      {
        this.authService.logout().subscribe((ok)=>{
          this.router.navigateByUrl('/');
          this.toastService.show('You have logged out','Logout',{status:'warning'})
        })
      }
      );
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

}
