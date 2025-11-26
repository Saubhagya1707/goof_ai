import { Component, inject, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Agent, AgentExecution } from '../../../../interfaces/interfaces';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CommonModule, DatePipe } from '@angular/common';
import { AgentService } from '../../../../services/agent.service';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'agent-detail',
  templateUrl: './agent-detail.component.html',
  imports: [ChartModule, SelectModule, FormsModule, CardModule, TableModule, DatePipe, CommonModule, ButtonModule],
})
export class AgentDetailComponent implements OnInit {


  private activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  private agentService: AgentService = inject(AgentService);
  agentId!: number
  agent!: Agent
  executions: AgentExecution[] = []

  ngOnInit() {
    let agentId = this.activatedRoute.snapshot.paramMap.get('agentId')
    const object = this.activatedRoute.snapshot.queryParams['data']
    const agent: Agent = JSON.parse(atob(object)) as Agent
    if (agentId) {
      this.agentId = Number.parseInt(agentId);
      this.agent = agent
    }
    this.agentService.getExecutionsForAgent(this.agentId).subscribe({
      next: (result: AgentExecution[]) => {
        this.executions = result
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  viewDetails(_t47: any) {
  throw new Error('Method not implemented.');
  }

}