(function($){
	const pluginName='articleSelectedPannel';
	var defaults={
		curentOperation:"newDsp",
		headerDescription:"",
		headerTitle:"",
		defUnHideCols:[1,2,3]
	};
	
	function Plugin(element, options){
		this.element=$(element);
		this.settings=$.extend(true,{},defaults, options);
		// console.log(options);
		this.chart=null;
		this.table=null;
		// this.init();
	}
	
	Plugin.prototype={
			
		init:function(){
			try{
				console.log(this.settings.curentOperation);
				// this.destroy()
				// ,backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0']
				let initChart=()=>{
				const ctx=this.element.find('#article-chart')[0].getContext('2d');
				this.chart=new Chart(ctx, {type:'pie', data:{labels:[], datasets:[{data:[]}]}, options:{responsive:true, plugins:{legend:{position:'bottom'}} }})
				
					}
				
				// window["curentOperation"]=this.settings.curentOperation;
				switch(this.settings.curentOperation){
					case 'newChqMSerie':
					// console.log();
					let c=window["newChequeMatiereSerie"];
					this.settings.headerTitle=window["newChequeMatiereSerie"]["Demandeur"] ;
					// console.log(this.settings.headerTitle);
					let d=window["travauxSelectedData"];
					this.settings.headerDescription=`(${d.QteCom})- ${d.DesignProd} `
					
					break;
				}
				
				cardSklt=(options={})=>{
					const{}=options;
				return `
			<div class="col-lg-12 col-md-12 col-sm-6 col-xs-12" id="dspPannel" data-action="articlePannelAction" data-keyupaction="selectedArticleKeyupEvent" tabindex="0">
                    <div class="card">
                        <div class="header bg-brown" >
                            <h2> ${this.settings['curentOperation']} - ${this.settings.headerTitle} <small>${this.settings.headerDescription} </small>
                            </h2>
                            <div class="btnContainer-left"></div>
                        </div>
                        <div class="body">
							<div class="row containerStep">
								  <div class="col-md-6">
									<table  style="width:100%" class="table table-striped table-bordered table-hover"  id="article-selected-table">
									  <thead><tr></tr></thead>
									  <tbody></tbody>
									</table>
								  </div>
								  <div class="col-md-6">
									<canvas id="article-chart" height="200"></canvas>
								  </div>
							</div>
							
						</div>
                </div>`;
				}
				
				this.element.html(cardSklt())
				$("#dspPannel").data({newChqmSerie:window["newChequeMatiereSerie"]})
					// setTimeout(()=>{$("#dspPannel").data({newChqmSerie:window["newChequeMatiereSerie"]})} ,100)
				
				initChart();
				
				let keyEventInit=()=>{
					// $(document).off();
					$(document).on('keyup',this.element,(e)=>{
					// console.log(e);
					switch(e.key){
						case 'Escape':this.destroy();
						$(document).off();
						break;
						case 'Enter':showNotification({text:'saving', colorName:'bg-orange', timer:100});
						$(document).off();
						break
					}
				})
				}
				
				// setTimeout( keyEventInit,100)
				
			}catch(er){
				console.log(er);
			};			
		},
		
		destroy:function(){
			window["curentOperation"]=null
			if (this.chart) {
				this.chart.destroy();
				this.chart = null;
			  }
			if (this.table) {
			this.table.destroy();
			this.table = null;
			}
			this.element.empty();
		},
		
		/**injectStep2: predecated
			@desc:le pluginparent va se carger de switcher sur les containerStep, le plugin enfant va injecter et d'initialiser le contenu.
			*/
		injectStep2:function(opt={}) {
			const{step2Content=""}=opt
			let step1Selector=`#dspPannel .card .body .containerStep1`;
			let step2Selector=`#dspPannel .card .body .containerStep2`;
			if(step2Content!==""){
				$(step1Selector).addClass('collapse');
				$(step2Selector).removeClass('collapse');
				$(step2Selector).html(step2Content);
			}else{
				showNotification({text:"step2 empty", colorName:"bg-red", timer:1000})
			}
		},
		
		/* injectStep: instead of injectStep2
		
		*/
		injectStep:function(opt={}){
			const{stepContent="",stepNumber=1}=opt
			let selector=`#dspPannel .card .body .containerStep`
			let n=(stepNumber<=0)?$(selector).length:stepNumber-1;
			$(selector).each(function(){
				if(!$(this).hasClass('collapse')){
					$(this).addClass('collapse')
				}
				
			})
			if($(selector).eq(n).length>0){
				// console.log($(selector).eq(n));
				$(selector).eq(n).removeClass('collapse').html(stepContent)
			}else{
				// +stepContent+
				let s="<div class='row containerStep'>"+stepContent+"</div>"
				$("#dspPannel .card .body").append(s)
			}
				
		},
		
		setLoadingState(){
			let sklt=()=>{
				let v=0;
				let t="SENDING...";
				return "<div class='progress-bar bg-green progress-bar-striped active' id='selectedArticlePb' role='progressbar' aria-valuenow='"+v+"' aria-valuemin='0' aria-valuemax='100' style='width: "+v+"%'> "+t+"</div>";
			}
			
			this.injectStep({stepContent:sklt(), stepNumber:0})
		},
		
		refreshLoadingState(opt={}){
			const{v=0,t=""}=opt;
			$("#selectedArticlePb").attr("aria-valuenow",v).css({width:v+"%"})
			if(t!==""){$("#selectedArticlePb").text(t)};
			if(v===100){
				this.destroy()
			}
		},
		
		setData:function(d,opts={}){
			const{
				unhidedCols=[0,1,2],
				iconConf={iconName:"box",iconAction:"", iconClass:"feather-icon-red"},
				bWithIconCol=false,
				tableId="article-selected-table"
				}=opts;
			
			let extractColNames=()=>{
				let colNames=Object.keys(d[0])
				if(bWithIconCol===true){colNames.unshift('i')}
				colNames=colNames.map(cName=>({title:`${cName}`,data:`${cName}`}) )
				// colNames.unshift('btnCol');
				return colNames;
			}
			
			let initTable=()=>{
				
				let initTableEvent=()=>{
					$("#"+tableId+' tbody').on('click', 'tr', function(){
						window["t"].$('tr.selected').removeClass('selected');
						$(this).addClass('selected');
						// console.log($t.row(this).data());
					})
				}
				
				let iconSklt=()=>{
					return `<a class="trefl01 neon-button" href="javascript:void(0);"  data-action ="${iconConf.iconAction}" ><span><i data-feather="${iconConf.iconName}" class="${iconConf.iconClass}"></i></span></a>`
				}
				
				if(!$.fn.DataTable.isDataTable("#"+tableId)){
					
					let hideCols=()=>{
					let colIds=Object.keys(colNames);
					colIds=colIds.map((v)=>{return parseInt(v)} );
					window["t"].columns(colIds).visible(false);
					window["t"].columns(unhidedCols).visible(true)
					}
				
					
					let addIconCols=function(o){
					let rowD=window["t"].row(o).data();
					$(o).data(rowD);
					let $cells=$(o).children('td');
					if($cells.eq(0).hasClass('icon-col')===false){
						$('<td class="icon-col text-center">' + iconSklt() + '</td>').insertBefore($cells.eq(0))
					}else{
						$cells.eq(0).html(iconSklt())
					}
					feather.replace()
					
					}
					
					window["t"]=$("#"+tableId).DataTable({
					select:true,
					data:d,
					columns:colNames,
					columnDefs: [ { targets: 0, title: "", defaultContent: "", orderable: false, className: 'icon-col' } ],
					dom:'Bfrtip',
					buttons:[{
						extend:'colvis',
						text:`<i data-feather="eye" class="feather-icon-red"></i>`
					}]
					})
				
					window["t"].on('draw.dt',function(){
						$("#"+tableId).find('tbody tr').each(function(rowIndex){
							if(bWithIconCol===true){
									addIconCols(this)
								}
							})
						// $(`[data-action="${iconConf.iconAction}"]`).on('click',function(){
							// console.log(this);
						// })
					});
				
					window["t"].draw(false);
					hideCols();
				
				}else{
					// $("#"+tableId).data(d)
					window["t"].clear()
					window["t"].rows.add(d);
					window["t"].draw(false);
				}
				
				feather.replace();
				
				initTableEvent();
				
			}
			
			let updtChart=()=>{
				let labels=d.map(row=>row['DesignArticle'])
				let q=(this.settings.curentOperation==="newChqMSerie")?'QteDem':'QteDS';
				let values=d.map(row=>row['QteStockArt'])
				this.chart.data.labels=labels
				this.chart.data.datasets[0].data=values;
				this.chart.update()
			}
			
			if(d.length>0){
				colNames=extractColNames();
				initTable();
				updtChart();
			}else{
				showNotification({text:"articleSelectedData length===0", colorName:"bg-red",timer:1000})
			}
		
		}
		
	}
	
	$.fn.articleSelectedPannel = function(methodOrOptions) {
	  const args = Array.prototype.slice.call(arguments, 1); // <== capture des arguments après "setData"
	  return this.each(function() {
		const $this = $(this);
		let plugin = $this.data(pluginName);
		if (!plugin) {
		  plugin = new Plugin(this, typeof methodOrOptions === 'object' ? methodOrOptions : {});
		  $this.data(pluginName, plugin);
		} else if (typeof methodOrOptions === 'string' && plugin[methodOrOptions]) {
		  plugin[methodOrOptions].apply(plugin, args); // <== on passe bien les vrais arguments ici
		}
	  });
	};

	
	
})(jQuery)