import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Agent, AgentExecution, PaginatedResponse, ToolOut } from "../interfaces/interfaces";
import { HttpConfigService } from "../config/http-config.service";
import { environment } from "../../environment/environment";

@Injectable({ providedIn: 'root' })
export class ToolService {
  
  httpClient: HttpClient = inject(HttpClient)
  config: HttpConfigService = inject(HttpConfigService)

  getAllTools(): Observable<ToolOut[]>{
    return this.httpClient.get<ToolOut[]>(`${environment.apiUrl}/tools/`)
  }
  
}