import ArgModel from "../models/argModel";
import ExtrnalService from "../models/extrnalService";
import InternalService from "../models/internalService";
import Router from "../router/router";
import Container, { FunctionModel, FunctionOption, ModelContainer, ModelProps, ParamModel } from "./container"; 
import ModelService from "./modelService";
import ExtraData from "./validation/extraData";
import IOriModel from "./validation/iOriModel";

var container:Container=new Container();
export  function SessionInput (target: Object, propertyKey: string , parameterIndex: number) { 
    container.addParamData(propertyKey,new ParamModel({
        index:parameterIndex,
        type:'session'
    })) 
}

export function DataInput(fields?: { 
    service?: string,  
    isRequired?:boolean
    classType?:any
  })
{
    return function (target: Object, propertyKey: string, parameterIndex: number) {
        var func:any=target[propertyKey] as Function;
        type types = Parameters<typeof func>;
        var a={} 
        container.addParamData(propertyKey,new ParamModel({
            index:parameterIndex,
            type:'input',
            isRequired:fields?.isRequired,
            classType:fields?.classType
        }))
    }

}
export function OriService(fields?: {
    domain?: string,
    service?: string, 
    isInternal?:boolean,
    isPublic?:boolean,
    roles?: number[] 
    maxUploadSize?:number
  }) { 
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {  
        container.setFunction(propertyKey,new FunctionOption(fields as any));         
    };
}
interface Type<T> {
    new (...args: any[]): T;
  }
  
export default function OriInjectable(fields: {
    domain: string, 
  }) {
    return function <T>(target: Type<T>) {
        var myclass=new target();
        
        for(var funcId in container.functions)
        {
            var func= container.functions[funcId] as FunctionModel; 
            var fstr=myclass[func.name].toString();
            var start=fstr.indexOf('(')
            var end=fstr.indexOf('\n')
            var fInterface=fstr.substr(start,end-start);
            if(fInterface.indexOf('=')!=-1)
            {
                throw `${func.name} : you can't use default value`
            }
            start=fInterface.indexOf('(') 
            fInterface=fInterface.substr(start+1,fInterface.indexOf(')')-start-1) 
            var params=fInterface.split(',')
            var paramList:ArgModel[]=[];
            for(var param of params)
            {
                paramList.push(new ArgModel({name:param.trim()}))
            }
            for(var fparam in func.params)
            {
                let pmodel=func.params[fparam] as ParamModel;
                if(pmodel.type=='session')paramList[pmodel.index].isSession=true;
                if(pmodel.classType)paramList[pmodel.index].type= pmodel.classType ; 
            }
            if(func.option.isInternal)
            {
                var service=func.name;
                if(func.option.service)service=func.option.service;
                Router.addInternalRoute(fields.domain,service,new InternalService({
                    functionName:func.name,
                    args:paramList
                }) )
            }
            else
            {
                var service=func.name;
                if(func.option.service)service=func.option.service;
                Router.addExternalRoute(fields.domain,service,new ExtrnalService({
                    functionName:func.name,
                    isPublic:func.option.isPublic,
                    maxUploadSize:func.option.maxUploadSize,
                    roles:func.option.roles, 
                    args:paramList
                }))

            }
        } 
        container=new Container();
    };
  }


export function OriModel(fields?: {
     
  }) {
    return function <T>(target: Type<T>) {
        ModelContainer.addModel(target.name);
    };
  }
 

export function OriProps(fields?: { 
    readOnly?:string
    title?:string
    tags?:string[]|string
    minLength?: number  
    minLengthError?:string
    maxLength?: number  
    maxLengthError?:string
    ignoreToJson?:boolean
    isRequired?:boolean
    isRequiredError?:string
  })
{
    return function(target: Object, propertyKey: string) { 
        if(propertyKey.indexOf('$ori')==0)
        {
            throw 'you can\'t use $ori ';
        } 
        ModelContainer.addProp(new ModelProps(propertyKey,fields));
        
        if(fields?.tags)
        {

            if(!target['$oriExtraData'])
            {
                target['$oriExtraData']=new ExtraData()
            }
            if(Array.isArray(fields.tags))
            {
                for(var tag of fields.tags)
                {
                    target['$oriExtraData'].addTag(tag,propertyKey) 
                    
                }
            }
            else
            {
                target['$oriExtraData'].addTag(fields.tags,propertyKey) 
            }
        } 
        if(fields?.readOnly)
        {
            Object.defineProperty(target, propertyKey, {
                get: function() {
                    return  this.$oriValues[fields.readOnly];
                } 
            }); 
            return
        }
        const getter = function() {
            return  this.$oriValues[propertyKey];
        };
        const setter = function(newVal: any) {  
            var errors = ModelService.validate(this.constructor.name,propertyKey,newVal);
            var model=this as IOriModel; 
            for(var error of errors)
            {
                model.$oriExtraData.SetValiadte(propertyKey,error);
            }
            
            if(!errors.length)
            {
                model.$oriExtraData.SetValiadte(propertyKey,'') 
                this.$oriValues[propertyKey] = newVal; 
            } 
        }; 
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter
        }); 
    }

}