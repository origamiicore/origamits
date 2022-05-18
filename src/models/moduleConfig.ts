export default class ModuleConfig
{
    id:string=''
    type:'module'|'service'='module';
    name:string='';
    config:any={};
    public constructor(
        fields?: {
          id?: string,
          name?: string, 
          type?: 'module'|'service', 
          config?:any
        }) {
        if (fields) Object.assign(this, fields);
    }
}