class ClassMois{
	constructor(options={}){
		const{
			moisEnString=""
		}=options;
		let m=new Date();
		let m0=1+m.getMonth();
		let m2=""+m0;
		m2=m2.padStart(2,"0");
		let m1=m.getFullYear();
		this.moisEnString=(moisEnString=="")?m2+"-"+m1:moisEnString;
		return this.moisEnString;
	}
	async getMoisInfo(){
		try{
			let url='/getMoisInfos';
			let data={mois:window.mois};
			let r=await axios.post(url,data);
			if (r.data.length==0){
				alert('table MOIS2 OUT OF DATE')
			}
			return r;
		}catch(err){
			console.log(err)
		}
	}
	/**
	définit le mois dans la variable global Window.mois
	et la suite comme récupérer l'état de paiememnt le mois définit ou qqchose du genre.
	@param:v-string valeur du mois en format "mm-yyyy"
	*/
	setMois(){
		let mc=prompt("Mois courent utilisé?", this.moisEnString)
		window.mois=(mc==null)?this.moisEnString:mc;
		window.systemMenu[0].text=window.mois;
		// refresh treeview
			let tv0=new ClassTreeView();
			tv0.d0=systemMenu;
			tv0.init();
			//possibilité de continuer ici si des données dépende du mois
	}
	
	// définit la date courant
	/* d au format "dd-mm-yyyy" */
	setDay(options={}){
		const{d=""}=options;
		let dt=new Date();
		let d1=dt.getDate();
		let s1=d1.toString().padStart(2,"0");
		let m1=dt.getMonth()+1;
		let s2=m1.toString().padStart(2,"0");
		let y1=dt.getFullYear();
		let d2=s1+"-"+s2+"-"+y1.toString();
		
		// console.log(d2);
		window.day=(d!="")?d:d2 ;
		window.systemMenu[0].text=window.day;
			window.tv0=new ClassTreeView();
			tv0.d0=systemMenu;
			tv0.init();
		return d2;
	}
	
	changeDay(){
		let dc=prompt("Jours courent utilisé?", window.day);
		this.setDay({d:dc});
	}
	
}