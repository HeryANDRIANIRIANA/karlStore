class ClassJournal{
	constructor(options={}){
		const{
			varName="",
			day=""
		}=options
		let d0=new Date();
		let d=d0.getDate();
		let sd=d.toString().padStart(2,'0');
		let m=d0.getMonth()+1;
		let sm=m.toString().padStart(2,'0');
		let y=d0.getFullYear().toString();
		this.day=(day==="")?sd+"/"+sm+"/"+y:day;
		
		this.day=(typeof(window.day)!="undefined")?window.day.replace(/-/g,'/') :day;
		this.data=window["journalData"];
		this.varName=varName;
		let myDataR=new ClassDataRectif();
		this.dbman=myDataR;
		let t1=performance.now();
		this.getAllDetailJournal();
		let t2=performance.now();
		// console.log(t2-t1);
	}
	
	async getJournalDuJour(options={}){
		const{day=""}=options
		try{
			let d=(day==="")?this.day:day;
			let url='/getJournalDuJour';
			let data={
				day:d
			}
			// console.log(d);
			window["journalStructure"]={} ;
			let r=await this.dbman.getData({gStruct:"journalStructure",url:url,data:data});
			window["journalData"]=r;
			// console.log(r);
			if(r[0].numPiece==="" || r.length==1){
				let r1=await this.createDefaultJournal();
			}
			let r0=await this.checkJournal();
			
			// console.log(window["journalData"]);
			if( Object.keys(window["journalData"]["Banque"]).length>0 && Object.keys(window["journalData"]["Caisse"]).length>0 ){
				let r2=await this.getDetailJournal();
			}
			
			return r
		}catch(err){
			console.log(err)
		}
	}
	
	async checkJournal(options={}){
		const{}=options
		try{
			window["journalData"]["Banque"]={};
			window["journalData"]["Caisse"]={};
		let i=0	
			for (let o of window["journalData"]) {
			  switch(o.TypePiece) {
				  case  "Banque": 
				  window["journalData"]["Banque"]=o
				  break;
				  case  "Caisse": 
				  window["journalData"]["Caisse"]=o
				  break;
			  }
			}
		return this.data;
		}catch(err){
			console.log(err)
		}
		
	}

	buildNewNum(options={}){
		const{TypePiece="Caisse", day=this.day}=options
		try{
			let dayInJournalName="";
			let [d,m,y]=day.split('/');
			let y2=y.split(0)[1];
			dayInJournalName=d+"/"+m+"/"+y2
			let pref=(TypePiece==="Caisse")?"JCST/":"JBST/";
			let NumPiece=pref+dayInJournalName;
			return NumPiece
		}catch(err){
			console.log(err)
		}
		
	}
	
	async saveDetailJounal(options={}){
		const{}=options
		try{
			// 
			let ar=[];
			ar.push(window["detailJournalCourent"]);
		 // console.log(ar);
			let url='/addRowDetailJounal';
			let data={
				ar:ar,
				structure:window["detailJournalStructure"].structure
			}
			let r=await this.dbman.getData({url:url,data:data});
			
			setTimeout(async (e)=>{
				let r=await this.getDetailJournal()
				// console.log(r);
			},2000)
			return r;
		}catch(err){
			console.log(err)
		}
		
	}
	
	setMontantPieceCurrentJournal(p){
		try{
			window["detailJournalCourent"].MontantPiece=p;
		}catch(err){
			console.log(err)
		}
		
	}
	
	getNumCurrentJournal(TypePiece){
		let ar=window["journalData"];
		let i=0;
		let numFound=false;
		let num="";
		while(i<ar.length || numFound==false){
			if(ar[i].TypePiece===TypePiece){
				num=ar[i].NumPiece;
				numFound=true;
			}
			i++
		}
		return num
	}
	
	setCurrentJournalDetail(options={}){
		const{TypePiece="Caisse", day=this.day, refB=""}=options
		try{
				window["detailJournalCourent"]=
						{
							"NumDetailPiece": 0,
							"NumPiece": "",//JBST...
							"DesignationPiece": "",//NomClient
							"ReferencePiece": "",//BC:...-Fact:...-RefB:---
							"NaturePiece": "Recette",//Recette
							"MontantPiece": 0
						}
				;
				window["detailJournalCourent"].NumPiece=this.getNumCurrentJournal(TypePiece);
				window["detailJournalCourent"].DesignationPiece=(typeof(window["factureInfo"].NomClient)!="undefined")?window["factureInfo"].NomClient:"";
				let bc=(typeof(window["factureInfo"].NumBC)!="undefined")?"BC:"+window["factureInfo"].NumBC: "";
				let fact=(typeof(window["factureInfo"].NumFact)!="undefined")?"-Fact:"+window["factureInfo"].NumFact: "";
				let rb=(refB!="")?"-RefB:"+refB: "";
				window["detailJournalCourent"].ReferencePiece=bc+""+fact+""+rb
				
		}catch(err){
			console.log(err)
		}
		
	}
	
	async createDefaultJournal(options={}){
		const{}=options
		try{
			
			let defaultJournal={
				Banque:[{NumPiece: this.buildNewNum({TypePiece:"Banque"}), DatePiece: this.day, TypePiece: 'Banque', RangPiece:0}] ,
				Caisse:[{NumPiece: this.buildNewNum({TypePiece:"Caisse"}), DatePiece: this.day, TypePiece: 'Caisse', RangPiece:0}]
			}
			let r={};
			// console.log(defaultJournal);
			if(typeof(window["journalData"]["Banque"])==="undefined" || Object.keys(window["journalData"]["Banque"]).length==0){
				// let b=confirm("Voulez vous créer journal Banque?");
				// if(b){
					
					r=await this.addJournalRow({ar:defaultJournal.Banque})
				// }
			}
			if(typeof(window["journalData"]["Caisse"])==="undefined" || Object.keys(window["journalData"]["Caisse"]).length==0){
				// let b=confirm("Voulez vous créer journal Caisse?");
				// if(b){
				r=await this.addJournalRow({ar:defaultJournal.Caisse})
				// }
			}
			
			if(Object.keys(r).length!=0){
				await this.getJournalDuJour();
			}
			return r;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async addJournalRow(options={}){
		const{ar=[], structure=window["journalStructure"]["structure"]}=options
		try{
			let url='/addJournalRow';
			let data={ar:ar,structure:structure};
			let r=await this.dbman.getData({url:url,data:data});
			return r;
		}catch(err){
			console.log(err)
		}
		
	}
	
	/* getDetailJournal recupererles détails des journal 
	pour éviter les doublons, 
	Objection: cette fonction doit être lancé au départ afin de permetre une verrif en local
	mais il n'y a pas intéret de le lancer si on vien de créer les journal
	es valeurs seront stockées dans window["detailJournal"];
	la structure sera conservé dans window["detailJournalStructure"];
	@param: NumPiece:[JBST, JCST]
	*/
	async getDetailJournal(options={}){
		const{arNumPiece=[window["journalData"][0]["NumPiece"],window["journalData"][1]["NumPiece"] ]}=options
		try{
			window["detailJournal"]=[] ;
			window["detailJournalStructure"]={} ;
			let url='/getDetailJournal';
			let data={arNumPiece:arNumPiece};
			let r=await this.dbman.getData({gStruct:"detailJournalStructure",url:url,data:data});
			window["detailJournal"]=r;
			return r
		}catch(err){
			console.log(err)
		}
		
	}

	async getAllDetailJournal(options={}){
		const{}=options
		try{
			let r={}
			let url='/getAllDetailJournal';
			r=await this.dbman.getData({url:url,data:{}});
			window["allDetailJournal"]=r;
			return r
		}catch(err){
			console.log(err)
		}
		
	}

	async showInDataTable(options={}){
		const{c0="root-container"}=options
		try{
			if(typeof(window["datatableIn"][c0])==="String"){
				let v=window["datatableIn"][c0];
				await window[v].unset();
			}
			window["myMiniD"]=new CMiniDatatable({varName:this.varName});
			let dataTOptions={
					deleteEvent:"",
					initCompleteEvent:"detailJournalSelected",
					efColVis:[1,2,3,5],
					globalData:"allDetailJournal",
					selectors:{container:c0+" section.content .container-fluid",table:"table1",widget:"wd1"},

					// aditifBtn:[
						// {
						  // "extend": "",
						  // "text": "Valider",
						  // "className": "btn validerFacture btn-white btn-primary btn-bold",
						  // columns: ':not(:first):not(:last)'
						// }
					// ],
					/* these actions are defied inCDatatableEvent, "paramSalaireImport" */
					// aditifActions:[ "EnregistrerFacture" ],
					varName:this.varName,
					titre:"DETAIL JOURNAL"
				}
			let s=await myMiniD.set({dataTOpt2:dataTOptions})
			
		}catch(err){
			console.log(err)
		}
		
	}

}