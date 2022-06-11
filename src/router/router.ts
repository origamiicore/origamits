import { IOriModel } from "../..";
import ExtrnalService from "../models/extrnalService";
import GlobalModels from "../models/globalModels";
import InternalService from "../models/internalService";
import MessageModel from "../models/messageModel";
import PackageIndex from "../models/packageIndex";
import RouteResponse from "../models/routeResponse";
import UploadModel from "../models/uploadModel";
import RouteErrorMessage from "./routeErrorMessage"; 
import RouteService from "./routeService";
import UploadService from "./uploadService";

var globalModel:GlobalModels=new GlobalModels();
if(global.origamits)
{
  globalModel=global.origamits as GlobalModels ;
} 
var routes = globalModel.routes; 


export default class Router
{ 
  //static routes = new Map<String,RouteService>();  
  static getRouteData(domain:string , service:string): ExtrnalService
  {
    if(!routes[domain])return null;
    var route=(routes[domain] as RouteService);
    if(!route.externalServices[service])return null;
    return route.externalServices[service] as ExtrnalService;
  } 
  static addExternalRoute(domain:string , service:string , data:ExtrnalService)
  {
    if(!routes[domain])routes[domain]=new RouteService();
    routes[domain].externalServices[service]=data; 
  }
  static addInternalRoute(domain:string , service:string , data:InternalService)
  {
    if(!routes[domain])routes[domain]=new RouteService();
    routes[domain].services[service]=data;
  }
  static setInstance(index:PackageIndex)
  {
    var domain=index.name;
    if(!routes[domain])return null;
    var service=routes[domain] as RouteService
    for(var defsrv in service.services)
    { 
      let serviceOption=service.services[defsrv] as InternalService;
      serviceOption.function=index[serviceOption.functionName]
      serviceOption.parent=index;
    }
    for(var srv in service.externalServices)
    {  
      let serviceOption=service.externalServices[srv] as ExtrnalService;
      serviceOption.function=index[serviceOption.functionName];
      serviceOption.parent=index;
    }

  }
  static async runInternal(domain:string ,service:string ,message:MessageModel ):Promise<RouteResponse>
  { 
    
    if(domain==null || !routes[domain])
    {
      return new RouteResponse({error: RouteErrorMessage.domainNotExist});
    }  
    if( !routes[domain]?.services[service])
    {
      return new RouteResponse({error: RouteErrorMessage.serviceNotExist});
    }
    var d=routes[domain] as RouteService;
    var s= d?.services[service] as InternalService;
    if(s==null) return new RouteResponse({error: RouteErrorMessage.serviceNotExist});
    var data:any[]=[];
    for(var arg of s.args)
    {
      var dt=message.data[arg.name]; 
      if(arg.isSession)
      {
        dt=message.session;
      }
      if(arg.type)
      {
        
        dt=new (arg.type)(dt); 
        if(dt instanceof IOriModel)
        { 
          var validate=  dt.$oriExtraData.isValid();  
          if(validate!==true)
          {
            return RouteResponse.failed({error:validate,name:arg.name},'parameter validation',RouteErrorMessage.validationError)
          }
          
        }
      }
      data.push(dt);

    }
    data.push(s.parent)
    try{
      var res =await  s.parent[s.functionName](...data) ;
      if(res instanceof RouteResponse)
      {
        return res;
      }
      return RouteResponse.success(res);
    }catch(exp){
      return RouteResponse.failed(exp,exp.message,'')
    }
  }
  static async runExternal(domain:string ,service:string ,message:MessageModel ):Promise<RouteResponse>
  { 
    
    if(domain==null || !routes[domain])
    {
      return new RouteResponse({error: RouteErrorMessage.domainNotExist});
    }  
    if( !routes[domain]?.externalServices[service])
    {
      return new RouteResponse({error: RouteErrorMessage.serviceNotExist});
    }
    var d=routes[domain] as RouteService;
    var s= d?.externalServices[service] as ExtrnalService;
    if(s==null) return new RouteResponse({error: RouteErrorMessage.serviceNotExist});
    var data:any[]=[];
    for(var arg of s.args)
    {
      var dt=message.data[arg.name]; 
      if(arg.isSession)
      {
        dt=message.session;
      }
      if(arg.type)
      {
        dt=new (arg.type)(dt); 
        if(dt instanceof IOriModel)
        { 
          var validate=  dt.$oriExtraData.isValid();
          if(validate!==true)
          {
            return RouteResponse.failed({error:validate,name:arg.name},'parameter validation',RouteErrorMessage.validationError)
          }
          
        }
      }
      data.push(dt);

    }
    data.push(s.parent)
    try{
      var res =await  s.parent[s.functionName](...data) ;
      if(res instanceof RouteResponse)
      {
        return res;
      }
      return RouteResponse.success(res);
    }catch(exp){
      return RouteResponse.failed(exp,exp.message,'')
    }
  }
}