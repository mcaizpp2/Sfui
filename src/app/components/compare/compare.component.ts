import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { CompareBl } from '../../Bl/comparebl';
import { FileDto } from '../../Models/Dtos/file-dto';
import { GetWorkSheetsRequest } from '../../Models/Requests/files-request';
import { WorkSheetDto } from '../../Models/Dtos/work-sheet-dtos';
import * as XLSX from 'xlsx';
import { MessageService } from '../../Services/message-service';
import { CompareRequest } from '../../Models/Requests/compare-request';
import { CompareResultsDto } from '../../Models/Dtos/compare-results-dto';
import { GridOptions } from 'ag-grid-community';
import { ConversionFileDto } from '../../Models/Dtos/conversion-dto';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit, AfterViewInit {
  public FileForm : FormGroup;
  public WorkSheetForm : FormGroup;

  public ConversionFilesDto : ConversionFileDto[];
  public FilesOne : FileDto[];
  public FilePath : string;
  public Errors : string[] = [];
  public DroppedWorkSheets : WorkSheetDto[] =[];
  public ProcessedWorkSheets : WorkSheetDto[] =[];
  public BldgClassMatched : number;
  public BldgClassNotMatched : number;
  public OccupancyMatched : number;
  public OccupancyNotMatched : number;
  public ShowResults : boolean = false;
  public CompareResults : CompareResultsDto[];
  public RowSelection : string = 'single';
  public Options:GridOptions;
  private _processFileName : string;
  private _file : File;

  public ColumnDefs = [
    {headerName: 'LocNum', field: 'locNum', width:85, headerClass:'ag-custom-header',filter:true },
    { headerName: 'Building Input', resizable: true,field:'buildingInput', width:240,headerClass:'ag-custom-header',filter:true },
  
    { headerName: 'Building', field:'droppedBldg', width:100,headerClass:'ag-custom-header',filter:true },
  { headerName: 'Morph Building', field:'processedBldg', width:140,headerClass:'ag-custom-header',filter:true },
  { headerName: 'Match', field:'isBuildingMatch', width:80,headerClass:'ag-custom-header',filter:true,
  cellRenderer: function(params) { 
    //var input = document.createElement('input');
    //input.type="checkbox";
    //input.readOnly = true;
    //input.checked=params.value;

    let eIconGui = document.createElement('span');   
    if (params.data.isBuildingMatch)      
      eIconGui.innerHTML = '<em class="fa fa-check success"></em>'; 
    else
    eIconGui.innerHTML = '<em class="fa fa-times failure"></em>';     

    return eIconGui;
} }, 
  { headerName: 'Occupancy Input', field:'occupancyInput', resizable: true, width:240,headerClass:'ag-custom-header',filter:true },
  { headerName: 'Occupancy', field:'droppedOccupancy', width:140,headerClass:'ag-custom-header',filter:true },
  { headerName: 'Morph Occupancy', field:'processedOccupancy', width:150,headerClass:'ag-custom-header',filter:true },
  { headerName: 'Match', field:'isOccupancyMatch', width:80,headerClass:'ag-custom-header',filter:true,
  cellRenderer: function(params) { 
    let eIconGui = document.createElement('span');   
    if (params.data.isOccupancyMatch)      
      eIconGui.innerHTML = '<em class="fa fa-check success"></em>'; 
    else
    eIconGui.innerHTML = '<em class="fa fa-times failure"></em>';     

    return eIconGui;
}}
  
  
  ];

  constructor(private _formBuilder: FormBuilder,private _compareBl : CompareBl,
    private _messagingService : MessageService) { }

  ngOnInit() {
    window.addEventListener("dragover", e => {
      e && e.preventDefault();
    }, false);
    window.addEventListener("drop", e => {
      e && e.preventDefault();
    }, false);

    this.FilePath = "Please Drop a file here";
    this.Errors.push('Please select an File');
    this.constructFormBuilder();
    this.loadLookups();

  }

  ngAfterViewInit() {
    this.initGrid();

  }

  public Filter(type : number)
  {
    var filter : any;
    switch (type)
    {
      case 1 :
        filter = {
          isBuildingMatch: {
            filterType: 'text',
            type: 'contains',
            filter: false
          }
        }
        break;
      case 2 :
        filter = {
          isOccupancyMatch: {
            filterType: 'text',
            type: 'contains',
            filter: false
          }
        }
        break;
      case 3 :
        break;
    }      
      this.Options.api.setFilterModel(null);
      if (type < 3)
        this.Options.api.setFilterModel(filter);
  }


  private initGrid()
  {
    this.Options = <GridOptions>{
   
      getRowStyle: (params) => {
        if (params.node.rowIndex % 2 === 0) {
          return {background: '#e7e7e7'};
        }
      },
      pagination: true,
      paginationPageSize: 50,
      cacheBlockSize: 50
    };
  }

  public IsImportFormValid()
  {
    var ctrls = this.FileForm.controls;
    var fileOne = ctrls['FileOne'].value;
    if (this.Errors.length == 0 && fileOne)
      return true;

    return false;
  }

  public Dropped(files: NgxFileDropEntry[]) {
    this.ShowResults = false;
    this._messagingService.LoadingMsg(true);
    this.Errors = [];
    if (files.length > 1)
    {
       this.Errors.push("You can only upload 1 file at a time");
       return;
    }

    for (const droppedFile of files)
    {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file:File) =>
        {

         let ext = file.name.split('.')[file.name.split('.').length - 1];

         if(ext.toLowerCase() == 'xlsx')
         {

           this._file = file;
           this.FilePath = file.name;
           this.ReadXl(file);
         }
         else
         {
            this.Errors.push(fileEntry.name + " does not have a valid file type");
            this.Errors.push('Please select an SOV');
         }
        });
      }
    }
    this._messagingService.LoadingMsg(false);
  }

  private ReadXl(file:File)
  {
    const reader: FileReader = new FileReader();
     
    reader.onload = (e: any) => {
     
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});


      var sheets = wb.SheetNames;
      this.DroppedWorkSheets = [];
      sheets.forEach(x=>
        {
            this.DroppedWorkSheets.push(new WorkSheetDto({ name : x}));
        });
    };

		reader.readAsBinaryString(file);

  }

  private async loadLookups()
  {
    var response = await this._compareBl.Get();

    if (response.status)
      this.ConversionFilesDto = response.conversionFiles;
  }

  private constructFormBuilder()
  {
    this.FileForm = this._formBuilder.group({  
      FileOne: [null, Validators.required]
    });

    this.WorkSheetForm = this._formBuilder.group({  
      DroppedWs : [null, Validators.required],
      ProcessedWs: [null, Validators.required],
      start : [null, Validators.required]
    });

    var ctrls = this.WorkSheetForm.controls;

    ctrls['start'].setValue(1);
  }

  public async GetWorkSheets()
  {
    this._messagingService.LoadingMsg(true);
    //get files to query
    var ctrls = this.FileForm.controls;

    this._processFileName = ctrls['FileOne'].value;

    var t = this.ConversionFilesDto.find(x=> x.filePath == this._processFileName);
    var request = new GetWorkSheetsRequest({CleanedFileName : t.filePath});

    var getWorksheetsResponse = await this._compareBl.GetWorkSheets(request);

    if (getWorksheetsResponse.status)
      this.ProcessedWorkSheets = getWorksheetsResponse.workSheets;

      this._messagingService.LoadingMsg(false);
  }

  public async Compare()
  {
    this._messagingService.LoadingMsg(true);
    var ctrls = this.WorkSheetForm.controls;
    var processedWs = ctrls['ProcessedWs'].value;
    var droppedWs = ctrls['DroppedWs'].value;
    var startIdx = ctrls['start'].value;

    var t = this.ConversionFilesDto.find(x=> x.filePath == this._processFileName);

    var compareRequest = new CompareRequest({ProcessedFile : this._processFileName,
                                            ProcessedWs : processedWs,
                                            DroppedWs : droppedWs,
                                            AccountName : t.accountName,
                                            StartIdx : startIdx });

    var compareResponse = await this._compareBl.Compare(compareRequest, this._file);

    if (compareResponse.status)
    {
      this.BldgClassMatched = compareResponse.totalBldgMatched;
      this.BldgClassNotMatched = compareResponse.totalBldgNotMatched;
      this.OccupancyMatched = compareResponse.totalOccupancyMatched;
      this.OccupancyNotMatched = compareResponse.totalOccupancyNotMatched;
      this.CompareResults = compareResponse.compareResults;
      this.ShowResults = true;
    }
    
    this._messagingService.LoadingMsg(false);
   
  }

}
