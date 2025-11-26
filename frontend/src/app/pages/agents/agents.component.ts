import { Component, inject } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { AgentService } from '../../services/agent.service';
import { Observable } from 'rxjs';
import { Agent } from '../../interfaces/interfaces';
import { DataViewModule } from 'primeng/dataview';
import { ChipModule } from 'primeng/chip';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { state } from '@angular/animations';

@Component({
  selector: 'app-agent',
  imports: [SearchBarComponent, DataViewModule, AsyncPipe, CommonModule, ChipModule, TableModule],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.sass'

})
export class AgentsComponent {

  private agentService: AgentService = inject(AgentService);
  private router: Router = inject(Router)
  agents$: Observable<Agent[]> = this.agentService.getAgents();

  ngOnInit(){
        
  }
  agentSelected($event: TableRowSelectEvent<Agent>) {
    const agent = $event.data as Agent;
    console.log("agent",agent)
    if (agent) {
      const encodedAgent = btoa(JSON.stringify(agent))
      const agentId = agent.id;
      this.router.navigate(["/agents", agentId], {queryParams: { data: encodedAgent }});
    }
  }

}
