import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AgentOut } from "../interfaces/interfaces";
import { HttpConfigService } from "../config/http-config.service";
import { environment } from "../../environment/environment";

@Injectable({ providedIn: 'root' })
export class AgentService {
  httpClient: HttpClient = inject(HttpClient)
  config: HttpConfigService = inject(HttpConfigService)

  get_agents(): Observable<AgentOut[]> {
    return this.httpClient.get<AgentOut[]>(`${environment.apiUrl}/agents/`)
  }
}