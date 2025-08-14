class CPopover{
	constructor(options={}){
		const{
			sourceSelector="spin"
		}=options;
		this.sklt=`<div id="popover" class="card">
		<div class="card-header py-1">
		<h6 class="card-title">Bienvenu</h6>
		</div>
		<div class="card-body">Cliquez ici pour commencer</div>
		<div class="card-footer py-1 py-1">
		</div>
		</div>`;
		this.sourceSelector=sourceSelector;
		if($("#popover").length==0){
			this.init();
		}
	}
	init(){
		$("body").append(this.sklt);
	}
	
	popoverShow(){
		let a=this.sourceSelector;
	let btn=document.querySelector("#"+a);
	  let popover=document.querySelector("#popover");
	  let popInstance=Popper.createPopper(btn,popover,{placement:'right'});
	  $("#popover").css({"display":"block"});
	  popInstance.update();
	  }
}