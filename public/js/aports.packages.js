

    get_packages = function(data) {
       //----- data.data -----
       var items = [];
       var h = getTblRow('', package.tblHdrs, 'data', 'th', 'tr');
       $.each( data.data, function( key, val ) {
         items.push( getTblRow(val['attributes'], package.fields, 'data', 'td', 'tr') );
       });
       var tbl = "\n" + h + "\n" + items.join( "\n" );
       $( "<table/>", {
          "id": "packages",
          "class": "packages sortable",
          //"class": "table table-striped table-bordered table-condensed",
          html: tbl
       }).appendTo( "body .container" );
       //setTimeout(function() { sortables_init(); }, 1600);

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

    get_maintainers = function(data) {
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

    app.query = (app.query) ? '&'+app.query : ''
    url = config.api.baseurl+''+app.resource+''+app.query;
    asyncReq(url, 'callback', get_packages);

    url=config.api.baseurl+'/categories';
    asyncReq(url, 'callback', get_categories);

    url=config.api.baseurl+'/maintainer/names';
    asyncReq(url, 'callback', get_maintainers);


    
    
    