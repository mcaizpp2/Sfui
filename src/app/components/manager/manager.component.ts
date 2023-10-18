import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild} from '@angular/core';
import { ManagerBl } from '../../Bl/manager-bl';
import { ConversionDto } from '../../Models/Dtos/conversion-dto';
import { Status } from '../../Models/Enums/status.enum';
import { ConversionService } from '../../Services/conversion.service';
import { Router } from '@angular/router';
import { MessageService } from '../../Services/message-service';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import { AuthenticationService } from '../../Data/authentication-service';
import { RouterLinkComponent } from '../../AgGrid/router-link/router-link.component';
import { RouterLinkTwoComponent } from '../../AgGrid/router-link-two/router-link-two.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagingDto } from '../..//Models/Dtos/paging-dto';
import { PagingBl } from '../../Bl/paging-bl';
import { PagingRequest } from '../../Models/Requests/paging-request';
import { PagingResponse } from '../../Models/Response/paging-response';


@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})

export class ManagerComponent implements OnInit, AfterViewInit {
  @ViewChild('content',{static: true}) contentElement : TemplateRef<any>;

  public Options:GridOptions;
  public Account : string;
  public _conversions : ConversionDto[] = [];

  private _convId : number;
  public Status = Status;
  public SelectedRow : number;
  //private _progressRef: NgProgressRef;
  public SelectedPage : number = 1;
  public Pages : number = 0;
  public Imported : boolean = true;
  public InProgress : boolean = true;
  public Completed : boolean = true;
  public Failed : boolean = true;
  public HasLoaded : boolean = false;
  public RowSelection : string = 'single';
  private _gridApi : any;
  public Paging : PagingResponse;



  public NoRowsTemplate =
  "<span style='font-weight:bold; color:#17a2b8; font-size:12px'>No Records Returned</span>";


  public ColumnDefs = [
    {headerName: 'ConversionId', field: 'convId', width:100, headerClass:'ag-custom-header',pinned: 'left' },
    {headerName: 'Status', field: 'status' , width:120,headerClass:'ag-custom-header',resizable: true, valueGetter: function(params) {
    
      var st = Status;
      if (params.data)
        return st[params.data.status]
      
      return st[1];
    }},
    {headerName: 'Account Name', field: 'account.name', width:275, headerClass:'ag-custom-header', resizable: true},
    {headerName: 'File',  field: 'file', width:300, headerClass:'ag-custom-header', resizable: true},
    {headerName: 'Currency', field: 'currency.name', width:130, headerClass:'ag-custom-header', resizable: true},
    {headerName: 'User', field: 'user.name', width:130, headerClass:'ag-custom-header', resizable: true},
   
    {headerName: 'Date Received', field: 'received', width:130, headerClass:'ag-custom-header', resizable: true,
    cellRenderer: (data) => {

      return moment(data.data.received).format('DD/MM/YYYY')
  }},
  {headerName: 'Files', field: 'zipPath', width:140, headerClass:'ag-custom-header', resizable: true,
  cellRendererFramework: RouterLinkComponent,
  cellRendererParams: {
    onClick: function(conversionDto : ConversionDto)
    {
      this.Export(conversionDto);
    }.bind(this),
    label: 'Download'
  }},

  {headerName: 'Locations', field: 'hasLocations', width:140, headerClass:'ag-custom-header', resizable: true,
  cellRendererFramework: RouterLinkTwoComponent,
  cellRendererParams: {
    onClick: function(conversionDto : ConversionDto)
    {
      this._convId = conversionDto.convId;
      this._conversionService.Set(conversionDto);
      this._modalService.open(this.contentElement, { ariaLabelledBy: 'modal-basic-title'});
    }.bind(this),
    label: 'Clear Locations'
  }},
  
   
  
  ];

  constructor(private _router : Router,private _managerBl : ManagerBl, private _conversionService : ConversionService,
    private _messagingService : MessageService,
    private _authenticationService : AuthenticationService,
    private _modalService: NgbModal, private _pagingBl : PagingBl
   ) { }

  async ngOnInit() {
    
    var pagingRequest = new PagingRequest ({ TypeId : 1, Filters : "", Current : 1, RecsPerPage : 15 });
    await this.PageInit(pagingRequest);
    this.initGrid()
  }

  private async Export(conversion : ConversionDto)
  {
    await this._managerBl.Download(conversion);
  }

  async ngAfterViewInit() {
    
    //this._paging = new PagingDto({ RecFirst: 1, PecLast : 15, First:1,Current:1, RecsPerPage:15 });
    //this.GetNew(this._paging);
    //this.initGrid();
    //await this.GetNew(this._paging);
  }

  public async DeleteLocations()
  {
    //this._messagingService.LoadingMsg(true);
    var response = await this._managerBl.DeleteLocations(this._convId);

    if (response.status)
    {
      //await this.Get(1, null);
      //this._gridApi.setDatasource(this.dataSource);
      var pagingDto= new PagingDto({ RecFirst: 1, RecLast : 15, Filters: "", TypeId : 1 });
      await this.GetNew(pagingDto);
 
    }
    
   // this._messagingService.LoadingMsg(false);
    var conv = this._conversionService.Get();
    debugger;
    conv.hasLocations = false;
    this._conversionService.Set(conv);
    this._modalService.dismissAll();
  }



  onCellClicked(params)
  {
    this.Select(params.data);
  }

  private initGrid()
  {
 
    this.Options = <GridOptions>{
   
      getRowStyle: (params) => {
        if (params.node.rowIndex % 2 === 0) {
          return {background: '#e7e7e7'};
        }
      }
    };
  }

  async onGridReady(params) {
    this._gridApi = params.api;
   params.api.setDomLayout('autoHeight');
   //params.api.setDatasource(this.dataSource);
  

 
  }

  async Filter()
  {
    var pagingRequest = new PagingRequest ({ TypeId : 1, Filters : "", Current : 1, RecsPerPage : 15 });
    await this.PageInit(pagingRequest);
  }

  Import()
  {
    this._router.navigate(['/import']);
  }

  SetClickedRow = function(index){
    this.SelectedRow = index;
  }

  public Select(conversion : ConversionDto)
  {
    this._conversionService.Set(conversion);
    this._router.navigate(['/import']);
  }

  public CloseModal()
  {
    this._modalService.dismissAll();
  }

 
  public async PageInit(pagingRequest : PagingRequest)
  {
    var status : number[] = [];

    if (this.Imported)
    {
      status.push(1);
    }
    if (this.InProgress)
    {
      status.push(2);
    }
    if (this.Completed)
    {
      status.push(4);
    } 

    if (this.Failed)
    {
      status.push(3);
    }
    var response = await this._pagingBl.PageConversions(pagingRequest, this.Account, status,this._authenticationService.currentUserValue.userId);
    
    this.Paging = response;
  }


  public async PageChanged(pagingDto : PagingDto)
  {
    await this.GetNew(pagingDto);
   
  }

  private async GetNew(pagingDto : PagingDto)
  {

    this._messagingService.LoadingMsg(true);
   //this._loadingBarService.start();
    //this._messagingService.LoadingMsg(true);
    var status : number[] = [];

    if (this.Imported)
    {
      status.push(1);
    }
    if (this.InProgress)
    {
      status.push(2);
    }
    if (this.Completed)
    {
      status.push(4);
    } 

    if (this.Failed)
    {
      status.push(3);
    }

    var managerResponse = await this._managerBl.Get(pagingDto, this.Account, status,this._authenticationService.currentUserValue.userId);

    if (managerResponse.status)
    {
      this._conversions = managerResponse.conversions;

      //this._paging = new PagingDto();

      //this._paging.RecFirst = managerResponse.recFirst;
      //this._paging.RecLast = managerResponse.recLast;
      //this._paging.First = managerResponse.first;
      //this._paging.Last = managerResponse.last;
      //this._paging.Current = managerResponse.current;
      //this._paging.RecsPerPage = managerResponse.recsPerPage;
     //this._paging.Total  = managerResponse.total;

     this._messagingService.LoadingMsg(false);
      this.HasLoaded = true;
    }
  }

}
