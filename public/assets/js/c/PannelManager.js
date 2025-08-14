class PannelManager{
	constructor(opt={}){
		try{
			this.defSklt=(opt={})=>{
				const{id="", headerClassName="", bodyContent="", title="", headerContent=""}=opt
				return `<div class="row clearfix">
<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
		<div class="card" id="${id}" >
                        <div class="header ${headerClassName}">
						${title}<div class="row"> ${headerContent}</div>
                          </div>
                        <div class="body fullHeight row clearfix">
                            ${bodyContent}
                        </div>
                    </div>
		</div>
</div>`
			}
		}catch(err){
			console.log(err);
		}
	}
	
	refreshFullHeight(){
		$(".fullHeight").each(function(){
			let h=window["screen"]["availHeight"] ;
			
			$(this).css({height:h})
		})
	}
	
	appendContent(opt={}){
		const{id="", headerClassName="", bodyContent="", headerContent=""}=opt
	$("section.content").append(this.defSklt({id:id, headerContent:headerContent, headerClassName:headerClassName, bodyContent:bodyContent}))	
	setTimeout(()=>{this.refreshFullHeight()},100)
	lucide.createIcons();
	feather.replace()
	}
	
	setLoadingState(){
		$("section.content").addClass('collapse')
		$(".page-loader-wrapper").addClass("fullHeight")
		setTimeout(()=>{this.refreshFullHeight()},100)
		}
	
	setNormalState(){
		$("section.content").removeClass('collapse')
		$(".page-loader-wrapper").removeClass("fullHeight")
		$(".page-loader-wrapper").addClass("collapse")
		
	}
	
	satellitesSetup(){
		let ar=[
		{label:"D",action:"a4", className:"bg-orange"},
		{label:"C",action:"a3", className:"bg-green"},
		{label:"B",action:"a2", className:"bg-blue"},
		{label:"A",action:"a1", className:"bg-red"},
		]
		function s(l,a, c){
			return `<a href="javascript:void(0);" data-action="${a}" class="${c}">${l}</a>`
		}
		let i=0
		$(".satellite").each(function(){
			 $(this).html(s(ar[i]['label'],ar[i]['action'],ar[i]['className']))
			 $(this).addClass(ar[i]['className'])
			 i++
		})
	}


}