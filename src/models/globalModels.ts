import RouteService from "../router/routeService";

export default class GlobalModels
{
    routes: Map<String,RouteService> = new Map<String,RouteService>(); 
}