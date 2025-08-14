/**
@class
@param {String} varName - nom de l'instance de CLoadkit
@param {Object} options - params optionnels
@param {Boolean} options.varInfinitMode - qui dicte
@param {Object} options.o - insta,ce d'une class qui contient la fonction à executer après le chargement.
 si notre Cloadkit est en cours de chargement

*/
class CLoadkit{
	constructor(varName,options={}){
		const{
			parentSelector="body",
			varInfinitMode=true,
			o=null
		}=options;
		this.sklt=()=>{return `
		<div id="root-container"></div>
		<div id="mask"></div>
		<div id="spin">
		<div class="logoContainer"><img src="images/logo.jpg"></div>
		<div><i></i></div>
		</div>
		`};
		this.varName=varName;
	    this.parentSelector=parentSelector;
	    this.varInfinitMode=varInfinitMode;
		// 5min
		this.selectors={
			spin:"#spin",
			i:"#spin div i",
			mask:"#mask",
			rootContainer:"#root-container"
		}   
		this.o=o;
		if($(this.selectors.spin).length==0){
		this.addToDom()	
		}
	}
	
	/**preocedure addToDom add Loadkit sklt jinto the som*/ 
	addToDom(){
		$(this.parentSelector).prepend(this.sklt);
	}
	// 8min
	// 1st test go to var
	
	/**loadkit is on loading sthg*/ ///start at 0
	setState0(){
		this.setState(0);
		this.varInfinitMode=true;
		let sp=this.selectors.spin;
		let ms=this.selectors.mask;
		$(sp).attr({"class":"spinner01 centred-spinner border-animed" });
		$(sp+" div i").removeAttr("class");
		$(ms).attr({"class":"maskEnable"});
		this.checkInfinitMode();
	}
	
	checkInfinitMode(options={}){
		const{
			state=1
		}=options;
		if(this.varInfinitMode==true){
			setTimeout(()=>{
				this.checkInfinitMode();
			},1000);
		}else{
			// this.setState1();
			this.setState({state:1});
			if(this.o!=null){
				setTimeout(this.o.init(),3000); 
			}else{
				alert("Chargement terminé")
			}
			
		}
	}//done at 5 min so 8+5=13 min till here
	
	/**procedure setState1() when load is succes */ 
	setState1(){
		let sp=this.selectors.spin;
		let i=sp+" div i";
		$(sp).attr({"class":"spinner01 centred-spinner border-active"});
		$(i).attr({
			"class":"fa fa-check fa-5x text-success",
			"onClick":this.varName+".setState2()"
			})
	}//5 min
	
	/**after user spin reduced and put to the left*/
	setState2(){
		let sp=this.selectors.spin;
		let i=sp+" div i";
		let msk=".maskEnabled";
		$(sp).attr({"clas":"spinner01 spinner-left-side border-active spinner-reduced"});
		$(msk).toggleClass("maskDisabled");
		$(i).attr({
			"class":"fa fa-user text-succes",
			"onClick":this.varName+".setState0()"
		})
	}//7min go to main to drive the loakit 
	
	setState(options={}){
		const{
			state=0,
			// fnCallBack={fn:myDatatable.init()}
			
		}=options;
		
		let attrs=[
		{
			spin:{"class":"spinner01 centred-spinner border-animed"},
			i:{"class":"fa"},
			mask:{"class":"maskEnabled"}
		} ,
		{
			spin:{"class":"spinner01 centred-spinner border-active"},
			i:{"class":"fa fa-check fa-5x text-success",
			"onClick":this.varName+".setState({state:2})"},
			mask:{"class":"maskEnabled"}
			
		} ,
		{
			spin:{"class":"spinner01 spinner-left-side border-active spinner-reduced"},
			i:{"class":"fa fa-home text-success",
			"onClick":this.varName+".setState()"},
			mask:{"class":"maskDisabled"}
			
		}
		
		]   
		
		// pour chaque éléments de l'état selectionné
		$.each(attrs[state],(s,v)=>{
			$(this.selectors[s]).removeAttr('class');
			$(this.selectors[s]).attr(v);
		});
		
		if(state==0){
			this.varInfinitMode=true;
			
			// setTimeout(()=>{fnCallBack.fn;},5000)
			setTimeout(()=>{				
			this.varInfinitMode=false;
			// setTimeout(fn ,6000);			
			},3000)
			
			// setTimeout(()=>{fnCallBack.fn;},5000)
			
			this.checkInfinitMode();
		}
	}
	
}