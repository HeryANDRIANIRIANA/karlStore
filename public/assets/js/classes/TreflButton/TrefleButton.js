(function($) {
  $.fn.TrefleButton = function(options) {
    const settings = $.extend({
      mainClass: 'btn-trefle',
      satelliteClass: 'satellite',
      count: 4
    }, options);

    return this.each(function() {
      const $btn = $(this);

      if (!$btn.hasClass(settings.mainClass)) {
        $btn.addClass(settings.mainClass);
        $btn.addClass('rotating');
		$btn.html(`<span><i data-feather="plus"></i></span>`);
		feather.replace();
      }

      // Créer le wrapper
      const $wrapper = $('<div class="trefle-button-wrapper"></div>');
      $btn.wrap($wrapper);

      // Ajouter les satellites
      for (let i = 1; i <= settings.count; i++) {
        const $satellite = $('<div>')
          .addClass(`${settings.satelliteClass} ${settings.satelliteClass}-${i}`);
        $btn.parent().append($satellite);
      }

      // Gestion du clic sur le bouton principal
      $btn.on('click', function(e) {
		  
		  const $icon = $btn.find('span');
		  $btn.addClass('rotating');

		  // Supprimer la classe après l'animation (0.8s ici)
		  setTimeout(() => {
			$btn.removeClass('rotating');
		  }, 800);
        // e.preventDefault();
        // $btn.parent().toggleClass('open');
		  e.preventDefault();
		  const $wrapper = $btn.parent();
		  // Fermer tous les autres wrappers
		  $('.trefle-button-wrapper').not($wrapper).removeClass('open');
		  // Toggle le bouton courant
		  $wrapper.toggleClass('open');
		
      });
    });
  };
})(jQuery);
