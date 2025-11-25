import { Component, inject } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { Observable } from 'rxjs';
import { AgentOut } from '../../interfaces/interfaces';
import { DataViewModule } from 'primeng/dataview';
import { ChipModule } from 'primeng/chip';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent',
  imports: [SearchBarComponent, DataViewModule, AsyncPipe, CommonModule, ChipModule],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.sass'

})
export class AgentsComponent {
  private agentService: AgentService = inject(AgentService);
  agents$: Observable<AgentOut[]> = this.agentService.get_agents();

  ngOnInit(){
        
  }

}
