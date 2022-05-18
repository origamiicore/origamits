import ModuleConfig from "./moduleConfig";

export default class ConfigModel
{
    public packageConfig:ModuleConfig[]=[];
    public constructor(
        fields?: {
            packageConfig?: ModuleConfig[], 
        }) {
        if (fields) Object.assign(this, fields);
    }

}