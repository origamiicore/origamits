import {ConfigModel,ModuleConfig} from "../"; 

export default new ConfigModel({
    packageConfig:[
        new ModuleConfig({
            id:'1',
            type:'module',
            name:'test',
            config:{
                //test config
                active:true
            }
        })
    ]
});