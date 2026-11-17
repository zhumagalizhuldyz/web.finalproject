
/* Educational client-side simulation only: do not reuse real passwords. */
(()=>{'use strict';
const $=(s)=>document.querySelector(s);
const safeGet=(k)=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}};
const userKey='rm_fan_users_v2', sessionKey='rm_fan_session_v2', themeKey='rm_theme_v2';
const users=()=>safeGet(userKey)||[];
const current=()=>users().find(u=>u.email===localStorage.getItem(sessionKey));
const setTheme=(dark)=>{document.body.classList.toggle('dark',dark);localStorage.setItem(themeKey,dark?'dark':'light');const b=$('#global-theme');if(b){b.textContent=dark?'☀ Light mode':'☾ Dark mode';b.setAttribute('aria-pressed',String(dark))}};
setTheme(localStorage.getItem(themeKey)==='dark');
$('#global-theme')?.addEventListener('click',()=>setTheme(!document.body.classList.contains('dark')));
$('#global-logout')?.addEventListener('click',()=>{localStorage.removeItem(sessionKey);location.href='login.html'});
const emailOK=(e)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const passOK=(s)=>s.length>=8&&/[A-Z]/.test(s)&&/[a-z]/.test(s)&&/[0-9]/.test(s);
const show=(id,msg)=>{const el=$(id);if(el){el.textContent=msg;el.setAttribute('role','status')}};
const register=$('#registerForm');
if(register){register.addEventListener('submit',(ev)=>{
 const name=($('#reg-first-name')?.value||'').trim(),last=($('#reg-last-name')?.value||'').trim(),email=($('#reg-email')?.value||'').trim().toLowerCase(),pass=$('#reg-password')?.value||'',confirm=$('#reg-confirm-password')?.value||'';
 const phone=register.querySelector('input[type=tel]');
 let error='';
 if(name.length<2||last.length<2)error='Please enter your first and last names (at least 2 characters).';
 else if(!emailOK(email))error='Please enter a valid email address.';
 else if(!passOK(pass))error='Password must have 8+ characters, uppercase, lowercase and a number.';
 else if(pass!==confirm)error='Passwords do not match.';
 else if(phone&&phone.value.trim()&&!/^\+?[0-9 ()-]{10,18}$/.test(phone.value.trim()))error='Please enter a valid phone number.';
 else if(users().some(u=>u.email===email))error='This email is already registered. Please log in.';
 if(error){ev.preventDefault();ev.stopImmediatePropagation();show('#final-register-error',error);return;}
 const all=users();all.push({name:name+' '+last,email,password:pass,phone:phone?.value.trim()||''});localStorage.setItem(userKey,JSON.stringify(all));localStorage.setItem(sessionKey,email);
 ev.preventDefault();ev.stopImmediatePropagation();location.href='profile.html';
 },true);}
const login=$('#final-login-form');if(login)login.addEventListener('submit',ev=>{ev.preventDefault();const email=$('#login-email').value.trim().toLowerCase(),pass=$('#login-password').value;
 if(!emailOK(email)){show('#login-error','Please enter a valid email address.');return}
 if(!pass){show('#login-error','Password is required.');return}
 const found=users().find(u=>u.email===email&&u.password===pass);
 if(!found){show('#login-error','Incorrect email or password.');return}
 localStorage.setItem(sessionKey,email);location.href='profile.html';});
if($('#profile-details')){const u=current();if(!u){location.replace('login.html')}else{$('#profile-details').textContent='Name: '+u.name+' | Email: '+u.email+(u.phone?' | Phone: '+u.phone:'')}}
const search=$('#final-player-search');if(search){const cards=[...document.querySelectorAll('.player-card')];const apply=()=>{const q=search.value.trim().toLowerCase();let count=0;cards.forEach(card=>{const matches=card.textContent.toLowerCase().includes(q);card.hidden=!matches;card.style.display=matches?'':'none';if(matches)count++});show('#final-search-count',count+' matching player or staff cards');};search.addEventListener('input',apply);apply();}
})();
