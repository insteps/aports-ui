/*<![CDATA[*/

/**
 * Copyright (c) 2016 V.Krishn (vkrishn@insteps.net)
 *
 * This file is part of "Aports UI";
 * ----
 *
 *
 */

config = {}
config.api = {}
config.api.baseurl = 'http://api.alpinelinux.org/index.php?_url='
config.api.resources = ['packages', 'contents', 'categories', 
                        'origins', 'flagged', 'depends',
                        'install_if', 'provides', 'maintainer'];
packages = {};
packages.tblHdrs = ['Package', 'Version', 'Project', 'License', 'Branch',
                   'Repository', 'Architecture', 'Maintainer', 'Build date'];
packages.fields = ['name', 'version', 'url', 'license', 'branch',
                   'repo', 'arch', 'maintainer', 'build_time'];
packages.class = 'packages';

contents = {};
contents.tblHdrs = ['File', 'Package', 'Branch', 'Repository', 'Architecture'];
contents.fields = ['file', 'package', 'branch', 'repo', 'arch'];
contents.class = 'contents';
flagged = {};

meta = {};
meta.stats = ['count', 'total-pages', 'per-page', 'total-count',
              'elapsed_time', 'memory_usage'];
link = {};
link.fields = ['self', 'first', 'next', 'last'];

app = {}
app.urlDef = config.api.baseurl+'/packages';
app.resource = app.resDef = '/search/packages';
app.url = (window.location).toString().split(/\?/)
app.baseurl = app.url[0];
if(app.url.length > 1) { 
  app.res_ =  app.url[1].split(/\&/);
  app.resource = (app.url[1][0] == '/') ? app.res_[0] : app.resDef;
  if((app.url[1][0] == '/')) app.res_.shift();
}
app.query = (app.res_ && app.res_.length > 0) ? ''+app.res_.join('&') : '';
for (a in config.api.resources) {
  if(config.api.resources[a] == app.resource) { break; }
}
temp = {}

    asyncReq = function(url, callback, callback2) {
        var request = $.ajax({
            url : url,
            xhrFields: {
              withCredentials: true
            },
            method: 'GET',
            cache: true,
            dataType: "jsonp", //CORS
            jsonp: callback, // defaults to 'callback'
            success: callback2
        });
        return request;
    }

    fmtData = function(data, field, type) {
        if(data[field] == null) return '';
        if('data' == type) {
            if('name' == field) {
                var u_ = []; //['packages']
                var v_ = { 'name':  data[field], 'branch': data['branch'],
                           'arch': data['arch'], 'repo': data['repo'] };
                var url_ = app.baseurl.replace(/packages/, 'package') + '?' + buildReq(u_, v_, packages.fields);
                return makeElm( 'a', data[field], {'title':data['description'], 'href':url_} );
            }
            if('version' == field) {
                var t_ = (data['fid']) ? 'Flagged: ' : 'Flag this package out of date';
                var c_ = (data['fid']) ? 'version text-danger fid'+data['fid'] : 'version text-success';
                return makeElm( 'a', data[field], {'title':t_, 'href':'', 'class': c_} );
            }
            if('url' == field) {
                return makeElm( 'a', 'URL', {'title':'', 'href':data[field]} )
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
        }
        if('meta' == type) {
        }
        if('links' == type) {
            var text = field;
            //if ('last' == field) { text = '&gt;&gt;' }
            //if ('next' == field) { text = '&gt;' }
            //if ('first' == field) { text = '&lt;&lt;' }
            return '<a title="'+'" href="'+data[field]+'">'+text+'</a>'
        }
        return data[field];
    };

    makePgn = function(data) {
        var links = data.links;
        var pgs = parseInt((/[\d]+$/i).exec(links.last));
        currPg = parseInt((/[\=\/]{1}([\d]+)$/i).exec(app.query)[1]);
        app.query = (app.query).split(/\&page.*/)[0];
        var pgr = $('#api-active-pager');
        setTimeout(function() {
            $(pgr).twbsPagination({
                startPage: (currPg <= data.meta['total-pages']) ? currPg : 1,
                totalPages: (pgs) ? pgs : 1,   visiblePages: 4,
                prev: '&lt;',      next: '&gt;',
                first: '&lt;&lt;', last: '&gt;&gt;',
                onPageClick: function(event, page) {
                  var query = (app.query !== '') ? '?'+app.query+'&' : '?';
                  var url = app.baseurl+query+'page='+page;
                  window.location = url;
                }
            });
        }, 600);
    }

    makeTblRow = function(data, fields, cls, elm, elmWrap) {
       var items = [];
       for(n in fields) {
           if(data) {
               val = (data[fields[n]]) ? fmtData(data, fields[n], cls) : '';
           } else {
               val = fields[n];
           }
           if(elm) items.push(makeElm(elm, val, {}));
       }
       var val = "\n"+items.join( "\n" );
       if(elmWrap != '') return makeElm( elmWrap, val, {'class':cls} );
       return val;
    };

    makeElm = function(elm, val, attr) {
        var a_ = [];
        a_.push('<'+elm);
        if (typeof attr == 'object') {
            for (a in attr) { a_.push(a+"='"+attr[a]+"'") }
        }
        if('img' == elm) {
            a_.push(' />'); var end_ = '';
        } else {
            a_.push('>'); var end_ = '</'+elm+'>';
        }
        return a_.join(' ')+val+end_;
    };

    buildReq = function(resource, reqs, fields) {
        var url_ = resource.join('/');
        var items = [];
        for(var i=0; i<fields.length; i++) {
            o = fields[i];
            if(reqs[o]) { items.push(o+'='+reqs[o]); }
        }
        var req_ = items.join("&");
        url_ = (url_) ? url_+'&' : '';
        return url_+req_;
    }

    fmtDate = function(epoch, fmt) {
        fmt = fmt ? fmt : "ddd, mmm dS, yyyy, h:MM TT";
        var now = new Date();
        var mEpoch = parseInt(epoch);
        if(mEpoch < 10000000000) { mEpoch *= 1000; }
        now.setTime(mEpoch);
        return dateFormat(now, fmt);
    };
   
    titleCase = function(string) {
        if(string) return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // converted function cntrl:humanBytes(bytes) found here
    // https://github.com/clandmeter/aports-turbo/blob/master/controller.lua
    humanBytes = function(bytes) {
        var mult = Math.pow(10,2);
        var size = [ 'B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
        var factor = Math.floor((bytes.toString().length-1) /3);
        var result = bytes/Math.pow(1024, factor);
        var r = Math.floor(result * mult + 0.5) / mult;
        return r.toString()+' ' + size[factor];
    }


/*]]>*/


