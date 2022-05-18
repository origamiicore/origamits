import OrigamiTs from "../";
import config from "./config";
import SampleIndex from "./module";
import SampleRoute from "./module/models/sampleRoute";
export default class SampleProject
{
    constructor()
    {
        this.init();
    }
    async init()
    {
        
        var origamicore = new OrigamiTs(config);
        await origamicore.start([
            new SampleIndex()
        ])
        var data=await SampleRoute.RunTestService('vahid1xx','hoss','dd');
        console.log(data);
        

    }
}
new SampleProject();