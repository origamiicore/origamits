import ExtrnalService from "../models/extrnalService";
import InternalService from "../models/internalService";
import MessageModel from "../models/messageModel";
import PackageIndex from "../models/packageIndex";
import RouteResponse from "../models/routeResponse";
import UploadModel from "../models/uploadModel";
import RouteErrorMessage from "./routeErrorMessage"; 
import RouteService from "./routeService";
import UploadService from "./uploadService";
 
export default class Router
{ 
  static routes = new Map<String,RouteService>();  
  static getRouteData(domain:string , service:string): ExtrnalService
  {
    if(!this.routes[domain])return null;
    var route=(this.routes[domain] as RouteService);
    if(!route.externalServices[service])return null;
    return route.externalServices[service] as ExtrnalService;
  } 
  static addExternalRoute(domain:string , service:string , data:ExtrnalService)
  {
    if(!this.routes[domain])this.routes[domain]=new RouteService();
    this.routes[domain].externalServices[service]=data; 
  }
  static addInternalRoute(domain:string , service:string , data:InternalService)
  {
    if(!this.routes[domain])this.routes[domain]=new RouteService();
    this.routes[domain].services[service]=data;
  }
  static setInstance(index:PackageIndex)
  {
    var domain=index.name;
    if(!this.routes[domain])return null;
    var service=this.routes[domain] as RouteService
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
    }

  }
  static async runInternal(domain:string ,service:string ,message:MessageModel ):Promise<RouteResponse>
  { 
    
    if(domain==null || !this.routes[domain])
    {
      return new RouteResponse({error: RouteErrorMessage.domainNotExist});
    }  
    if( !this.routes[domain]?.services[service])
    {
      return new RouteResponse({error: RouteErrorMessage.serviceNotExist});
    }
    var d=this.routes[domain] as RouteService;
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
      }
      data.push(dt);

    }
    data.push(s.parent)
    var res = s.parent[s.functionName](...data)  
    return res;
  }
  static async runExternal(domain:string ,service:string ,message:MessageModel ):Promise<RouteResponse>
  { 
    
    if(domain==null || !this.routes[domain])
    {
      return new RouteResponse({error: RouteErrorMessage.domainNotExist});
    }  
    if( !this.routes[domain]?.externalServices[service])
    {
      return new RouteResponse({error: RouteErrorMessage.serviceNotExist});
    }
    var d=this.routes[domain] as RouteService;
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
      }
      data.push(dt);

    }
    data.push(s.parent)
    var res = s.parent[s.functionName](...data)  
    return res;
  }
}