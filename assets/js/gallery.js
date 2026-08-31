/* ===================================================
   GALLERY.JS — "See More" reveals social links on gallery.html
=================================================== */
document.addEventListener('DOMContentLoaded', function () {
    var seeMoreBtn = document.getElementById('seeMoreBtn');
    var socialBlock = document.getElementById('gallerySocial');

    if (seeMoreBtn && socialBlock) {
        seeMoreBtn.addEventListener('click', function () {
            socialBlock.classList.add('is-visible');
            seeMoreBtn.classList.add('is-hidden');
        });
    }
});
