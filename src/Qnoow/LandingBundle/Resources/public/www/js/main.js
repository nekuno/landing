!function(n){function i(i){var t=n(i.target).parent(".navigation-item");v.find(".active").removeClass("active"),t.addClass("active")}function t(){h&&window.clearTimeout(h),h=window.setTimeout(function(){w()||window.mySwipe?w()&&window.mySwipe&&(window.mySwipe.kill(),window.mySwipe=null,n(".slider-dots .slider-dot").off("click")):(window.mySwipe=new Swipe(document.getElementById("slider"),{startSlide:0,speed:400,auto:3e3,continuous:!0,disableScroll:!1,stopPropagation:!1,callback:e}),n(".slider-dots .slider-dot").on("click",o))},500)}function e(i){var t=n(".slider-dots .slider-dot");t.closest(".active").removeClass("active"),t.eq(i).addClass("active")}function o(i){var t=n(i.target).data("index");window.mySwipe.slide(t)}function a(){var i=n("#menu").hasClass("scrolled"),t=n(window).scrollTop();i&&t<50?c():!i&&t>=50&&r()}function r(){n("#menu").addClass("scrolled")}function c(){n("#menu").removeClass("scrolled")}function l(){var i=n(".scrollable-section").length;!b&&i&&w()&&(b=!0,n("body .container").sectionScroll({easing:"easeInOutQuart"}))}function s(i){var t=n("#"+i+"-box");t.find("form").on("submit",function(e){e.preventDefault();n.ajax(n(this).attr("action"),{accepts:{json:"application/json"},dataType:"json",data:n(this).serialize(),type:"POST",beforeSend:function(){t.find("form").hide(400),t.find("form").after('<img src="/bundles/qnoowapp/images/712.GIF" width="50" height="50" style="margin-left: 90px;">'),t.find(".alert-box").text("")},complete:function(){t.find("form").show(400),window.setTimeout(d,400)},success:function(n){var e=n.message||"";t.find(".alert-box").text(e),"login"==i?(window.location=window.location.pathname.replace(/\/[^\/]+$/,"/"),t.find("form").remove()):t.find("form").siblings("img").first().remove()},error:function(n){t.find("form").siblings("img").first().remove();var i=n.responseJSON.message||"";t.find(".alert-box").text(i)}})})}function d(){var i=n("#invitation-box, #login-box");i.height("auto");var t=Math.max(n("#invitation-box").height(),n("#login-box").height());i.height(t)}function f(i,t){var e=Math.round((new Date).getTime()/1e3),o=i+Math.round((e-t)/100);n(".internet-users-number").text(u(o))}function u(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function m(){var i=n(window).scrollTop();n(".for-you-background").css("top",.35*i+"px")}function w(){return"block"==n("#navigation").css("display")}function g(){return window.location.pathname.match(/$/)}var p={toggle:"#hamburger",animation_duration:"0.5s",place:"right",animation_curve:"cubic-bezier(0.54, 0.01, 0.57, 1.03)",body_slide:!0,no_scroll:!0},v=n("#navigation-mobile");if(v.sliiide(p),v.find(".navigation-item h4").on("click",i),g()){var h=null;t(),n(window).on("resize",t)}if(window.setInterval(a,500),g()){var b=!1;l(),n(window).on("resize",l)}if(n.ajax("//brain.nekuno.com/client/blog-feed",{accepts:{xml:"application/rss+xml"},dataType:"xml",success:function(i){var t=n("#blog-posts").find("article");n(i).find("item").each(function(i){if(i>2)return!1;var e=n(this);return t.eq(i).attr("onclick",'window.location = "'+e.find("link").text()+'"'),t.eq(i).find("header h3").html(e.find("title").text()),t.eq(i).find("header figure figcaption").html(e.find("category").eq(0).text()||"Sin categoría"),t.eq(i).find("header figure img").attr("src",e.find("image").text()||"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="),t.eq(i).find("time").html(e.find("pubDate").text()),t.eq(i).find("p").replaceWith(e.find("description").text()),t.eq(i).find(".comments-number").html(e.find("slash:comments").text()||0),!0})},error:function(n,i,t){}}),n(".close-login-form").one("click",function(){n(".login-fixed-container").removeClass("active"),n(".container").animate({opacity:1},400)}),n(".facebook-register-button button").on("click",function(){window.location="https://m.nekuno.com/#/?autoLogin=1"}),n("a.request-invitation").on("click",function(){var i=n(".login-button a")[0];i.click(),window.setTimeout(function(){n(".login-fixed-container").is(":hidden")&&i.click()},400)}),s("invitation"),s("login"),d(),n(".apple-store-link").on("click",function(i){i.preventDefault();var t=n("#apple-store-notice");t.addClass("active"),n(".container").animate({opacity:.3},400),t.find(".close").one("click",function(){t.removeClass("active"),n(".container").animate({opacity:1},400)})}),function(){return window.location.pathname.match(/\/about-us$/)}()){var x=n("#changing-words"),k=1,y=x.find(".changing-word-"+k).text(),A=n(".changing-word");setInterval(function(){(y=x.find(".changing-word-"+(k+1)).text())?k++:(k=1,y=x.find(".changing-word-"+k).text()),A.text(y)},500)}f(3376668,1464264268),setInterval(function(){f(3376668,1464264268)},1e5),Date.now||(Date.now=function(){return(new Date).getTime()}),g()&&n(window).on("scroll",m)}(jQuery);