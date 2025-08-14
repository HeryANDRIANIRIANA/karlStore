class ClassTrefleButton{
	constructor(element, options={}){		
		this.$btn=$(element)
		this.settings=$.extend({
			mainClass:'btn-trefle',
			satelliteClass:'satellite',
			count:4,
			onOpen:null,
			onClose:null,
			onLoadData:null,
		},options)
		this.$wrapper = $('<div class="trefle-button-wrapper"></div>');
		this.isOpen=false;
		this.isDataLoaded=false;
		this.productId=this.$btn.data("productid");
		this.data={};
		this.init();
		this.element=element;
		this.NumChqMSerie=null;
	}
	
	init(){
		// console.log(this.$btn);
		if(!this.$btn.hasClass(this.settings.mainClass)){
			this.$btn.addClass(this.settings.mainClass);
			this.$btn.html(`<span><i data-feather="plus"></i></span>`);
			feather.replace()
			this.$btn.addClass('rotating');
			this.$btn.wrap(this.$wrapper);
			this.$wrapper=this.$btn.parent();
			
			this.addSatellites();
			
			this.$btn.on('click',(e)=>{
				// console.log();
				 if($(e.currentTarget).attr('disabled')!=='disabled' ){
					this.toggle(e);
				 }else{
					 showNotification({text:'En cours de chargement...', colorName:'alert-success', allowDismiss:false})
				 }
			})
			this.setState('loading');
		}
	}
	
	addSatellites(){
		for(let i=1 ; i<=this.settings.count; i++){
			let $satellite=$('<div>').addClass(`${this.settings.satelliteClass} ${this.settings.satelliteClass}-${i}`);
			this.$wrapper.append($satellite);
		}
	}
	
	setState(status='loading'){
		switch(status){
			case 'loading':
			if(!this.$btn.hasClass('rotating'))this.$btn.addClass('rotating');
			this.$btn.attr('disabled','disabled')
			this.$btn.attr('data-toggle','tooltip')
			// this.$btn.attr('data-action',"test")
			// $('[data-toggle="tooltip"]').tooltipster({
				// content: 'Chargement...'
			// });
			break;
			case 'normal':
			this.$btn.removeAttr('disabled')
			break;
			
		}
	}
	
	toggle(e){
		e.preventDefault();
		this.$btn.addClass('rotating');
		setTimeout(()=>{
			this.$btn.removeClass('rotating')
		} ,800)
		const wasOpen=this.isOpen;
		  // Fermer tous les autres
		$('.trefle-button-wrapper.open').not(this.$wrapper).each(function(){
			$(this).removeClass('open');
			const inst=$(this).data('instance');
			if(inst) inst.isOpen=false;
		})
		
		this.isOpen=!wasOpen;
		this.$wrapper.toggleClass('open',this.isOpen);
		
		if(this.isOpen && typeof(this.settings.onOpen)==='function'){
			this.settings.onOpen.call(this);
		}
		if(!this.isOpen && typeof(this.settings.onClose)==='function'){
			this.settings.onClose.call(this);
		}
		if(this.isOpen && !this.isDataLoaded && typeof(this.settings.onLoadData)==='function'){
			this.settings.onLoadData.call(this);
			this.isDataLoaded=true;
		}


	}
	
	async checkData(options={}){
		const{}=options
		try{
			let productId=this.productId;
			// console.log(window["chequeMatiereByProductIdData"][productId]);
			if(typeof(window["chequeMatiereByProductIdData"])==="undefined"){
				this.isDataLoaded=false
			}else{
				if(typeof(window["chequeMatiereByProductIdData"][productId])==="undefined"){
					this.isDataLoaded=false
					
				}else{
					if(typeof(window["chequeMatiereByProductIdData"][productId]['chequeMatiere'])==="undefined" || window["chequeMatiereByProductIdData"][productId]['chequeMatiere']===null){
					this.isDataLoaded=false
					}else{
						this.isDataLoaded=true
						this.chequeMatiere=window["chequeMatiereByProductIdData"][productId]["chequeMatiere"];
						this.NumChqMSerie=this.chequeMatiere[0]['NumChqMSerie']
						this.detailChequeMatiere=window["chequeMatiereByProductIdData"][productId]["detailChequeMatiere"];
					}
				}
			}
			if(this.isDataLoaded===false){
				let myChm=new ChequeMatiere();
				this.data['chequeMatiere'] =await myChm.getChequeMatiereByProductId({productId:productId});
				this.NumChqMSerie=this.data['chequeMatiere'][0]['NumChqMSerie']
				this.data['detailChequeMatiere']= await myChm.getDetailChequeMatiereSerie({NumChqMSerie:this.NumChqMSerie})
				window["chequeMatiereByProductIdData"][productId]['detailChequeMatiere']=this.data['detailChequeMatiere']
				// console.log(this.data['chequeMatiere'] );
				this.isDataLoaded=true;
				await this.init1stBtn();
				this.setState('normal')
			}else{
				await this.init1stBtn();
				this.setState('normal')
				// this.isDataLoaded=true;
				// await this.init1stBtn();
				// this.setState('normal')
				// console.log(this.data['chequeMatiere'] );
			}
			return 0
		}catch(err){
			console.log(err)
		}
		
	}
	
	async init1stBtn(options={}){
		const{}=options
		try{
		let cible=this.$btn.parent().find(".satellite-1");
		// <span class="label-count">${this.NumChqMSerie}</span> <i data-feather="tool" class="feather-icon-red"> </i>
		// feather.replace()
        let template=`<a href="javascript:void(0);" > <span class="label-count">${this.NumChqMSerie}</span> </a>`;
		cible.html(template)
		cible.addClass('neon-button')
		cible.attr('data-action','openChequeMatierEditPannel');
		cible.attr('data-numchqmserie',this.NumChqMSerie);
		cible.attr('data-productid',this.productId);
		
		return 0
		}catch(err){
			console.log(err)
		}
		
	}

}