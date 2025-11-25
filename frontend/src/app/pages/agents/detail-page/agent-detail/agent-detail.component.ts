import { Component, inject, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'agent-detail',
  templateUrl: './agent-detail.component.html',
  imports: [ChartModule, SelectModule, FormsModule],
})
export class NodeDetailComponent implements OnInit {

  

  constructor() {
  }

  ngOnInit() {
  }

}