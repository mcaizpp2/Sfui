import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthGuard} from './Services/auth-guard';
import { CheckBoxCellComponent } from '../app/AgGrid/checkbox-cell-component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopComponent } from './components/top/top.component';
import { RouterModule, Routes } from '@angular/router';
import { ManagerComponent } from './components/manager/manager.component';
import { ImportComponent } from './components/import/import.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagerBl } from './Bl/manager-bl';
import { ManagerService } from './Data/manager.service';
import { MediatorService } from './Services/mediator.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbDateParserFormatter,NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberPickerModule } from 'ng-number-picker';
import { ToastrModule } from 'ngx-toastr';
import { ConversionService } from './Services/conversion.service';
import { NgxFileDropModule} from 'ngx-file-drop'
import { NgSelectModule } from '@ng-select/ng-select';
import { LookupService } from './Data/lookupservice';
import { LookupBl } from './Bl/lookup-bl';
import { MappingComponent } from './components/mapping/mapping.component';
import { ToMatrixPipe } from './Pipes/to-matrix.pipe';
import { NgbDateFormatter } from './Format/ngb-date-parser-formatter';
import { LocationsComponent } from './components/wizard/locations/locations.component';
import { SidebarModule } from 'ng-sidebar';
import { LocationService } from './Data/location-service';
import { LocationBl } from './Bl/location-bl';
import { AgGridModule } from 'ag-grid-angular';
import { AssumptionsComponent } from './components/wizard/assumptions/assumptions.component';
import { StateEditorComponent } from './AgGrid/CellEditors/state-editor/state-editor.component';
import { ToastMsgComponent } from './components/toast-msg/toast-msg.component';
import { BarComponent } from './components/bar/bar.component';
import { CompareComponent } from './components/compare/compare.component';
import { CompareService } from './Data/compare-service';
import { CompareBl } from './Bl/comparebl';
import { LoginComponent } from './components/login/login.component';
import { ChangePwdComponent } from './components/change-pwd/change-pwd.component';
import { UsersComponent } from './components/Admin/users/users.component';
import { MiComponent } from './components/Admin/mi/mi.component';
import { MaintenanceBl } from './Bl/maintenance-bl';
import { MaintenanceService } from './Data/maintenance-service';
import { RouterLinkComponent } from './AgGrid/router-link/router-link.component';
import { TxtDisFilterComponent } from './AgGrid/Filters/txt-dis-filter/txt-dis-filter.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MappingNewComponent } from './components/mapping-new/mapping-new.component';
import { NumericCtrlComponent } from './components/Ctrls/numeric-ctrl/numeric-ctrl.component';
import { RouterLinkTwoComponent } from './AgGrid/router-link-two/router-link-two.component';
import { ChangedValuesComponent } from './components/Admin/changed-values/changed-values.component';
import { BtnRenderComponent } from './AgGrid/btn-render/btn-render.component';
import { AdminValuesBl } from './Bl/admin-values-bl';
import { AdminValuesService } from './Data/admin-values-service';
import { CleanseComponent } from './components/cleanse/cleanse.component';
import { CleansingBl } from './Bl/cleansing-bl';
import { CleansingService } from './Data/cleansing-service';
import { FileUploadModule } from 'ng2-file-upload';
import { CleanseMgrComponent } from './components/cleanse-mgr/cleanse-mgr.component';
import { PagerComponent } from './components/pager/pager.component';
//import { GuiGridModule } from '@generic-ui/ngx-grid';
import {MatMenuModule} from '@angular/material/menu';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { JoinComponent } from './components/Ctrls/Cleansing/Component/join/join.component';
import { MapLkpComponent } from './components/Ctrls/Cleansing/map-lkp/map-lkp.component';
import { SignalRService } from './Services/signal-rservice';
import { EncodersComponent } from './components/Templates/encoders/encoders.component';
import { ViewEncodersComponent } from './components/Templates/view-encoders/view-encoders.component';

const appRoutes: Routes = [
  { path: 'manager',
    pathMatch: 'full',
    component : ManagerComponent,
    canActivate: [AuthGuard] 
  },
 
  { path: '',
    pathMatch: 'full',
    component : ManagerComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'cleanse',
  pathMatch: 'full',
  component : CleanseMgrComponent,
  canActivate: [AuthGuard] 
  },
  { path: 'clean/:id',
  pathMatch: 'full',
  component : CleanseComponent,
  canActivate: [AuthGuard] 
  },
  { path: 'import',
  pathMatch: 'full',
  component : ImportComponent,
  canActivate: [AuthGuard] 
  },
  { path: 'mapping',
    pathMatch: 'full',
    component : MappingComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'mappingNew',
    pathMatch: 'full',
    component : MappingNewComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'users',
    pathMatch: 'full',
    component : UsersComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'locations',
    pathMatch: 'full',
    component : LocationsComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'mi',
    pathMatch: 'full',
    component : MiComponent,
    canActivate: [AuthGuard] 
  },
  {
    path: 'changed',
    pathMatch: 'full',
    component : ChangedValuesComponent,
    canActivate: [AuthGuard]
  },
  { path: 'compare',
    pathMatch: 'full',
    component : CompareComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'changePwd',
    pathMatch: 'full',
    component : ChangePwdComponent
  },
  { path: 'viewEncoders',
    pathMatch: 'full',
    component : ViewEncodersComponent
  },
  { path: 'Encoder/:id',
    pathMatch: 'full',
    component : EncodersComponent
  },
  { path: 'login',
    pathMatch: 'full',
    component : LoginComponent
}];
@NgModule({
  declarations: [
    AppComponent,
    TopComponent,
    ManagerComponent,
    ImportComponent,
    MappingComponent,
    ToMatrixPipe,
    LocationsComponent,
    AssumptionsComponent,
    StateEditorComponent,
    StateEditorComponent,
    ToastMsgComponent,
    BarComponent,
    CompareComponent,
    LoginComponent,
    ChangePwdComponent,
    UsersComponent,
    MiComponent,
    CheckBoxCellComponent,
    RouterLinkComponent,
    TxtDisFilterComponent,
    MappingNewComponent,
    NumericCtrlComponent,
    RouterLinkTwoComponent,
    ChangedValuesComponent,
    BtnRenderComponent,
    CleanseComponent,
    CleanseMgrComponent,
    PagerComponent,
    ContextMenuComponent,
    JoinComponent,
    MapLkpComponent,
    EncodersComponent,
    ViewEncodersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot( appRoutes ),
    FormsModule,
    BrowserAnimationsModule, // required animations module
    NgbModule,
    NgxFileDropModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbProgressbarModule,
    AgGridModule.withComponents([StateEditorComponent,BtnRenderComponent, RouterLinkComponent,TxtDisFilterComponent,RouterLinkTwoComponent]),
    // ToastrModule.forRoot({timeOut: 30000,
    //   positionClass: 'toast-top-full-width'
    // }), 
    ToastrModule.forRoot({
      toastComponent: ToastMsgComponent,positionClass: 'toast-top-full-width', timeOut:2500
    }), 
    FileUploadModule,
    
    // ToastrModule added
  //   NgProgressModule.withConfig({
  //     thick:false,
  //    ease:'linear',
  //    color: "#fed136",
  //   min:0.15,
  //     max:100,
  //    speed: 400,
  //  spinner: false,
  //   direction:'ltr+'
  //    ,trickleSpeed:900,
  //   fixed:true,
      

   //}),
  // NgProgressModule,
    SidebarModule.forRoot(),
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    NumberPickerModule,
    MatMenuModule
    //uiGridModule
  ],
  providers: [CleansingBl, SignalRService, CleansingService, MaintenanceService,MaintenanceBl,MediatorService,ManagerService,AdminValuesService, AdminValuesBl, CompareService,CompareBl,ManagerBl,ConversionService,LookupService,LookupBl,LocationService,LocationBl,
    {provide: NgbDateParserFormatter, useClass: NgbDateFormatter}],
  bootstrap: [AppComponent],
  entryComponents: [ToastMsgComponent,CheckBoxCellComponent],
  exports :[BrowserModule, RouterModule, MatMenuModule]
})
export class AppModule { }
