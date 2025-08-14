 class CLoadkit{
	 constructor(varName,options={}){
		 const{
			 parentSelector="body", //conteneur
			 varInifinitMode=true, //spinner indéfninment
			 o=null //contenir la fonct à executer aprsè chargement
			 
		 }=options
		 // this.myNavbtn=new ClassNavbarbuttons();
		// this.journalBtnInNav=()=>{
			 // return this.myNavbtn.btnJournalInNav();
		 // }
		// this.btnFactureInNav=()=>{
			// return this.myNavbtn.btnFactureInNav()
		// }
		
		this.sklt=()=>{
			 // btn btn-primary btn-lg btn-block waves-effect
			 let navBarColaps=`<button id="factureImpayees" class="btn btn-white bg-teal btn-block btn-xs waves-effect" type="button">Factures <span class="badge"></span></button>`
			 // let btJournalinNav1=this.journalBtnInNav();
			 // let btnFactureInNav1=this.btnFactureInNav();
			 let btJournalinNav1="";
			 let btnFactureInNav1="";
			 
			 // let navBarColaps=`<a class="btn btn-white btn-primary btn-bold" tabindex="0" aria-controls="myDetailC-table1"><span>Impayées</span><span class="badge">10+</span></a>`
			 
			 return `
			 <div id="forBackground">
			 <video autoplay muted loop playsinline id="background-video"> <source id="mp4Source" src="" type="video/mp4"> Votre navigateur ne supporte pas les vidéos. </video>
			 </div>
			 <div id="root-container">
			 
			 			 <section>
						 <aside id="leftsidebar" class="sidebar"></aside>
						 </section>
						 <section class="content">
						 <div class="container-fluid">
						 
						 <div class="block-header">
						 
						 <div class="widget-toolbar ">${btJournalinNav1} ${btnFactureInNav1} </div>
						 
						 <nav class="navbar"></nav>
						 </div>
						<div id="article-panel-container"></div>
						
						 <div class="row clearfix"></div>
						  
						 </div>
						 </section>
						 
						 
			</div>
		<div id="mask">	
		</div>
		<div id="spin">
		
		<div><i></i></div>
		
		</div>`;
		// <div class="logoContainer"><img src="images/logo.jpg"/></div>
		// <section class="content"></section>
		 }
		  // assign local vars
		  this.varName=varName;
		  this.parentSelector=parentSelector;
		  this.varInifinitMode=window.varInifinitMode;
		  this.o=o
		  // selectors
		  this.selectors={
			  spin:"#spin",
			  i:"#spin div i",
			  mask:"#mask",
			  rootContainer:"#root-container"
		  }
		  // dd to dom
		  if($(this.selectors.spin).length==0){
			  this.addToDom()
		  }
		  this.pbContainerSelector="#mask .pbContainer";
		  
	 }   

	 // addToDom
	 addToDom(){
		 $(this.parentSelector).prepend(this.sklt);
		
	 }
	 
	 async navbarBtnInit(options={}){
		const{}=options
		try{
			$("#btnJournal").click(function(e){
				 $(this).closest("li").find(".dropdown-menu").slideToggle();
				 console.log(e);
			})
			console.log('init done');
		}catch(err){
			console.log(err)
		}
		
	}
	
	 changeInfinitMode(v){
		 this.varInifinitMode=v
		window.varInifinitMode=v
	 }
	 
	 //fn checkInfinitMode
	 checkInfinitMode(options={}){
		 // console.log(window.varInifinitMode)
		 const{
			 state=1
		 }=options
		 if(window.varInifinitMode==true){
			 setTimeout(()=>{this.checkInfinitMode()},1000)
		 }else{
			this.setState({state:1});
			if(this.o!=null){
				setTimeout(()=>{
					$.each(this.o,(i,v)=>{
						v.init()
						// console.log(v);
					})
					// this.o.init()
				},3000)
			}else{
				// alert("chargement terminé")
				this.setState({state:2})
			}
		 }
		 
	 }
	 // fn setState
	 
	 setState(options={}){
		 const{
			 state=0,
			 
		 }=options;
		 
		 let attrs=[
		 {
			 spin:{"class":"spinner01 centred-spinner border-animed"},
			 i:{"class":"fa"},
			 mask:{"class":"maskEnabled" },
			 // backgroundVideo1:{"class":"maskEnabled" }
			
		 },
		 {
			 spin:{"class":"spinner01 centred-spinner border-active"},
			 i:{"class":"fa fa-check fa-5x text-success", "onClick":this.varName+".setState({state:2})"},
			 mask:{"class":"maskEnabled" },
			 // backgroundVideo1:{"class":"maskEnabled" }
		 },
		 {
			 spin:{"class":"spinner01 spinner-left-side border-active spinner-reduced"},
			 i:{"class":"fa fa-home text-success", "onClick":this.varName+".setState()"},
			 mask:{"class":"maskDisabled" },
			// backgroundVideo1:{"class":"maskDisabled" }
		 },
		 
		 ]
		 
		 $.each(attrs[state],(s,v)=>{
			 $(this.selectors[s]).removeAttr('class');
			 $(this.selectors[s]).attr(v);
		 })
		 
		 if(state==0){
			 // this.varInifinitMode=true;
			 let sklt=`	<div class="logoContainer"><img src="images/logo.jpg"/></div>`
			 $('#mask').html(sklt);
			 window.varInifinitMode=true;
			 // setTimeout(()=>{
				 // this.varInifinitMode=false;
			 // } ,3000);
		 this.checkInfinitMode();
		 }else{
			 $("#mask .logoContainer").remove();
		 }
	 }

 
	setProgressbarContainer(){
		let s=`<div class="pbContainer"> <ul></ul> </div>`
		if($(this.pbContainerSelector).length===0){
		$("#mask").append(s)	
		}
		
	}
	
	addProgressbar(options={}){
		const{text="", percent=0}=options
		// percent=percent*2
		let c=$(this.pbContainerSelector+" ul li").length;
		let defsklt=`<li data-selector="loadkitpb${c}"> <a href="javascript:void(0);"> <h4> ${text} <small>${percent}%</small> </h4> <div class="progress" style="width:200px"> <div class="progress-bar bg-orange" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100" style="width: ${percent}px"> </div> </div> </a></li>`;
		$(this.pbContainerSelector+" ul").prepend(defsklt);
		// this.refreshLabelCount()
		return c
	}
	
	refreshProgressbar(options={}){
		const{s=0,text="", percent=0}=options
		// console.log(text,percent);
		let sel=this.pbContainerSelector+` ul li[data-selector="loadkitpb${s}"]`;
		let tSel=sel+` a h4`;
		let pSel=sel+` a .progress .progress-bar`;
		let t=`${text} <small>${percent}%</small>`;
		$(tSel).html(t);
		$(pSel).attr("aria-valuenow",percent);
		$(pSel).css("width",percent*2)
		if(percent===100){
			// this.removeProgressbar(s);
		}
	}
	
	checkAllProgression(){
		let sel=this.pbContainerSelector+` ul li`
		let busy=false;
		$(sel).each(function(){
			let p=parseInt($(this).find('.progress').prop('aria-valuenow'))
			if(p<100){busy=true}
		})
		if(busy===true){
			setTimeout(this.checkAllProgression,1000)
		}else{
			this.changeInfinitMode(false);
		}
		return busy
	}
	
	removeProgressbar(s=0){
		let sel=this.pbContainerSelector+` ul li[data-selector="loadkitpb${s}"]`;
		$(sel).remove()
	}
	
	unsetProgressbar(){
		
	}
 
 }
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 