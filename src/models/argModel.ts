export default class ArgModel
{
    name:string;
    type:any;
    isSession:boolean=false;
    isOdata:boolean=false;
    public constructor(
        fields?: { 
            name?: string 
            type?: any 
        }) {
        if (fields) Object.assign(this, fields);
    }
}