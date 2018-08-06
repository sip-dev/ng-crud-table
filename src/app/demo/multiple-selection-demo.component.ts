import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Column, Settings, DataTable} from '../../ng-data-table';
import {getColumnsPlayers} from './columns';

@Component({
  selector: 'app-multiple-selection-demo',
  template: `<button class="button" (click)="clearSelection()">Clear all selections</button>
    <p>Selection type: multiple. Selection mode: checkbox</p>
    <app-datatable [table]="table" (selectionChange)="onSelection()"></app-datatable>
    <div class="df-alert df-alert-success" style="margin-right:5px;" *ngFor="let row of selectedRows">
      {{row.id}}-{{row.name}}</div>
    <p>Selection type: multiple. Selection mode: radio</p>
    <app-datatable [table]="table2" (selectionChange)="onSelection2()"></app-datatable>
    <div class="df-alert df-alert-success" style="margin-right:5px;" *ngFor="let row of selectedRows2">
      {{row.id}}-{{row.name}}</div>
  `
})

export class MultipleSelectionDemoComponent implements OnInit {

  public table: DataTable;
  public table2: DataTable;
  public columns: Column[];
  public selectedRows: any[];
  public selectedRows2: any[];

  public settings: Settings = <Settings>{
    selectionMultiple: true,
    selectionMode: 'checkbox',
  };

  public settings2: Settings = <Settings>{
    selectionMultiple: true,
    selectionMode: 'radio',
  };

  constructor(private http: HttpClient) {
    this.columns = getColumnsPlayers();
    for (const column of this.columns) {
      column.editable = false;
    }

    this.table = new DataTable(this.columns, this.settings);
    this.table2 = new DataTable(this.columns, this.settings2);
  }

  ngOnInit() {
    this.table.events.onLoading(true);
    this.http.get('assets/players.json').subscribe(data => {
      this.table.rows = data;
      this.table2.rows = data;
      this.table.events.onLoading(false);
    });
  }

  onSelection() {
    this.selectedRows = this.table.getSelection();
  }

  onSelection2() {
    this.selectedRows2 = this.table2.getSelection();
  }

  clearSelection() {
    this.table.selection.clearSelection();
    this.table2.selection.clearSelection();
  }

}
