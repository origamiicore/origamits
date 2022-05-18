import ArgModel from "./argModel";
import { DefaultFunction } from "./defaultFunction";

export default class InternalService
{
    functionName:string;
    function:Function ;   
    args:ArgModel[]=[];
    public constructor(
        fields?: { 
            functionName?: string
            function?:  Function             
            args?:ArgModel[]
        }) {
        if (fields) Object.assign(this, fields);
    }
}