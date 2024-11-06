import { Component, Input, OnInit } from '@angular/core';
import { ProcessService } from '../services/process/process.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LawsuitActivitiesService } from '../services/lawsuit-activities/lawsuit-activities.service';

@Component({
  selector: 'lawsuit-activity',
  standalone: true,
  imports: [NgClass, AsyncPipe, FormsModule],
  templateUrl: './lawsuit-activity.component.html',
  styleUrl: './lawsuit-activity.component.css'
})
export class LawsuitActivityComponent implements OnInit{
  @Input() activities: any;
  @Input() lawsuitId: any;
  @Input() rawActivities: any
  searchFilter: string = '';
  typeFilter: string = 'all';
  dateSort: string = 'newest';

  
  
  constructor(private lawsuitActivitiesService: LawsuitActivitiesService){}
  
  ngOnInit(): void {
    
    console.log(this.activities);
    
  }

  applyFilters() {
    if (!this.rawActivities) return;
  
    let filteredActivities = this.rawActivities.results;
  
    if (this.searchFilter) {
      const searchTextLower = this.searchFilter.toLowerCase();
      filteredActivities = filteredActivities.filter((activity: any) => 
        activity.conteudo?.toLowerCase().includes(searchTextLower) || 
        activity.fonte_grau_formatado.toLowerCase().includes(searchTextLower)
      );
    }
  
    if (this.typeFilter !== 'all') {
      filteredActivities = filteredActivities.filter((activity: any) => activity.tipo === this.typeFilter);
    }
  
    filteredActivities = filteredActivities.sort((a: any, b: any) => {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      if (this.dateSort === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
  
  
    this.activities = {
      ...this.rawActivities,
      results: filteredActivities
    };

  }

  loadMoreActivities(id: number){
    this.lawsuitActivitiesService.loadMoreActivities(id);
  }

}
