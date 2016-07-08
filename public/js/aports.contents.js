/*<![CDATA[*/

/**
 * Copyright (c) 2016 V.Krishn (vkrishn@insteps.net)
 *
 * This file is part of "Aports UI";
 * ----
 *
 *
 */


    fmtData = function(data, field, type) {
        if(data[field] == null) return '';
        if('data' == type) {
            if('file' == field) {
              return data['path']+'/'+data[field];
            }
        }
        return data[field];
    };

    set_contents = function(data) {
        //----- data.data -----
        var items = []; var ln = '';
        var p = new Poly9.URLParser(window.location);
        var q = p.getQueryarray();
        
        var h = makeTblRow('', contents.tblHdrs, 'data', 'th', 'tr');
        $.each( data.data, function( key, val ) {
          
          var d_ = val['attributes'];
          var r = data.meta.search;
		  var qName = q['name'] ? q['name'] : '';
          ln = 'http://pkgstest.alpinelinux.org/'+'/'+q['name'];
          var pk = (makeElm('a', d_['name'], {
            'title': '',
            'href': ''
          }));
          d_['package'] = pk;
          //d_['branch'] = r['branch'];
          //d_['repo'] = r['repo'];
          //d_['arch'] = r['arch'];
          
          items.push(makeTblRow(val['attributes'], contents.fields, 'data', 'td', 'tr'));
        });

        var tbl = "\n" + h + "\n" + items.join( "\n" );
        $( "<table/>", {
           "id": "contents",
           "class": "packages contents sortable",
           //"class": "table table-striped table-bordered table-condensed",
           html: tbl
        }).appendTo( "body .container" );
        //setTimeout(function() { sortables_init(); }, 1600);
        contents_ =  document.getElementById('contents');
        
        //----- data.links -----
        var links = [];
        links.push( makeTblRow(data.links, link.fields, 'links', 'td', 'tr') );
        var tbl = links.join( "\n" );
        $( "<div/>", {
           "id": "api-active-pager",
           "class": "contents page-pager",
           html: "\n"
        }).appendTo( "body .container" );
        makePgn(data);

        //----- data.meta -----
        var stats = [];
        var h = makeTblRow('', meta.stats, 'meta', 'th', 'tr');
        stats.push( makeTblRow(data.meta, meta.stats, 'meta', 'td', 'tr') );
        var tbl = "\n" + h + "\n" + stats.join( "\n" );
        $( "<table/>", {
           "class": "packages contents meta",
           html: tbl
        }).appendTo( "body .container" );

        //----- data.meta.search -----
        var stats = []; var f = [];
        for (a in data.meta.search) f.push(a);
        var h = makeTblRow('', f, 'meta', 'th', 'tr');
        stats.push( makeTblRow(data.meta.search, f, 'meta', 'td', 'tr') );
        var tbl = "\n" + h + "\n" + stats.join( "\n" );
        $( "<table/>", {
           "class": "packages contents meta-search",
           html: tbl
        }).appendTo( "body .container" );

    };

    set_categories = function(data) {
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
        attr = {'class': 'form-group'};
        var btn = get_btn_search();
        var html = '<br style="clear: both;"/>'+"\n"+(makeElm('div', opt1, attr))
             +"\n"+(makeElm('div', opt2, attr))
             +"\n"+(makeElm('div', opt3, attr))+btn;
        $( html ).appendTo( "body #search" );
    };

    get_btn_search = function() {
        var btn = (makeElm('button', 'Search', {
          'type':'submit', 'class':'btn btn-primary'
        }));
        return "\n"+btn;
    };

    var p = new Poly9.URLParser(window.location);
    var q = p.getQueryarray();
    query = (app.query) ? '&'+app.query : ''
    var qName = q['name'] ? q['name'] : '';
    //url = config.api.baseurl+''+'/packages/'+'17912'+'/relationships/contents'+''+query;
    url = config.api.baseurl+''+'/search/contents/'+qName+''+query;
    //alert(url);
    asyncReq(url, 'callback', set_contents);

    url=config.api.baseurl+'/categories';
    asyncReq(url, 'callback', set_categories);


/*]]>*/


