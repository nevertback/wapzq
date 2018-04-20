(function ($) {
    var baseScaleRio,codeMod = 'dev',dataCacheTime = 60;
    dataCacheTime = codeMod==='dev'?80:60;
    var timeCode = '20180420001';
    function setScaleRio(){
        var $ww = $(window).width();
        $ww = $ww>720?720:$ww;
        baseScaleRio = $ww/7.2;
    }
    setScaleRio();
    $(window).resize(setScaleRio);
    var zqApi = {
        getMoreList:function (paramsData,callback,beforeSendFnc) {
            var apiUrl = "//db2.gamersky.com/LabelJsonpAjax.aspx";
            $.ajax({
                type: "get",
                dataType: "jsonp",
                url: apiUrl,
                data: paramsData,
                beforeSend: function () {
                    if(typeof beforeSendFnc === 'function'){
                        beforeSendFnc();
                    }
                },
                success: function (backData) {
                    if(typeof callback === 'function'){
                        callback(backData);
                    }
                },
                error:function (err) {
                    console.log(err)
                }
            });
        },
        getRating:function (paramsData,callback,beforeSendFnc) {
            var apiUrl = "//cm1.gamersky.com/apirating/getplayersscore";
            $.ajax({
                type: "get",
                dataType: "jsonp",
                url: apiUrl,
                data: paramsData,
                beforeSend: function () {
                    if(typeof beforeSendFnc === 'function'){
                        beforeSendFnc();
                    }
                },
                success: function (backData) {
                    if(typeof callback === 'function'){
                        callback(backData);
                    }
                },
                error:function (err) {
                    console.log(err)
                }
            });
        }
    };
    $.fn.extend({
        gsZqNav:function(){
            var _this = $(this),$placeHolder = _this.closest('.gsZqNavPlaceholder'),mNavHeight = $placeHolder.height(),glNavLen = $('#gsSCMexist').length;
            function mainNavTo() {
                _this.find('a').on('tap',function () {
                    var $ts = $(this),toTar = $ts.data('to');
                    $('html,body').animate({scrollTop:$('.'+toTar).offset().top - mNavHeight},200);
                });
            }
            function setMainNavLinkState(st) {
                _this.find('a').each(function () {
                    var $ts = $(this),
                        toTar = $ts.data('to'),
                        toTarHeight = $('.'+toTar).offset().top;
                    if(st>toTarHeight - 50){
                        _this.find('a').removeClass('cur');
                        $ts.addClass('cur');
                    }
                });

            }
            function setMainNavState(st) {
                var tarTop = $placeHolder.offset().top;
                if(st>tarTop){
                    _this.addClass('cur');
                }else{
                    _this.removeClass('cur');
                }
            }
            function setGlNavState(st){}
            //主导航
            mainNavTo();
            setMainNavState(0);
            $(window).scroll(function () {
                var st = $(window).scrollTop();
                setMainNavState(st);
                setMainNavLinkState(st);
                if(glNavLen>0){
                    setGlNavState(st);
                }
            });
        },
        gsZqInfoPlatformTime:function () {
            this.each(function () {
                var $ts = $(this),
                    $btn = $ts.find('.gsZqGameInfoPlat'),
                    $item = $ts.find('.gsZqGameInfoTime');
                $btn.find('a').on('tap',function () {
                    var idx = $(this).index();
                    $btn.find('a').removeClass('cur').eq(idx).addClass('cur');
                    $item.find('p').removeClass('cur').eq(idx).addClass('cur');
                })
            });
        },
        gsZqInfoIntro:function () {
            this.each(function () {
                var $ts = $(this),
                    $btn = $ts.find('.gsZqGameInfoIntroMore');
                var para = '<p>';
                $ts.find('p').each(function (i) {
                    para += $(this).text().replace('　　','');
                    if(i===0){
                        para += ':';
                    }
                }).remove();
                para += '</p>';
                $ts.append(para).show();
                $btn.on('tap',function () {
                    $ts.addClass('cur');
                })
            });
        },
        gsZqSwp:function () {
            this.each(function () {
                var $ts = $(this),
                    $swp = $ts.find('.gsZqSwp');
                var zqSwp = new Swiper($swp, {
                    slidesPerView:'auto',
                    freeMode : true,
                    freeModeSticky : true
                })
            });
        },
        gsZqTab:function () {
            this.each(function () {
                var $ts = $(this),
                    $nav = $ts.find('.gztNav'),
                    $box = $ts.find('.gztBox');
                $nav.find('.gztNavBtn').on('tap',function () {
                    var idx = $(this).index();
                    $nav.find('.gztNavBtn').removeClass('cur').eq(idx).addClass('cur');
                    $box.find('.gztItem').removeClass('cur').eq(idx).addClass('cur');
                })
            });
        },
        gsZqGl:function () {
            var $ts = $(this);
            $('.ymw-tags').removeClass();
            if($ts.find('#gsSCMexist').length<=0){
                $ts.hide();
                $('.gsZqNav').find('.gsZqNavGl').remove();
            }else{
                //$('.gsZqNav').find('.gsZqNavGl').removeClass('hide');
                $ts.find('.collectbox').show().find('.gs_strategy_collect').removeClass().addClass('zq-strategy-collect');
                $ts.find('.gs_sc_item_list').each(function () {
                    $(this).find('li:gt(3)').remove();
                });
                $ts.find('a').each(function () {
                    var _this = $(this),wapUrl = _this.attr('waphref');
                    _this.attr('href',wapUrl);
                });
                function addQuickGo(zk) {
                    var quickDom = '';
                    quickDom += '<div class="gs-zq-gl-quick">';
                    $ts.find('.gs_sc_item').map(function (idx) {
                        var $this = $(this);
                        quickDom += '<a class="gsZqGlQuickBtn" data-idx="'+idx+'">'+$this.find('.gs_sc_item_btn').text()+'</a>';
                    });
                    quickDom += '</div>';
                    $ts.find('.gsZqGlQuick').html(quickDom);
                    $ts.find('.gsZqGlQuickBtn').on('tap',function () {
                        var idx = $(this).data('idx'),itemTop;
                        if(zk === true){
                            $ts.find('.gsZqGlBoxMore').remove();
                            $ts.find('.gs_sc_item:gt(1)').show();
                            itemTop = $ts.find('.gs_sc_item').eq(idx).offset().top - 0.7*baseScaleRio;
                        }else{
                            itemTop = $ts.find('.gs_sc_item').eq(idx).offset().top;
                        }
                        $('html,body').animate({scrollTop:itemTop},200);
                    });
                }
                function moreListFnc(){
                    var $moreList = $ts.find('.gs_sc_item:gt(1)');
                    $moreList.hide();
                    $ts.find('.zq-strategy-collect').append('<a class="gs-zq-more gs-zq-more-blue gsZqGlBoxMore">更多</a>');
                    $ts.find('.gsZqGlBoxMore').on('tap',function () {
                        $(this).remove();
                        $moreList.show();
                    });
                }
                if($ts.find('.gs_sc_item').length>2 && $('#gsZqStrategyShow').length<1){
                    moreListFnc();
                }
                if($('#gsZqStrategyShow').length>0){
                    addQuickGo();
                }else{
                    addQuickGo(true);
                }
            }
        },
        gsZqGetCommentCount:function(){
            var cycm = "";
            $(".gsZqComment").each(function () {
                var $ts = $(this),sid = $ts.attr('data-sid'),isAdd = $ts.attr('data-add');
                if (cycm !== "") {
                    cycm = cycm + ","
                }
                if(isAdd !== 'yes'){
                    cycm = cycm + sid;
                }
            });
            if (cycm !== "") {
                $.ajax({
                    type: "GET",
                    url: "//cm.gamersky.com/commentapi/count",
                    dataType: "jsonp",
                    data: {
                        topic_source_id: cycm
                    },
                    success: function (responseJson) {
                        $(".gsZqComment").each(function () {
                            var $ts = $(this);
                            if (responseJson.result.hasOwnProperty($ts.attr("data-sid"))) {
                                var cmobj = responseJson.result[$ts.attr("data-sid")];
                                $ts.text(cmobj.comments).attr('data-add','yes');
                            }
                        });
                    }
                });
            }
        },
        gsZqAddLoading:function(){
            var ldDom = '';
            ldDom = '<div class="gs-zq-loading gsZqLoading"></div>';
            this.append(ldDom)
        },
        gsZqRemoveLoading:function(){
            $('.gsZqLoading').remove();
        },
        gsZqGetMoreOnce:function () {
            this.each(function () {
                var $ts = $(this),
                    moreUrl = $ts.data('href'),
                    $tar = $('.'+$ts.data('tar')),tmk,nid,lid;
                tmk = $ts.data('tmk');
                nid = $ts.data('nid');
                lid = $tar.find('li').eq(-1).data('id');
                function addData(){
                    var transData,tmpJson;
                    tmpJson={
                        type:"getwaplabelpage",
                        isCache:true,
                        cacheTime:dataCacheTime,
                        templatekey:tmk,
                        id:lid,
                        nodeId:nid,
                        page:2
                    };
                    transData = {
                        jsondata:JSON.stringify(tmpJson)
                    };
                    zqApi.getMoreList(transData,function (moreDt) {
                        if(moreDt.status === 'ok'){
                            $tar.find('ul').append(moreDt.body);
                        }
                        $tar.gsZqRemoveLoading();
                        $ts.show().addClass('gs-zq-more-all').html('查看全部').attr({
                            'href':moreUrl,
                            'target':'_blank'
                        }).off();
                    },function () {
                        $ts.hide();
                        $tar.gsZqAddLoading();
                    })
                }
                $ts.on('tap',function () {
                    addData();
                })
            });
        },
        gsZqGetMore:function () {
            this.each(function () {
                var $ts = $(this),
                    $tar = $('.'+$ts.data('tar')),tmk,nid;
                tmk = $ts.data('tmk');
                nid = $ts.data('nid');
                function addData(){
                    var transData,tmpJson,lpg = $ts.attr('data-page'),lid;
                    lid = $tar.find('li').eq(-1).data('id');
                    lpg++;
                    tmpJson={
                        type:"getwaplabelpage",
                        isCache:true,
                        cacheTime:dataCacheTime,
                        templatekey:tmk,
                        id:lid,
                        nodeId:nid,
                        page:lpg
                    };
                    transData = {
                        jsondata:JSON.stringify(tmpJson)
                    };
                    zqApi.getMoreList(transData,function (moreDt) {
                        if(moreDt.status === 'ok'){
                            var resDt = moreDt.body;
                            if (resDt.indexOf("没有任何记录") > 0){
                                $ts.show().addClass('gs-zq-more-done').html('全部加载完成').off();
                            }else{
                                $tar.find('ul').append(resDt);
                                $(".gsZqComment").gsZqGetCommentCount();
                            }
                        }
                        $tar.gsZqRemoveLoading();
                        $ts.show().attr({
                            'data-page':lpg
                        });
                    },function () {
                        $ts.hide();
                        $tar.gsZqAddLoading();
                    })
                }
                $ts.on('tap',function () {
                    addData();
                })
            });
        },
        gsZqSetMinHeight:function () {
            var _this = this;
            function setMH(){
                var hPad = _this.outerHeight() - _this.height(),
                    $wh = $(window).height(),
                    hHead = _this.offset().top,
                    hFoot = $('.ymw-footer').outerHeight(),mH;
                mH = $wh - hHead - hFoot - hPad;
                _this.css({
                    'min-height':mH
                });
            }
            setMH();
            $(window).resize(setMH)
        },
        gsZqGetRating:function () {
            var transData,tmpJson,_this = this;
            tmpJson = {
                genneralId: _this.attr('data-gameid'),
                num:'10'
            };
            transData = {
                jsondata:JSON.stringify(tmpJson)
            };
            zqApi.getRating(transData,function (bdt) {
                if(bdt.status === 'ok'){
                    var tmpScore = bdt.sorce,
                        calcScore,
                        numDom = '';
                    calcScore = parseFloat(tmpScore)*10+'';
                    if(tmpScore !== '--'){
                        if(calcScore === '100'){
                            numDom += '<i class="pnm pnm1"></i>';
                            numDom += '<i class="pnm pnm0"></i>';
                            _this.find('.gsZqRatingNum').addClass('gs-zp-rating-num-full');
                        }else{
                            numDom += '<i class="pnm pnm'+calcScore[0]+'"></i>';
                            numDom += '<i class="dot"></i>';
                            numDom += '<i class="pnm pnm'+calcScore[1]+'"></i>';
                        }
                        _this.find('.gsZqRatingNum').html(numDom);
                    }else{
                        _this.remove();
                    }
                }
            })
        },
        gsZqCreatePic:function () {
            var $tar = $('#gsZpImages'),picDom = '',picData=[];
            function formatData(){
                var $dataArea = $('#demo0').find('.piclist');
                $dataArea.find('a').each(function () {
                    var $ts = $(this),tmpSmall = $ts.attr('data-pic'),tmpTiny = $ts.find('img').attr('src'),tmpObj = {};
                    tmpObj.pic = {
                        small:tmpSmall,
                        tiny:tmpTiny,
                        origin:tmpTiny.replace('_tiny',''),
                        sizeW:1000,
                        sizeH:534
                    };
                    picData.push(tmpObj);
                });
            }
            formatData();
            picDom += '<div class="gs-zq-images ">';
            picDom += '<div class="gs-zq-title-lev1">图库</div>';
            picDom += '<div class="gs-zq-swp gsZqSwpPicDad">';
            picDom += '<div class="swiper-container gsZqSwp">';
            picDom += '<div class="swiper-wrapper">';
            $.each(picData,function (i,item) {
                picDom += '<div class="swiper-slide"><a class="gsZqPicLook" data-idx="'+i+'"><img src="'+item.pic.tiny+'" alt="gs"></a></div>';
            });
            picDom += '';
            picDom += '</div></div></div></div>';
            $tar.html(picDom);

            $('.gsZqSwpPicDad').gsZqSwp();
            function bindPswp() {
                cps.photoSwp(picData);
            }
            if(typeof PhotoSwipe === "undefined"){
                var pswpLink = '<link rel="stylesheet" href="//j.gamersky.com/css/??g/lib/photoswipe.min.css,g/lib/default-skin.min.css,?dtcode='+timeCode+'"></link>';
                $('head').append(pswpLink);
                $.getScript('//j.gamersky.com/js/??g/lib/photoswipe.min.js,g/lib/photoswipe-ui-default.min.js',function () {
                    bindPswp();
                });
            }else{
                bindPswp();
            }
        }
    });
    var cps = {
        DomExist:function(tar,callback){
            if(tar.length>0&&typeof callback === "function"){
                callback();
            }
        },
        infoIntroduce:function () {
            this.DomExist($('.gsZqGameInfoIntro'),function () {
                $('.gsZqGameInfoIntro').gsZqInfoIntro();
            });
        },
        infoPlatformTime:function () {
            this.DomExist($('.gsZqGameInfo'),function () {
                $('.gsZqGameInfo').gsZqInfoPlatformTime();
            });
        },
        swp:function () {
            this.DomExist($('.gsZqSwpDad'),function () {
                $('.gsZqSwpDad').gsZqSwp();
            });
        },
        tab:function(){
            this.DomExist($('.gsZqTab'),function () {
                $('.gsZqTab').gsZqTab();
            });
        },
        gl:function(){
            this.DomExist($('#gsZqStrategy'),function () {
                $('#gsZqStrategy').gsZqGl();
            });
        },
        nav:function(){
            this.DomExist($('.gsZqNav'),function () {
                $('.gsZqNav').gsZqNav();
            });
        },
        moreOnce:function(){
            this.DomExist($('.gsZqGetMoreOnce'),function () {
                $('.gsZqGetMoreOnce').gsZqGetMoreOnce();
            });
        },
        more:function(){
            this.DomExist($('.gsZqGetMore'),function () {
                $('.gsZqGetMore').gsZqGetMore();
            });
        },
        commentCount:function(){
            this.DomExist($('.gsZqComment'),function () {
                $('.gsZqComment').gsZqGetCommentCount();
            });
        },
        setMinHeight:function(){
            this.DomExist($('.gsZqLp'),function () {
                $('.gsZqLp').gsZqSetMinHeight();
            });
        },
        getRating:function(){
            this.DomExist($('.gsZqRating'),function () {
                $('.gsZqRating').gsZqGetRating();
            });
        },
        //图片弹出层 默认执行,一般情况不需要修改
        addSwpOnce: function () {
            var swp = '<div class="pswp pswp-zq pswpZq" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div>';
            swp += '<div class="pswp__ui pswp__ui--hidden">';
            swp += '<div class="pswp__bot-bar">';
            swp += '<a class="pswp-zq-origin-btn pswpBtnOrigin pswp__single-tap" title="查看原图">查看原图</a>';
            swp += '<a class="pswp-zq-save-btn pswpBtnSave pswp__single-tap" title="保存原图"></a>';
            swp += '</div>';
            swp += '<div class="pswp__top-bar">';
            swp += '<div class="pswp__counter"></div>';
            swp += '<button class="pswp__button pswp__button--close" title="关闭"></button>';
            swp += '<button class="pswp__button pswp__button--share" title="Share"></button> <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button> <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="上一张"></button> <button class="pswp__button pswp__button--arrow--right" title="下一张"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div>';
            swp += '</div></div>';
            $('body').append(swp);
        },
        //图片弹出层方法 默认执行,一般情况不需要修改
        photoSwp: function (dt) {
            var initPhotoSwipeFromDOM = function (gallerySelector) {
                var parseThumbnailData = function (tarData) {
                    var items = [];
                    $.each(tarData,function (i,ehl) {
                        var item = {
                            msrc:ehl.pic.tiny,
                            src: ehl.pic.small,
                            w: ehl.pic.sizeW,
                            h: ehl.pic.sizeH,
                            ori: ehl.pic.origin
                        };
                        items.push(item);
                    });
                    return items;

                };
                var openPhotoSwipe = function (clk, index, guid, disableAnimation, fromURL) {
                    var pswpElement = $('.pswpZq')[0],
                        gallery,
                        options,
                        items;
                    items = parseThumbnailData(dt);
                    options = {
                        shareEl: false,
                        fullscreenEl: false,
                        zoomEl: false,
                        bgOpacity: 1,
                        showHideOpacity: 0,
                        galleryUID: guid,
                        history: false,
                        tapToClose:true,
                        tapToToggleControls:false,
                        index:index,
                        getThumbBoundsFn: function (index) {
                            var thumbnail = clk.find('img')[0],
                                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                                rect = thumbnail.getBoundingClientRect();
                            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
                        }
                    };
                    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                    gallery.init();
                    var originIdx=0;
                    function SetSaveUrl(idx){
                        $('.pswpZq').find('.pswpBtnSave').attr({
                            'target':'_blank',
                            'href':'//pic.gamersky.com/down/index?url='+items[idx].ori
                        });
                    }
                    gallery.listen('initialZoomIn', function () {
                        originIdx = gallery.getCurrentIndex();
                        SetSaveUrl(originIdx);
                        $('.pswpZq').animate({ 'opacity': 1 }, 333);
                    });
                    gallery.listen('initialZoomOut', function () {
                        $('.pswpZq').animate({ 'opacity': 0 }, 200);
                    });
                    gallery.listen('afterChange', function () {
                        originIdx = gallery.getCurrentIndex();
                        SetSaveUrl(originIdx);
                    });
                    function setOrigin() {
                        $('.pswpZq').on('click','.pswpBtnOrigin',function () {
                            $('.pswpZq').find('.pswp__img').each(function () {
                                var $ts = $(this);
                                if($ts.attr('src') === items[originIdx].src){
                                    $ts.attr('src',items[originIdx].ori);
                                }
                            });
                        });
                    }
                    setOrigin();
                };
                var galleryElements = $(gallerySelector);
                galleryElements.attr('data-pswp-uid',1);
                galleryElements.find('.gsZqPicLook').on('click',function () {
                    var $ts = $(this),idx = $ts.data('idx');
                    openPhotoSwipe($ts, idx, 1);
                })
            };
            initPhotoSwipeFromDOM('.gsZqSwpPicDad');
        },
        createPic:function(){
            var _this = this;
            this.DomExist($('#demo0'),function () {
                $('#demo0').gsZqCreatePic();
                _this.addSwpOnce();
            });
        },
        openClub:function(){
            var _this = this;
            this.DomExist($('#QZCMT'),function () {
                $.getScript('//j.gamersky.com/web2015/qzcomment/js/qzcmtconfig.wap.js');
            });
        },
        init:function () {
            var _this = this;
            _this.nav();
            _this.infoPlatformTime();
            _this.infoIntroduce();
            _this.tab();
            _this.swp();
            _this.gl();
            _this.setMinHeight();
            _this.moreOnce();
            _this.more();
            _this.commentCount();
            _this.getRating();
            _this.createPic();
            _this.openClub();
        }
    };
    cps.init();
})(jQuery);