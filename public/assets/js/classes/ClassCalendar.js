class ClassCalendar{
	constructor(options={}){
		const{varName="myCalendar"}=options;
		this.varName=varName;
		this.idAnnee=window["idAnnee"];
		this.dependencyes=new ClassDependencyes()
		this.dbman=this.dependencyes.dbman;
		this.myDatatable=this.dependencyes.myDatatable;
		this.dtTableName="myTable"+this.varName;
		
	}
	
	async init(options={}){
		const{}=options
		try{
			let d=window["day"].split("-")
			let c=$('#root-container section.content .row')
			let s=`<div id='calendar' style="min-height:600px;" ></div>`
			c.html(s);
			setTimeout(()=>{
				var calendarEl = document.getElementById('calendar');

				window["calendar"]= new FullCalendar.Calendar(
				calendarEl,
				{
					// initialView:'multiMonthYear',
					initialDate:d[2]+'-'+d[1]+'-'+d[0],
					editable: false,
					  selectable: true,
					  dayMaxEvents: false,
					  eventDidMount:function(i){
						  
						  let props=i.event._def.extendedProps;
						  let NumChqMSerie=props['NumChqMSerie']
						  // console.log(NumChqMSerie);
						  let myCM=new ChequeMatiere();
						  let productInfo=myCM.resolveProductInfoByNumChqMSerie(NumChqMSerie);
						   $(i.el).tooltipTable({productInfo:productInfo})
					
						  // console.log(productInfo);
						  // let QteDems=productInfo[0]["detailChequeMatiere"]
						  $(i.el).pieChartFromArray({productInfo:productInfo})
						  
					  }
				}
				)
				calendar.render()
			},10)
		}catch(err){
			console.log(err)
		}
		
	}
	
	addDetailCommande(options={}){
		const{productId=0}=options
		try{
			let o=window["chequeMatiereByProductIdData"][productId]
			// console.log(o);
			let dt=o["calendarDate"]
			window["calendar"].gotoDate(dt)
			let detailCommande=o["detailCommande"];
			// console.log(detailCommande)
			let NumChqMSerie=o["chequeMatiere"][0]["NumChqMSerie"];
			let DesignProd=(detailCommande.length>0)?detailCommande[0]["DesignProd"]:"";
			let harnessSelector=`td[data-date="${dt}"] .fc-daygrid-day-frame .fc-daygrid-day-events .fc-daygrid-event-harness`;            
            let fcEventSelector=harnessSelector+` a.fc-event .fc-event-main .fc-event-main-frame
            .fc-event-title-container .fc-event-title`;

			$(fcEventSelector).each(function(){
                 // console.log($(this).text());
                if($(this).text()===NumChqMSerie){
                    $(this).attr("data-designprod",DesignProd)
					 $(this).tooltipster({
						content: DesignProd
					  });
                }
            })
			
		}catch(er){
			console.error(er)
		}
	}
	
	highlightEvent(ProductId){
			let chequeMatiereInfo=window["chequeMatiereByProductIdData"][ProductId]
          // console.log(chequeMatiereInfo);
          let dt=chequeMatiereInfo["calendarDate"];
		  let NumChqMSerie=chequeMatiereInfo["chequeMatiere"][0]["NumChqMSerie"];
		  this.removeOldHighlighted({dt:dt, NumChqMSerie:NumChqMSerie})
            
			window["calendar"].gotoDate(dt);
			let harnessSelector=`td[data-date="${dt}"] .fc-daygrid-day-frame .fc-daygrid-day-events .fc-daygrid-event-harness`;            
            let fcEventSelector=harnessSelector+` a.fc-event .fc-event-main .fc-event-main-frame
            .fc-event-title-container .fc-event-title`;

			$(fcEventSelector).each(function(){
                // console.log($(this).text());
                if($(this).text()===NumChqMSerie){
                    $(this).parent().addClass("eventHighlight")
					// $('htlk,body,table.fc-scrollgrid').animate({ scrollTop: $(this).offset().top}, 100);
                }
            })
		return 0
	}
	
	removeOldHighlighted(options={}){
		const{dt="", NumChqMSerie=""}=options
		if(typeof(window["oldNumChqMSelected"])==="undefined"){
			window["oldNumChqMSelected"]=NumChqMSerie;
			window["oldDtChqMSelected"]=dt;
			
		}else if(window["oldNumChqMSelected"]!==NumChqMSerie){
			let harnessSelector=`td[data-date="${window["oldDtChqMSelected"]}"] .fc-daygrid-day-frame .fc-daygrid-day-events .fc-daygrid-event-harness`;
            
            let fcEventSelector=harnessSelector+` a.fc-event .fc-event-main .fc-event-main-frame
            .fc-event-title-container .fc-event-title`;
			$(fcEventSelector).each(function(){
				$(this).parent().removeClass("eventHighlight")
				})
			window["oldNumChqMSelected"]=NumChqMSerie;
			window["oldDtChqMSelected"]=dt;
		}
		
	}
	
}