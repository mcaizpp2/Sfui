import { AfterViewInit, Component, EventEmitter, NgZone, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { CleansingBl } from '../../Bl/cleansing-bl';
import { AuthenticationService } from '../../Data/authentication-service';
import { MessageService } from '../../Services/message-service';
import * as moment from 'moment';
import { Status } from '../../Models/Enums/status.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';
import { PagingRequest } from '../../Models/Requests/paging-request';
import { PagingBl } from '../../Bl/paging-bl';
import { PagingResponse } from '../../Models/Response/paging-response';
import { PagingDto } from '../../Models/Dtos/paging-dto';
import { CleansedMgrDto } from '../../Models/Dtos/cleansed-mgr-dto';
import { RouterLinkComponent } from '../../AgGrid/router-link/router-link.component';
import { RouterLinkTwoComponent } from '../../AgGrid/router-link-two/router-link-two.component';
import { MediatorService } from '../../Services/mediator.service';
import { SignalrMessageType } from '../../Models/Enums/message-type';
import { NotificationMessage } from '../../Models/notification-message';

@Component({
  selector: 'app-cleanse-mgr',
  templateUrl: './cleanse-mgr.component.html',
  styleUrls: ['./cleanse-mgr.component.css']
})
export class CleanseMgrComponent implements OnInit, AfterViewInit {
  @ViewChild('newTemplate',{static: true}) newElement : TemplateRef<any>;
  @ViewChild('replayTemplate', { static: true }) replayElement: TemplateRef<any>;
  @ViewChild('load', { static: true }) loadElement: TemplateRef<any>;
  @ViewChild('content', { static: true }) contentElement: TemplateRef<any>;

  public NoRowsTemplate =
  "<span style='font-weight:bold; color:#17a2b8; font-size:12px'>No Records Returned</span>";

  private _paging: PagingDto;
  public NewForm: FormGroup;
  public Operation : string;
  public Options:GridOptions;
  public RowSelection : string = 'single';
  private _file : File;
  private _gridApi : any;
  public Paging : PagingResponse;
  public HasLoaded : boolean;
  public CleansedMgrs: CleansedMgrDto[];

  public ProgressTxt: string;
  public ProgressPercent: number = 0;
  public ParsingStarted: boolean = false;
  public ParsingHeader: string;
  private _cleanseMgrId: number;
  public Title: string;


  public ColumnDefs = [
    {headerName: 'Id', field: 'cleansedMgrId', width:100, headerClass:'ag-custom-header',pinned: 'left' },
    {headerName: 'Name', field: 'name', width:275, headerClass:'ag-custom-header', resizable: true},
    {headerName: 'Status', field: 'status' , width:120,headerClass:'ag-custom-header',resizable: true, valueGetter: function(params) {
    
      var st = Status;
      if (params.data)
        return st[params.data.status]
      
      return st[1];
    }},
    {headerName: 'User', field: 'user.name', width:275, headerClass:'ag-custom-header', resizable: true},
    {headerName: 'Created Date', field: 'created', width:130, headerClass:'ag-custom-header', resizable: true,
    cellRenderer: (data) => {
      return moment(data.received).format('DD/MM/YYYY')
    }},
    {headerName: '', field: 'cleansedMgrId', width:140, headerClass:'ag-custom-header', resizable: true,
    cellRendererFramework: RouterLinkComponent,
    cellRendererParams: {
      onClick: function(cleansedMgrDto : CleansedMgrDto)
      {
        this.Replay(cleansedMgrDto);
      }.bind(this),
      label: 'Replay'
      }
    },
    {
      headerName: '', field: 'cleansedMgrId', width: 140, headerClass: 'ag-custom-header', resizable: true,
      cellRendererFramework: RouterLinkTwoComponent,
      cellRendererParams: {
        onClick: function (cleansedMgrDto: CleansedMgrDto) {
          this._cleanseMgrId = cleansedMgrDto.cleansedMgrId;
          this.Title = cleansedMgrDto.name;

          this._modalService.open(this.contentElement, { ariaLabelledBy: 'modal-basic-title' });
        }.bind(this),
        label: 'Delete'
      }
    }
  ];
  constructor(private _messagingService : MessageService,
    private _authenticationService : AuthenticationService, 
    private _cleansingBl : CleansingBl,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _mediatorService : MediatorService,
    private _router : Router,
    private _pagingBl: PagingBl,
    private ngZone: NgZone) { }

  async ngOnInit() {
    await this.initPager();
    this.initGrid();


    this.NewForm = this._formBuilder.group({
      name: ['', Validators.required],
      file: ['', Validators.required],
      user: ['', Validators.required],
      userId : ['',Validators.required],
      status : ['', Validators.required],
      replayId : ['']
    });

    this._mediatorService.ConvFailed.subscribe(x => {
      this._modalService.dismissAll();
    });

    this._mediatorService.CleanseComplete.subscribe(x => {
      this._modalService.dismissAll();

      this._mediatorService.Publish(new NotificationMessage({
        messageType: SignalrMessageType.Success,
        subject: x.subject,
        Refresh: false,
        body: x.body

      }));
      this._router.navigate(['/clean', x.cleanseMgrId]);
    });

    this._mediatorService.Progressed.subscribe(x => {
      this.ngZone.run(() => {
        this.ParsingStarted = true;
        this.ProgressPercent = x.progress;
        this.ProgressTxt = x.progress + '%  - ' + x.complete;
      });

    });
   
  }

  public async ReplayBtn()
  {
    var ctrls = this.NewForm.controls;
    var name = ctrls['name'].value;
    var replayId = ctrls["replayId"].value;
    var userId = this._authenticationService.currentUserValue.userId;
    var response = await this._cleansingBl.New(name, userId, this._file);
    this._modalService.dismissAll();

    if (response.status)
    {
      var cleansedMgrId = response.cleansedMgrId;
      var replayResponse = await this._cleansingBl.Replay(cleansedMgrId, replayId, name, this._file, this._authenticationService.currentUserValue);
 
      this._router.navigate(['/clean', cleansedMgrId]);
    }
  }

  public async DeleteRecord() {

    var response = await this._cleansingBl.Delete(this._cleanseMgrId);

    if (response.status) {
      await this.GetNew(this._paging);
    }
    
    this._modalService.dismissAll();
  }

  private Replay(cleansedMgrDto : CleansedMgrDto)
  {
    this.setFormValues(cleansedMgrDto);
    this._modalService.open(this.replayElement, { ariaLabelledBy: 'modal-basic-title'});
  }

  private async initPager()
  {
    var pagingRequest = new PagingRequest ({ TypeId : 2,  Filters : "", Current : 1, RecsPerPage : 20 });
    await this.PageInit(pagingRequest);
  }

  private async PageInit(pagingRequest : PagingRequest)
  {
    var userId =  this._authenticationService.currentUserValue.userId;
    var response = await this._pagingBl.PageCleansed(pagingRequest, userId);
    
    this.Paging = response;
  }

  public async Refresh()
  {
    await this.GetNew(this._paging);
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

  onGridReady(params) {
    this._gridApi = params.api;
    params.api.setDomLayout('autoHeight');
  }

  ngAfterViewInit() 
  {
    //this.Get(1, null);
  }
  public async PageChanged(pagingDto : PagingDto)
  {
    this._paging = pagingDto;
    await this.GetNew(pagingDto);
  }

  public New()
  {
    this.Operation = "New";

    this._modalService.open(this.newElement, { ariaLabelledBy: 'modal-basic-title'});

    this.setFormValuesCommon();
  }


  private async GetNew(pagingDto : PagingDto)
  {
    this._messagingService.LoadingMsg(true);
    this._authenticationService.currentUserValue.userId;

    var response = await this._cleansingBl.Get(pagingDto, this._authenticationService.currentUserValue.userId);
    
    this.CleansedMgrs = response.cleansedMgrs

    //this._gridApi.setDomLayout('autoHeight');

    this._messagingService.LoadingMsg(false);
    this.HasLoaded = true;
  }

  private setFormValues(cleansedMgrDto : CleansedMgrDto)
  {
    var ctrls = this.NewForm.controls;
    
   
    ctrls['replayId'].setValue(cleansedMgrDto.cleansedMgrId);
    this.setFormValuesCommon();
  }

  private setFormValuesCommon()
  {
    var ctrls = this.NewForm.controls;
    
    ctrls['user'].setValue(this._authenticationService.currentUserValue.userName);
    ctrls['userId'].setValue(this._authenticationService.currentUserValue.userId);
    ctrls['status'].setValue(Status.Imported);
  }

  public uploader: FileUploader = new FileUploader({
    url: '',
        disableMultipart : false,
        autoUpload: false,
        method: 'post',
        itemAlias: 'attachment'

  });

  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    console.log(file);
    var ctrls = this.NewForm.controls;
    ctrls['file'].setValue(file.name);
    this._file = file;
  }

  public async Save()
  {
    var ctrls = this.NewForm.controls;
    var name = ctrls['name'].value;
    
    var userId = this._authenticationService.currentUserValue.userId;

    this.ParsingHeader = "Parsing Excel File";
    this.ParsingStarted = true;
    this.ProgressPercent = 0;
    this.ProgressTxt = "0% Parsed";

    this._modalService.dismissAll();
    this._modalService.open(this.loadElement, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });

    var response = await this._cleansingBl.New(name, userId, this._file);

    //this._modalService.dismissAll();

    //if (response.status)
    //{
    //  var cleansedMgrId = response.cleansedMgrId;
    //  this._router.navigate(['/clean', cleansedMgrId]);
    //}
  }

  onCellClicked(params)
  {
    var cleansedMgrId = params.data.cleansedMgrId;
    this._router.navigate(['/clean', cleansedMgrId]);
  }

  public CloseModal() {
    this._modalService.dismissAll();
  }


}
