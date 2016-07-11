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
            if('version' == field) {
                return makeElm( 'span', data[field], {'class': 'version text-danger'} );
            }
            if('maintainer' == field) { return data[field].split(/\</)[0] }
            if('origin' == field) {
                var u_ = [''];
                var v_ = { 'name':  data[field], 'branch': data['branch'],
                           'arch': data['arch'], 'repo': data['repo'] };
                var url_ = app.baseurl.replace(/flagged/, 'packages')
                         + '?' + buildReq(u_, v_, packages.fields);
                return makeElm( 'a', data[field], {'title':'', 'href':url_} )
            }
            if('flag_date' == field) { return fmtDate(data[field], "yyyy-mm-dd HH:MM:ss") }
            if('message' == field) { // TODO
                var f_ = data['fid'];
                var m_ = data['message_'];
                var s_ = makeElm( 'span', '', {'class': 'glyphicon glyphicon-comment'} );
                var s_ = makeElm( 'a', s_, {'title':'Message', 'href':'#', 'class': 'text-muted'} );
                return s_;
            }
            

        };
        if('included' == type) {
        };
        return data[field];
    };

    set_flagged = function(data) {
        var included = [];
        $.each( data.included, function( key, val ) {
          included[val.id] = val['attributes'];
        });
        
        //----- data.data -----
        var items = []; var fids = [];
        var h = makeTblRow('', flagged.tblHdrs, 'data', 'th', 'tr');
        $.each( data.data, function( key, val ) {
          var fid = val['attributes'].fid;
          var incs = included[fid];
          val['attributes'].new_version = incs.new_version;
          val['attributes'].flag_date = incs.created;
          val['attributes'].message = '**';
          val['attributes'].message_ = incs.message;
          items.push(makeTblRow(val['attributes'], flagged.fields, 'data', 'td', 'tr'));
          //if(val['attributes'].fid) fids[val['attributes'].fid] = '';
        });
/*
        //set flagged items data
        var fids_ = []; for(a in fids) { fids_.push(a); }
        url_ = config.api.baseurl+'/flagged/fid/'+fids_.join(',');
        asyncReq(url_, 'callback', set_flagged_by_fids);
*/
        var tbl = "\n" + h + "\n" + items.join( "\n" );
        $( "<table/>", {
           "id": "flagged",
           "class": "flagged packages sortable",
           //"class": "table table-striped table-bordered table-condensed",
           html: tbl
        }).appendTo( "body .container" );
        //setTimeout(function() { sortables_init(); }, 1600);
//         flagged_ = document.getElementById('flagged');
//         flagged_.onmouseover = flaggedOver;

        //----- data.links -----
        var links = [];
        links.push( makeTblRow(data.links, link.fields, 'links', 'td', 'tr') );
        var tbl = links.join( "\n" );
        $( "<div/>", {
           "id": "api-active-pager",
           "class": "packages flagged page-pager",
           html: "\n"
        }).appendTo( "body .container" );
        makePgn(data);

        //----- data.meta -----
        var stats = [];
        var h = makeTblRow('', meta.stats, 'meta', 'th', 'tr');
        stats.push( makeTblRow(data.meta, meta.stats, 'meta', 'td', 'tr') );
        var tbl = "\n" + h + "\n" + stats.join( "\n" );
        $( "<table/>", {
           "class": "packages flagged meta",
           html: tbl
        }).appendTo( "body .container" );

        //----- data.meta.search -----
        var stats = []; var f = [];
        for (a in data.meta.search) f.push(a);
        var h = makeTblRow('', f, 'meta', 'th', 'tr');
        stats.push( makeTblRow(data.meta.search, f, 'meta', 'td', 'tr') );
        var tbl = "\n" + h + "\n" + stats.join( "\n" );
        $( "<table/>", {
           "class": "packages flagged meta-search",
           html: tbl
        }).appendTo( "body .container" );

    };
/*
    set_flagged_by_fids = function(data) {
        //----- data.data -----
        flagged.onpage = [];
        $.each( data.data, function( key, val ) {
          if(val.id) flagged.onpage[val.id] = fmtDate(val['attributes'].created, "yyyy-mm-dd HH:MM:ss");
        });
    };
*/
    flaggedOver = function(e) {
      e.preventDefault(); obj = e.target;
      if(obj.tagName != 'A') return;
      if( ! $(obj).hasClass('text-danger') ) return;
      var fid = parseInt((/[\d]+$/i).exec(obj.className));
      obj.title = 'Flagged: '+flagged.onpage[fid];
    }

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
        attr = {'class': 'form-group'}
        var html = "\n"+(makeElm('div', opt1, attr))
             +"\n"+(makeElm('div', opt2, attr))
        $( html ).appendTo( "body #search" );
    };

    set_maintainer_names = function(data) {
        //----- data.data -----
        var items = [];
        items.push(makeElm('option', '', {}) );
        $.each( data.data, function( key, val ) {
            items.push( makeTblRow(val['attributes'], ['name'], 'data', 'option', '') );
        });
        var opt4 = (makeElm('select', items.join( "\n" ), {
          'name':'maintainer', 'data-placeholder':'Branch',
          'class':'form-control chosen-select', 'id':'maintainer'
        }));
        var btn = (makeElm('button', 'Search', {
          'type':'submit', 'class':'btn btn-primary'
        }));
        attr = {'class': 'form-group'};
        var html = "\n"+(makeElm('div', opt4, attr))+"\n"+btn;
        $( html ).appendTo( "body #search" );
    };

    query = (app.query) ? '&'+app.query : '';
    url = config.api.baseurl+'/packages/flagged'+''+query;
    asyncReq(url, 'callback', set_flagged);

    url = config.api.baseurl+'/categories';
    asyncReq(url, 'callback', set_categories);

    url = config.api.baseurl+'/maintainer/names';
    asyncReq(url, 'callback', set_maintainer_names);


/*]]>*/


