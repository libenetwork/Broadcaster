
/*
Popr 1.0
Copyright (c) 2015 Tipue
popr is released under the MIT License
http://www.tipue.com/popr
*/


(function($) {

     $.fn.popr = function(options) {
     
          var set = $.extend( {
               
               'speed'        : 50,
               'mode'         : 'bottom'
          
          }, options);

          return this.each(function() {
          
               var popr_cont = '.popr_container_' + set.mode;
               var popr_show = true;

               $(this).click(function(event)
               {
                    $('.popr_container_top').remove();
                    $('.popr_container_bottom').remove();
                    
                    if (popr_show)
                    {
                         event.stopPropagation();
                         popr_show = false;
                    }
                    else
                    {
                         popr_show = true;
                    }                   
                    
                    var d_m = set.mode;
                    if ($(this).attr('data-mode'))
                    {
                         d_m = $(this).attr('data-mode')
                         popr_cont = '.popr_container_' + d_m;   
                    }
                    
                    var out = '<div class="popr_container_' + d_m + '"><div class="popr_point_' + d_m + '"><div class="popr_content">' + $('div[data-box-id="' + $(this).attr('data-id') + '"]').html() + '</div></div></div>';

                    $(this).append(out);
                    $(popr_cont).css("width", ($(this).width() + 25) + "px");

                    var w_t = $(popr_cont).outerWidth();
                    var w_e = $(this).width();
                    var m_l = (w_e / 2) - (w_t /2) ;

               
                    $(popr_cont).css('margin-left', m_l + 'px');
                    $(this).removeAttr('title alt');

                         var w_h = document.getElementsByClassName("preferences_sufix")[0].getBoundingClientRect().bottom + 8 ;
                         $(popr_cont).css('top', w_h + 'px');
                         var w = window.innerHeight - w_h - 10;
                         document.getElementsByClassName("popr_content")[0].style.maxHeight =  w + 'px';
                    document.getElementsByClassName("popr_content")[0].classList.add("no-scrollbar");
                    let elem = document.getElementsByClassName("popr_content")[0];
                    (function(timer) {


                         elem.addEventListener('scroll', function(e) {

                              elem.classList.remove('no-scrollbar');
                              elem.classList.add('scrollbar');

                              clearTimeout(timer);
                              timer = setTimeout(function() {
                                   elem.classList.add('no-scrollbar');
                                   elem.classList.remove('scrollbar');
                              }, 100);

                         })

                    })();


               let click = document.getElementsByClassName("popr_content")[0].children;
               console.log(click);
               for (let i = 0; i < click.length; i++){
                    console.log(i);
                 
                    click[i].addEventListener("click", (e) => {
                    try{
                         add_source(i)}
                         catch{
                              add_server(i);
                         }
                    });
                 
               }


                    $(popr_cont).fadeIn(set.speed);   
               });
                            
               $('html').click(function()
               {
                    $('.popr_container_top').remove();
                    $('.popr_container_bottom').remove();
                    popr_show = true;
               });                           
          });
     };
     
})(jQuery);
