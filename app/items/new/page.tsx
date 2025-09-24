'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewItem() {
  const [file, setFile] = useState<File|null>(null);
  const [category, setCategory] = useState('TOP');
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert('이미지를 선택하세요');
    setSaving(true);

    // 세션 확인
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) { setSaving(false); return alert('로그인이 필요합니다.'); }
    const userId = session.user.id;

    // 1) items 레코드 생성
    const { data: item, error } = await supabase.from('items')
      .insert({ user_id: userId, category })
      .select('*').single();
    if (error || !item) { setSaving(false); return alert(error?.message || 'insert 실패'); }

    // 2) 원본 업로드
    const ext = (file.name.split('.').pop() || 'png');
    const rawPath = `wardrobe/raw/${userId}/${item.id}.${ext}`;
    const up = await supabase.storage.from('wardrobe').upload(rawPath, file, { upsert: true });
    if (up.error) { setSaving(false); return alert(up.error.message); }

    await supabase.from('items').update({ raw_photo_url: rawPath }).eq('id', item.id);

    // 3) 사인드 URL 발급
    const signed = await supabase.storage.from('wardrobe').createSignedUrl(rawPath, 300);
    if (signed.error || !signed.data) { setSaving(false); return alert(signed.error?.message || 'signed url 실패'); }

    // 4) 엣지 함수 호출 (유저 토큰)
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/background-remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify({ signedUrl: signed.data.signedUrl, itemId: item.id })
    });
    if (!res.ok) { setSaving(false); return alert(await res.text()); }
    const json = await res.json() as { cutoutPath: string };

    setSaving(false);
    alert('등록 완료! cutout: ' + json.cutoutPath);
  }

  return (
    <main style={{maxWidth: 520, margin: '40px auto', padding: 16}}>
      <h1 style={{fontSize: 20, fontWeight: 700}}>아이템 등록</h1>
      <form onSubmit={onSubmit} style={{display: 'grid', gap: 8, marginTop: 12}}>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option>TOP</option><option>BOTTOM</option><option>OUTER</option>
          <option>DRESS</option><option>SHOES</option><option>ACC</option>
        </select>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
        <button disabled={saving}>{saving ? '처리 중...' : '저장'}</button>
      </form>
      <p style={{marginTop: 16}}><a href="/">← 홈으로</a></p>
    </main>
  );
}
