window["pm"]=new PannelManager()
window["tm"]=new TableManager()
window["articles"]=new ClassArticle();
window["myMouvementStock"]=new mouvementStock();
window["cm"]=new chartManager()
function pannel1headerContent(){
	return `<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div class="info-box">
                        <div class="icon bg-red" style="width:50px">
                            <i data-feather="database" ></i>
                        </div>
                        <div class="content">
                            <div class="">VALEUR STOCK</div>
                            <div class="sumValeurStock">10000 AR</div>
                        </div>
                    </div>
                </div>
				<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div class="info-box">
                        <div class="icon bg-red" style="width:50px">
                            <i data-lucide="Panda" ></i>
                        </div>
                        <div class="content">
                            <div class="">MARGE SUR STOCK</div>
							<div class="sumMargeStock">10000 AR</div>
                        </div>
                    </div>
                </div>
				<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div class="info-box">
                        <div class="icon bg-red" style="width:50px">
                            <i data-lucide="Building" ></i>
                        </div>
                        <div class="content">
                            <div class="">MARGE SUR EXERCICE</div>
                        </div>
                    </div>
                </div>
				<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
					
				</div>
				
				`
}
window["pannels"]={
	/* <div class="text">VALEUR STOCK</div>
                            <div class="number count-to" data-from="0" data-to="125" data-speed="1000" data-fresh-interval="20">125</div> */
	p1:{id:"p1",headerClassName:"bg-red", headerContent:pannel1headerContent(), bodyContent:`<canvas id="pie_chart" height="150"></canvas>`},
	p2:{id:"p2",headerClassName:"bg-blue"},
	p3:{id:"p3",headerClassName:"bg-green", headerContent:pannel1headerContent(), bodyContent:`<table style="width:100%" id="tableArticle" class="table table-striped table-bordered table-hover"></table>`},
	p4:{id:"editArticlePannel",headerClassName:"bg-orange", bodyContent:''},
}


var oArticle={
	data:[], 
	structure:window["articleStructure"],
	selector:"#tableArticle", 
	defaultVisibleCols:[0,4,5,6,7], 
	selectedLineData:"articleSelected",
	classContainer:"articles"
}

var oMouvementStock={
	data:[],
	structure:window["mouvementStockStructure"],
	classContainer:"mouvementStock"
}

var showNotification=function(options={}){
		const{
			colorName='bg-black', 
			text='', 
			placementFrom='top', 
			placementAlign='right', 
			animateEnter='animated lightSpeedIn', 
			animateExit='animated lightSpeedOut',
			allowDismiss=true,
			timer=1000
			}=options
		try{
			$.notify({
			message: text
			},
			{
            type: colorName,
            allow_dismiss: allowDismiss,
            newest_on_top: true,
            timer: timer,
            placement: {
                from: placementFrom,
                align: placementAlign
            },
            animate: {
                enter: animateEnter,
                exit: animateExit
            },
            template: '<div data-notify="container" class="bootstrap-notify-container alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '</div>'
			});
		
		}catch(err){
			console.log(err)
		}
		
	}
	


