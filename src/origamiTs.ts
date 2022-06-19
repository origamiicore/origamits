import ConfigModel from "./models/configModel";
import ModuleConfig from "./models/moduleConfig";
import PackageIndex from "./models/packageIndex";
import Router from "./router/router";

export default class OrigamiTs
{
	config:ConfigModel;
	constructor(config:ConfigModel)
	{
		this.config=config;
	}
	async start()
	{ 
		for(var config of this.config.packageConfig)
		{
			var instance=await config.createInstance();
			await instance.start();
			Router.setInstance(instance);
		}  
	}
}