class ClassTreeView{
	constructor(varName="myTreeView",options={}){
		const{
			
			d0=window.systemMenu,
			selector="menu",
			
			container="root-container section aside#leftsidebar"
		}=options;
		this.varName=varName;
		this.container=container;
		this.d0=d0;
		this.selector=selector;
		
		
	}
	
	async set(options={}){
		const{d1={}}=options;
			try{
				let d=(Object.keys(d1).length==0)?window.systemMenu:d1;
				await this.addToDom();
				let i=0;
				for (let o of d){
					let s=`<li class="ui-menu-item"><div id="ui-id-${i} " tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">${o.text} </div></li>`;
					$("#"+this.selector).append(s);
					if(typeof(o[]))
					i++
				}
			
			}
			catch(err){
				console.log(err)
			}
			/* return `
			<ul style="width:100px;" id="menu" role="menu" tabindex="0" class="ui-menu ui-widget ui-widget-content" aria-activedescendant="ui-id-19">
			<li class="ui-menu-item"><div id="ui-id-19" tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">Item 1</div></li>
			<li class="ui-menu-item"><div id="ui-id-20" tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">Item 2</div></li>
			<li class="ui-menu-item"><div aria-haspopup="true" id="ui-id-21" tabindex="-1" role="menuitem" class="ui-menu-item-wrapper"><span class="ui-menu-icon ui-icon ui-icon-caret-1-e"></span>Item 3</div>
			<ul role="menu" aria-expanded="false" class="ui-menu ui-widget ui-widget-content ui-front" aria-hidden="true" style="top: 2916.25px; left: 151px; display: none;">
			<li class="ui-menu-item"><div id="ui-id-22" tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">Item 3-1</div></li>
			<li class="ui-menu-item"><div id="ui-id-23" tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">Item 3-2</div></li>
			<li class="ui-menu-item"><div id="ui-id-24" tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">Item 3-3</div></li>
			<li class="ui-menu-item"><div id="ui-id-25" tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">Item 3-4</div></li>
			<li class="ui-menu-item"><div id="ui-id-26" tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">Item 3-5</div></li>
			</ul>
			</li>
			<li class="ui-menu-item"><div id="ui-id-27" tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">Item 4</div></li>
			<li class="ui-menu-item"><div id="ui-id-28" tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">Item 5</div></li>
			</ul>`; */
		}
	
	async addToDom(){
		try{
			let s=`<ul style="width:100px;" id="menu" role="menu" tabindex="0" class="ui-menu ui-widget ui-widget-content" aria-activedescendant="ui-id-19"></ul>`;
			$(this.container).html(s);
			return 'OK'
		}catch(err){
			console.log(err)
		}
	}
	
	init(){
		
	}
	
}