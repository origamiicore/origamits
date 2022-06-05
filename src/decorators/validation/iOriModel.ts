import ErrorDataModel from "./errorDataModel";
import ExtraData from "./extraData";

export default class IOriModel
{
    $oriExtraData:ExtraData;
    $oriValues:any={};
    $oriIsValidate:boolean=true;
    $oriJSonProps:any={};
    $oriErrorData:ErrorDataModel[]=[];  
    constructor()
    {  
        if(this.$oriExtraData)this.$oriExtraData.setParent(this);          
    }
    $oriSetValiadte(key:string,error:string)
    { 
        //if(!this.$oriErrorData)this.$oriErrorData=[];
        var index=this.$oriErrorData.map(p=> p.key).indexOf(key);
        if(error)
        {
            if(index==-1)
            {
                this.$oriErrorData.push(new ErrorDataModel({key:key,resion:error}))
            }
            else
            {
                this.$oriErrorData[index].resion=error;
            }
        }
        else
        {
            if(index>-1)this.$oriErrorData.splice(index,1);
        }
        this.$oriIsValidate=!this.$oriErrorData.length
    }
    toJSON()
    {
        var ignore=['$oriIsValidate','$oriJSonProps','$oriErrorData','$oriValues','$oriExtraData']
        var copy:any={};
        for(let prop in this)
        {
            if(ignore.indexOf(prop)!=-1)continue;
            copy[prop]=this[prop]
        }         
        for(let prop in this.$oriJSonProps)
        {
            if(this.$oriJSonProps[prop])
            {
                copy[prop]=this[prop];
            }
        } 
        return  copy;
    }
}