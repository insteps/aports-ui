
   getPackage = function(data) {
       //----- data.data -----
       var d = data.data[0];
       var items = []; var f = [];
       $.each( d['attributes'], function( key, val ) {
         items.push('<tr>');
         items.push(makeElm('th', titleCase(key).replace(/\_/, ' '), {'class': 'text-nowrap'}) );
         items.push(makeElm('td', fmtData(d['attributes'], key, 'data'), {}) );
         items.push('</tr>');
       });
       var tbl = "\n" + '' + "\n" + items.join( "\n" );
       $( "<table/>", {
          "id": "package",
          "class": "packages",
          //"class": "table table-striped table-bordered table-condensed",
          html: tbl
       }).appendTo( "body .container" );
   }


   _getPackage = function(url) {
        var p = new Poly9.URLParser(url);
        var q = p.getQueryarray();
        if( ! q['name'] ) { $('<span>no data</span>').appendTo( "body .container" ); return; }
        asyncReq(url, 'callback', getPackage);
    }

    app.query = (app.query) ? '&'+app.query : ''
    url = config.api.baseurl+''+app.resource+'&'+app.query;
    _getPackage(url);




