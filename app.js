$(function() {
  $('.alert-danger').hide();
  var src = localStorage['calendar'];
  if (src) {
    $('#calendar').val(src);
  }

  $('#generate').click(function(){
    var body = $('#content').val();
    if (!body) {
      $('.alert-danger').slideDown();
      return;
    }
    body = body.replace(/\r\n|\r/g, "\n");
    var title = body.match(/\n((?:.*?)メンテナンス)のご連絡\s*\n/)[1];
    title = title.replace(/^\s+/, '').replace(/\s+$/, '');
    var lines = body.match(/◆日時.*\n([\s\S]+?)\n\n/);
    var lines = lines[1];
    var datetimes = lines.split("\n").map(function(line){
      var m;
      var date;
      line = line.replace(/^\s+/, '').replace(/\s+$/, '');
      if (line.match(/\d{4}年\d{1,2}月\d{1,2}日.*\d{4}年\d{1,2}月\d{1,2}日/)) { // 2016年02月29日（月）23:00 ～ 2016年03月01日（火）06:00（※24時間表記）
        m = line.match(/(\d{4})年(\d{1,2})月(\d{1,2})日.*?(\d{2})[:：](\d{2}).*?(\d{4})年(\d{1,2})月(\d{1,2})日.*?(\d{2})[:：](\d{2})/);
        date = {
          startYear: m[1],
          startMonth: m[2],
          startDay: m[3],
          startHour: m[4],
          startMinute: m[5],
          endYear: m[6],
          endMonth: m[7],
          endDay: m[8],
          endHour: m[9],
          endMinute: m[10]
        };
      } else if (line.match(/\d{4}年\d{1,2}月\d{1,2}日/)) { // (1) 2016年03月07日（月）　01：00～06：00
        m = line.match(/(\d{4})年(\d{1,2})月(\d{1,2})日.*?(\d{1,2})[:：](\d{1,2}).+?(\d{1,2})[:：](\d{1,2})/);
        date = {
          startYear: m[1],
          startMonth: m[2],
          startDay: m[3],
          startHour: m[4],
          startMinute: m[5],
          endYear: m[1],
          endMonth: m[2],
          endDay: m[3],
          endHour: m[6],
          endMinute: m[7]
        };
      }
      return date;
    }).filter(function(d) { return d; });

    if (datetimes.length === 0) {
      $('.alert-danger').slideDown();
    }

    $('#result').empty();
    var src = $('#calendar').val();
    if (!src) {
      src = $('#calendar').data('placeholder');
    }

    var $ol = $('<ol>');
    datetimes.forEach(function(datetime) {
      var url = 'https://www.google.com/calendar/render';
      url += '?action=TEMPLATE';
      url += '&text=' + title;
      // Delete greeting
      body = body.replace(/[\s\S]+(?=◆対象)/, '');
      // Delete signature
      body = body.replace(/^-+$\n.+\n-+$/m, '');
      body = body.replace(/…+\n[\s\S]+/m, '');
      // Keep newline on Google Calendar
      body = body.replace(/\n/g, "%0A%0D")
      url += '&details=' + body;
      url += '&src=' + src;
      url += '&dates=' + datetime.startYear + datetime.startMonth + datetime.startDay + 'T' + datetime.startHour + datetime.startMinute + '00' + '/' + datetime.endYear + datetime.endMonth + datetime.endDay + 'T' + datetime.endHour + datetime.endMinute + '00';
      var $a = $('<a>').attr('href', url).attr('target', '_blank').text(title);
      var $li = $('<li>');
      $li.append($a);
      $ol.append($li);
    });
    $('#result').append($ol);

    localStorage['src'] = src;
  })

  var presetMailContent = function() {
    var params = location
      .search
      .substr(1)
      .split('&')
      .reduce(function(h, kv) {
        var d = kv.split('='),
          k = d[0],
          v = decodeURI(d[1]);
        if (k) {
          h[k] = v;
        }
        return h;
      }, {});

    if (params.body) {
      $('#content').val(params.body);
    }
  };

  presetMailContent();
});
