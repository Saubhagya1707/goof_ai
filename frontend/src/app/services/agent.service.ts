import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Agent, AgentExecution } from "../interfaces/interfaces";
import { HttpConfigService } from "../config/http-config.service";
import { environment } from "../../environment/environment";

@Injectable({ providedIn: 'root' })
export class AgentService {
  httpClient: HttpClient = inject(HttpClient)
  config: HttpConfigService = inject(HttpConfigService)

  getAgents(): Observable<Agent[]> {
    return this.httpClient.get<Agent[]>(`${environment.apiUrl}/agents/`)
  }


  getExecutionsForAgent(agentId: number): Observable<AgentExecution[]>{
    return this.httpClient.get<AgentExecution[]>(`${environment.apiUrl}/agent-execution/agent/${agentId}`)
  }
}