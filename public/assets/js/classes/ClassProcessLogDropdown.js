class ClassProcessLogDropdown extends ClassChequeMatiereEditPannel {
	constructor(selector="#myChequeMatPannel", options={}){
		const{
			pplIcon="box"
			
		}=options;
		try{
			super();
			this.pplIcon=pplIcon;
			this.$el=$(selector);
			this.selector=selector;
			this.mainContainerSelector=this.selector+" .ahDropTableContainer";
			this.mainbtnSelector=this.mainContainerSelector+" .dropdown a.btnMain";
			this.labelCountSelector=this.mainContainerSelector+" .dropdown span.label-count";
			this.bodySelector=this.selector+" .ahDropTableContainer li.dropdown ul.dropdown-menu li.body";
			this.footerSelector=this.selector+" .ahDropTableContainer li.dropdown ul.dropdown-menu li.footer";
			
			// this.init();
		}catch(err){
			console.error(err)
		}
	}
	
	async init(options={}){
		const{}=options
		try{
			let str=this.sklt();
			this.$el.html(str);
			$(this.mainbtnSelector).parent("li").prepend(`<span class="label-count">0</span>`).addClass("withLabelCount");
			// btnMain
			$(this.mainbtnSelector).off().on("click", (e)=>{
				e.preventDefault();
				// console.log(e);
				let a=$(e.currentTarget).closest('a');
				// if(a.attr("disabled")!=="disable"){
					let o=$(e.currentTarget).closest("li").find(".dropdown-menu");
					o.slideToggle()
				// }
				
				if($(this.bodySelector).is(":visible")){
					$(document).off().on("keydown", $(this.bodySelector), async (e)=>{
						switch(e.key){
							case "Escape": this.slideToggleFromAnyWhere();
							$(document).off()
							break;
						}
					})
				}
				
			})
			
			return 0;

		}catch(err){
			console.log(err)
		}
		
		
	}
	
	refreshLabelCount(){
		let c=$(this.bodySelector+" li").length;
		$(this.labelCountSelector).text(c)
		return c
	}
	
	addContent(options={}){
		const{text="", percent=0}=options
		let c=parseInt($(this.labelCountSelector).text());
		let defsklt=`<li data-selector="${c}"> <a href="javascript:void(0);"> <h4> ${text} <small>${percent}%</small> </h4> <div class="progress"> <div class="progress-bar bg-orange" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" style="width: ${percent}%"> </div> </div> </a></li>`;
		$(this.bodySelector).prepend(defsklt);
		this.refreshLabelCount()
		return c
	}
	
	refreshContent(options={}){
		const{s=0,text="", percent=0}=options
		let sel=this.bodySelector+` li[data-selector="${s}"]`;
		let tSel=sel+` a h4`;
		let pSel=sel+` a .progress .progress-bar`;
		let t=`${text} <small>${percent}%</small>`;
		$(tSel).html(t);
		$(pSel).attr("aria-valuenow",percent);
		$(pSel).css("width",percent)
		
	}
	
}