
/*
Popr 1.0
Copyright (c) 2015 Tipue
popr is released under the MIT License
http://www.tipue.com/popr
*/

function getParents(elem){
     let parents = [];
     let obj = elem;
     while (obj.parentNode !== document.getElementsByTagName("BODY")[0]){
          parents[parents.length] = obj.parentNode;
          obj = obj.parentNode;
     }
     return parents;
}
function hasParents(elem, elem1){
     let parents = [];
     let obj = elem;
     let respons = false;
     try{
     while (obj.parentNode !== document.getElementsByTagName("BODY")[0]){
          parents[parents.length] = obj.parentNode;
          obj = obj.parentNode;
     }
     for (let i = 0; i < parents.length; i++){
          if (parents[i] === elem1){
               respons = true;
          }
     }}
     catch{
          
     }
     return respons;
     
}

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
                    if (!hasParents(event.target, document.getElementById("date_picker"))){
                    
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
                    if ( (event.target.classList.contains("highlight_icon"))){
                         $(popr_cont).css("width", ($(this).width()*21.5+ 25) + "px");
                    }else{
                    $(popr_cont).css("width", ($(this).width() + 25) + "px");
                    }
                    var w_t = $(popr_cont).outerWidth();
             
                    var w_e = $(this).width();

                    var m_l = (w_e / 2) - (w_t /2) ;

               
                    $(popr_cont).css('margin-left', m_l + 'px');
                    $(this).removeAttr('title alt');
                         if (event.target.classList.contains("highlight_icon")){
                              var w_h = event.target.parentNode.parentNode.getBoundingClientRect().bottom + 13 ;

                         }else{
                         var w_h = event.target.getBoundingClientRect().bottom + 8 ;}

                         $(popr_cont).css('top', w_h + 'px');
                         var w = window.innerHeight - w_h - 10;
                         if (event.target.classList.contains("highlight_icon")){
                         }else{
                         document.getElementsByClassName("popr_content")[0].style.maxHeight =  w + 'px';
                         }
                    document.getElementsByClassName("popr_content")[0].classList.add("no-scrollbar");
                    let elem = document.getElementsByClassName("popr_content")[0];
               
let ticking = false;

                    event.target.parentNode.parentNode.parentNode.parentNode.parentNode.addEventListener("scroll", (e) => {
               
                         if (!ticking) {
                              window.requestAnimationFrame(() => {
                                        var w_hs = event.target.parentNode.parentNode.getBoundingClientRect().bottom + 8 ;

                              $(popr_cont).css('top', w_hs + 'px');

                                ticking = false;
                              });
                        
                              ticking = true;}
               });
               try{
               event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.addEventListener("scroll", (e) =>
               {
                    if (!ticking) {
                         window.requestAnimationFrame(() => {
                              if (event.target.classList.contains("highlight_icon")){
                                   var w_hs = event.target.parentNode.parentNode.getBoundingClientRect().bottom + 8 ;
                              }else{
                              var w_hs = event.target.getBoundingClientRect().bottom + 8 ;}

                         $(popr_cont).css('top', w_hs + 'px');

                           ticking = false;
                         });
                   
                         ticking = true;}
               })}catch{

               }
                
               let timer;
                    (function(timer) {


                         elem.addEventListener('scroll', function(e) {

                              elem.classList.remove('no-scrollbar');
                              elem.classList.add('scrollbar');
                              try{
                              clearTimeout(timer);}
                              catch{

                              }
                              timer = setTimeout(function() {
                                   elem.classList.add('no-scrollbar');
                                   elem.classList.remove('scrollbar');
                              }, 100);

                         })
                        
                    })();


               let click = document.getElementsByClassName("popr_content")[0].children;
               console.log(click);
               if (click[0].id === "date_picker"){
                    console.log("date_picker");
               const calendar = document.querySelector("#calendar_main");
                     input = document.querySelector("#date");
                     calMonthTitle = document.querySelector("#calendar_header span");
                    calYearTitle = document.querySelectorAll("#calendar_header span")[1];
                     calDays = document.querySelector("#cal_days");
                     let calendar_input = document.getElementsByClassName("calendar")[0];
                     calendar_input.setAttribute("style", " border: 3px solid #677a93ff !important; width: 40%")
                    datepicker_init(calendar, input, calMonthTitle, calYearTitle, calDays);

               }else{
               
                
               }
               for (let i = 0; i < click.length; i++){
                    console.log(i);
                 
                    click[i].addEventListener("click", (e) => {
                         if (hasParents(e.target, document.getElementById("date_picker"))){}else{
                    try{
                         add_source(i)}
                         catch{
                              add_server(i);
                         }
                    }
                    });
               
               }


                    $(popr_cont).fadeIn(set.speed);   
             }else{
                    console.log("calendar");
             }});
                            
               document.addEventListener("click", (e) =>
               {
                    if (!hasParents(e.target, document.getElementById("date_picker"))){
                    $('.popr_container_top').remove();
                    $('.popr_container_bottom').remove();
                    popr_show = true;
                    if (!calendar_focused){
                    let calendar_input = document.getElementsByClassName("calendar")[0];
                    try{
                         calendar_input.setAttribute("style", " width: 40%")
                    }catch{
                         
                    }
                    }

               }
               });                           
          });
     };
     
})(jQuery);
