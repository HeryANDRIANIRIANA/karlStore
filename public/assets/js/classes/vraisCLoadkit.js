/**
@class
@param {String} varName - Nom de linstance de CLoadkit
@param {Object} options - paramètres optionnels
@param {Boolean} options.varInfinitMode - définit si CLoadkit sera vérfouillé en Stat0
*/
class CLoadkit{
	constructor(varName,options={}){
		const{
			parentSelector="body",
			varInfinitMode=true
		}=options;
		
		this.sklt=`
		<div id="root-container"></div>
		<div id="mask"></div>
		<div id="spin">
		<div> <i></i></div>
		</div>
		`;
		
		this.varInfinitMode=varInfinitMode;
		this.varName=varName;
		this.selectors={
			spin:"#spin",
			mask:"#mask",
			rootContainer:"#root-container"
			};
		
		this.parentSelector=parentSelector;
		if ($("#spin").length==0){
			this.addToDom()
		}
		
	}
	
	/** Ajout du squelette dans le DOM*/
	addToDom(){
		$(this.parentSelector).prepend(this.sklt);
	}
	
	/**State0: CLoadkit en cours de chargement*/
	setState0(){
		this.varInfinitMode=true;
		let spin= this.selectors.spin;
		// $(sel).removeAttr("class");
		$(spin).attr({"class": "spinner01 centred-spinner border-animed"});
		$(spin+" div i").removeAttr ("class");
		$(this.selectors.mask).attr({"class":"maskEnabled"})
		this.checkInfinitMode();
	}
	
	/**Ecoute si CLoadkit doit rester State0 infinimente
	une intervention externe va changer la valeur de la 
	@variable {Boolean} this.varInfinitMode en false pour passer à State1;
	*/
	checkInfinitMode(){
		if(this.varInfinitMode==true){
			setTimeout(()=>{this.checkInfinitMode()},1000 );
		}else{
			this.setState1();
		}
	}
	
	/**State1: CLoadkit actif chargement succes*/
	setState1(){
		let spin=this.selectors.spin;
		$(spin).attr({"class": "spinner01 centred-spinner border-active"});
		$(spin+" div i").attr({"class":"fa fa-check fa-5x text-success", 'onClick':this.varName+".setState2()"});
	}
	
	/**State2: CLoadkit mise au coté droite*/
	setState2(){
		let spin=this.selectors.spin;
		
		$(spin).attr({"class": "spinner01 spinner-left-side border-active spinner-reduced"});
		$(".maskEnabled").toggleClass("maskDisabled")

		$(spin+" div i").attr({'onClick':this.varName+".setState0()", "class":"fa fa-user text-success"});
	}
	
	
}