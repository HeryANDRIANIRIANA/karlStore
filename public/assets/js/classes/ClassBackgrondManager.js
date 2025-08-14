class ClassBackgroundManager{
	constructor(){
		this.selector="#forBackground";
		this.imageSrc=[
		''
		];
		this.currentImageIndex=0;
	}
	
	addImage(){
		 $('body').css({ 
		 'background-image': 'url("images/fond (1).jpg")',
		 'background-position': 'center',
		 'background-size': '150%'});
	}
	
	// changement de video
	changeVideo(){
		// $("#mp4Source").src="images/videos (2).mp4";
		// $("#background-video").load();
		// $("#background-video").play();
		let i=this.getRandomIntInclusive(1, 2)
		let s=`<video autoplay muted loop playsinline id="background-video"> <source id="mp4Source" src="images/videos (${i}).mp4" type="video/mp4"> Votre navigateur ne supporte pas les vidéos. </video>`
		// let s1=`<video autoplay muted loop playsinline id="backgroundVideo1"> <source id="mp4Source" src="images/videos (1).mp4" type="video/mp4"> Votre navigateur ne supporte pas les vidéos. </video>`
		$("#forBackground").html(s);
		// $("#mask").html(s1);
		
	}
	
	getRandomIntInclusive(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min; // Le maximum est inclus et le minimum est inclus
	}

	
}