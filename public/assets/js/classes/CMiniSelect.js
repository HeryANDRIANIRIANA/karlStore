class CminiSelect{
	constructor(options={}){
		const{
			varName="myMiniSelect",
			cible=$("#root-container"),
			selector="mySelect01",
		}=options;
		this.varName=varName;
		this.cible=cible;
		this.selector=selector;
	}
	
	sklt(){
		let s=`<div id="${this.selector}" style="overflow: scroll; position: absolute; width: 520px; height:600px; left: 50px; top: 30px; padding: 1.2em" class="ui-widget ui-front ui-widget-content ui-corner-all ui-widget-shadow">
		<section class="content">
						 <div class="container-fluid">
						 
						 <div class="block-header">
						 <nav class="navbar"></nav>
						 </div>
						 <div class="row clearfix"></div>
						 </div>
						 </section>
	</div>`
	return s;
	}
	
	async set(){
		try{
			this.cible.append(this.sklt());
			this.cible.addClass("ui-widget-overlay ui-front");
			return 'OK'
		}catch(err){
			console.log(err)
		}
	}
	
	async unset(){
			$("#"+this.selector) .remove();
			this.cible.removeClass("ui-widget-overlay ui-front");
			return 'OK'
	}
	
}
