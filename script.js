// script.js
const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('formMessage');

// field refs
const fields = {
  fullname: document.getElementById('fullname'),
  email: document.getElementById('email'),
  username: document.getElementById('username'),
  password: document.getElementById('password'),
  confirm: document.getElementById('confirm'),
  phone: document.getElementById('phone'),
  age: document.getElementById('age'),
  terms: document.getElementById('terms')
};

// error helpers
function setError(id, text) {
  const el = document.getElementById('err-' + id);
  el.textContent = text || '';
}
function clearAllErrors(){ Object.keys(fields).forEach(k => setError(k, '')); }

// validation rules (return error message string or empty)
function validateFullname(v){
  if(!v) return 'Full name is required.';
  if(!/^[A-Za-z\s]{3,80}$/.test(v)) return 'Use only letters and spaces (3-80 chars).';
  return '';
}
function validateEmail(v){
  if(!v) return 'Email is required.';
  // simple but practical regex
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email.';
  return '';
}
function validateUsername(v){
  if(!v) return 'Username required.';
  if(!/^[A-Za-z0-9._-]{3,20}$/.test(v)) return '3-20 chars: letters, numbers, . _ -';
  return '';
}
function validatePassword(v){
  if(!v) return 'Password required.';
  if(v.length < 8) return 'Password must be at least 8 characters.';
  if(!/[A-Z]/.test(v)) return 'Include at least one uppercase letter.';
  if(!/[0-9]/.test(v)) return 'Include at least one number.';
  if(!/[!@#$%^&*()_\-+=\[\]{};:"\\|,.<>\/?]/.test(v)) return 'Include at least one special character.';
  return '';
}
function validateConfirm(pass, conf){
  if(!conf) return 'Please confirm your password.';
  if(pass !== conf) return 'Passwords do not match.';
  return '';
}
function validatePhone(v){
  if(!v) return '';
  if(!/^\d{10}$/.test(v)) return 'Phone must be 10 digits.';
  return '';
}
function validateAge(v){
  if(!v) return '';
  const n = Number(v);
  if(Number.isNaN(n) || n < 13 || n > 120) return 'Enter a valid age (13-120).';
  return '';
}
function validateTerms(checked){
  if(!checked) return 'You must accept terms.';
  return '';
}

// run validation for one field and show error
function validateField(name){
  let err = '';
  const val = fields[name].type === 'checkbox' ? fields[name].checked : fields[name].value.trim();
  switch(name){
    case 'fullname': err = validateFullname(val); break;
    case 'email': err = validateEmail(val); break;
    case 'username': err = validateUsername(val); break;
    case 'password': err = validatePassword(val); 
      // also validate confirm if present
      setError('password', err);
      if(fields.confirm.value) setError('confirm', validateConfirm(fields.password.value, fields.confirm.value));
      return;
    case 'confirm': err = validateConfirm(fields.password.value, val); break;
    case 'phone': err = validatePhone(val); break;
    case 'age': err = validateAge(val); break;
    case 'terms': err = validateTerms(val); break;
    default: break;
  }
  setError(name, err);
}

// check overall form validity, return boolean
function isFormValid(){
  clearAllErrors();
  const checks = [
    ['fullname', validateFullname(fields.fullname.value.trim())],
    ['email', validateEmail(fields.email.value.trim())],
    ['username', validateUsername(fields.username.value.trim())],
    ['password', validatePassword(fields.password.value)],
    ['confirm', validateConfirm(fields.password.value, fields.confirm.value)],
    ['phone', validatePhone(fields.phone.value.trim())],
    ['age', validateAge(fields.age.value.trim())],
    ['terms', validateTerms(fields.terms.checked)]
  ];
  let ok = true;
  checks.forEach(([name, err]) => {
    if(err){ ok = false; setError(name, err); }
  });
  return ok;
}

// attach real-time listeners
Object.keys(fields).forEach(name=>{
  const el = fields[name];
  const ev = el.type === 'checkbox' ? 'change' : 'input';
  el.addEventListener(ev, ()=> validateField(name));
});

// prevent spam submit while processing
function setLoading(loading){
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? 'Submitting...' : 'Create account';
}

// submit handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  message.textContent = '';
  if(!isFormValid()) {
    message.textContent = 'Please fix errors before submitting.';
    message.style.color = 'var(--err)';
    return;
  }
  // simulate server call
  setLoading(true);
  try{
    // Example: client would send to server here
    const payload = {
      fullname: fields.fullname.value.trim(),
      email: fields.email.value.trim(),
      username: fields.username.value.trim()
    };
    // simulate latency
    await new Promise(r => setTimeout(r, 700));
    // assume success
    message.style.color = 'green';
    message.textContent = 'Account created successfully (mock).';
    form.reset();
  } catch(err){
    message.style.color = 'var(--err)';
    message.textContent = 'Server error. Try later.';
  } finally {
    setLoading(false);
  }
});
