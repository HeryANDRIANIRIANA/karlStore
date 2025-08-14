class ClassArticle{
	constructor(options={}){
		const{varName="myArticle"}=options;
		this.varName=varName;
		this.idAnnee=window["idAnnee"];
		let myDataR=new ClassDataRectif();
		this.dbman=myDataR;
	}
	
	async save(options={}){
		const{oper="add",currentMouvementStock=null}=options
		try{
			
			let url="/addArticle";
			let data={
				articleStructure:window["articleStructure"].structure,
				newArticle:window["newArticle"],
				currentMouvementStock:currentMouvementStock,
				mouvementStockStructure:window["mouvementStockStructure"],
				oper:oper
			}
			let myDataR=new ClassDataRectif();
			let r=await myDataR.getData({url:url, data:data});
			// console.log(r);
			await this.refreshLocalData({oper:oper})
		}catch(err){
			console.log(err)
		}
		
	}
	
	async refreshLocalData(opt={}){
		const{oper="add"}=opt
		
		switch(oper){
			case 'add':
			window["articleData"].push(window["newArticle"][0])
			window["dtTableInarticles"].rows.add(window["newArticle"]);
			await this.arrageByCodeArticle2({pbSelector:"#pbHeaderEditArticle"})
			// TODO: addNamePbselector
			break;
		}
	}
	
	async getData(options={}){
		const{}=options
		try{
			let url='/getListArticle';
			let data={};			
			let r=await this.dbman.getData({gStruct:"articleStructure", url:url, data:data});
			window["articleData"]=r;
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
	
	async arrageByCodeArticle(){
		try{
			let s=myLoadkit.addProgressbar({text:"Arange article by code", percent:0})
			let i=0;
			let batchSize=10;
			let td=10;
			function arangeArticle(){
				let o=window["articleData"]
				let start=performance.now();
				let end=Math.min(i+batchSize,o.length)
				for(;i<end;i++){
					// console.log(o[i]);
					let CodeArticle=o[i]['CodeArticle'];
					if(window["articleDataByCodeArticle"]===undefined||window["articleDataByCodeArticle"]===null){
						window["articleDataByCodeArticle"]={}
					}
					window["articleDataByCodeArticle"][CodeArticle]=o[i]
				}
				
				let d=performance.now()-start;
				if(d<td && batchSize<1000){batchSize+=10}else if(d>td && batchSize>10){batchSize-=10};
				
				if(i===o.length){
					showNotification({text:"classement par codeArticle Done", colorName:'bg-green', timer:1000});
					myLoadkit.checkAllProgression()
				}else if(i<o.length){
					let t=o[i]['CodeArticle'];
					let p=parseInt(i/(o.length-1)*100 )
					myLoadkit.refreshProgressbar({s:s, text:t, percent:p})
					setTimeout(arangeArticle,5);
				}
				
			}
			if(window["articleData"]===undefined|| window["articleData"]===null){
				await this.getData()
				arangeArticle()
			}else{
				arangeArticle()
			}
			
		}catch(err){console.log(err);}
	}
	
	async arrageByCodeArticle2(opt={}){
		try{
			const{pbSelector=""}=opt
			// console.log(pbSelector);
			// let s=myLoadkit.addProgressbar({text:"Arange article by code", percent:0})
			let i=0;
			let vStock=0;
			let mStock=0;
			let batchSize=10;
			let td=10;
			let labels=[]
			let pieData=[]
			let pieBgColor=[]
			if(typeof(window["chart01"])!=="undefined"){
				window["chart01"].destroy()
			}
			function refreshResumePannel(opt={}){//pannel de résumé
				const{vStock=0, mStock=0, CodeArticle=""}=opt
				$(".sumValeurStock").each(function(){
						$(this).html(`<b>${vStock}</b>`)
					})
				$(".sumMargeStock").each(function(){
						$(this).html(`<b>${mStock}</b>`)
					})
			
			window["pieConfData"]={};
			window["pieConfData"]["labels"]=[];
			window["pieConfData"]["datasets"]=[{data:[],backgroundColor:[]}]
			window["pieConfData"]["labels"].push(CodeArticle)
					window["pieConfData"]["datasets"][0]["data"].push(vStock)
					window["pieConfData"]["datasets"][0]["backgroundColor"].push(`rgb(${window["articleData"].length},${vStock},125)`)
			window["cm"].drawChart({data:window["pieConfData"]})
			
			}
			
			function refreshPb(opt={}){
				const{pbSelector="",percent=0, oDataTable=window["dtTableInarticles"]}=opt
				$(pbSelector).each(function(){
					$(this).find(".progress-bar").attr("aria-valuenow",percent).css("width",percent+"%")
					// let $c=$(this).parent().parent().parent()
					// let oDataTable=$c.data().oDataTable;
					if(percent>=100){
						// console.log(window["articleData"]);
						// oDataTable.clear()
						// oDataTable.rows.add(window["articleData"]); 
						oDataTable.draw(false)
					}
				})
				
			}
			
			function arangeArticle2(opt={}){
				const{pbSelector=""}=opt
				let o=window["articleData"]
				let start=performance.now();
				let end=Math.min(i+batchSize,o.length)
				for(;i<end;i++){
					// console.log(o[i]);
					let CodeArticle=o[i]['CodeArticle'];
					
					if(window["articleDataByCodeArticle"]===undefined||window["articleDataByCodeArticle"]===null){
						window["articleDataByCodeArticle"]={}
					}
					// o[i]['valeurStock']=0
					function calculVStock(){
						let q=0;
						if(!isNaN(o[i]["QteStockArt"]) && !isNaN(o[i]["PrixAchatUnitaire"])){
						o[i]["PrixAchatUnitaire"]=(o[i]["PrixAchatUnitaire"]===null)?0:o[i]["PrixAchatUnitaire"];
						q=(o[i]["QteStockArt"]>0)?o[i]["QteStockArt"]:0;
						o[i]['valeurStock']=parseFloat(q)*parseFloat(o[i]["PrixAchatUnitaire"])	
						labels.push(CodeArticle)
						pieData.push(parseInt(o[i]['valeurStock']))
						pieBgColor.push(`rgb(${i},${q},125)`)
						}else{
						o[i]['valeurStock']=0
						}
						if(!isNaN(o[i]["QteStockArt"]) && !isNaN(o[i]["MargeUnitaire"])){
						q=(o[i]["QteStockArt"]>0)?o[i]["QteStockArt"]:0;
						o[i]['margeStock']=parseFloat(q)*parseFloat(o[i]["MargeUnitaire"])	
						}else{
							o[i]["margeStock"]=0;
						}
					
						}
						
					calculVStock()
					vStock+=o[i]['valeurStock']
					mStock+=o[i]['margeStock']
					refreshResumePannel({vStock:vStock, mStock:mStock, CodeArticle:CodeArticle})
					o[i]["articleDataIndex"]=i;
					window["articleDataByCodeArticle"][CodeArticle]=o[i]
				}
				
				let d=performance.now()-start;
				if(d<td && batchSize<1000){batchSize+=10}else if(d>td && batchSize>10){batchSize-=10};
				
				let p=parseInt(i/(o.length-1)*100 )
				
				if(pbSelector!==""){
					// console.log(p);
						refreshPb({pbSelector:pbSelector,percent:p})
					}
				
				if(i===o.length){
					showNotification({text:"Valeur stock: "+vStock, colorName:'bg-green', timer:1000});
					window["articleDataByCodeArticle"]["valeurStock"]=vStock;
					window["pieConfData"]={labels:labels,datasets:[{
						data:pieData,backgroundColor:pieBgColor
					}]
					}
					
					window["cm"].drawChart({data:window["pieConfData"]})
					// window["chart01"].data.labels=labels;
					// window["chart01"].data.datasets[0].data=pieData;
					// window["chart01"].data.datasets[0].backgroundColor=pieBgColor;
					// window["chart01"].update()
					// myLoadkit.checkAllProgression()
				}else if(i<o.length){
					// let t=o[i]['CodeArticle'];
					
					// myLoadkit.refreshProgressbar({s:s, text:t, percent:p})
					setTimeout(arangeArticle2({pbSelector:pbSelector}),5);
				}
				
			}
			if(window["articleData"]===undefined|| window["articleData"]===null){
				await this.getData()
				arangeArticle2({pbSelector:pbSelector})
			}else{
				arangeArticle2({pbSelector:pbSelector})
			}
			
		}catch(err){console.log(err);}
	}
	
	async getProfileDsp(options={}){
		const{}=options
		try{
			let url='/getProfileData';
			let data={};			
			let r=await this.dbman.getData({gStruct:"articleProfileStructure", url:url, data:data});
			window["articleProfileData"]=r;
			return 0;
		}catch(err){
			console.log(err)
		}
		
	}
	
	profieDspbyCodeArticle(){
		let o={};
		for (const el of window["articleProfileData"]) {
		 o[el["CodeArticle"]]=el
		}
		return o;
		
	}
	
	async showInDatatable(options={}){
		const{c0='root-container'}=options
		try{
			if(typeof(window["datatableIn"]["root-container"])==="string"){
			let v=window["datatableIn"]["root-container"]
			// console.log(v);
			await window[v].unset();
			}
			
			window.myMiniD=new CMiniDatatable({varName:this.varName});
			
			let dataTOptions={
					deleteEvent:"",
					initCompleteEvent:"",
					efColVis:[1,2,3],
					globalData:"articleData",
					selectors:{container:c0+" section.content .container-fluid",table:"table1",widget:"wd1"},
					aditifBtn:[],
					/* these actions are defied inCDatatableEvent, "paramSalaireImport" */
					aditifActions:[],
					varName:this.varName,
					titre:"LISTE DES ARTICLES"
				}
				let s=await myMiniD.set({dataTOpt2:dataTOptions})
				return 0;
			
		}catch(err){
			console.log(err)
		}
		
	}

	async generateSelect(options={}){
			const{}=options
			try{
				if(typeof(window["articleData"])==="undefined"){
					await this.getData()
				}
				
				let s=""
				window["articleData"].forEach((v, k) => {
					if(v.QteStockArt>0){
						let dataString="";
						for (let k in v) {
							let v1=v[k]
							dataString+=`data-${k}="${v1}" `
								// console.log(key, obj[key]); // Affiche les clés et leurs valeurs
							}
						s+=`<option value="${v.CodeArticle}" ${dataString} >${v.CodeArticle}</option>`
					}
					});
				return s;
			}catch(err){
				console.log(err)
			}
			
		}
	
	resetEditArticlePannel(){
		let pannelId="editArticlePannel"
		let head=$("#"+pannelId).find('.header')
		let body=$("#"+pannelId).find('.body')
		
		let ar=["margeUnitaire","DesignArticle","Unite","QteStockArt","PrixAchatUnitaire"]
		ar.forEach(function(v,k){
			$("#"+v).off()
		})
		head.empty()
		body.empty()
		
	}
	
	setupEditArticlePannel(){
		//define newArticle
		// window["newArticle"]={};
		
		let structure=window["articleStructure"]
		let pannelId="editArticlePannel"
		//"Caractéristique"
		let editableFields=["DesignArticle","Unite","QteStockArt","PrixAchatUnitaire"]
		let generateNewArticle=()=>{
			window["curentMarge"]=10;
			window["newArticle"]={} ;
			let structure=window["articleStructure"]
			// console.log(structure);
			let d=structure.data[0];
			// console.log(d);
			// window["newArticle"].push(d);
			let desc=structure.structure.colDesc;
			// console.log(desc);
			for (let key in d) {
			// console.log(key, obj[key]); // Affiche les clés et leurs valeurs
				if(typeof(desc[key])!=="undefined"){
					switch(desc[key]["dataType"]){
					case -9:
					window["newArticle"][key]="-";
					break;
					case 2:
					window["newArticle"][key]=0;
					break;
					case 4:
					window["newArticle"][key]=0;
					break;
				}
				}
			}
			return 0;
		}
		
		generateNewArticle()
		
		function checkIfNumeric(o){
					let a=parseFloat($(o).val())
						if(isNaN(a)){
							$(o).val('')
						}
				}
		
		function updtMargeUnitaire(opt={}){
					const{pct=window["curentMarge"], pu=window["newArticle"]["PrixAchatUnitaire"], margeU0=0}=opt
					let margeU=pu*pct/100
					if(margeU0!==0){
						margeU=margeU0
						let pct0=margeU/pu*100
						window["curentMarge"]=pct0
						$("#pctvalue").text(parseInt(window["curentMarge"])+"%")
						$("#margePct").slider({
						range:'min',
						min:0,
						max:100,
						value:window["curentMarge"],
						slide:(e,ui)=>{
							window["curentMarge"]=parseFloat(ui.value);
							$("#pctvalue").text(parseFloat(ui.value)+"%")
							updtMargeUnitaire()
						}
						})
					
					}
					
					let pvUnitaire=margeU+pu
					window["newArticle"]["MargeUnitaire"]=margeU
					window["newArticle"]["PrixVenteUnitaire"]=pvUnitaire
					$("#margeUnitaire").val(margeU)
					$("#pvUnitaire").val(pvUnitaire)
					
					
					
				}
		
		
		let s0=(opt={})=>{//bodySKlt
			const{cpName='', iFeather='', iLucide='', classControl='' }=opt
			let iFeather1=(iFeather!=='')?`<i data-feather="${iFeather}"></i>`:'';
			let iLucide1=(iLucide!=='')?`<i data-lucide="${iLucide}"></i>`:'';
			return `<div class="col-sm-12 collapse">
                                        <b>${cpName} </b>
                                        <div class="input-group">
                                            <span class="input-group-addon">
                                               ${iFeather1}
                                               ${iLucide1}
                                            </span>
                                            <div class="form-line">
                                                <input id="${cpName}" type="text" class="form-control ${classControl} " placeholder=""></input>
                                            </div>
                                        </div>
                                    </div>`
		}
		
		let s1=(e)=>{//header sklt
			return ` <div class="collapse headerFormContainer"> <div style="display:inline-flex" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
<div class="col-md-3">
<b>Marge Unitaire</b>

<div class=""><input id="margeUnitaire" type="text" placeholder=""></input></div>
<span class="input-group-addon" style="display:flex">
<span id='pctvalue'>100%</span>
<div id="margePct" class='' style="width:90%; margin-left:10px; margin-top:5px"></div>
</span>
</div>
<div class="col-sm-3">
<b>PV Unitaire</b>
<div class="input-group">
	<div class="">
		<input id="pvUnitaire" type="text" placeholder="" disabled></input>
	</div>
</div>
</div>
<div class="col-sm-3">
</div>
<div class="col-sm-3">
<div class="input-group">
<div class='neon-button'><a href="javascript:void(0)" data-action="saveArticle"><i data-feather="save"></i></a></div>
<div class='neon-button'><a href="javascript:void(0)" data-action="cancelArticle"><i data-feather="x"></i></a></div>
</div>
</div>
</div>
</div>
<div class="collapse">
					<div class="progress" id="pbHeaderEditArticle">
					<div class="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
					<span class="sr-only">60% Complete (warning)</span>
					</div>
					</div>
				</div>
		`
		// TODO:setup pbInHeader
		}
		
		let head=$("#"+pannelId).find('.header')
		// console.log(head);
		// console.log($(head).children().length);
		if(head.children().length===1){
			
			head.html(s1)
			
			let initHeaderFields=function(){
				$("#pctvalue").text(window["curentMarge"]+"%")
				
				$("#margePct").slider({
					range:'min',
					min:0,
					max:100,
					value:window["curentMarge"],
					slide:(e,ui)=>{
						window["curentMarge"]=parseFloat(ui.value);
						$("#pctvalue").text(parseInt(ui.value)+"%")
						updtMargeUnitaire()
					}
				})
				
				$("#margeUnitaire").on('keyup',function(){
					checkIfNumeric(this)
					if($(this).val().length>1){
						let margeU0=parseFloat($(this).val())
						updtMargeUnitaire({margeU0:margeU0})
					}
				}
				)
			}
			setTimeout(()=>{
				feather.replace();
				lucide.createIcons();
				initHeaderFields()
			},100)
		}
		
		let s="";
		let body=$("#"+pannelId).find('.body')
		
		let l=body.children().length
		if(l===0){
			editableFields.forEach((v, k) => {
				s+=s0({cpName:v})
				});
				
			body.html( "<div>"+s+"</div>")
			
			let initfields=function(){								
				function buildCodeArticle(s){
					let i=1
					let code=""
					let availableCode=false;
					while(availableCode===false){
						let sm=i.toString().padStart(3,'00');
						code=s.substr(0,3).toUpperCase()+""+sm
						console.log(code);
						if(typeof(window["articleDataByCodeArticle"][code])==="undefined"){
							availableCode=true
							
						}
						i++
					}
					return code;
				}
				
				function selParent(s){
					return $(s).parent().parent().parent()
				} 
				
				$("#DesignArticle").parent().parent().parent().removeClass('collapse')
				
				$("#DesignArticle").on('keyup',function(){
					if($(this).val().length>=3){
						window["newArticle"]["CodeArticle"]=buildCodeArticle($(this).val())
						window["newArticle"]["DesignArticle"]=$(this).val()
						
						selParent("#Unite").removeClass('collapse')
					}
				})
				
				$("#Unite").inputmask('aa', { placeholder: '' })
				.on('keyup',(e)=>{
					let u=e.currentTarget.value
					if(u.length===2){
					window["newArticle"]["Unite"]=u
					let l="QteStockArt"
					let p=selParent("#"+l);
					p.removeClass('collapse')
					p.find('b').text(l+' ('+u+')')
					l="PrixAchatUnitaire"
					p=selParent("#"+l);
					p.removeClass('collapse')
					p.find('b').text(l+' (ar/'+u+')')
					
					}
				}) ;
				
				$("#QteStockArt").on('keyup',function(){
					checkIfNumeric(this)
					window["newArticle"]["QteStockArt"]=parseFloat($(this).val())
					}
					);
					
				$("#PrixAchatUnitaire").on('keyup',function(){
					checkIfNumeric(this)
					// console.log($(this).val());
					let o=head.find(".headerFormContainer")
					if($(this).val().length>1){
						let pu=parseFloat($(this).val())
						window["newArticle"]["PrixAchatUnitaire"]=pu
						
					updtMargeUnitaire()
						
					o.removeClass('collapse');
					}else{
						if(o.is(':visible')){
							o.addClass('collapse')
						}
					}
					
					}
					);
				
			}
			setTimeout(
			()=>{
				initfields()
				feather.replace();
				lucide.createIcons();
			},1000)
		}
		return 0
	}
	
	async saveInlineEdit(opt={}){
		const{oDom=null, oParent=null, dependentFields=[]}=opt
		let $p=$(oDom).parent().parent().parent().parent()
		let rowIndex=$p.parent().data()["rowIndex"]
		let champName=$p.parent().data()["champName"]
		
		let childrenIds=[2,1];//inlineChildren div
		childrenIds.forEach((v, k) => {
			$p.children().eq(v).toggleClass('collapse');
		});
		
		let rowData=$p.parent().data()["rowData"]
		let CodeArticle=rowData["CodeArticle"]
		let articleId=window["articleDataByCodeArticle"][CodeArticle]["articleDataIndex"]
		let newVal=parseFloat($p.parent().find('input').val())
		
		dependentFields.forEach((v, k) => {
			if(oParent!==null){
			let colId=this.getColumnNumber({oParent:oParent, colName:v.colName})
			let $c=$p.parent().parent().find('td').eq(colId)
			$c.text(v.fn(articleId,newVal))
			}
			
			});
		
		window["articleData"][articleId][champName]=newVal
		// console.log(window["articleData"][articleId]);
		let ar=[]
		let cArt={}
		window["articleStructure"].structure.colNames.forEach((v, k) => {cArt[v]=window["articleData"][articleId][v] });
		ar.push(cArt)
		window["newArticle"]=ar
		
		await this.save({oper:"update"})
		return newVal
		
	}
	
	async recalculStock(opt={}){
		const{oper="up", oDom=null}=opt
		let $p=$(oDom).parent().parent().parent().parent()
			// console.log($p.parent().data());
			let rowIndex=$p.parent().data()["rowIndex"]
			let champName=$p.parent().data()["champName"]
			$p.children().eq(2).removeClass('collapse');
			$p.children().eq(1).addClass('collapse');
			let rowData=$p.parent().data().rowData
			// console.log(rowData);
			let CodeArticle=rowData["CodeArticle"];
			// console.log(CodeArticle);
			let articleId=window["articleDataByCodeArticle"][CodeArticle]["articleDataIndex"]
			let qteMvt=parseFloat($p.parent().find("input").val())
			// console.log(articleId);
			// console.log(articleId);
			function calculStock(oper){
				let pQte=rowData["QteStockArt"];				
				// console.log(addQte);
				switch(oper){
					case "up":
					return pQte+qteMvt;
					break;
					case "down":
					let q=(pQte-qteMvt>0)?pQte-qteMvt:0
					return q;
					break;
					
				}
				
			}
			
			let curQte=calculStock(oper)
			window["articleData"][articleId]["QteStockArt"]=curQte //to update
			let ar=[]
			let cArt={}
			window["articleStructure"].structure.colNames.forEach((v, k) => {cArt[v]=window["articleData"][articleId][v] });
			ar.push(cArt)
			window["newArticle"]=ar
			
			function buildCurrentMouvementStock(){
				let cm={};
				let ar=[]
				let colNames=mouvementStockStructure.structure.colNames;
				let curentArticle=window["newArticle"][0]
				colNames.forEach((v,k)=>{
								if(typeof(curentArticle[v])!=="undefined"){
									cm[v]=curentArticle[v]
								}
						})
				cm["QteMouvement"]=qteMvt
				cm["NatureMouvement"]=oper
				ar.push(cm)
				return ar
			}
			let currentMouvementStock=buildCurrentMouvementStock()
			await this.save({oper:oper, currentMouvementStock:currentMouvementStock})
			
			return curQte
	}
	
	cancelInlineEdit(o){
		let $p=$(o).parent().parent().parent().parent()
					$p.children().eq(0).removeClass('collapse');
					$p.children().eq(1).addClass('collapse');
						
	}
	
	startInlineEdit(o){
			let $p=$(o).parent().parent()
						console.log($p.parent().data());
					$p.children().eq(1).removeClass('collapse');
					$p.children().eq(0).addClass('collapse');
			}
			
	getColumnInfo(oParent){
			let arPresentCols=[];
				$(oParent.selector).find('thead tr').each(function(){
					let th=$(this).children('th')
					$(th).each(function(i){
						let columnTile=$(this).find(".dt-column-title").text()
						arPresentCols.push(columnTile);
					})
				} )
				return arPresentCols;
			}
	
	getColumnNumber(opt={}){
		const{oParent={}, colName=""}=opt;
		return this.getColumnInfo(oParent).indexOf(colName)
			}

	tableDrawProcedure(dom,oParent,oDataTable){
		var classParent=this;
			
		function formsklt(opt={}){
				const{champName="",
				rowIndex=-1,
				curentValue="",
				formFields=null,
				}=opt
				return `<div id="${champName}${rowIndex}">
				<div class="${champName}"><a data-action="startEdit" href="javascript:void(0);">${curentValue}</a></div>
				<div class="${champName} collapse">
				${formFields()}	
				</div>
				<div class="${champName} collapse">
					<div class="progress" id="pb${champName}${rowIndex}">
					<div class="progress-bar progress-bar-warning progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
					<span class="sr-only">60% Complete (warning)</span>
					</div>
					</div>
				</div>
				</div>`
			}
			
		
		function initInlineForm(opt={}){
			const{colNumber=0, champName="", concernedColsId=0}=opt;
			
			$(dom).find('tbody tr').each(function(rowIndex){
				let rowData=oDataTable.row(this).data()
				let newRowData={...rowData}
				// console.log(newRowData);
				let $cells=$(this).children('td').eq(colNumber);
				let o=concernedCols[concernedColsId]
				o["colNumber"]=colNumber;
				o["rowIndex"]=rowIndex;
				o["curentValue"]=rowData[champName];
				// console.log(concernedCols[concernedColsId]);
				
				$cells.html(formsklt(o))
				$cells.data({...o,rowData,oDataTable:oDataTable});
				
				setTimeout(o.formFnInit(o) ,100)
				
			})
		}
		
		let concernedCols=[
		{champName:"QteStockArt", colNumber:-1, rowIndex:-1, curentValue:"", fnInit:initInlineForm, 
		formFields:()=>{
			return `<div class="input-group" style="width:200px;">
						<input size="5" class=""  type="text" placeholder="" data-keyupAction="upordownstock"></input>
						<div class='neon-button'><a href="javascript:void(0)" data-action="upQteStock"><i data-feather="plus-circle"></i></a></div>
						<div class='neon-button'><a href="javascript:void(0)" data-action="downQteStock"><i data-feather="minus-circle"></i></a></div>
						<div class='neon-button'><a href="javascript:void(0)" data-action="cancel"><i data-feather="x"></i></a></div>
					</div>`
		},
		
		formFnInit:(opt={})=>{
				const{champName="",
				rowIndex=-1,
				curentValue=""
				}=opt
				// console.log(rowIndex);
				let actions={
					startEdit:function(){
						classParent.startInlineEdit(this);
						},
					cancel:function(){
						classParent.cancelInlineEdit(this)
					},
						// TODO:addingQteStockFn
					upQteStock:async function(){
						let curQte=classParent.recalculStock({
							oDom:this,
							oper:"up"
						})
						
						// await classParent.saveInlineEdit({oDom:this, oParent:oParent})
						
						let pbSelector=`#pb${champName}${rowIndex}`
						
						await classParent.arrageByCodeArticle2({pbSelector:pbSelector})
						
					},
					downQteStock:async function(){
						let curQte=classParent.recalculStock({
							oDom:this,
							oper:"down"
						})
						
						let pbSelector=`#pb${champName}${rowIndex}`
						
						await classParent.arrageByCodeArticle2({pbSelector:pbSelector})
					}
				}
				
				$(`#${champName}${rowIndex}`).on('click','[data-action]', function(){
					let actName=$(this).attr('data-action')
					// console.log(actions[actName]);
					if(actions[actName] && typeof actions[actName]==="function"){
						actions[actName].call(this)
					}
					
				})
				
				let keyupAction={
				upordownstock:(e)=>{
					// console.log(e);
					let o=e.currentTarget;
					switch(e.key){
						case "U":$(o).parent().find('[data-action="upQteStock"]').click()
						break;
						case "D":$(o).parent().find('[data-action="downQteStock"]').click()
						break;
						case "Escape":$(o).parent().find('[data-action="cancel"]').click()
						break;
					}
					// console.log(arguments);
				}
			}
			
			$(`#${champName}${rowIndex}`).on('keyup', '[data-keyupAction]', function(e){
				let actName=$(this).attr('data-keyupAction')
				if(keyupAction[actName] && typeof keyupAction[actName]==='function'){
					keyupAction[actName].call(this,e)
				}
			})
				
				feather.replace();
				lucide.createIcons();	
		}
		
		},
		{champName:"MargeUnitaire", colNumber:-1, rowIndex:-1, curentValue:"", fnInit:initInlineForm,
		formFields:()=>{
			return `<div class="input-group" style="width:200px;">
						<input size="5" class="" data-keyupAction="editMargeUnitaire" type="text" placeholder="" ></input>
						<div class='neon-button'><a href="javascript:void(0)" data-action="updateMargeUnitaire"><i data-feather="save"></i></a></div>
						<div class='neon-button'><a href="javascript:void(0)" data-action="cancel"><i data-feather="x"></i></a></div>
					</div>`
		},
		formFnInit:(opt={})=>{
			const{champName="",
				rowIndex=-1,
				curentValue=""
				}=opt
			let actions={
				startEdit:function(){
						classParent.startInlineEdit(this);
						},
				cancel:function(){
						classParent.cancelInlineEdit(this)
					},
				updateMargeUnitaire:async function(){
					let dependentFields=[
					{colName:"PrixVenteUnitaire", fn:(articleId,newVal)=>{
						window["articleData"][articleId]["PrixVenteUnitaire"]=newVal+window["articleData"][articleId]["PrixAchatUnitaire"]	
						return window["articleData"][articleId]["PrixVenteUnitaire"]
					} }
					]
						await classParent.saveInlineEdit({oDom:this, oParent:oParent, dependentFields:dependentFields})
						let pbSelector=`#pb${champName}${rowIndex}`
						
						await classParent.arrageByCodeArticle2({pbSelector:pbSelector})
					},
			
			}
			let keyupAction={
				editMargeUnitaire:(e)=>{
					// console.log(e);
					let o=e.currentTarget;
					switch(e.key){
						case "Enter":$(o).parent().find('[data-action="updateMargeUnitaire"]').click()
						break;
						case "Escape":$(o).parent().find('[data-action="cancel"]').click()
						break;
					}
					// console.log(arguments);
				}
			}
			
			$(`#${champName}${rowIndex}`).on('keyup', '[data-keyupAction]', function(e){
				let actName=$(this).attr('data-keyupAction')
				if(keyupAction[actName] && typeof keyupAction[actName]==='function'){
					keyupAction[actName].call(this,e)
				}
			})
			
			$(`#${champName}${rowIndex}`).on('click','[data-action]', function(){
					let actName=$(this).attr('data-action')
					// console.log(actions[actName]);
					if(actions[actName] && typeof actions[actName]==="function"){
						actions[actName].call(this)
					}
					
				})
				
			feather.replace();
			lucide.createIcons();
			
		}
		},
		{champName:"PrixAchatUnitaire", colNumber:-1, rowIndex:-1, curentValue:"", fnInit:initInlineForm,
		formFields:()=>{
			return `<div class="input-group" style="width:200px;">
						<input size="5" class=""  type="text" placeholder="" ></input>
						<div class='neon-button'><a href="javascript:void(0)" data-action="updatePrixAchatUnitaire"><i data-feather="save"></i></a></div>
						<div class='neon-button'><a href="javascript:void(0)" data-action="cancel"><i data-feather="x"></i></a></div>
					</div>`
		},
		formFnInit:(opt={})=>{
			const{champName="",
				rowIndex=-1,
				curentValue=""
				}=opt
			let actions={
				startEdit:function(){
						classParent.startInlineEdit(this);
						},
				cancel:function(){
						classParent.cancelInlineEdit(this)
					},
				updatePrixAchatUnitaire:async function(){
					let dependentFields=[
					{colName:"PrixVenteUnitaire", fn:(articleId,newVal)=>{
						window["articleData"][articleId]["PrixVenteUnitaire"]=newVal+window["articleData"][articleId]["MargeUnitaire"]	
						return window["articleData"][articleId]["PrixVenteUnitaire"]
					} }
					]
						await classParent.saveInlineEdit({oDom:this, oParent:oParent, dependentFields:dependentFields})
						let pbSelector=`#pb${champName}${rowIndex}`
						
						await classParent.arrageByCodeArticle2({pbSelector:pbSelector})
					},
			
			}
			
			$(`#${champName}${rowIndex}`).on('click','[data-action]', function(){
					let actName=$(this).attr('data-action')
					// console.log(actions[actName]);
					if(actions[actName] && typeof actions[actName]==="function"){
						actions[actName].call(this)
					}
					
				})
				
			feather.replace();
			lucide.createIcons();
			
		}
		},
		
		];
		
		// let arPresentCols=classParent.getColumnInfo(oParent);
		
		// classParent.getColumnNumber({oParent:oParent,colName:colName}) 
		// TODO:getColumnNumber
			
		concernedCols.forEach((v, k) => {
				let colNumber=classParent.getColumnNumber({
				oParent:oParent, colName:v["champName"]})
				if(colNumber>=0){
					v.fnInit({concernedColsId:k, colNumber:colNumber,champName:v["champName"]})
				}
				
			});
			
	}
	
}