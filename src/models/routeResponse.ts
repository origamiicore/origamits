export class ResponseDataModel
{ 
  isDone:boolean=false;
  data:any;
  sessionId:string;
  public constructor(
      fields?: { 
        isDone?: boolean
        data?: any
        sessionId?: string
      }) {
      if (fields) Object.assign(this, fields);
  }
}
export class ResponseErrorModel
{
    message:string;
    code:string;
    data:any;
    public constructor(
      fields?: {
        message?: string,
        code?: string,
        data?: any
      }) {
      if (fields) Object.assign(this, fields);
  }
}
export class AddedResponse
{
  redirect:string;
  directText:string;
  streamFileDownload:string;
  directFileDownload:string;
  type:string;
  public constructor(
      fields?: {  
        redirect?: string
        directText?: string
        streamFileDownload?: string
        directFileDownload?: string
        type?: string
      }) {
      if (fields) Object.assign(this, fields);
  }
}
export default class RouteResponse
{
    session:any;
    error:ResponseErrorModel ;
    response:ResponseDataModel;
    addedResponse:AddedResponse;
    public constructor(
      fields?: {
        response?: ResponseDataModel
        error?: ResponseErrorModel
        session?: any
        addedResponse?:AddedResponse
      }) {
      if (fields) Object.assign(this, fields);
  }

}