import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  getCookie(cname: string): string {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  setCookieExpiration(milliseconds: number): string {
    const tokenExpiration = new Date();
    tokenExpiration.setTime(tokenExpiration.getTime() + milliseconds)
    const tokenExpirationUTC = tokenExpiration.toUTCString();
    
    return tokenExpirationUTC;
  }

  setCookie(name: string, value: string, expiration: string): void {
    document.cookie = `${name}=${value}; expires=${expiration}; path=/`
  }

  setCookies(access_token: string, refresh_token: string): void {
    const accessTokenExpiration = this.setCookieExpiration(30 * 60 * 1000);
    const refreshTokenExpiration = this.setCookieExpiration(24 * 60 * 60 * 1000);
    
    this.setCookie('access_token', access_token, accessTokenExpiration);
    this.setCookie('access_token_expiration', accessTokenExpiration, accessTokenExpiration);
    this.setCookie('refresh_token', refresh_token, refreshTokenExpiration);
    this.setCookie('refresh_token_expiration', refreshTokenExpiration, refreshTokenExpiration);
  }


  deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }

  deleteCookies(): void {
    this.deleteCookie('access_token');
    this.deleteCookie('access_token_expiration');
    this.deleteCookie('refresh_token');
    this.deleteCookie('refresh_token_expiration');
    this.deleteCookie('fist_name');
    this.deleteCookie('last_name');
    this.deleteCookie('email');
    this.deleteCookie('username');
    this.deleteCookie('id')
    this.deleteCookie('is_superuser');
    this.deleteCookie('is_staff');
  }

  
}
