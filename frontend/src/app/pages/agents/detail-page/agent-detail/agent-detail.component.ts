import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Agent, AgentExecution, PaginatedResponse, ToolOut } from '../../../../interfaces/interfaces';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CommonModule, DatePipe } from '@angular/common';
import { AgentService } from '../../../../services/agent.service';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from "primeng/tooltip";
import { Ripple } from "primeng/ripple";
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { ToolService } from '../../../../services/tool.service';
import { TagModule } from 'primeng/tag';

interface PageData {
  page: number
  size: number
  total: number
}


@Component({
  selector: 'agent-detail',
  templateUrl: './agent-detail.component.html',
  imports: [ChartModule,TagModule, SelectModule, FormsModule, CardModule, TableModule, DatePipe, CommonModule, ButtonModule, Tooltip, Ripple, PaginatorModule, DialogModule, TabsModule],
})
export class AgentDetailComponent implements OnInit {
  first: number = 0;
  loading: boolean = false;
  rows: number = 10;
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  private agentService: AgentService = inject(AgentService);
  private toolService: ToolService = inject(ToolService);
  agentId!: number
  agent!: Agent
  executions: AgentExecution[] = []
  executionPageData!: PageData
  visible: boolean = false
  marketTools: ToolOut[] = []

  ngOnInit() {
    this.loading = true;
    const agentId = this.activatedRoute.snapshot.paramMap.get('agentId');
    const object = this.activatedRoute.snapshot.queryParams['data'];
    const agent: Agent = JSON.parse(atob(object)) as Agent;

    if (agentId) {
      this.agentId = Number.parseInt(agentId);
      this.agent = agent;
    }

    this.loadExecutions();
    this.loadTools();
  }

  loadTools() {
    this.toolService.getAllTools().subscribe({
      next: (res: ToolOut[]) => {
        this.marketTools = res;
      }
    })
  }

  loadExecutions(page: number = 1, size: number = 10) {
    this.agentService.getExecutionsForAgent(this.agentId, page, size).subscribe({
      next: (result: PaginatedResponse<AgentExecution>) => {
        this.executions = result.data;
        this.executionPageData = {
          page: result.page,
          size: result.size,
          total: result.total
        };
        // PrimeNG expects "first" as starting index
        this.first = (result.page - 1) * result.size;
      },
      error: (err) => console.error(err),
      complete: () => {
        this.loading = false;
      }
    });
  }
  viewDetails(_t47: any) {
  throw new Error('Method not implemented.');
  }

  updateAgentStatus(status: boolean) {
    this.agentService.updateStatus(this.agentId, status).subscribe({
      next: (res: Agent) => {
        this.agent = res;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  updateFrequency() {
    throw new Error('Method not implemented.');
  }
  onPageChange(event: PaginatorState) {
    const newPage = (event.page ?? 0) + 1; // Convert 0-based → 1-based
    const newSize = event.rows ?? this.executionPageData.size;

    this.loadExecutions(newPage, newSize);
  }
}