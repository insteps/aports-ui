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
                return makeElm( 'a', data[field], {'title':'Flag this package out of date', 'href':''} );
            }
            if('url' == field) {
                return makeElm( 'a', data[field], {'title':'', 'href':data[field]} )
            }
            if('build_time' == field) { return fmtDate(data[field], "yyyy-mm-dd HH:MM:ss") }
            if('maintainer' == field) { return data[field].split(/\</)[0] }
            if('origin' == field) {
                var u_ = [''];
                var v_ = { 'name':  data[field], 'branch': data['branch'],
                           'arch': data['arch'], 'repo': data['repo'] };
                var url_ = app.baseurl + '?' + buildReq(u_, v_, packages.fields);
                return makeElm( 'a', data[field], {'title':'', 'href':url_} )
            }
            if('size' == field) { return humanBytes(data[field]) }
            if('installed_size' == field) { return humanBytes(data[field]) }
        }
        return data[field];
    };

    getPackage = function(data) {
        //----- data.data -----
        var d = data.data[0]; var d_ = d['attributes'];
        var name = d_['name'];
        var version = d_['version'];
        var branch = d_['branch'];
        var repo = d_['repo'];
        var arch = d_['arch'];
        var items = []; var ln = '';
        
        ln = 'http://git.alpinelinux.org/cgit/aports/tree';
        var gr = (makeElm('a', 'Git repository', {
          'href': ln+'/'+repo+'/'+name+'?h=master'
        }));
        d_['git_repository'] = gr;
        
        ln = 'http://build.alpinelinux.org/buildlogs';
        var bl = (makeElm('a', 'Bluid log', {
          'href': ln+'/'+'build-'+branch+'-'+arch+'/'+repo+'/'+name+'/'+name+'-'+version+'.log'
        }));
        d_['build_log'] = bl;
        
        ln = 'http://pkgs.alpinelinux.org/contents';
        var ct = (makeElm('a', 'Contents of package', {
          'href': ln+'?branch='+branch+'&name='+name+'&arch='+arch+'&repo='+repo+''
        }));
        d_['contents'] = ct;
        
        $.each( d_, function( key, val ) {
            key_ = key;
            if('name' == key_) { key_ = 'Package' };
            if('url' == key_) { key_ = 'Project' };
            if('repo' == key_) { key_ = 'Repository' };
            if('arch' == key_) { key_ = 'Architecture' };
            if('checksum' == key_) { key = '' };
            if('fid' == key_) { key = '' };
            if('commit' == key_) {
                d_['commit'] = (makeElm('a', val, {
                  'href':'http://git.alpinelinux.org/cgit/aports/commit/?id='+val
                }));
            };

            items.push('<tr>');
            if(key !== '') {
                items.push(makeElm('th', titleCase(key_).replace(/\_/, ' '), {'class': 'text-nowrap'}) );
                items.push(makeElm('td', fmtData(d_, key, 'data'), {}) );
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
        if( ! q['name'] ) { $('<span>no data</span>').appendTo( "body .container" ); return; };
        asyncReq(url, 'callback', getPackage);
    };

    app.query = (app.query) ? '&'+app.query : '';
    url = config.api.baseurl+''+app.resource+'&'+app.query;
    _getPackage(url);


   
	

/*]]>*/


