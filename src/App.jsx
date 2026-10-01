import { useEffect, useState } from 'react';

const T = {
  fa: {
    title: 'تمرین پلی‌رایت', email: 'ایمیل', password: 'رمز عبور', login: 'ورود',
    loginError: 'ایمیل یا رمز عبور اشتباه است', welcome: 'خوش آمدی', logout: 'خروج',
    menu: 'منو', lang: 'English', todos: 'کارهای من', newTodo: 'کار جدید', add: 'افزودن',
    empty: 'هنوز کاری اضافه نشده', remove: 'حذف', products: 'محصولات',
    loading: 'در حال بارگذاری...', fetchError: 'خطا در دریافت محصولات', retry: 'تلاش دوباره',
    home: 'خانه', about: 'درباره ما',
  },
  en: {
    title: 'Playwright Practice', email: 'Email', password: 'Password', login: 'Login',
    loginError: 'Invalid email or password', welcome: 'Welcome', logout: 'Logout',
    menu: 'Menu', lang: 'فارسی', todos: 'My todos', newTodo: 'New todo', add: 'Add',
    empty: 'No todos yet', remove: 'Delete', products: 'Products',
    loading: 'Loading...', fetchError: 'Failed to load products', retry: 'Retry',
    home: 'Home', about: 'About',
  },
};

function Login({ t, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (email === 'test@test.com' && password === '1234') onLogin(email);
    else setError(true);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>{t.login}</h2>
      <label>
        {t.email}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        {t.password}
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p role="alert" className="error">{t.loginError}</p>}
      <button type="submit">{t.login}</button>
    </form>
  );
}

function Todos({ t }) {
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);

  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setItems([...items, { id: Date.now(), text: text.trim(), done: false }]);
    setText('');
  };
  const toggle = (id) => setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const remove = (id) => setItems(items.filter((i) => i.id !== id));

  return (
    <section className="card">
      <h2>{t.todos}</h2>
      <form onSubmit={add} className="row">
        <label className="grow">
          <span className="sr-only">{t.newTodo}</span>
          <input placeholder={t.newTodo} aria-label={t.newTodo} value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <button type="submit">{t.add}</button>
      </form>
      {items.length === 0 ? (
        <p className="muted">{t.empty}</p>
      ) : (
        <ul>
          {items.map((i) => (
            <li key={i.id} className="row">
              <label className="grow">
                <input type="checkbox" checked={i.done} onChange={() => toggle(i.id)} />
                <span className={i.done ? 'done' : ''}>{i.text}</span>
              </label>
              <button onClick={() => remove(i.id)}>{t.remove}</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Products({ t, lang }) {
  const [state, setState] = useState({ status: 'loading', data: [] });

  const load = () => {
    setState({ status: 'loading', data: [] });
    fetch('/products.json')
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => setState({ status: 'ok', data }))
      .catch(() => setState({ status: 'error', data: [] }));
  };
  useEffect(load, []);

  return (
    <section className="card">
      <h2>{t.products}</h2>
      {state.status === 'loading' && <p>{t.loading}</p>}
      {state.status === 'error' && (
        <div role="alert" className="error">
          <p>{t.fetchError}</p>
          <button onClick={load}>{t.retry}</button>
        </div>
      )}
      {state.status === 'ok' && (
        <ul>
          {state.data.map((p) => (
            <li key={p.id}>
              {lang === 'fa' ? p.name : p.nameEn} — {p.price.toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function App() {
  const [lang, setLang] = useState('fa');
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = T[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.title = t.title;
  }, [lang, t.title]);

  return (
    <>
      <header className="header">
        <h1>{t.title}</h1>
        <button className="menu-btn" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {t.menu}
        </button>
        <nav aria-label="main" className={menuOpen ? 'nav open' : 'nav'}>
          <a href="#home">{t.home}</a>
          <a href="#about">{t.about}</a>
          <button onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}>{t.lang}</button>
          {user && <button onClick={() => setUser(null)}>{t.logout}</button>}
        </nav>
      </header>

      <main>
        {!user ? (
          <Login t={t} onLogin={setUser} />
        ) : (
          <>
            <p className="welcome">{t.welcome} {user}</p>
            <Todos t={t} />
            <Products t={t} lang={lang} />
          </>
        )}
      </main>
    </>
  );
}
