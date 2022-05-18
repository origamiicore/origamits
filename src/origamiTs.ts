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
	async start(packages:PackageIndex[])
	{ 
		for(let pk of packages)
		{
			let name=pk.name;
			var config:ModuleConfig=this.config.packageConfig.filter(p=>p.name==name)[0];
			if(!config)throw 'Config not found : '+name; 
			await pk.jsonConfig(config);
			Router.setInstance(pk);
			await pk.start();
		}

	}
}