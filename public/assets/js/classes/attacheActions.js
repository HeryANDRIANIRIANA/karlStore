(function($){
    $.attachGlobalActions = function(actions = {}) {
        $(document).on('click', '[data-action]', function(e) {
            e.preventDefault();
            var actionName = $(this).data('action');

            if (actions[actionName] && typeof actions[actionName] === 'function') {
                actions[actionName].call(this, e); // `this` = élément cliqué
            } 
			else {
                // console.warn(`Action "${actionName}" non définie.`);
            }
        });
    };
    
    $.attacheKeyUpActions=function(actions={}){
        $(document).on('keyup','[data-keyupaction]',function(e){
                e.preventDefault();
                let actionName=$(this).data('keyupaction');
                if(actions[actionName] && typeof actions[actionName]==='function'){
                    actions[actionName].call(this,e)
                }
        })
    }
    
})(jQuery);


$.attachGlobalActions({
    openChequeMatierEditPannel: async function(){
        try{
            function initDefaultVar(){
                window["arSelectedArticle"]=[];
                
                window["pass"]=0;
                // window["newChequeMatiereSerie"]={}
                window["newChequeMatiereSerie"]["Demandeur"]=""
                // setUpChqMSeriePannel
            }
            function tooltipContent(){
            let myCMPannel=new ClassChequeMatiereEditPannel();
            let sklt=myCMPannel.getSkltChequeMatiereAssistance()
            let c2=`<div>
            <div class="header">Nouveau Cheque Matiere</div>
            <div class="body">${sklt} </div>
            </div>`
              return c2
          }
          
          if(!$(this).hasClass("tooltipstered")){
              $(this).tooltipster({
                  trigger: 'click',
                  contentAsHTML: true,
                  interactive: true,
                  content:tooltipContent(),
                  functionBefore: function(instance, helper) {
                    // Fermer tous les autres tooltips sauf celui cliqué
                    $('.tooltip').not(helper.origin).each(function () {
                      if ($(this).hasClass('tooltipster-show')) {
                        $(this).tooltipster('close');
                      }
                    });
                    return true; // continuer à ouvrir le tooltip
                  },
                  
                  functionReady:function(instance,helper){
                      // console.log(arguments);
                       let myCMPannel=new ClassChequeMatiereEditPannel();
                       // console.log(window["newChequeMatiereSerie"]);
                       initDefaultVar();
                    myCMPannel.initAssistanceChqM2()
                   /*  $(document).off().on('keyup',$("#select-paramW"),(e)=>{
                        switch(e.key){
                            case "Enter":
                            if(e.ctrlKey===true && window["newChequeMatiereSerie"]["Demandeur"]!==""){
                                window["curentOperation"]="newChqMSerie";
                                instance.close()
                                $(document).off()
                            }
                            
                            break;
                        }
                        // console.log(e.key,e.ctrlKey);
                    })
                */
                    
                    // console.log(instance,helper);
                    // $('.tooltip-content').on('keydown',function(e) {
                        // console.log(e);
                    // })
                    }
                
                });
          }
        
        }catch(err){
            console.log(err);
        }
    
        /* window["myDb1"].slideToggleFromAnyWhere()
        let cible="nav.navbar";
        let id="myChequeMatPannel";
		if($("#"+id).length===0){
            $('<div>', {
            id:id,
            class: '',
            text: ''
            }).appendTo(cible);
        }
       window[id]=new ClassChequeMatiereEditPannel("#"+id, {pplIcon:"tool"})
       window[id].setState("loading");
       // console.log($(this).data('action'));
       // setTimeout(async()=>{
           await window[id].init({productId:$(this).data('productid'),NumChqMSerie:$(this).data('numchqmserie')});
       // },10)
       $('html, body').animate({ scrollTop: $('#'+id).offset().top}, 100);
       window[id].setState("normal");
       window[id].slideToggleFromAnyWhere() */
	},
    sayHello: function() {
        console.log("Bonjour depuis un élément externe !");
    },
    detailCommandeLineSelected: async function(e){
        // $(this).focus()    
        // let a=$(this).children("td.icon-col a
        let a=$(this).find('td.icon-col a');
        let td=$(this).find('td.icon-col');
      if($(this).data('ischequerm')!=="Non"){
          // console.log($(this).data());
          let ProductId= $(this).data('productid')
          // console.log(window["chequeMatiereByProductIdData"]);
          // console.log(ProductId);
          // console.log(window["calendar"].getEvents());
          window["myCalendar"].highlightEvent(ProductId);
           // $(a).TrefleButton();
           // let aSelector='btnTrefle-'+$(this).data('productid')
           let aSelector='btnTrefle-'+$(this).data('productid')
           $(a).attr('id',aSelector);
           $(a).attr('data-productid',$(this).data('productid'));
           
           window[aSelector]=new ClassTrefleButton('#'+aSelector)
           await window[aSelector].checkData();
           
           // $(this).off();
      }
      else{
          $(this).attr('tabindex',0)
       // .focus()
       .off('keydown')
       .on('keydown',function(e1){
           switch(e1.key){
               case 't':
               let a=$(this).find('td.icon-col a');
               $(a).trigger('click');
               break;
           }
       })
      }
      
    },
    canceldsp:function(){
        let mydsp=new ClassDemandeSpecial();
        mydsp.destroyPannel();
    } ,
    /* performed when select article for a DSP or a cheqM */
    stocklineselected:async function(e){
        // console.log(e);
        // console.log($(this).data());
        function setQteDemPannel(){
            return `<input type="text" id="qtedem" placeholder="Quantité demandé">`
        }
        if(!$(this).hasClass('tooltipstered')){
            $(this).tooltipster({
                  trigger: 'click',
                  content: setQteDemPannel() ,
                  contentAsHTML: true,
                  interactive: true,
                  functionBefore: function(instance, helper) {
                      // console.log($(helper.origin).data());
                        $('.tooltip').not(helper.origin).each(function () {
                          if ($(this).hasClass('tooltipster-show')) {
                            $(this).tooltipster('close');
                          }
                        });
                        if(helper.event===null||helper.event.ctrlKey===false){
                            return false;
                        }else{
                            return true
                        }
                        
                        return ; // continuer à ouvrir le tooltip
                    },
                 functionReady:function(instance,helper){
                     // console.log(instance);
                     // let h=helper;
                     $("#qtedem").focus();
                     $("#qtedem").on('keyup',function(e){
                         let $o=$(this);
                         $o.removeClass('inError')
                         function check(){
                             if(isNaN($o.val()) && $o.val()!==""){
                             $o.addClass('inError')
                             $o.val('numeric requis')
                             }else{
                                 let d=window["stockSelectedData"];
                                //QteDS utilisé automatiquement lors de la DSP
                                // QteDem utilisé automatiquement mors de newChqMSerie
                                 d["QteDS"]=parseInt($o.val())
                                 d["QteDem"]=parseInt($o.val())
                                 let cArtSel=new ArticleSelected();
                                 cArtSel.refreshData(d);
                                 instance.close()
                             }
                             
                         }
                         // console.log(e.key);
                         switch(e.key){
                             case "Enter": check();
                             break;
                             case "Escape":instance.close();
                             break;
                         }
                     })
                 }
                        
					});
        }else{
           $(this).tooltipster('open'); 
        }
        // $(this).tooltipster('open');
        // console.log($(this).data());
    },

/* deleteArticleSelected:
@dep: window["t"], DataTable selectedArticles */
    deleteArticleSelected:function(){
        // console.log();
        let d=window["t"].$('tr.selected').data()
        let myArtSel=new ArticleSelected();
        let arSelectedArticle=myArtSel.deleteData(d);
        console.log(arSelectedArticle);
        $('#article-panel-container').articleSelectedPannel("setData",arSelectedArticle,{unhidedCols:[0,1,8], bWithIconCol:true, iconConf:{iconName:"delete",iconAction:"deleteArticleSelected", iconClass:"feather-icon-red"}});
    },

/* articlePannelAction:
@desc: on selectionArticlePannel, need to set focus to activate keyup event 
@dep:window["myDb1"] - DetailCommandeInDropdown
*/
    articlePannelAction:function(){
        window["myDb1"].closeFromAnyWhere()
        // console.log(this);
        // $(this).focus()
    },
	
	a1:function(){
		// console.log($(this));
		 $('html, body').animate({ scrollTop: $('#p1').offset().top}, 100);
	},
	a2:function(){
		// console.log($(this));
		 $('html, body').animate({ scrollTop: $('#p2').offset().top}, 100);
	},
	a3:function(){
		// console.log($(this));
		 $('html, body').animate({ scrollTop: $('#p3').offset().top}, 100);
	},
	a4:function(){
		// console.log($(this));
		 $('html, body').animate({ scrollTop: $('#editArticlePannel').offset().top}, 100);
         
         window["articles"].setupEditArticlePannel()
	},
	saveArticle:async function(){
        // TODO: pbSetup befor save
       function beforeSaveArticle(o){
           let $p=$(o).parent().parent().parent().parent().parent().parent();
           // console.log($p.children().eq(0).attr('class'));
           for(let i=0; i<=1; i++){
               $p.children().eq(i).toggleClass('collapse')
           }
           // console.log(window["newArticle"]);
           // console.log(window["articleData"]);
       }
       
       beforeSaveArticle(this)
       let o=window["newArticle"]
       let ar=[]
       ar.push(o)
       window["newArticle"]=ar
      
        await window["articles"].save()
         setTimeout(()=>{
             window["articles"].resetEditArticlePannel()
         },2000)
    }
	
    
});


$.attacheKeyUpActions({
    /**closeTooltypPreNewChqm:
    @descr:fermer le tooltyp via esc ou ctrl+enter
    @dep:window["newChequeMatiereSerie"],$().articleSelectedPannel()
    @param: 
    **/
    closeTooltypPreNewChqm:function(){
        let e=arguments[0]
        
        //fermer tout les tooltips
        function closeAlltooltyp(){
            $('.tooltip').each(function () {
                      if ($(this).hasClass('tooltipster-show')) {
                        $(this).tooltipster('close');
                      }
                    });
        }
        
        //setup pannel for selected articles
        function setPannel(){
                $('#article-panel-container').articleSelectedPannel({curentOperation:'newChqMSerie'});
                $('#article-panel-container').articleSelectedPannel("init");
        }
        
        switch(e.key){
            case "Escape":
            closeAlltooltyp()
            break;
            case "Enter":
            if(e.ctrlKey===true){
                if(window["newChequeMatiereSerie"]["Demandeur"]!==undefined && window["newChequeMatiereSerie"]["Demandeur"]!==""){
                    closeAlltooltyp();
                    setPannel();
                }else{
                    showNotification({text:"selectionnez un Demandeur",colorName:'bg-red', timer:1000})
                }
            }
            break;
        }
    
    },
    
    /**selectedArticleKeyupEvent:
    @desc:detruire l'interfaace de selection d'article
    @dep:window["curentOperation"],window["arSelectedArticle"], window["newChequeMatiereSerie"], window["travauxSelectedData"]
    
    **/
    selectedArticleKeyupEvent:function(){
        let e=arguments[0]
        // console.log(e);
        function cancel(){
            $('#article-panel-container').articleSelectedPannel("destroy");
        }
                
        function save(){
            if(typeof window["arSelectedArticle"]==="array" && window["arSelectedArticle"].length>0){
            showNotification({text:`saving ${window["curentOperation"]}`, colorName:'bg-orange', timer:1000})
            $('#article-panel-container').articleSelectedPannel("destroy");    
            }else{
            showNotification({text:`arSelectedArticle`, colorName:'bg-red', timer:1000})
            }
            
        }
        
        switch(e.key){
            case "Escape":
            cancel();
            break;
            case "F8":
            let myChqmEditPannel=new ClassChequeMatiereEditPannel()
            myChqmEditPannel.beforSave()
            break;
        }
        
    },
    
    /*  */
    checkIfAvailableNumChqmSerie:async function(){
        try{
            let e=arguments[0];
            let $this=e.currentTarget;
            
            $($this).removeClass('bg-red');
            
            switch(e.key){
                case"Enter":
                let myChqmEditPannel=new ClassChequeMatiereEditPannel()
                let b=await myChqmEditPannel.checkIfAvailableNumChqmSerieThenSave($(e.currentTarget).val())
                if(b===false){
                    $($this).addClass('bg-red')
                }
                break;
            }
        
        }catch(err){
            console.log(err);
        }
    }
    
})