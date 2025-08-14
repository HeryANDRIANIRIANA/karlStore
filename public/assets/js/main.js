// chargement pple
$(
()=>{
	
	window["pm"].setLoadingState()
	for (let key in window["pannels"]) {
		window["pm"].appendContent(window["pannels"][key])
    // console.log(key, obj[key]); // Affiche les clés et leurs valeurs
	}
	
	// window["pm"].appendContent()
	setTimeout(async()=>{
		await window["myMouvementStock"].getData()
		oMouvementStock.data=window["mouvementStockData"]
		
		await window["articles"].getData();
		// console.log(window["articleData"]);
		oArticle.data=window["articleData"]
		window["tm"].setData(oArticle)
		// window["articles"].setupEditArticlePannel()
		await window["articles"].arrageByCodeArticle2();
		
		setTimeout(()=>{window["pm"].setNormalState()},3000)
	},500)
	
	$("#menu a").TrefleButton()
	
	window["pm"].satellitesSetup()
}
)