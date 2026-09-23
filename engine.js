/* EatFirst engine - pure leftover safety-window math, shared by app.html and node tests. */
(function(root, factory){
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EatFirstEngine = factory();
})(typeof self !== 'undefined' ? self : this, function(){

  /* safe fridge days by category (USDA/FDA guidance) */
  var WINDOWS = {
    'cooked meat': 3, 'poultry': 3, 'fish': 2, 'rice/grains': 3,
    'soup/stew': 3, 'vegetables': 4, 'pizza': 3, 'pasta': 4,
    'eggs (cooked)': 4, 'bread/baked': 5, 'other': 3
  };

  function toDate(iso){ var p = iso.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function toISO(d){ return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2); }

  function windowFor(category){
    return WINDOWS.hasOwnProperty(category) ? WINDOWS[category] : WINDOWS.other;
  }

  function eatByISO(cookedISO, category){
    var d = toDate(cookedISO);
    d.setUTCDate(d.getUTCDate() + windowFor(category));
    return toISO(d);
  }

  function daysLeft(todayISO, eatByISO_){
    return Math.round((toDate(eatByISO_).getTime() - toDate(todayISO).getTime()) / 86400000);
  }

  /* status: toss (past) / today (0 left) / soon (1 left) / fresh */
  function status(todayISO, cookedISO, category){
    var d = daysLeft(todayISO, eatByISO(cookedISO, category));
    if (d < 0) return 'toss';
    if (d === 0) return 'today';
    if (d === 1) return 'soon';
    return 'fresh';
  }

  function daysLabel(todayISO, cookedISO, category){
    var d = daysLeft(todayISO, eatByISO(cookedISO, category));
    if (d < 0) return 'toss - ' + (-d) + ' day' + (-d === 1 ? '' : 's') + ' over';
    if (d === 0) return 'eat today';
    if (d === 1) return '1 day left';
    return d + ' days left';
  }

  /* order: toss sinks to bottom, then soonest deadline first */
  function sortItems(items, todayISO){
    return items.slice().sort(function(a, b){
      var ea = eatByISO(a.cooked, a.category);
      var eb = eatByISO(b.cooked, b.category);
      var da = daysLeft(todayISO, ea), db = daysLeft(todayISO, eb);
      var xa = da < 0, xb = db < 0;
      if (xa !== xb) return xa ? 1 : -1;
      return da - db;
    });
  }

  /* counts for the banner: {today: n, toss: n} */
  function counts(items, todayISO){
    var c = { today: 0, soon: 0, toss: 0, fresh: 0 };
    for (var i = 0; i < items.length; i++){
      c[status(todayISO, items[i].cooked, items[i].category)]++;
    }
    return c;
  }

  function fmtISO(iso){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var p = iso.split('-');
    return months[+p[1] - 1] + ' ' + (+p[2]);
  }

  return {
    WINDOWS: WINDOWS,
    windowFor: windowFor,
    eatByISO: eatByISO,
    daysLeft: daysLeft,
    status: status,
    daysLabel: daysLabel,
    sortItems: sortItems,
    counts: counts,
    fmtISO: fmtISO
  };
});
