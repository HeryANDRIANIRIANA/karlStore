class CSpinner{
	constructor(popover,varName,options={}){
		const{
			// param1 = 'valeur par défaut 1',
			selector='spin'
		}=options;
		this.popover=popover;
		this.varName=varName;
		this.sklt=`<div id="conteneur"></div>
		<div id="rido" class='rido-initial'></div>
		<div id="spin" class="Spinner-centred spinner01 spiner-btn" data-action="test">
		<div><i class="fa fa-3x text-success"></i></div>
		</div>`;
		this.selector=selector;
		
		if($("#spin").length==0){
			this.init();
		}
		
	}
	
	init(){
		$("body").prepend(this.sklt);
	}
	
	spinButtonAction00(){
		let nextAction=this.varName+".spinButtonAction0()";
		let a=this.selector;
	$("#"+a).addClass('spinner01');
	$("#"+a).removeClass('spinner-withBorder');
	$("#"+a).removeClass('spinner-left-sided');
	$("#rido").toggleClass('rido-reduced');
	setTimeout(nextAction,3000);
	}
	
	spinButtonAction0(){
		let a=this.selector;
		let btnAction=this.varName+'.spinButtonAction1()';
	$("#"+a).removeClass('spinner01');/*enlever bordure*/
	$("#"+a).addClass('spinner-withBorder');/*apparaitre bordure*/
	$("#"+a+" div i").addClass("fa-check");
	  // faire apparaitre le popover
	  this.popover.popoverShow();
	  
	  $('#'+a).attr('onclick', btnAction);
	  }
	  
	spinButtonAction1(){
		let a=this.selector;
		let btnAction=this.varName+'.spinButtonAction00()';
	$('#'+a).removeAttr('onclick');
	$("#popover").css({"display":"none"});
	$("#"+a).addClass("spinner-left-sided");
	$("#"+a+" div i").removeClass("fa-check");
	setTimeout(()=>{$('#'+a).attr('onclick', btnAction);},120 );
	$("#rido").toggleClass('rido-reduced');
	// $("#widget-box-1").toggleClass('fullscreen');
	}
}
