import { NgClass } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CookieService } from '../services/cookie/cookie.service';
import { ElementInteractionService } from '../services/element-interaction/element-interaction.service';
import { DropdownClickOutDirective } from '../directives/dropdown-click-out.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, NgClass, RouterLinkActive, DropdownClickOutDirective],
  providers: [ElementInteractionService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, OnDestroy{

  sidebarOpen: boolean = false;
  userProfileOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router, private eRef: ElementRef, private cookieService: CookieService, public elementInteractionService: ElementInteractionService){

  }

  ngOnInit(): void { 
    this.authService.startSessionMonitoring()
  }

  @HostListener('document:click', ['$event'])
  clickOut(event: any){
    if(!this.eRef.nativeElement.contains(event.target)){
      this.sidebarOpen = false;
    }
  }

  isAdmin(){
    return this.authService.isAdmin()
  }

  getUsername(){
    return this.cookieService.getCookie('username');
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  toggleSidebar(){
    if(this.sidebarOpen == false){
      this.sidebarOpen = true;
    }
    else{
      this.sidebarOpen = false;
    }
  }

  toggleDropdown(index: number){
    this.elementInteractionService.toggleDropdown('sidebar', index);
  }

  handleDropdownClick(event: MouseEvent) {
    this.elementInteractionService.handleDropdownClick(event);
  }

  ngOnDestroy(): void {
    this.authService.stopSessionMonitoring()
  }
}
