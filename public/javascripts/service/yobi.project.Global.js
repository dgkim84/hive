/**
 * @(#)yobi.project.Global.js 2013.06.21
 *
 * Copyright NHN Corporation.
 * Released under the MIT license
 *
 * http://yobi.dev.naver.com/license
 */
/*
 * 프로젝트 페이지 전역에 영향을 주는 공통모듈
 * projectMenu.scala.html 에서 호출함
 */
(function(ns) {
    var oNS = $yobi.createNamespace(ns);
    oNS.container[oNS.name] = function(htOptions) {
        var htVar = {};
        var htElement = {};

        /**
         * 모듈 초기화
         * initialize
         */
        function _init(htOptions) {
            _initVar(htOptions);
            _initElement();
            _attachEvent();

            // htKeyMap is optional
            if(typeof htOptions.htKeyMap === "object"){
                _initShortcutKey(htOptions.htKeyMap);
            }
        }

        /**
         * 변수 초기화
         * initialize normal variables
         */
        function _initVar(htOptions){
            htVar.sRepoURL = htOptions.sRepoURL;
        }

        /**
         * 엘리먼트 변수 초기화
         * initialize element variables
         */
        function _initElement() {
            htElement.welProjectMenu = $(".project-menu");
            htElement.welPageWrap = $(".project-page-wrap");
            htElement.welProjectHeaherWrap = $('.project-header-wrap');
            htElement.welProjectHeaher = $('.project-header')
            htElement.welBtnWatch   = $(".watchBtn, #btnWatch");
            htElement.welBtnEnroll  = $("#enrollBtn");
            htElement.welBtnMenuToggle = $('#btnMenuToggler');

            htElement.welBtnClone   = $('[data-toggle="cloneURL"]');
            htElement.welInputCloneURL =$('#cloneURL');
            htElement.welBtnCopy   = $('#cloneURLBtn');
            htElement.welForkedFrom = $("#forkedFrom");
            htElement.weBtnHeaderToggle = $('.project-header-toggle-btn');
            // 프로젝트 페이지에서만.
            
            htElement.weSideMenu = $('.project-menu-wrap li a');
        }

        /**
         * 이벤트 핸들러 초기화
         * attach event handlers
         */
        function _attachEvent() {
            htElement.welBtnWatch.on('click',_onClickBtnWatch);
            htElement.welBtnEnroll.on('click',_onClickBtnEnroll);
            htElement.welBtnMenuToggle.on('click', _onClickBtnMenuToggle);
            // 내용은 data-content 속성으로 scala 파일 내에 있음.
            htElement.welForkedFrom.popover({
                "html"   : true
            });

            htElement.welProjectHeaherWrap.on('click.toggle-clone-url','[data-toggle="cloneURL"]',_onClickBtnClone);

            htElement.welBtnCopy.zclip({
                "path": "/assets/javascripts/lib/jquery/ZeroClipboard.swf",
                "copy": htVar.sRepoURL
            });

            htElement.weBtnHeaderToggle.on('click',function(){
                htElement.welProjectHeaher.toggleClass('vertical-large');
            });

        }

        /**
         * Watch 버튼 클릭시 이벤트 핸들러
         * @param {Wrapped Event} weEvt
         */
        function _onClickBtnWatch(weEvt){
            var sURL = $(this).attr('href');
            //$('<form action="' + sURL + '" method="post"></form>').submit();
            $.ajax(sURL, {
                "method" : "post",
                "success": function(){
                    document.location.reload();
                },
                "error": function(){
                    $yobi.notify("Server Error");
                }
            })

            weEvt.preventDefault();
            return false;
        }

        /**
         * Enroll 버튼 클릭시 이벤트 핸들러
         * @param {Wrapped Event} weEvt
         */
        function _onClickBtnEnroll(weEvt){
            var sURL = $(this).attr('href');
            //$('<form action="' + sURL + '" method="post"></form>').submit();
            $.ajax(sURL, {
                "method" : "post",
                "success": function(){
                    document.location.reload();
                },
                "error": function(){
                    $yobi.notify("Server Error");
                }
            })

            weEvt.preventDefault();
            return false;
        }

        /**
         * MenuToggle 버튼 클릭시 이벤트 핸들러
         * @param {Wrapped Event} weEvt
         */
        function _onClickBtnMenuToggle(weEvt){
            if(htElement.welPageWrap.hasClass('mini')){
                htElement.welPageWrap.removeClass('mini');
                htElement.weSideMenu.tooltip('disable');
            }else{
                htElement.welPageWrap.addClass('mini');
                htElement.weSideMenu.tooltip('enable');
            }            
        }

        /**
         * 프로젝트 전역 공통 단축키
         * @param {Hash Table} htKeyMap
         * @require yobi.ShortcutKey
         */
        function _initShortcutKey(htKeyMap){
            yobi.ShortcutKey.setKeymapLink(htKeyMap);
        }

        /**
         * Clone 버튼 클릭시 이벤트 핸들러
         */
        function _onClickBtnClone(){
            $(this).parent().toggleClass('open');
        }

        _init(htOptions || {});
    };
})("yobi.project.Global");
