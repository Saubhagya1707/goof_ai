import { Routes } from "@angular/router";
import { AgentDetailComponent } from "./detail-page/agent-detail/agent-detail.component";
import { defaultConfig } from "../../app.routes";
import { AgentsComponent } from "./agents.component";

export const nodeRoutes: Routes = [
    {
        path: '',
        component: AgentsComponent,
        children: [
          {
            path: ':agentId',
            component: AgentDetailComponent
          }
        ]
      }
]