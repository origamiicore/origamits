import ArgModel from "./argModel";
import { DefaultFunction } from "./defaultFunction";

export default class ExtrnalService
{
    functionName:string;
    function:Function ; 
    isPublic:boolean=true; 
    roles:number[]=[]; 
    args:ArgModel[]=[];
    maxUploadSize:number=0;
    public constructor(
        fields?: { 
            functionName?: string
            function?: DefaultFunction
            isPublic?: boolean
            roles?: number[]  
            args?: ArgModel[]  
            maxUploadSize?:number
        }) {
        if (fields) Object.assign(this, fields);
    }
}