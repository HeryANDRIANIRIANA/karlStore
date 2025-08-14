class ClassFacture{
	constructor(options={}){
		const{varName=""}=options;
		this.varName=varName;
		this.idAnnee=window["idAnnee"];
		let myDataR=new ClassDataRectif();
		this.dbman=myDataR;
	}


	/* getListFact of the client */
	async getListFacture(options={}){
		const{IdClient1=0}=options
		try{
			let IdClient=(IdClient1!==0)?IdClient1:window.clientSelected[0].IdClient;
			let url='/getListFacture';
			let data={IdClient:IdClient, idAnnee:window.idAnnee};
			let myDataR=new ClassDataRectif();
			let r=await myDataR.getData({gStruct:"facture2Structur", url:url, data:data});
			// console.log(window["facture2Structur"]);
			return r
		}catch(err){
			console.log(err)
		}

	}

	/* getCountFacture of the client */
	async getCountFacture(options={}){
		const{}=options
		try{

			let url='/getCountFacture';
			let data={idAnnee:window.idAnnee};
			let myDataR=new ClassDataRectif();
			let r=await myDataR.getData({url:url, data:data});
			// console.log(r)
			return r
		}catch(err){
			console.log(err)
		}

	}

	/* recalcul montant facture et ajout du champ Qte dans detailFacture */
	// TODO: calculEtRectifFacture
	async calculEtRectifFacture(ar, options={}){
		const{
			eltsFact={}
			}=options
		try{
			let o1={};
			let sum=0;

			for(let o of ar){
				let QteFactured=(typeof(eltsFact[o["ProductId"]])!=="undefined" )?eltsFact[o["ProductId"]]:0;
				o["facturedQte"]=QteFactured;
				o["Quantite_facture"]=o["QteCom"]-QteFactured;
				o["Qte"]=o["QteCom"]-QteFactured;
				// o["QteCom"]=o["Quantite_facture"];
				sum+=o["Quantite_facture"]*o["PUTTCCOM"]
			}
			o1["detail"]=ar;

			o1["sum"]=sum;
			return o1
		}catch(err){
			console.log(err)
		}
	}

	// TODO:SHOW IN DATATA
	async showInDatatable(options={}){
	const{c0="mySelect01", editMode=true}	=options;
	try{
		if(typeof(window["datatableIn"]["root-container"])==="string"){
			let v=window["datatableIn"]["root-container"]
			// console.log(v);
			await window[v].unset();
		}

		window.myMiniD=new CMiniDatatable({varName:this.varName});
			// console.log(window["detailFacture"]);
			/* j'ai constaté que le champ Qte n'est pas affiché pourtant l'objet original le contient
			aussi que c'est le champ Qte qui sera prise en compte vers la bas de donnée
			*/
			// console.log(window["detailFacture"]);
			let dataTOptions={}
			
			if(editMode===true){
					dataTOptions={
					deleteEvent:"",
					initCompleteEvent:"setEditableQteColumn",
					efColVis:[0,10,4],
					globalData:"detailFacture",
					selectors:{container:c0+" section.content .container-fluid",table:"table1",widget:"wd1"},

					aditifBtn:[
						{
						  "extend": "",
						  "text": "Valider",
						  "className": "btn validerFacture btn-white btn-primary btn-bold",
						  columns: ':not(:first):not(:last)'
						}
					],
					/* these actions are defied inCDatatableEvent, "paramSalaireImport" */
					aditifActions:[ "EnregistrerFacture" ],
					varName:this.varName,
					titre:"CREATION FACTURE"
				}
			}else{
					 dataTOptions={
					deleteEvent:"",
					// initCompleteEvent:"setEditableQteColumn",
					efColVis:[2,3,4],
					globalData:"detailFacture",
					selectors:{container:c0+" section.content .container-fluid",table:"table1",widget:"wd1"},

					aditifBtn:[
						{
						  "extend": "",
						  "text": "Télecharger",
						  "className": "btn validerFacture btn-white btn-primary btn-bold",
						  columns: ':not(:first):not(:last)'
						}
					],
					/* these actions are defied inCDatatableEvent, "paramSalaireImport" */
					aditifActions:[ "TelechargerFact" ],
					varName:this.varName,
					titre:"FACTURE "
				}
			}
			
			let s=await myMiniD.set({dataTOpt2:dataTOptions})
			 // console.log(s)
			// TODO:RECTIIFER stockage var
			// window['dataTableDetailCom']=s;
			// window["datatableIn"][c0]=s
			// $(".validerFacture").hide()
			if(editMode===true){
				await this.checkValidFacture();
			}
			return s;
	}catch(err){
		console.log(err)
	}
	}

	async checkValidFacture(options={}){
		const{}=options
		try{
			let bvalide=true
			/* si Undes Qte de la ligne detail fact est negatif facture invalid */
			for (let [key, o] of Object.entries(window["detailFacture"])) {
				if( o["Qte"] <= 0){
					bvalide=false;
				}
			}

			if(bvalide===true){
				$(".validerFacture").show()
			}else{
				$(".validerFacture").hide();
				await this.setEditableQteColumn({disable:true})
			}
			return bvalide;
		}catch(err){
			console.log(err)
		}

	}

	async preDetailFacture(options={}){
		const{o={}}=options
		try{

			let s=`<table width="100%"border="1px solid red" id="preDetailFacture">
			<tr> <td class="font-italic">Département:${o.Departement} </td><td>Toamasina le, ${o.DateFactur} </td> </tr>
			<tr> <td class="font-italic">FactN° : ${o.NumFact} </td><td> </td> </tr>
			<tr> <td>BCN°: ${o.NumBC} </td><td>DOIT: ${o.NomClient} </td> </tr>
			<tr> <td><a id="btnBl">BLN°</a>: ${o.BL} </td><td>description CLIENT : ${o.DescriptionClient} </td> </tr>
			</table>`
			return s;
		}catch(err){
			console.log(err)
		}

	}

	async postDetailFacture(options={}){
		const{o={}}=options
		try{
// <button id="factureImpayees" class="btn btn-white bg-teal btn-block btn-xs waves-effect" type="button">Factures <span class="badge"></span></button>
			let s=`<table width="100%"border="1px solid red" id="post">
			<tr> <td class="font-italic"></td><td>Total HT : ${o.MontantHTFactur} </td> </tr>
			<tr> <td></td><td >TVA : ${o.TVA} </td> </tr>
			<tr> <td> </td><td>TOTAL TTC : ${o.MontantTTCFactur} </td> </tr>
			<tr> <td> </td><td> <a id="acompteEdit" class="btn btn-white bg-teal btn-block btn-xs waves-effect" type="button">ACOMPTE</a> : ${o.MontantDue} </td> </tr>
			<tr> <td> </td><td>NET A PAYER : ${o.ResteAPayer}</td> </tr>
			</table>`
			return s;
			
			
		}catch(err){
			console.log(err)
		}

	}

	async rectifyDetailFact(ar,options={}){
		const{NumFact=""}=options
		try{
			// console.log(ar)
			ar.forEach((v, k) => {v["NumFact"]=NumFact });
			return ar;
		}catch(err){
			console.log(err)
		}

	}

	async getQteOfFacturedItems(options={}){
		const{}=options
		try{
			let arProductId=[]
			for (let o of window["detailFacture"]) {
			arProductId.push(o["ProductId"])
			}
			// console.log(arProductId)
			let url="/getDetailFacture2";
			let data={
				arIdProduct:arProductId
			}
			let facturedItems=await this.dbman.getData({url:url,data:data});

			let oFacturedQ=this.sumFacturedQte(facturedItems);
			return oFacturedQ;
		}catch(err){
			console.log(err)
		}

	}

	/* addRow facture: to Database
	add row in table facture
	and add detailFacture in table facture
	*/
	async addRowFacture(options={}){
		const{rowFacture={}, arDetailFacture=[]}=options
		try{
			let url='/addRowFacture';
			let data={
				rowFacture:rowFacture,
				struct:window["facture2Structur"]
			}

			let r=await this.dbman.getData({gStruct:"temp",url:url,data:data});

			let NumFact=window["temp"]["NumFact"]
			// console.log(NumFact)

			if(Object.keys(window["DETAILFACTURE2Structur"]).length===0){
				url="/getDetailFacture";
				data={NumFact:""}
				await this.dbman.getData({gStruct:"DETAILFACTURE2Structur", url:url, data:data});
				// console.log(window["DETAILFACTURE2Structur"]);
			}
			// console.log(r)
			// TODO:Rectify NumFact in detailFact
			let detailFacture= await this.rectifyDetailFact(arDetailFacture,{NumFact:NumFact});

			url='/addDetailFacture';
			data={
				arDetailFacture:detailFacture,
				struct:window["DETAILFACTURE2Structur"]
			};
			r=await this.dbman.getData({url:url,data:data});
			// console.log(r)
			return r
		}catch(err){
			console.log(err)
		}

	}

	/*
	@params:ar-rows factured items
	*/
	sumFacturedQte(ar){
		let o={};
		ar.forEach((v,k)=>{
			o[v["ProductId"]]=(typeof(o[v["ProductId"]])==="undefined")?v["Qte"]:o[v["ProductId"]]+v["Qte"];
		})
		return o;
	}

	async getFacture(NumFact){
		try{
			// console.log(NumFact);
			await this.create({editMode:false, cNumFact:NumFact});
			return NumFact;
		}catch(err){
			console.log(err)
		}
		
	}
	
	
	/* create consist to show a pannel
	when pannel shown all data are stored in window["facutureInfo"] AND window["detailFacture"]
	*/
	async create(options={}){
		const{
			editMode=true,
			cNumFact=""
			}=options
		try{
			let factureInfo={};
			window["detailFacture"]=[];
			let NumFact=cNumFact;
			
			if( editMode===false){
				// TODO:GET FACTUREINFO
				let factureInfo0=await this.getFactureinfo(cNumFact) ;
				window['factureInfo']=factureInfo0[0] ;
				factureInfo=factureInfo0[0] ;
				detailFacture=await this.getDetailFacture3(cNumFact);
				window['detailFacture']=detailFacture;
			}
			
			let bl="";
			let profileFacture={
				DescriptionClient:"",
				TVA:0,
				ACOMPTE:0
			}
			
			
			if(editMode===true){
				// console.log(editMode);
				let m=new CminiSelect();
				let s=await m.set();
				// geting bcInfo
				let myBc=new ClassBonCommande();
				let bcInfo=await myBc.getInfoOfBCSelected(window["NumBC"])
				let clientInfo=window.clientSelected[0];
				
				NumFact=await this.buildNumFact({departement:bcInfo["TypeTravaux"]});
				
				let selectedRows=window[window["dataTableDetailCom"]].rows({selected:true});
				let d=selectedRows.data().toArray();
				
				if(d.length===0){
					for(let o of window["detailCommande"]){
						window["detailFacture"].push(o)
					}
				}else{
					for(let o of d){
						window["detailFacture"].push(o)
					}
				}
				
				let oFacturedQ=await this.getQteOfFacturedItems()
				
				let r1=await this.calculEtRectifFacture(window["detailFacture"],{eltsFact:oFacturedQ});
				window["detailFacture"]=r1["detail"];
				
				// console.log(window["detailFacture"])
				
				let MontantHTFactur=r1["sum"];
				let MontantTVA=profileFacture.TVA*MontantHTFactur/100;
				let MontantTTC=MontantHTFactur+MontantTVA;
				let ResteAPayer=MontantTTC-bcInfo["Avance"];
				
				factureInfo={NumFact:NumFact, NumBC:bcInfo["NumBC"] ,Departement:bcInfo["TypeTravaux"], IdClient:clientInfo["IdClient"] ,DateFactur:window.day, MontantHTFactur:r1["sum"], MontantDue:bcInfo["Avance"], ResteAPayer:ResteAPayer, DateBC:bcInfo["DateBC"], NomClient:clientInfo["NomClient"], BL:bl, DescriptionClient: profileFacture["DescriptionClient"], TVA:MontantTVA, ACOMPTE:profileFacture["ACOMPTE"], MontantTTCFactur:MontantTTC}
				// console.log(factureInfo)
				window['factureInfo']=factureInfo;
				
				$(document).on("keydown",(e)=>{
				// console.log(e)
				if(e.key==="Escape") {
					m.unset();
				}
				})
				
			}

			/* note 04-02-2024
			profile Facture à recup dans db une autre aventure
			
			*/
			let c0=(editMode===true)?"mySelect01":"root-container";
			let t=await this.showInDatatable({c0:c0,editMode:editMode});

			let s1=await this.preDetailFacture({o:factureInfo});
			let container=c0+" section.content .container-fluid .row";
			$("#"+container).prepend(s1);
			s1=await this.postDetailFacture({o:factureInfo});
			$("#"+container).append(s1);
			
			await this.initPostAndPreSection();
			return 0;

		}catch(err){
			console.log(err)
		}
	}

	async updtBC(options={}){
		const{}=options
		try{
			// if(window["bcSelected"].Avance!=window["factureInfo"].MontantDue){
				let b=confirm("Voulez vous mettre à jours BC?");
				if(b){
					// TODO:Modification BC
					let myBc=new ClassBonCommande();
					let Avance=window["factureInfo"].MontantDue;
					let ResteAPayer=window["factureInfo"].ResteAPayer;
					let FacturerVe=window["factureInfo"].NumFact;
					let LivrerV=(window["bcSelected"].LivrerV!="Non" && window["bcSelected"].LivrerV!=window["factureInfo"].BL)?window["bcSelected"].LivrerV+"-"+window["factureInfo"].BL:window["factureInfo"].BL;
					let NumBC=window["bcSelected"].NumBC;
					await myBc.updt({ar:[{Avance:Avance, ResteAPayer:ResteAPayer, FacturerVe:FacturerVe, LivrerV:LivrerV, NumBC:NumBC}]})
				}
			// }
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}

	async updtJornal(options={}){
		const{}=options
		try{
			let b=confirm("Voulez-vous mettre à jour le journal?");
			if(b){
				
			}
		}catch(err){
			console.log(err)
		}
		
	}
	
	async EnregistrerFacture(options={}){
		const{}=options
		try{
			myLoadkit.setState()
			await this.addRowFacture({rowFacture:window["factureInfo"], arDetailFacture:window["detailFacture"]})
			//fin enregistrement Table Facture
			
			await this.updtBC();

			await this.generateExcel()

			window.myMiniS.unset()
			
			let s=window["datatableIn"]["root-container"];
			// console.log(s);
			await window[s].unset();
			// console.log(s);

			window.varInifinitMode=false;
			return 0;
		}catch(err){
			console.log(err)
		}

	}

	addingDetailComToExcelFact(ws){
			// let detailCommande=window['detailCommande'];
			let detailFacture=window['detailFacture'];
			let l=1;
			let i=20;
			let m=20;
			let sum=0;

			for (let o of detailFacture) {
			let arC1=["A","F","G","H"];
			let j=i+1;
			let n=m+1;

			arC1.forEach((v, k) => {
			ws.mergeCells(v+i+":"+v+j);
			// console.log(v+i+":"+v+j)
			ws.getCell(v+i).alignment = { vertical: 'bottom', horizontal: 'right' };
			ws.getCell(v+i).numFmt = '#,##0';
			ws.getCell(v+i).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
			});

			ws.mergeCells("B"+m+":E"+n);
			ws.getCell('A'+i).value=l ;
			ws.getCell('B'+m).value=o["DesignProd"] ;
			ws.getCell('F'+i).value=o["Qte"] ;
			ws.getCell('G'+i).value=o["PUTTCCOM"] ;
			sum+=o["Qte"]*o["PUTTCCOM"];
			ws.getCell('H'+i).value={ formula: "=G"+i+"*F"+i };

			ws.getCell('B'+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

			m+=2;
			i+=2;
			l++;
			}

			while(l<=10){
				let arC1=["A","F","G","H"];
				let j=i+1;
				let n=m+1;

				arC1.forEach((v, k) => {
				ws.mergeCells(v+i+":"+v+j);
				// console.log(v+i+":"+v+j)
				ws.getCell(v+i).alignment = { vertical: 'bottom', horizontal: 'right' };
				ws.getCell(v+i).numFmt = '#,##0';
				ws.getCell(v+i).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
				});

				ws.mergeCells("B"+m+":E"+n);
				ws.getCell('B'+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

				m+=2;
				i+=2;
				l++;
			}

		let p=m-1;
				ws.getCell("G"+m).alignment = { vertical: 'top', horizontal: 'center' };
				ws.getCell("G"+m).value="TOTAL HT";
				ws.getCell("G"+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

				ws.getCell("H"+m).alignment = { vertical: 'bottom', horizontal: 'right' };
				ws.getCell("H"+m).value={ formula: "=SUM(H16:H"+p+")" };
				ws.getCell("H"+m).numFmt = '#,##0';
				ws.getCell("H"+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

				ws.mergeCells("A"+m+":F"+m);
				ws.getCell("A"+m).value="Arrêtée la présente facture à la somme de :";
				m++;
				let n=m+1;
				ws.mergeCells("A"+m+":F"+n);
				ws.getCell("A"+m).value=NumberToLetter(sum)+" Ariary";
				ws.getCell("A"+m).alignment = { vertical: 'top', horizontal: 'left' };
				ws.getCell("A"+m).font = { bold: true };

				ws.getCell("G"+m).alignment = { vertical: 'top', horizontal: 'center' };
				ws.getCell("G"+m).value="TVA";
				ws.getCell("G"+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

				ws.getCell("H"+m).alignment = { vertical: 'bottom', horizontal: 'right' };
				ws.getCell("H"+m).value=window["factureInfo"]["TVA"] ;
				ws.getCell("H"+m).numFmt = '#,##0';
				ws.getCell("H"+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
				m++;
				ws.getCell("G"+m).alignment = { vertical: 'top', horizontal: 'center' };
				ws.getCell("G"+m).value="TOTAL TTC";
				ws.getCell("G"+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
				n=m-1;
				p=m-2;
				ws.getCell("H"+m).alignment = { vertical: 'bottom', horizontal: 'right' };
				ws.getCell("H"+m).value={ formula: "=SUM(H"+n+":H"+p+")" };
				ws.getCell("H"+m).numFmt = '#,##0';
				ws.getCell("H"+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

				m++;
				ws.getCell("G"+m).alignment = { vertical: 'top', horizontal: 'center' };
				ws.getCell("G"+m).value="ACOMPTE";
				ws.getCell("G"+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

				ws.getCell("H"+m).alignment = { vertical: 'bottom', horizontal: 'right' };
				ws.getCell("H"+m).value=window["factureInfo"]["MontantDue"] ;
				ws.getCell("H"+m).numFmt = '#,##0';
				ws.getCell("H"+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

				m++;
				ws.getCell("G"+m).alignment = { vertical: 'top', horizontal: 'center' };
				ws.getCell("G"+m).value="R. A PAYER";
				ws.getCell("G"+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
				n=m-1;
				p=m-2;
				ws.getCell("H"+m).alignment = { vertical: 'bottom', horizontal: 'right' };
				ws.getCell("H"+m).value={ formula: "=H"+p+"-H"+n } ;
				ws.getCell("H"+m).numFmt = '#,##0';
				ws.getCell("H"+m).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

				m+=2;
				ws.getCell("G"+m).alignment = { vertical: 'top', horizontal: 'center' };
				ws.getCell("G"+m).value="Signature";

	}

	async generateExcel(options={}){
		const{}=options
		try{
			let factInfo=window['factureInfo'];
			let NumFact=factInfo["NumFact"];
			let NomClient=factInfo['NomClient'];
			let NumBC=factInfo['NumBC'];
			let fName="facture_"+NomClient.split(' ')[0]+"_"+window.day;
			const wb= await new ExcelJS.Workbook();
			const ws=wb.addWorksheet(fName);
			const imageId1 = wb.addImage({
				base64: await this.getBase64FromUrl('images/e1.jpg'), // Exemple avec le logo Google
					extension: 'jpg',
				});
			const imageId2 = wb.addImage({
				base64: await this.getBase64FromUrl('images/e2.jpg'), // Exemple avec le logo Google
					extension: 'jpg',
				});
			let d=["A","B","C","D","E","F","G","H"];
			// setup column
			ws.columns=d.map((h)=>{ return { header: h, key: h, width: 11.8 } });
			//reset cols1
			ws.getColumn('A').width = 4;
			//merge A1:I8 pour la photo
			ws.mergeCells('A1:H11');
			//merge A49:I50 pour le pied de page
			ws.mergeCells('A50:H51');

			// ws.getCell('A1').fill = {
				// type: 'pattern',
				// pattern: 'solid',
				// fgColor: { argb: 'FF00FF00' }, // Vert
			// };
			// ws.getCell('A46').fill = {
				// type: 'pattern',
				// pattern: 'solid',
				// fgColor: { argb: 'FF00FF00' }, // Vert
			// };
			let lNum=12
			ws.getCell('A'+lNum).value="Département: "+factInfo['Departement'];
			ws.getCell('F'+lNum).value="Toamasina le, "+factInfo['DateFactur'];
			lNum++
			// 13
			ws.getCell('A'+lNum).value="Facture N°: "+factInfo['NumFact'];
			lNum++
			// 14
			ws.getCell('A'+lNum).value="Bon de commande N°: "+factInfo['NumBC'];
			lNum++
			// 15
			
			let l0=lNum+2
			ws.mergeCells('B'+lNum+':D'+l0);
			// ws.getCell('B'+lNum).value=factInfo["BL"] ;
			ws.getCell('A'+lNum).value=(factInfo["BL"]!="" )?"BL:"+factInfo["BL"]:"" ;
			ws.getCell('B'+lNum).alignment = { vertical: 'top', horizontal: 'left' };
			ws.mergeCells('E'+lNum+':H'+lNum+'');
			ws.getCell('E'+lNum).value="DOIT: "+factInfo["NomClient"] ;
			lNum++
			l0=lNum+1
			ws.mergeCells('E'+lNum+':H'+l0);
			ws.getCell('E'+lNum).alignment = { vertical: 'top', horizontal: 'left' };
			ws.getCell('E'+lNum).value=factInfo["DescriptionClient"] ;

			ws.addImage(imageId1, {
				tl: { col: 0, row: 0 }, // Position de l'angle supérieur gauche (colonne B, ligne 2)
				// ext: { width: 100, height: 75 },
				 br: { col: 8, row: 11 }, // Position de l'angle inférieur droit (colonne E, ligne 7)
				editAs: 'oneCell' // Important pour que l'image reste ancrée à la cellule
				// editAs: 'absoluteAnchor', // Important pour que l'image reste ancrée à la cellule

				});
			ws.addImage(imageId2, {
				tl: { col: 0, row: 50 }, // Position de l'angle supérieur gauche (colonne B, ligne 2)
				// ext: { width: 100, height: 75 },
				 br: { col: 8, row: 52 }, // Position de l'angle inférieur droit (colonne E, ligne 7)
				editAs: 'oneCell' // Important pour que l'image reste ancrée à la cellule
				// editAs: 'absoluteAnchor', // Important pour que l'image reste ancrée à la cellule

				});
				
				lNum+=3;

			ws.getCell('A'+lNum).value="N°" ;
			ws.mergeCells('B'+lNum+':E'+lNum+'');
			ws.getCell('B'+lNum).value="DESIGNATION" ;
			ws.getCell('F'+lNum).value="QTE" ;
			ws.getCell('G'+lNum).value="P. U.(Ariary)" ;
			ws.getCell('H'+lNum).value="MONTANT" ;

			let arCelToCenter=["A"+lNum,"B"+lNum,"F"+lNum,"G"+lNum,"H"+lNum];
			arCelToCenter.forEach((v,k)=>{
			ws.getCell(v).alignment = { vertical: 'top', horizontal: 'center' };
			ws.getCell(v).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
			})



			this.addingDetailComToExcelFact(ws);
			// ws.insertColumn(4);
			// console.log(ws);
			ws.getColumn(4).width=25
				ws.pageSetup.margins={
					"left": 0.25,
					"right": 0,
					"top": 0,
					"bottom": 0,
					"header": 0.3,
					"footer": 0.3
				}
			wb.xlsx.writeBuffer().then(buffer => {  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); saveAs(blob, fName+'.xlsx'); });

			return 0;
		}catch(err){
			console.log(err)
		}

	}

	async TelechargerFact(){
		
		try{
			await this.generateExcel();
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
	
	//Fonction asynchrone pour convertir une URL en base64
	async getBase64FromUrl(url) {
		const data = await fetch(url);
		const blob = await data.blob();
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = () => {
				const base64data = reader.result;
				resolve(base64data);
			}
		});
	}

	async buildNumFact(options={}){
		const{departement="Imprimérie"}=options
		try{
			const offset=43;
			let counts=await this.getCountFacture();
			let count=offset+1+counts[0]["count"];
			let sCount=count.toString().padStart(3,"0");
			// console.log(sCount);
			let sDep=(departement==="Imprimérie")?"IMP":"SER";
			let n=sCount+"/"+sDep+"/"+this.idAnnee.toString();
			return n;
		}catch(err){
			console.log(err)
		}

	}

	setEditableQteColumn(setting, options={}){
		const{disable=false}=options;
		// console.log(setting)
		// if(Object.keys(setting).length==1){
			// console.log(window["myTable"+this.varName].column());
		// }
		
		try{
			let dt=(Object.keys(setting).length>1)?setting.api:window["myTable"+this.varName];
			let cols=dt.column(10);
			let i=0;
			let nCelVal=[];
			if(setting.disable!=true){
				while (typeof(cols.data()[i])!="undefined"){
					let v=dt.cell(i,10).data();
					let t="<input type='text' id='Quantite_facture-"+i+"' class='inlineInput' value="+v+" ></input>"
					dt.cell(i,10).data(t)
					
					i++;
				}
			}else{
				while (typeof(cols.data()[i])!="undefined"){
				let v=dt.cell(i,10).data();
				// console.log(v);
				let t=$('#Quantite_facture-'+i ).val()
				dt.cell(i,10).data(t)
				i++;
				}
			}
			i=0;
			while(typeof(cols.data()[i])!="undefined"){
				// setTimeout(
					// ()=>{
						// console.log($('input#Quantite_facture-'+i).val());
						$('input#Quantite_facture-'+i).keydown((e)=>{
							let s=e.target.id;
							let i1=parseInt(s.split('-')[1]);
							let q=(e.target.value<=window["detailFacture"][i1]["QteCom"])?e.target.value:window["detailFacture"][i1]["QteCom"] ;
							e.target.value=q
							window["detailFacture"][i1]["Qte"]=q
							this.recalculMontantFacture();
						})
					// } ,10)
				i++;
			}
			
			// cols.data(nCelVal);
			// console.log(dt.column(10).data());
			// return 0;
		}catch(err){
			console.log(err)
		}
		
	}

	async getFactureinfo(NumFact){
			// console.log(NumFact);
			try{
				let url="/getFactureinfo";
				let data={NumFact:NumFact};
				let r=this.dbman.getData({url:url,data:data});
				return r;
			}catch(err){
				console.log(err)
			}
			
	}
	
	async getDetailFacture3(NumFact){
			// console.log(NumFact);
			try{
				let url="/getDetailFacture3";
				let data={NumFact:NumFact};
				let r=await this.dbman.getData({url:url,data:data});
				// console.log(r);
				return r;
			}catch(err){
				console.log(err)
			}
			
	}

	async seeFactureImpayees(options={}){
			const{}=options
			try{
				myLoadkit.setState();
			let url="/getFacturesImpayees";
			let data={}
			let r=await this.dbman.getData({url:url,data:data});
			// console.log(r);
			window["allFactures"]=r;
			window["facturesImpayees"]= await this.getFacturesImpayeesL();
			// console.log(window["facturesImpayees"]);
			let myNavBtn=new ClassNavbarbuttons();
			await this.showFacturesInDatatable();
			window["varInifinitMode"]=false;
			await myNavBtn.updtbadgeImpayees({v0:window["facturesImpayees"].length, v1:window["allFactures"].length});
			return r;
			
			}catch(err){
				console.log(err)
			}
			
	}
	
	async showFacturesInDatatable(options={}){
		const{
			c0="root-container"
		}=options
		try{
			let dataTOptions={
					deleteEvent:"",
					// initCompleteEvent:"setEditableQteColumn",
					efColVis:[0,2,3,4],
					globalData:"allFactures",
					selectors:{container:c0+" section.content .container-fluid",table:"table1",widget:"wd1"},

					aditifBtn:[
						{
						  "extend": "",
						  "text": "Paiement",
						  "className": "btn validerFacture btn-white btn-primary btn-bold",
						  columns: ':not(:first):not(:last)'
						}
					],
					/* these actions are defied inCDatatableEvent, "paramSalaireImport" */
					aditifActions:[ "paiementFacture" ],
					varName:this.varName,
					titre:"FACTURES "
				}
				await this.clearDatatableContainer();
				
				window.myMiniD=new CMiniDatatable({varName:this.varName});
				let s=await myMiniD.set({dataTOpt2:dataTOptions});
				
		}catch(err){
			console.log(err)
		}
		
	}
	
	async clearDatatableContainer(options={}){
		const{c0="root-container"}=options
		try{
			if(typeof(window["datatableIn"][c0])==="string"){
					let v=window["datatableIn"][c0]
					await window[v].unset();
				}
				return "OK";
		}catch(err){
			console.log(err)
		}
		
	}
	
	
	async getFacturesImpayeesL(options={}){
		const{ar=window["allFactures"]}=options
		try{
			let arImpayees=[]
			for (const o of ar) { 
			if(o.ResteAPayer!=0){
				arImpayees.push(o)
			}
			}
			return arImpayees;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async recalculMontantFacture(options={}){
		const{ar=window["detailFacture"]}=options
		try{
			let sum=0;
			for (let o1 of ar) {
				sum+=o1.PUTTCCOM*o1.Qte
				}
				window["factureInfo"]["MontantHTFactur"]=sum ;
				window["factureInfo"]["MontantTTCFactur"]=sum*(1+window["factureInfo"]["TVA"]);
				window["factureInfo"]["ResteAPayer"]=window["factureInfo"]["MontantTTCFactur"]-window["factureInfo"]["MontantDue"];
				
				let s1=await this.postDetailFacture({o:window["factureInfo"]});

				$("table#post").html(s1);
				await this.initPostAndPreSection();
				return 0;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async paiementFacture(options={}){
		const{}=options
		try{
			alert("WILL BE AVAILABLE SO SOON!")
		}catch(err){
			console.log(err)
		}
		
	}
	
	async editAcompte(options={}){
		const{}=options
		try{
			let myDial=new ClassUiDialog();
			await myDial.paiementFactureForm();
			
			// let o=window["factureInfo"];
			// let p=prompt("Saisir le montant payé:",o.ResteAPayer);
			// if(parseInt(p)=="NaN"){
				// alert("Montant payé doit être numerique");
				// await this.editAcompte();
			// }else{
				// if(p!=null){
				// let rap=window["factureInfo"]["ResteAPayer"];
				// let d=window["factureInfo"]["MontantDue"];
				// let m=d+parseInt(p) ;
				// window["factureInfo"]["MontantDue"]=(m<=rap)?m:rap;
				// await this.recalculMontantFacture();
				// }
			// }
				
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async editBL(options={}){
		const{}=options
		try{
			let o=window["factureInfo"]
			// console.log(o );
			let bl=prompt("BL:",o.BL);
			if(bl!=null){
				// console.log(window["factureInfo"]);
				window["factureInfo"]["BL"]=bl;
				let s=await this.preDetailFacture({o:window["factureInfo"]});
				$("#preDetailFacture").html(s);
				await this.initPostAndPreSection();
			}
			return 'OK'
		}catch(err){
			console.log(err)
		}
		
	}
	
	async initPostAndPreSection(options={}){
		const{}=options
		try{
			
			if (!$("#btnBl").data("initialized")) {
				$("#btnBl").data("initialized", true);
				$("#btnBl").click((e)=>{
				try{
					this.editBL()
				}catch(err){
					console.log(err);
				}
			})
			}
			
			if (!$("#acompteEdit").data("initialized")) {
			$("#acompteEdit").data("initialized", true);
				$("#acompteEdit").click( 
				()=>{
					this.editAcompte()
				}
				)
			}
			
			
		}catch(err){
			console.log(err)
		}
		
	}

}