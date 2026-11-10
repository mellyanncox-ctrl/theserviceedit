/* TSE SITE STATS (10 Nov 2026). Cookieless visitor counts for theserviceedit.com, stored in the TSE Supabase project.
   No cookies set, no IP stored. Skips Mel's own browsers (tse_me cookie from ?me=1 on any showcase), ?qa=1 and automated browsers.
   Logs: page views, time on page (15/30/60/120/300s), clicks on buttons, email/phone links and outbound links, enquiry form submits. */
(function(){
  var EP='https://rxwjactnfsrakpagbiit.supabase.co/functions/v1/site/e';
  var q,s;
  try{
    q=new URLSearchParams(location.search);
    if(q.get('me')==='1'){document.cookie='tse_me=1; domain=.theserviceedit.com; path=/; max-age=315360000; secure; samesite=lax';}
    if(/(^|;\s*)tse_me=1/.test(document.cookie)||q.get('qa')==='1'||navigator.webdriver)return;
    s=sessionStorage.getItem('tse_ss');
    if(!s){s=Math.random().toString(36).slice(2,12)+Date.now().toString(36);sessionStorage.setItem('tse_ss',s);}
  }catch(e){return;}
  var path=location.pathname.replace(/\.html$/,'')||'/';
  function send(e,d){
    var body=JSON.stringify({e:e,p:path,d:String(d||''),r:document.referrer||'',us:q.get('utm_source')||'',um:q.get('utm_medium')||'',uc:q.get('utm_campaign')||'',s:s});
    try{if(navigator.sendBeacon&&navigator.sendBeacon(EP,body))return;}catch(x){}
    try{fetch(EP,{method:'POST',body:body,mode:'no-cors',keepalive:true});}catch(x){}
  }
  send('view');
  var secs=0,marks=[15,30,60,120,300],done={};
  setInterval(function(){
    if(document.visibilityState!=='visible')return;
    secs++;
    if(marks.indexOf(secs)>-1&&!done[secs]){done[secs]=1;send('engaged',secs);}
  },1000);
  document.addEventListener('click',function(ev){
    var a=ev.target&&ev.target.closest?ev.target.closest('a[href],button'):null;
    if(!a)return;
    var href=a.getAttribute('href')||'';
    var label=(a.textContent||'').replace(/\s+/g,' ').trim().slice(0,60);
    var out=/^https?:/i.test(href)&&a.hostname&&a.hostname!==location.hostname;
    var isBtn=a.tagName==='BUTTON'||/btn|button|cta/i.test(a.className||'');
    if(/^(mailto|tel):/i.test(href)||out||isBtn)send('click',label+'|'+href);
  },true);
  document.addEventListener('submit',function(ev){
    var f=ev.target;send('form',(f&&(f.id||f.getAttribute('name')))||'form');
  },true);
})();
