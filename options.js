const OptionManager = {
     render: function (options, onClick) {
          $(".option-box").each(function (i) {
               $(this).show().text(options[i]).off('click').on('click', () => {
                    onClick(i);
               });
          });
     },

     hideAll: function () {
          $(".option-box").hide();
     }
};
