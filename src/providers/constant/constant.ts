
import { Injectable } from '@angular/core';
@Injectable()
export class Constant
{
  public fileTypes : any = [
        {"name":"XLSX","ext":".xlsx","type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
        {"name":"CSV","ext":".csv","type":"text/csv"},
        {"name":"DOC","ext":".doc","type":"application/msword"},
        {"name":"DOCX","ext":".docx","type":"application/vnd.openxmlformats-officedocument.wordprocessingml.document"},
        {"name":"GIF","ext":".gif","type":"image/gif"},
        {"name":"JPEG","ext":".jpeg","type":"image/jpeg"},
        {"name":"JPG","ext":".jpg","type":"image/jpeg"},
        {"name":"PNG","ext":".png","type":"image/png"},
        {"name":"PDF","ext":".pdf","type":"application/pdf"},
        {"name":"PPT","ext":".ppt","type":"application/vnd.ms-powerpoint"},
        {"name":"PPTX","ext":".pptx","type":"application/vnd.openxmlformats-officedocument.presentationml.presentation"},
        {"name":"RAR","ext":".rar","type":"application/x-rar-compressed"},
        {"name":"TXT","ext":".txt","type":"text/plain"},
        {"name":"XLS","ext":".xls","type":"application/vnd.ms-excel"},
        {"name":"ZIP","ext":".zip","type":"application/zip"}
    ];
    public leaseAppointmentStatus:any={0:"",1:"Booked",2:"Rescheduled",3:"Leasing Approved",4:"FM Approved",5:"Cancelled"}
  }