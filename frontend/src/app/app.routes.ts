import { Routes } from '@angular/router';
import { LayoutConfig } from './layout/layout.service';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './pages/login/auth.guard';
import { AgentsComponent } from './pages/agents/agents.component';
import { AgentDetailComponent } from './pages/agents/detail-page/agent-detail/agent-detail.component';
import { NotFoundComponent } from './core/not-found/not-found.component';

export const defaultConfig: LayoutConfig = {
    theme: 'light',
    sidebar: {
        collapsed: false,
        position: 'left',
        items: [
            { label: 'Dashboard', path: 'dashboard'},
            { label: 'Agents', path: 'agents'}
        ]
    }
};
export const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        loadComponent: () => LayoutComponent,
        data: defaultConfig,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                component: HomeComponent,
                data: defaultConfig
            },
            // {
            //     path: 'pods',
            //     // component: PodsComponent,
            //     data: defaultConfig,
            //     // loadChildren: () => import('./pages/pods/pods-routes.module').then(m => m.podRoutes) 
            // },
            {
                path: 'agents',
                children: [
                    {
                      path: '', // Shows NodeComponent at /nodes
                      component: AgentsComponent,
                      data: defaultConfig
                    },
                    {
                      path: ':agentId', // Shows NodeDetailComponent at /nodes/some-node
                      component: AgentDetailComponent,
                      data: {
                        ...defaultConfig,
                        sidebar: {
                            ...defaultConfig.sidebar,
                            collapsed: true,
                        }
                      }
                    }
                  ]
            }
        ]
    },
    // {
    //     'path': 'newuser',
    //     // component: NewUserComponent,
    //     data: () => {
    //         let val = defaultConfig
    //         val.hideAll = true
    //         return val
    //     }
    // }, 
    {
        'path': 'login',
        component: LoginComponent,
        data: {
            ...defaultConfig,
            hideAll: true
        }
    },
    {
        'path': 'notfound',
        component: NotFoundComponent,
        data: () => {
            let val = defaultConfig
            val.hideAll = true
            return val
        }
    },
];
