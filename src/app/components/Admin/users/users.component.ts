import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LookupBl } from '../../../Bl/lookup-bl';
import {UserBl} from '../../../bl/user-bl'
import { GridOptions } from 'ag-grid-community';
import { UserDto } from '../../../Models/Dtos/user-dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientDto } from '../../../Models/Dtos/client-dto';
import { UserTypeDto } from '../../../Models/Dtos/user-type-dto';
import { AuthenticationService } from '../../../Data/authentication-service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('userTemplate',{static: true}) userElement : TemplateRef<any>;
  @ViewChild('confirmTemplate',{static: true}) confirmElement : TemplateRef<any>;

  public UserForm: FormGroup;
  public Options:GridOptions;
  public RowSelection : string = 'single';
  public Users : UserDto[] = [];
  public HasLoaded : boolean;
  public SelectedUser : UserDto;
  public Operation : string;
  public Clients : ClientDto[];
  public UserTypes : UserTypeDto[];
  public GridSelected : UserDto;
  public GridUserSelected : boolean;
  public ConfirmTitle : string;
  public Question : string;
  private _add : boolean;
  private _reset : boolean;
  private _gridApi;
  
  public ColumnDefs = [
    {headerName: 'UserId', field: 'userId', width:100, headerClass:'ag-custom-header',pinned: 'left' },
    
    {headerName: 'Name', field: 'name', width:275, headerClass:'ag-custom-header', resizable: true},
    {headerName: 'UserName', field: 'userName', width:275, headerClass:'ag-custom-header', resizable: true},
   
    {headerName: 'UserType',  field: 'userType.userType', width:300, headerClass:'ag-custom-header', resizable: true},
    {headerName: 'Company', field: 'client.client', width:150, headerClass:'ag-custom-header', resizable: true}
  ];

  constructor(private _lookUpBl : LookupBl, 
    private _userBl : UserBl,
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _authenticationService : AuthenticationService) { }

  async ngOnInit() {

    this.Options = <GridOptions>{
   
      getRowStyle: (params) => {
        if (params.node.rowIndex % 2 === 0) {
          return {background: '#e7e7e7'};
        }
      }
    };

    this.UserForm = this._formBuilder.group({
      name: ['', Validators.required],
      userName: ['', Validators.required],
      client: ['', Validators.required],
      userType : ['', Validators.required]
    });
    
    var user = this.getUser();
    var lookupResponse = await this._lookUpBl.GetUserLookups(user.userId);

    await this.loadUsers();
    this.Clients = lookupResponse.clients;
    this.UserTypes = lookupResponse.userTypes;
    this.HasLoaded = true;
  }

  async loadUsers()
  {
    var user = this.getUser();
    var response  = await this._userBl.Get(user.userId);

    this.Users = response.users;
  }

  getUser()
  {
    return this._authenticationService.currentUserValue;
  }

  onCellClicked(params)
  {
    this.SelectedUser = params.data;
    this.Operation = "Update";
    this._modalService.open(this.userElement, { ariaLabelledBy: 'modal-basic-title'});

    this.setFormValues(false);
  }

  onSelectionChanged() {
    var selected = this._gridApi.getSelectedRows();

    if (selected)
    {
      this.GridSelected = selected[0];
      this.GridUserSelected = true;
    }

  }

  onGridReady(params) {
    this._gridApi = params.api;
    this._gridApi.setDomLayout('autoHeight');
  }

  Add()
  {
    this.SelectedUser = new UserDto({ client : null });
    this.Operation = "Add";
    this._modalService.open(this.userElement, { ariaLabelledBy: 'modal-basic-title'});

    this.setFormValues(true);
  }

  setFormValues(add : boolean)
  {
    var ctrls = this.UserForm.controls;

    ctrls['name'].setValue(this.SelectedUser.name);

    if (add)
    {
      var loggedInUser = this.getUser();
      if (loggedInUser.userType.userTypeId == 2)
      {
        var client = this.Clients.find(x=> x.client == loggedInUser.client.client);
        ctrls['client'].setValue(client.clientId);
      }
      else
        ctrls['client'].setValue(null);
    }
    else
      ctrls['client'].setValue(this.SelectedUser.client.clientId);

    ctrls['userName'].setValue(this.SelectedUser.userName);

    if (add)
      ctrls['userType'].setValue(null);
    else
      ctrls['userType'].setValue(this.SelectedUser.userType.userTypeId);

    this._add = add;
  }

  ResetPwd()
  {
    this._reset = true;
    this.ConfirmTitle = "Confirm Reset Password";
    this.Question = "Are you sure sure you wish to reset the user " + this.GridSelected.userName +" password?";
    this._modalService.open(this.confirmElement , { ariaLabelledBy: 'modal-basic-title'});
  }

  Confirm()
  {
    if (this._reset)
      this.Reset();
    else
      this.DeleteUser();

  }

  async DeleteUser()
  {
    await this._userBl.Delete(this.GridSelected.userId);

    this.Cancel();

    await this.loadUsers();
  }
  Cancel()
  {
    this._modalService.dismissAll();
  }

  Delete()
  {
    this.ConfirmTitle = "Confirm Delete";
    this._reset = false;
    this.Question = "Are you sure you wish to delete the user - " + this.GridSelected.userName+ "?";
    this._modalService.open(this.confirmElement , { ariaLabelledBy: 'modal-basic-title'});
 
  }

  async Reset()
  {
    await this._userBl.ChangePwd(this.GridSelected.userId);
    
    this.Cancel();
  }

  async Save()
  {
    
    var ctrls = this.UserForm.controls;

    var name = ctrls['name'].value;

    this.SelectedUser.name = name;

    var clientId = ctrls['client'].value;

    var client = this.Clients.find(x=> x.clientId == clientId);

    this.SelectedUser.client = client;
    this.SelectedUser.userName = ctrls['userName'].value;

    var userTypeId = ctrls['userType'].value;

    var userType = this.UserTypes.find(x=> x.userTypeId == userTypeId);

    this.SelectedUser.userType = userType;

    await this._userBl.Save(this.SelectedUser, this._add);

    this._modalService.dismissAll();

    await this.loadUsers();
  }

}
