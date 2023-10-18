import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { RouterLinkComponent } from 'src/app/AgGrid/router-link/router-link.component';
import { EncoderBl } from 'src/app/Bl/encoder-bl';
import { AuthenticationService } from 'src/app/Data/authentication-service';
import { EncoderDto } from 'src/app/Models/Dtos/encoder-dto';
import { MessageService } from 'src/app/Services/message-service';

@Component({
  selector: 'app-view-encoders',
  templateUrl: './view-encoders.component.html',
  styleUrls: ['./view-encoders.component.css']
})
export class ViewEncodersComponent implements OnInit {
  @ViewChild('newTemplate',{static: true}) newElement : TemplateRef<any>;
  public HasLoaded : boolean;
  public NoRowsTemplate =
  "<span style='font-weight:bold; color:#17a2b8; font-size:12px'>No Encoders Returned</span>";

  public ColumnDefs = [
    {headerName: 'Encoder Id', field: 'encoderId', width:100, headerClass:'ag-custom-header',pinned: 'left' },

    {headerName: 'Encoder Name', field: 'name', width:275, headerClass:'ag-custom-header', resizable: true},
  
  ];

  public NewForm: FormGroup;
  public Encoders : EncoderDto[];
  private _gridApi : any;
  public Options:GridOptions;
  public RowSelection : string = 'single';
  constructor(private _encoderBl : EncoderBl,
    private _authenticationService : AuthenticationService,
    private _router : Router,
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _messagingService : MessageService) { }

    
  async ngOnInit() {
    this.initGrid();
    await this.Load();

    this.NewForm = this._formBuilder.group({
      name: ['', Validators.required]
    });
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

  onCellClicked(params)
  {
    var encoderId = params.data.encoderId;
    this._router.navigate(['/Encoder', encoderId]);
  }

  public New()
  {
    this._modalService.open(this.newElement, { ariaLabelledBy: 'modal-basic-title'});
  }

  private async LoadEncoder(encoder : EncoderDto)
  {
    debugger;
  }

  public async Load()
  {
    this._messagingService.LoadingMsg(true);
    var user = this._authenticationService.currentUserValue;

    var result = await this._encoderBl.Get(user.client.clientId);
    this.Encoders = result.encoders;
    this._messagingService.LoadingMsg(false);

    this.HasLoaded = true;
  }

  public async Create()
  {
    var ctrls = this.NewForm.controls;
    var name = ctrls['name'].value;
    
    var client = this._authenticationService.currentUserValue.client;

    var response = await this._encoderBl.Create(name, client);
    this._modalService.dismissAll();

    if (response.status)
    {
      var encoderId = response.encoderId;
      this._router.navigate(['/Encoder', encoderId]);
    }
  }
}
