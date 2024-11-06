import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElementInteractionService {
  currentClickedDropdown: number | undefined;
  dropdownsVisible: boolean[] = [];
  private dropdownGroups: { [key: string]: { dropdownsVisible: boolean[], currentClickedDropdown?: number } } = {};

  toggleDropdown(groupId: string, index: number){
    
    if (!this.dropdownGroups[groupId]) {
      this.dropdownGroups[groupId] = { dropdownsVisible: [] };
    }
  
    const group = this.dropdownGroups[groupId];
    
    group.dropdownsVisible[index] = !group.dropdownsVisible[index];
    
    if (group.currentClickedDropdown !== undefined && group.currentClickedDropdown !== index) {
        group.dropdownsVisible[group.currentClickedDropdown] = false;
    }
    
    group.currentClickedDropdown = index;
  }

  isDropdownOpen(groupId: string, index: number): boolean {
    return this.dropdownGroups[groupId]?.dropdownsVisible[index] || false;
  }

  closeAllDropdowns() {
    for (const groupId in this.dropdownGroups) {
        this.dropdownGroups[groupId].dropdownsVisible.fill(false);
        this.dropdownGroups[groupId].currentClickedDropdown = undefined;
    }
}

  handleDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }

  timeSince(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date().getTime();
    const seconds = Math.floor((now - date.getTime()) / 1000);

    const intervals = {
        ano: 31536000, // 60 * 60 * 24 * 365
        mês: 2592000, // 60 * 60 * 24 * 30
        semana: 604800, // 60 * 60 * 24 * 7
        dia: 86400, // 60 * 60 * 24
        hora: 3600, // 60 * 60
        minuto: 60,
        segundo: 1,
    };

    for (const interval in intervals) {
        const count = Math.floor(seconds / intervals[interval as keyof typeof intervals]);
        if (count >= 1) {
          if(interval === 'mês'){
            return count === 1 ? `há ${count} ${interval}` : `há ${count} meses`;

          } else {
            return count === 1 ? `há ${count} ${interval}` : `há ${count} ${interval}s`;
          }
            
        }
    }

    return 'há alguns segundos';
  }

  formatDate(dateString: string){
    const date = new Date(dateString)

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} às ${hours}:${minutes}`;
    return formattedDate;
  }
}