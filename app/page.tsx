'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);
    alert('회원가입 완료. 바로 로그인하거나 items/new로 이동해 테스트해보세요.');
  }
  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    alert('로그인 성공!');
  }
  async function signOut() {
    await supabase.auth.signOut();
    alert('로그아웃');
  }

  return (
    <main style={{maxWidth: 520, margin: '40px auto', padding: 16}}>
      <h1 style={{fontSize: 24, fontWeight: 700}}>Wardrobe Demo</h1>
      <p>이메일/비밀번호로 로그인한 뒤 <a href="./items/new">아이템 등록</a>을 테스트하세요.</p>
      <div style={{display: 'grid', gap: 8, marginTop: 16}}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={signUp}>회원가입</button>
        <button onClick={signIn}>로그인</button>
        <button onClick={signOut}>로그아웃</button>
      </div>
    </main>
  );
}
