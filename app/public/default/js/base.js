(function($) {
  var app = {
    init: function() {
      this.initSwiper();
      this.initNavSlide();
      this.initColorSelect();
      this.initContentTabs();
      this.addToCart();
    },
    
    addToCart() {
      $("#addCart").click(function() {
        var goods_id = $("#color_list .active").attr("goods_id");
        var color_id = $("#color_list .active").attr("color_id");
        location.href =
          "/addCart?goods_id=" + goods_id + "&color_id=" + color_id;
      });
    },
    initSwiper: function() {
      new Swiper(".swiper-container", {
        loop: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        autoplay: true
      });
    },
    initNavSlide: function() {
      $("#nav_list>li").hover(
        function() {
          $(this)
            .find(".children-list")
            .show();
        },
        function() {
          $(this)
            .find(".children-list")
            .hide();
        }
      );
    },
    initContentTabs: function() {
      $(".detail_info .detail_info_item:first").addClass("active");
      $(".detail_list li:first").addClass("active");
      $(".detail_list li").click(function() {
        var index = $(this).index();
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        $(".detail_info .detail_info_item")
          .removeClass("active")
          .eq(index)
          .addClass("active");
      });
    },
    initColorSelect() {
      var that = this;
      $("#color_list .banben").click(function() {
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        //获取当前商品的id
        var goods_id = $(this).attr("goods_id");
        //当前的颜色值
        var color_id = $(this).attr("color_id");
        $.get(
          "/getImagelist?goods_id=" + goods_id + "&color_id=" + color_id,
          function(response) {
            console.log("res:", response);
            if (response.success) {
              var result = response.result;
              var str = "";
              for (var i = 0; i < result.length; i++) {
                str +=
                  '<div class="swiper-slide"><img style="height: 560px;width: 560px;" src="' +
                  result[i].img_url +
                  '"> </div>';
              }
              console.log("str:", str);
              $("#swiper-wrapper").html(str);
              //改变轮播图以后重新初始化轮播图
              that.initSwiper();
            }
          }
        );
      });
    }
  };

  $(function() {
    app.init();
  });
})($);
