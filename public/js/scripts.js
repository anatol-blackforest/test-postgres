(function ($) {
    'use strict';


    var tagRemover = function (string) {
        return string.replace(/(<([^>]+)>)/ig,"");
    }

    jQuery(document).ready(function () {

        const socket = io.connect('http://localhost:3000');
        socket.emit('loaded')

        socket.on('message', function(result){

            console.log("DERNULI")
            console.log(result)

        var html = ""

        result.forEach((item, i) => {
            html += `<div class="col-md-12 blog-post">
                <div class="post-title">
                    <h1>${i+1}. ${tagRemover(item.product_name)}</h1>

                    <p>Цена: ${item.price}</p>
                    <p>Ссылка: <a href="${item.link}" target="_blank">${item.link}</p>
                 
                </div>  
            </div>`
        })

        $('#bloglist').html(html)

        })

        
       /* Preloader */
		
        $(window).load(function () {
            $('.preloader').delay(800).fadeOut('slow');
         });
		 		
		
       /* Smooth Scroll */

        $('a.smoth-scroll').on("click", function (e) {
            var anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $(anchor.attr('href')).offset().top - 50
            }, 1000);
            e.preventDefault();
        });
		
        let activePage = 0
        
        $(window).on('click', function(e){
            if (e.target.nodeName === "A" && e.target.id !== "load-more-post"){
                activePage = 0
            }
            if (e.target.nodeName === "A"){
                $('#addform input[type="text"], #addform textarea').each(function(){
                    $(this).css('border','2px solid transparent');//Сделаем бордер серым
                });    
            }
        })
		
       /* Scroll To Top */
		
        $(window).scroll(function(){
        if ($(this).scrollTop() >= 500) {
            $('.scroll-to-top').fadeIn();
         } else {
            $('.scroll-to-top').fadeOut();
         }
         });
	
	
        $('.scroll-to-top').click(function(){
          $('html, body').animate({scrollTop : 0},800);
          return false;
          });
		  
		  
		  
       /* Tooltip */
	   
        $('[data-toggle="tooltip"]').tooltip();



       /* Popover */
	   
        $('[data-toggle="popover"]').popover();		  
		  
		  
	   
       /* Ajaxchimp for Subscribe Form */
		
        $('#mc-form').ajaxChimp();
        
        $('#addpost').click(function(e) {
            e.preventDefault()
            $('#addformblock').toggle()
            $(this).text($(this).text() == '+ Добавить покупку' ? '- Добавить покупку' : '+ Добавить покупку');
        })
        
        // CRUD

        $( document ).ready(function() {

            //добавление поста
            $("#form").submit(
                function(e){
                    e.preventDefault()
                    var trigger = true
                    $('#form input[type="text"], #form textarea').each(function(){
                        if(!$(this).val() || $(this).val() == ''){
                           $(this).css('border-color','red');//Сделаем бордер красным
                           trigger = false
                        }
                    });
                    
                    if (trigger) { 
                        $.ajax({
                            url:     "/", //url страницы 
                            type:     "POST", //метод отправки
                            dataType: "html", //формат данных
                            data: $("#form").serialize(),  // Сериализуем объект
                            success: function(response) { //Данные отправлены успешно
                                var result = $.parseJSON(response);
                                $('#hint').html(result.Message)

                                $("#form").trigger('reset')
                                $("#load-more-post").hide()
                            },
                            error: function() { // Данные не отправлены
                                $('#bloglist').html('Ошибка. Данные не отправлены.');
                            }
                        });

                    }
                }
            );


            $("#bloglist").click(function(e){
                e.preventDefault()

                if(e.target.classList.contains("editoggle")){
                    $(e.target).closest(".post-title").children(".editform").toggle() 
                    $("#postblock").toggle()
                }

                //редактирование поста
                if (e.target.className === "edit"){
                    var form = $(e.target).closest(".editform")
                    console.log("form")
                    console.log(form.serialize())
                    $.ajax({
                        type: "PUT",
                        url: `/${e.target.dataset.id}`, 
                        dataType: "html", //формат данных
                        data: form.serialize(),  // Сериализуем объект
                        success: function(response){

                            var result = $.parseJSON(response);
                            $('#addformblock').hide()
                            $('#hint').html(result.Message)
                            $("#load-more-post").hide()
                        }
                    });
                }
                 
                //удаление поста
                if(e.target.className === "delete"){
                    console.log(e.target.className )
                    var htmlPost = ""
                    var htmlCats = ""
                    var id = e.target.dataset.id
                    $.ajax({
                        type: "DELETE",
                        url: `/${id}`, 
                        success: function(result){
                            console.log(result)
                       
                             $('#hint').html(result.Message)
                            $("#load-more-post").hide()
                        }
                    });
                } 

            });

        });

	  
		   
    });

   })(jQuery);