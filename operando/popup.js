(function () {


    var handleClick = function () {
        var abpCtn = document.getElementById("wrapperabp");
        var expandIcon = document.getElementById("expand_abp");
        var apbExpanderBtn = document.getElementById("abp_expand");
        apbExpanderBtn.addEventListener("click", function () {
            abpCtn.classList.toggle('visible');
            expandIcon.classList.toggle('expanded');
        });

        //BUTTONS HANDLERS


        var buttonsHandlers=[{
           elementId:"privacy_issues",
           fragment:"security_issues_tab"
        },
        {
            elementId:"privacy_settings",
            fragment:"privacy_tab"
        },
        {
            elementId:"dashboard",
            fragment:"dashboard_tab"
        },
        {
            elementId:"manage_accounts",
            fragment:"identity_management_tab"
        }
        ];

        buttonsHandlers.forEach(function(element){
            var item = document.getElementById(element.elementId);
            item.addEventListener("click", function(){
                window.open(chrome.runtime.getURL("operando/operando.html#"+element.fragment),"operando");
            })
        });


    }

    function init() {
        handleClick();

        var backgroundPage = ext.backgroundPage.getWindow();
        var require = backgroundPage.require;
        var Prefs = require("prefs").Prefs;

        function updateOperandoStats(element, i18nkey, stats) {
            i18n.setElementText(element, i18nkey, stats);
        }


        var unsecuredFollowedLinksElement = document.getElementById("blocked-links");
        var unsecuredFollowedLinks = Prefs.unsecured_links_followed;

        var unsecuredAcceptedSubmitsElement = document.getElementById("blocked-submits");
        var unsecuredAcceptedSubmits = Prefs.unsecured_submits;

        updateOperandoStats(unsecuredFollowedLinksElement, "blocked_links", [unsecuredFollowedLinks]);
        updateOperandoStats(unsecuredAcceptedSubmitsElement, "blocked_submits", [unsecuredAcceptedSubmits]);



    }

    window.addEventListener("DOMContentLoaded", init, false);

})();