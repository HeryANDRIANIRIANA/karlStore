class CSender{
	constructor(options={}){
		const{
			label="",
			data={} ,
			varSender="",
			senderOp="",
			currentStape=0,
			allStep=[],
			stepParams=[],
			url=""
		}=options
			this.label=label
			this.data=data
			this.varSender=varSender
			this.senderO=senderOp
			this.currentStape=currentStape
			this.allStep=allStep
			this.stepParams=stepParams
			this.url=url
	}
	
	async trySend(){
		try{
			myLoadkit.setState()
			for (let i = 0; i < this.allStep.length; i++) {
				console.log(window[this.varSender])
				let r=await window[this.varSender][this.allStep[i]](this.stepParams[i]) ;
			}
			
			window.varInifinitMode=false;
			return r
		}catch(err) {
			console.error(err) 
		}
	}
	
}