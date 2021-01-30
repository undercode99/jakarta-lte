/**
 * Dropdown
 */
$(function () {
  const $dropdownClass = $(".dropdown-toggle");
  const $dropdownData = "dropdown";
  $dropdownClass.on("click", function (e) {
    e.preventDefault();
    const dropdownId = $(this).data($dropdownData);
    $("#" + dropdownId).toggle();
    $dropdownClass.each(function () {
      const all_dropdown = $(this).data($dropdownData);
      if (all_dropdown === dropdownId) {
        return;
      }
      $("#" + all_dropdown).hide();
    });
  });
  $(document).on("click", function (e) {
    e.stopPropagation();
    if ($dropdownClass.has(e.target).length === 0) {
      $dropdownClass.each(function () {
        const dropdownId = $(this).data($dropdownData);
        $("#" + dropdownId).hide();
      });
    }
  });
  $(document).on("keyup", function (e) {
    const key = e.key;
    if (key === "Escape" || key === "Esc" || key === 27) {
      $dropdownClass.each(function () {
        const dropdownId = $(this).data($dropdownData);
        $("#" + dropdownId).hide();
      });
    }
  });
});
