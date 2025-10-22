# IPFS Integration Setup Guide

This guide will help you set up IPFS metadata for your NFT badges using Pinata.

## 📋 Prerequisites

- [ ] Pinata account (free tier is sufficient)
- [ ] Contract deployed on Base Sepolia
- [ ] You are the contract owner
- [ ] Courses created in Supabase database

---

## Step 1: Get Pinata API Credentials

1. Go to [pinata.cloud](https://pinata.cloud) and create an account
2. Navigate to **API Keys** section
3. Click **New Key**
4. Give it a name (e.g., "SynauLearn")
5. Enable permissions:
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
6. Copy the **JWT token** (starts with `eyJ...`)

---

## Step 2: Update Environment Variables

1. Open your `.env` file
2. Add your Pinata JWT:

```env
PINATA_JWT=your_jwt_token_here
NEXT_PUBLIC_PINATA_GATEWAY=gateway.pinata.cloud
```

3. Save the file

---

## Step 3: Update Course Mapping

1. Open `lib/courseMapping.ts`
2. Get your course UUIDs from Supabase:

```sql
SELECT id, title FROM courses ORDER BY created_at;
```

3. Add mappings to `courseIdToNumber`:

```typescript
export const courseIdToNumber: Record<string, number> = {
  '9bea6cc1-8a0f-4aad-9d10-2984bf70368f': 1,
  'your-second-course-uuid': 2,
  'your-third-course-uuid': 3,
  // ... add all your courses
};
```

4. Save the file

---

## Step 4: Run IPFS Setup Script

This script will:
- Generate badge images for all courses
- Upload images to IPFS
- Generate metadata JSON files
- Upload metadata folder to IPFS

```bash
npm run setup-ipfs
```

**Expected Output:**
```
🚀 Starting IPFS Setup...

📊 Checking course mappings...
   ✅ 3 courses mapped

🎨 Generating and uploading badge images...
   ✅ Image uploaded: ipfs://QmXXX.../badge-1.svg
   ✅ Image uploaded: ipfs://QmXXX.../badge-2.svg
   ...

📁 Uploading metadata folder to IPFS...
   ✅ Folder uploaded: ipfs://QmFolderHash.../

🔗 Contract BaseURI:
   ipfs://QmFolderHash.../

📋 Next Steps:
   1. Copy the baseURI above
   2. Run: npm run set-baseuri "ipfs://QmFolderHash.../"
```

**Copy the IPFS folder URL** (starts with `ipfs://Qm...`) - you'll need it for the next step!

---

## Step 5: Set BaseURI on Contract

**IMPORTANT:** You must be the contract owner and connected with the owner wallet!

```bash
npm run set-baseuri "ipfs://QmYourFolderHashHere.../"
```

Make sure to:
- ✅ Include the full `ipfs://` URL
- ✅ End with a trailing slash `/`
- ✅ Use quotes around the URL

The script will:
1. Show current baseURI
2. Send transaction (approve in your wallet!)
3. Wait for confirmation
4. Verify the update

**Expected Output:**
```
🔗 Setting Contract BaseURI

📝 Proposed Change:
   From: (empty)
   To:   ipfs://QmFolder.../

🔄 Sending transaction...
   📊 Setting baseURI to: ipfs://QmFolder.../

✅ Transaction sent successfully!
   Transaction Hash: 0xabc123...

🎉 Setup complete! Users can now mint badges.
```

---

## Step 6: Verify Setup

### Test Metadata Access

1. Get your folder CID from the output (e.g., `QmXyZ123...`)
2. Visit: `https://gateway.pinata.cloud/ipfs/QmXyZ123.../1.json`
3. You should see JSON metadata for course 1

### Test on Contract

```typescript
// In browser console or test script
import { BadgeContract } from './lib/badgeContract';

// Check baseURI
const baseURI = await BadgeContract.getBaseURI();
console.log('BaseURI:', baseURI);
// Should output: ipfs://QmYourFolder.../
```

### Test Minting

1. Complete a course
2. Click "Mint Badge"
3. Approve transaction
4. Badge should mint successfully!

---

## 🎯 You're Done!

Users can now mint NFT badges that are stored on IPFS! The badges will:
- ✅ Be visible in MetaMask
- ✅ Show up on OpenSea
- ✅ Have permanent, decentralized metadata
- ✅ Display proper images and attributes

---

## 🔄 Adding New Courses (Future)

When you add a new course:

1. **Add to mapping** in `lib/courseMapping.ts`:
   ```typescript
   'new-course-uuid': 4,  // next number
   ```

2. **Re-run setup script**:
   ```bash
   npm run setup-ipfs
   ```

3. **Update baseURI** with new folder CID:
   ```bash
   npm run set-baseuri "ipfs://NewFolderCID.../"
   ```

**Note:** Old badges continue working! They store the full tokenURI, not just the courseId.

---

## 🐛 Troubleshooting

### Error: "No courses mapped"
- Check `lib/courseMapping.ts` has entries
- Verify UUIDs match database exactly

### Error: "Failed to upload to IPFS"
- Check PINATA_JWT is correct in `.env`
- Verify internet connection
- Check Pinata dashboard for API limits

### Error: "Transaction rejected"
- Ensure you're connected as contract owner
- Check you have enough Base Sepolia ETH for gas
- Verify you're on Base Sepolia network

### Metadata not loading
- Wait 1-2 minutes for IPFS propagation
- Try different gateway: `https://ipfs.io/ipfs/...`
- Check folder CID is correct in baseURI

---

## 📚 Useful Commands

```bash
# Setup IPFS (run once, or when adding courses)
npm run setup-ipfs

# Set contract baseURI (run after setup-ipfs)
npm run set-baseuri "ipfs://QmFolder.../"

# Check current baseURI
# (Use browser console with badgeContract.ts functions)
```

---

## 📁 Files Created

```
lib/
├── ipfs.ts              # Pinata integration
├── metadata.ts          # Metadata generation
├── imageGenerator.ts    # SVG badge creation
└── courseMapping.ts     # UUID to number mapping

scripts/
├── setupIPFS.ts         # Upload metadata to IPFS
└── setBaseURI.ts        # Set contract baseURI

.env.example             # Environment template
```

---

## 🎨 Customizing Badge Images

Edit `lib/imageGenerator.ts` to customize:
- Colors/gradients
- Badge size
- Text styling
- Decorative elements

After changes, re-run `npm run setup-ipfs` to regenerate and re-upload.

---

## 💡 Tips

- Keep your Pinata JWT secret (never commit to Git)
- Test on a single course first before uploading all
- Save your folder CIDs for reference
- IPFS is immutable - you can't edit files, only upload new versions
- Use Pinata's web interface to manage pinned files

---

## 🆘 Need Help?

- Pinata Docs: https://docs.pinata.cloud
- IPFS Docs: https://docs.ipfs.tech
- Base Sepolia Faucet: https://faucet.quicknode.com/base/sepolia

---

Happy minting! 🚀✨
