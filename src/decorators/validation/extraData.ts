export default class ExtraData{
    tags:Map<string,string[]>=new Map<string,string[]>();
    private parent:any;
    setParent(parent:any)
    {
        this.parent=parent;
    }
    addTag(tag:string,name:string)
    {
        if(!this.tags[tag])this.tags[tag]=[];
        this.tags[tag].push(name);
    }
    clearByTag(tag:string)
    {
        var tags=this.tags[tag];
        if(tags)
        {
            for(var tag of tags)
            {
                if(this.parent[tag])
                {
                    this.parent[tag]=null;
                }
            }
        }
    }
}