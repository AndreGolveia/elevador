var Elevador = function(){

	var t = this;
	this.$elevador;
	this.movimento = false;
	this.fila = [];
	const music = new Audio('./sound/music.mp3');

	this.abrirPortas = function(callback){
		music.pause()
		var portas = this.$elevador.find(".porta");

		if(portas.hasClass("open")){
			
			callback();

		}else{

			portas.addClass("open");
		
			setTimeout(callback, 1000);

		}

	};

	this.fecharPortas = function(callback){
	
		var portas = this.$elevador.find(".porta");

		if(portas.hasClass("open")){

			portas.removeClass("open");

			setTimeout(callback, 1000);

		}else{

			callback();

		}		

	};

	this.mostrarAndar = function(numero){
		if(numero == '1'){
			var texto = 'T'
		}else if(numero == '2'){
			var texto = '1'
		}else if(numero == '3'){
			var texto = '2'
		}else if(numero == '4'){
			var texto = '3'
		}

		this.$elevador.find(".letreiro").text(texto);

	};

	this.irParaAndar = function(numero){
		music.play()
		if(!t.movimento){
			t.fecharPortas(function(){

				t.movimento = true;

				var andarAtual = t.andarAtual();

				var diferenca = andarAtual-numero;
				if(diferenca<0) diferenca *= -1;

				var tempo = diferenca * 2;
				var elevador = t.$elevador.find(".elevador");

				elevador.removeClass("andar1 andar2 andar3 andar4");
				elevador.addClass("andar"+numero);
				elevador.data("andar", numero);
				elevador.css("-webkit-transition-duration",tempo+"s");

				var andares = [];

				if(andarAtual < numero){

					for(var x = andarAtual; x <= numero; x++){ 
						andares.push(x);
					}

				}else{

					for(var x = andarAtual; x >= numero; x--){
						andares.push(x);
					}
				}

				var vez = 0;
				t.intervalMostraAndar = setInterval(function(){

					vez++;

					var andar = andares[vez];

					t.mostrarAndar(andar);

				}, 2000);

				setTimeout(function(){

					clearInterval(t.intervalMostraAndar);
					t.intervalMostraAndar = undefined;

					t.abrirPortas(function(){

						if(t.fila.length){

							var primeiro = t.fila.shift();
							t.irParaAndar(primeiro);

						}

					});

					t.movimento = false;

				}, (tempo*1000)+50);

			});

		}else{

			t.fila.push(numero);

		}

	};

	this.andarAtual = function(){

		return this.$elevador.find(".elevador").data("andar");

	};

	var init = function(){

		var html = $("#view-elevador").html();

		var template = Handlebars.compile(html);
		var data = {};

		t.$elevador = $(template(data));

		t.$elevador.find(".botao").on("click", function(){

			var andar = $(this).data("andar");

			t.irParaAndar(andar);

		});

		$("body").append(t.$elevador);

	};

	init();

};

$(function(){

	window.e1 = new Elevador();

});