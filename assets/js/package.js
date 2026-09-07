/* ===================================================
   PACKAGE.JS — category tab switching on package.html
=================================================== */
document.addEventListener('DOMContentLoaded', function () {
    var tabs = document.querySelectorAll('.category-tab');
    var lists = document.querySelectorAll('.service-list');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            var targetId = tab.getAttribute('data-target');

            tabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');

            lists.forEach(function (list) {
                list.classList.toggle('active', list.id === targetId);
            });

            // Keep the tab in view when scrolled
            tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });
});
