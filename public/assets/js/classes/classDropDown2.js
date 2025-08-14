class DropDown2{
	/* c:str like '#db' */
	constructor(c, options={}){
		const{label='🧪'}=options;
		this.c=c;
		this.label=label;
	}
	
	sklt(){
		let str= `
			<li class="dropdown">
                        <a href="javascript:void(0);" class="btn btn-white bg-teal btn-block btn-xs waves-effect pplBtn" data-toggle="dropdown" role="button" aria-expanded="true">
                            <i class="material-icons">${this.label} </i>
                            <span class="label-count"></span>
                        </a>
                        <ul class="dropdown-menu" style="width:400px; margin:0px; max-width: 400px; overflow: scroll;">
                            <li class="header"></li>
                            <li class="body">
							  <ul class="menu tasks" style='padding:0px; width:400px'>
							  
							  </ul>
							</li>
							<li class="footer">
								<ul>
								
								</ul>
                                
                            </li>
						</ul>
			</li>	
		`
		return str
	}

	async addToDom(options={}){
		const{initFn='defaultInit'}=options
		try{
			$(this.c).html(this.sklt())
			setTimeout(async()=>{
				await this[initFn]()
			},100)
		}catch(er){
			console.error(er);
		}
	}
	
	async defaultInit(options={}){
		const{}=options
		try{
			let hdr=$(this.c).find("li.header");
			let bdy=$(this.c).find("li.body>ul.menu");
			let fter=$(this.c).find("li.footer");
			let btnPpl=$(this.c+" li.dropdown a.pplBtn")
			btnPpl.on('click',(e)=>{
				e.preventDefault(); // Empêche le comportement par défaut du lien
				let o=$(e.target).closest("li").find(".dropdown-menu");
				o.slideToggle();
			})
		}catch(err){
			console.log(err)
		}
		
	}
	
	async initDtTableWInDropdown(options={}){
		const{}=options
		try{
			let bdy=$(this.c).find("li.body>ul.menu");
			let tableName='DataTableWInDropdown'
			let sklt=`<li><table style="" id="${tableName}" class="table table-striped table-bordered table-hover"></table></li>`
			if($("#"+tableName).length===0){
				bdy.html(sklt);
				window["DataTableWInDropdown"]=new DataTable2('#'+tableName);
				// console.log(window["allTravauxData"]);
				if(typeof(window["allTravauxData"])==='undefined' || Object.keys(window["allTravauxData"]).length===0){
					let w0=new ClassTravaux()
					await w0.getAllTravaux()
					
				}
				// console.log(window["allTravauxData"]);
				window["DataTableWInDropdown"].init({data:window["allTravauxData"]})
			}
			
			let btnPpl=$(this.c+" li.dropdown a.pplBtn")
			btnPpl.on('click',(e)=>{
				e.preventDefault(); // Empêche le comportement par défaut du lien
				let o=$(e.target).closest("li").find(".dropdown-menu");
				o.slideToggle();
			})
			
		}catch(err){
			console.log(err)
		}
		
	}
}