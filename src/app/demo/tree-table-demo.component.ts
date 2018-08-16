import {Component, OnInit, OnDestroy} from '@angular/core';
import {TreeDataSource, Column, Settings, TreeTable} from '../../ng-tree-table';
import {HttpClient} from '@angular/common/http';
import {TreeDemoService} from './tree-demo.service';
import {getTreeColumns} from './columns';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tree-table-demo',
  template: `<p>Tree with lazy load child nodes</p>
  <app-tree-table [treeTable]="treeTable"></app-tree-table>
  <p>Build tree array from flat array (id, parentId)</p>
  <app-tree-table [treeTable]="flattenTreeTable"></app-tree-table>
  `
})
export class TreeTableDemoComponent implements OnInit, OnDestroy {

  treeService: TreeDataSource;
  treeTable: TreeTable;
  settings: Settings = <Settings> {
    selectionMultiple: true,
    selectionMode: 'checkbox',
    filter: false,
    sortable: false,
  };
  columns: Column[];
  flattenTreeTable: TreeTable;

  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) {
    this.columns = getTreeColumns();
    this.treeService = new TreeDemoService(this.http);
    this.treeTable = new TreeTable(this.columns, this.settings, this.treeService);
    this.treeTable.pager.perPage = 1000;

    this.flattenTreeTable = new TreeTable(this.columns, this.settings, null);
  }

  ngOnInit() {
    this.flattenTreeTable.events.onLoading(true);
    this.http.get<any[]>('assets/flatten-tree.json').subscribe(data => {
      const nodes = this.flattenTreeTable.rowsToTree(data, 'parentId', 'id');
      this.flattenTreeTable.nodes = nodes;
      this.flattenTreeTable.events.onLoading(false);
    });

    const subSelection = this.treeTable.events.selectionSource$.subscribe(() => {
      console.log(this.treeTable.getSelection());
    });
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
