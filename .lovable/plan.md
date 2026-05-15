## Sorun
`src/components/PasswordGate.tsx` içinde şifre zaten `migros2024` olarak tanımlı, ancak tarayıcıda kabul edilmiyor. Olası nedenler:
1. `sessionStorage` içindeki eski `od360_auth` değeri veya eski şifre denemesinden kalan state
2. HMR'ın güncellenmiş dosyayı yansıtmaması
3. Şifre karşılaştırmasında boşluk/whitespace farkı (kopyala-yapıştır kaynaklı)

## Yapılacaklar

1. **`src/components/PasswordGate.tsx`** güncellemesi:
   - `PASSWORD` sabitini açıkça `"migros2024"` olarak ayarla (zaten öyle, doğrula).
   - Karşılaştırmayı `value.trim() === PASSWORD` olarak değiştir (yanlışlıkla eklenen boşlukları tolere etmek için).
   - Şifre versiyonu değiştiğinde eski oturumu geçersiz kılmak için `STORAGE_KEY` değerini `od360_auth_v2` yap (eski cache'lenmiş "1" değerleri ile çakışmayı önler — ama burada sadece doğrulamayı geçmiş kullanıcılar etkilenir; yine de güvenli tarafta kalmak için bırakılabilir).
   - Hatalı denemeden sonra input'a tekrar focus ver.

2. **Doğrulama**: Preview'da `migros2024` ile giriş denenecek; hata kalırsa console/network log'larına bakılacak.

## Not
Şifreyi ileride değiştirmek için sadece `PasswordGate.tsx` dosyasındaki `PASSWORD` sabitini güncellemek yeterli.