/*<![CDATA[*/

/**
 * Copyright (c) 2016 V.Krishn (vkrishn@insteps.net)
 *
 * This file is part of "Aports UI";
 * ----
 *
 *
 */

    get_packages = function(data) {
        //----- data.data -----
        var items = []; var fids = [];
        var h = getTblRow('', packages.tblHdrs, 'data', 'th', 'tr');
        $.each( data.data, function( key, val ) {
          items.push(getTblRow(val['attributes'], packages.fields, 'data', 'td', 'tr'));
          if(val['attributes'].fid) fids[val['attributes'].fid] = '';
        });
        
        //get flagged items data
        var fids_ = []; for(a in fids) { fids_.push(a); }
        url_ = config.api.baseurl+'/flagged/fid/'+fids_.join(',');
        asyncReq(url_, 'callback', get_flagged_by_fids);

        var tbl = "\n" + h + "\n" + items.join( "\n" );
        $( "<table/>", {
           "id": "packages",
           "class": "packages sortable",
           //"class": "table table-striped table-bordered table-condensed",
           html: tbl
        }).appendTo( "body .container" );
        //setTimeout(function() { sortables_init(); }, 1600);
        packages_ =  document.getElementById('packages');
        packages_.onmouseover = packagesOver;
        

        //----- data.links -----
        var links = [];
        links.push( getTblRow(data.links, link.fields, 'links', 'td', 'tr') );
        var tbl = links.join( "\n" );
        $( "<div/>", {
           "id": "api-active-pager",
           "class": "packages page-pager",
           html: "\n"
        }).appendTo( "body .container" );
        makePgn(data);

        //----- data.meta -----
        var stats = [];
        var h = getTblRow('', meta.stats, 'meta', 'th', 'tr');
        stats.push( getTblRow(data.meta, meta.stats, 'meta', 'td', 'tr') );
        var tbl = "\n" + h + "\n" + stats.join( "\n" );
        $( "<table/>", {
           "class": "packages meta",
           html: tbl
        }).appendTo( "body .container" );

        //----- data.meta.search -----
        var stats = []; var f = [];
        for (a in data.meta.search) f.push(a);
        var h = getTblRow('', f, 'meta', 'th', 'tr');
        stats.push( getTblRow(data.meta.search, f, 'meta', 'td', 'tr') );
        var tbl = "\n" + h + "\n" + stats.join( "\n" );
        $( "<table/>", {
           "class": "packages meta-search",
           html: tbl
        }).appendTo( "body .container" );

    };

    get_flagged_by_fids = function(data) {
        //----- data.data -----
        var fids = []; flagged.onpage = [];
        $.each( data.data, function( key, val ) {
          if(val.id) flagged.onpage[val.id] = fmtDate(val['attributes'].created, "yyyy-mm-dd HH:MM:ss");
        });
    };
    
    packagesOver = function(e) {
      e.preventDefault(); obj = e.target;
      if(obj.tagName != 'A') return;
      if( ! $(obj).hasClass('text-danger') ) return;
      var fid = parseInt((/[\d]+$/i).exec(obj.className));
      obj.title = 'Flagged: '+flagged.onpage[fid];
    }
    
    get_categories = function(data) {
        //----- data.data -----
        var items = [];
        items.push(makeElm('option', '', {}) );
        $.each( data.data.branch, function( key, val ) {
            items.push(makeElm('option', val, {}) );
        });
        var opt1 = (makeElm('select', items.join( "\n" ), {
          'name':'branch', 'data-placeholder':'Branch',
          'class':'form-control chosen-select', 'id':'branch'
        }));
        var items = [];
        items.push(makeElm('option', '', {}) );
        $.each( data.data.repo, function( key, val ) {
            items.push(makeElm('option', val, {}) );
        });
        var opt2 = (makeElm('select', items.join( "\n" ), {
          'name':'repo', 'data-placeholder':'Repository',
          'class':'form-control chosen-select', 'id':'repo'
        }));
        var items = [];
        items.push(makeElm('option', '', {}) );
        $.each( data.data.arch, function( key, val ) {
            items.push(makeElm('option', val, {}) );
        });
        var opt3 = (makeElm('select', items.join( "\n" ), {
          'name':'arch', 'data-placeholder':'Arch',
          'class':'form-control chosen-select', 'id':'arch'
        }));
        attr = {'class': 'form-group'}
        var html = "\n"+(makeElm('div', opt1, attr))
             +"\n"+(makeElm('div', opt2, attr))
             +"\n"+(makeElm('div', opt3, attr))
        $( html ).appendTo( "body #search" );
    };

    get_maintainer_names = function(data) {
        //----- data.data -----
        var items = [];
        items.push(makeElm('option', '', {}) );
        $.each( data.data, function( key, val ) {
            items.push( getTblRow(val['attributes'], ['name'], 'data', 'option', '') );
        });
        var opt4 = (makeElm('select', items.join( "\n" ), {
          'name':'maintainer', 'data-placeholder':'Branch',
          'class':'form-control chosen-select', 'id':'maintainer'
        }));
        var btn = (makeElm('button', 'Search', {
          'type':'submit', 'class':'btn btn-primary'
        }));
        attr = {'class': 'form-group'}
        var html = "\n"+(makeElm('div', opt4, attr))+"\n"+btn
        $( html ).appendTo( "body #search" );
    };

    query = (app.query) ? '&'+app.query : ''
    url = config.api.baseurl+''+app.resource+''+query;
    asyncReq(url, 'callback', get_packages);

    url=config.api.baseurl+'/categories';
    asyncReq(url, 'callback', get_categories);

    url=config.api.baseurl+'/maintainer/names';
    asyncReq(url, 'callback', get_maintainer_names);


/*]]>*/


