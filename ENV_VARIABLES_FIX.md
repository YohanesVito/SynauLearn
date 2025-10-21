# Environment Variables Fix

## Problem: Node.js Scripts Can't Access NEXT_PUBLIC_* Variables

### Why This Happens

Next.js has a special convention:
- Variables prefixed with `NEXT_PUBLIC_*` are **only** available in the browser and Next.js build process
- They are **NOT** available in regular Node.js scripts (like our `setupIPFS.ts`)

### The Error

```
Error: supabaseUrl is required.
```

This happens because when you run `npm run setup-ipfs`, it's a Node.js script that can't see `NEXT_PUBLIC_SUPABASE_URL`.

---

## Solution

We need **two versions** of each environment variable:

1. `NEXT_PUBLIC_*` - For browser/Next.js
2. Regular name - For Node.js scripts

### Updated .env File

```env
# For browser/Next.js
NEXT_PUBLIC_SUPABASE_URL=https://rmhwjjnoxusnrcsfnomy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# For Node.js scripts (same values, different names)
SUPABASE_URL=https://rmhwjjnoxusnrcsfnomy.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...

# Pinata (same pattern)
NEXT_PUBLIC_PINATA_GATEWAY=scarlet-abstract-dog-422.mypinata.cloud
PINATA_GATEWAY=scarlet-abstract-dog-422.mypinata.cloud
PINATA_JWT=eyJhbGc...
```

---

## Files Updated

### 1. `lib/supabase.ts`

**Before:**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
```

**After:**
```typescript
// Try NEXT_PUBLIC_ first (browser), fallback to regular (Node.js)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required...');
}
```

### 2. `lib/ipfs.ts`

**Before:**
```typescript
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud",
});
```

**After:**
```typescript
const getGateway = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";
  }
  return process.env.PINATA_GATEWAY || process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud";
};

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: getGateway(),
});
```

---

## How It Works Now

### In Browser (Next.js App):
```
Uses: NEXT_PUBLIC_SUPABASE_URL
Uses: NEXT_PUBLIC_PINATA_GATEWAY
✅ Works!
```

### In Node.js Scripts:
```
Uses: SUPABASE_URL (fallback)
Uses: PINATA_GATEWAY (fallback)
✅ Works!
```

### Smart Fallback Logic:
```typescript
// Try browser variable first, then Node.js variable, then default
process.env.NEXT_PUBLIC_VAR || process.env.VAR || 'default'
```

---

## Testing

Now both should work:

### Browser/Next.js:
```bash
npm run dev
# ✅ Uses NEXT_PUBLIC_* variables
```

### Node.js Scripts:
```bash
npm run setup-ipfs
# ✅ Uses non-prefixed variables
```

---

## Important Notes

1. **Keep values in sync**: Both versions (`NEXT_PUBLIC_*` and regular) should have the **same value**
2. **Security**: Never commit `.env` file to Git
3. **Deployment**: Make sure to set both versions in your deployment environment (Vercel, etc.)

---

## Environment Variable Checklist

Make sure you have all of these in your `.env`:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_ANON_KEY`
- [ ] `NEXT_PUBLIC_PINATA_GATEWAY` + `PINATA_GATEWAY`
- [ ] `PINATA_JWT` (no NEXT_PUBLIC_ needed, only used in scripts)

---

## ✅ Fixed!

The scripts should now work correctly without the "supabaseUrl is required" error.

Try running:
```bash
npm run setup-ipfs
```

It should now successfully connect to Supabase and Pinata! 🎉
