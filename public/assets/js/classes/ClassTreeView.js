class ClassTreeView{
	constructor(varName="myTreeView",options={}){
		const{
			
			d0=[
			{
				text:'p1',
				tags:['4','5','6'],
				nodes:[
				{
					text:'c1',
					tags:['0']
				}
				]
			}
			],
			selector="treeview1",
			container="root-container section aside#leftsidebar"
		}=options;
		this.varName=varName;
		this.container=container;
		this.d0=d0;
		this.selector=selector;
		this.sklt=()=>{
			return `<div class="col-xs-6 col-md-6 col-lg-12 ">
				<div id="${this.selector}"></div>
				</div>`;
		}
		this.addToDom();
	}
	
	addToDom(){
		if($("#"+this.selector).length==0){
			$("#"+this.container).append(this.sklt);
		}
	}
	init(options={}){
		const{d=window.systemMenu}=options;
		let tr1=$("#"+this.selector).treeview(
		{
			data:d,
			onNodeSelected:(e,n)=>{
				// console.log(e);
				 // console.log(n.data.fn);
				// if(typeof(n.data.fn)=='function'){
					// n.data.fn();
					let myEvent=new ClassTreeviewEvent();
					if(typeof(n.data)!="undefined" && n.data!="undefined"){
						if(typeof(n.data.param)!="undefined" && n.data.param!="undefined"){
						myEvent[n.data.fn](n.data.param);
					}else{
						myEvent[n.data.fn]();
					}
					}
					
					// console.log(myEvent[n.data.fn]());
				// }
			}
		}
		)
	}

	async addNode(options={}){
		const{
			r=[], 
		nodeRow=2, 
		nodeText="BC",
		subNodefn="getDetailCommande",
		subNodekey="NumBC"
		}=options
		try{
			if(typeof(window.systemMenu[nodeRow])=="undefined"){
				window.systemMenu[nodeRow]={text:nodeText,tags:[''], nodes:[] }
			}
			window.systemMenu[nodeRow].nodes=[];
			window["detailCommande"] ={} ;
		
			// console.log(r)
			for(let o of r){
				let o1={text:o[subNodekey] ,tags:[''], data:{fn:subNodefn, param:o[subNodekey]}}
				window.systemMenu[nodeRow].nodes.push(o1) ;
			}
			// console.log(window.systemMenu)
			this.init();
		}catch(err){
			console.log(err)
		}
		
	}

	async node3Reset(options={}){
		const{nodeRow=3}=options
		try{
			if(Object.hasOwn(window["systemMenu"], 3)){
				delete window["systemMenu"][3]
				await this.init();
				return "node3Reset"
			}
		}catch(err){
			console.log(err)
		}
		
	}
}