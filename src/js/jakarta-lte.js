/**
 * Dropdown
 */
$(function () {
  var $dropdownClass = $(".dropdown-toggle");
  var $dropdownData = "dropdown";
  $dropdownClass.on("click", function (e) {
    e.preventDefault();
    var dropdownId = $(this).data($dropdownData);
    $("#" + dropdownId).toggle();
    $dropdownClass.each(function () {
      var alldropdown = $(this).data($dropdownData);
      if (alldropdown === dropdownId) {
        return;
      }
      $("#" + alldropdown).hide();
    });
  });
  $(document).on("click", function (e) {
    e.stopPropagation();
    if ($dropdownClass.has(e.target).length === 0) {
      $dropdownClass.each(function () {
        var dropdownId = $(this).data($dropdownData);
        $("#" + dropdownId).hide();
      });
    }
  });
  $(document).on("keyup", function (e) {
    var key = e.key;
    if (key === "Escape" || key === "Esc" || key === 27) {
      $dropdownClass.each(function () {
        var dropdownId = $(this).data($dropdownData);
        $("#" + dropdownId).hide();
      });
    }
  });
});
