 
import {OriInjectable,PackageIndex,DataInput, OriService, SessionInput,ModuleConfig} from "../../"; 
import TestModel from "./models/testModel"; 

@OriInjectable({domain:'test'})
class SampleIndex implements PackageIndex
{ 
    name:string='test';
    jsonConfig(moduleConfig: ModuleConfig): Promise<void> { 
        return ;
    }
    start(): Promise<void> {
        return;
    }
    restart(): Promise<void> {
        return;
    }
    stop(): Promise<void> {
        return;
    }

    @OriService({isInternal:true})
    async internalService(@DataInput({classType:TestModel}) info:TestModel,addedData)
    {
        console.log('info>',JSON.stringify(info) );
        // console.log('info>',info.$oriToJson() );
        console.log('errors>',info.$oriErrorData);
        console.log('addedData>',addedData);

    }
    @OriService()
    async testService(@DataInput({classType:TestModel}) info,@SessionInput session)
    {
        console.log('info>',info);
        console.log('session>',session);
        
    }
 
}
export default SampleIndex