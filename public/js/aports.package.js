
   getPackage = function(data) {
       //----- data.data -----
       var d = data.data[0]; var d_ = d['attributes'];
       var name = d['attributes']['name'];
       var version = d['attributes']['version'];
       var repo = d['attributes']['repo'];
       var arch = d['attributes']['arch'];
       var branch = d['attributes']['branch'];
       var items = [];
       
       var gr = (makeElm('a', 'Git repository', {
         'href': 'http://git.alpinelinux.org/cgit/aports/tree/'+repo+'/'+name+'?h=master'
       }));
       d['attributes']['git_repository'] = gr;
       
       var bl = (makeElm('a', 'Bluid log', {
         'href': 'http://build.alpinelinux.org/buildlogs/build-'+branch+'-'+arch+'/'+repo+'/'+name+'/'+name+'-'+version+'.log'
       }));
       d['attributes']['build_log'] = bl;
       
       var ct = (makeElm('a', 'Contents of package', {
         'href': 'http://pkgs.alpinelinux.org/contents?branch='+branch+'&name='+name+'&arch='+arch+'&repo='+repo+''
       }));
       d['attributes']['contents'] = ct;
       
       $.each( d['attributes'], function( key, val ) {
         key_ = key;
         if ('name' == key_) { key_ = 'Package' };
         if ('url' == key_) { key_ = 'Project' };
         if ('repo' == key_) { key_ = 'Repository' };
         if ('arch' == key_) { key_ = 'Architecture' };
         if ('checksum' == key_) { key = '' };
         if ('fid' == key_) { key = '' };
         if ('commit' == key_) {
             d['attributes']['commit'] = (makeElm('a', val, {
               'href':'http://git.alpinelinux.org/cgit/aports/commit/?id='+val
             }));
         };

         items.push('<tr>');
         if(key !== '') {
             items.push(makeElm('th', titleCase(key_).replace(/\_/, ' '), {'class': 'text-nowrap'}) );
             items.push(makeElm('td', fmtData(d['attributes'], key, 'data'), {}) );
         }
         items.push('</tr>');
       });
       var tbl = "\n" + '' + "\n" + items.join( "\n" );
       $( "<table/>", {
          "id": "package",
          "class": "packages",
          //"class": "table table-striped table-bordered table-condensed",
          html: tbl
       }).appendTo( "body .container" );
   };


   _getPackage = function(url) {
        var p = new Poly9.URLParser(url);
        var q = p.getQueryarray();
        if( ! q['name'] ) { $('<span>no data</span>').appendTo( "body .container" ); return; }
        asyncReq(url, 'callback', getPackage);
    };

    app.query = (app.query) ? '&'+app.query : '';
    url = config.api.baseurl+''+app.resource+'&'+app.query;
    _getPackage(url);




