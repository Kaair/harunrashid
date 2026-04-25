# মানিকগঞ্জ নাগরিক সেবা প্ল্যাটফর্ম

একটি আধুনিক, দ্রুত, নিরাপদ এবং মোবাইল-ফার্স্ট পাবলিক সার্ভিস প্ল্যাটফর্ম যেখানে নাগরিকরা সমস্যা জমা দিতে পারে, অগ্রগতি ট্র্যাক করতে পারে এবং প্রার্থীর সাথে যোগাযোগ করতে পারে।

## বৈশিষ্ট্যসমূহ

### ফ্রন্টএন্ড
- **Next.js 14 (App Router)** + TypeScript
- **Tailwind CSS** স্টাইলিং
- **Framer Motion** অ্যানিমেশন
- **Recharts** ড্যাশবোর্ড চার্ট
- **Lucide React** আইকন
- **React Hot Toast** নোটিফিকেশন
- **Mobile-First** রেসপন্সিভ ডিজাইন
- **Bengali Fonts** (Hind Siliguri, Noto Sans Bengali)

### ব্যাকএন্ড
- **Node.js API Routes**
- **MongoDB** ডাটাবেস
- **Mongoose** ODM
- **OTP-based Authentication**
- **Twilio SMS Integration**
- **Cloudinary** ইমেজ আপলোড
- **JWT** অথেনটিকেশন

### মূল ফিচার
- অভিযোগ জমা দেওয়া সিস্টেম
- ট্র্যাকিং আইডি জেনারেশন
- লাইভ পাবলিক ড্যাশবোর্ড
- প্রার্থী প্রোফাইল সেকশন
- ইশতেহার সেকশন
- স্বেচ্ছাসেবক রেজিস্ট্রেশন
- মিডিয়া ও আপডেট সেকশন
- অ্যাডমিন প্যানেল
- SMS নোটিফিকেশন

## ফোল্ডার স্ট্রাকচার

```
manikganj-citizen-service/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── complaints/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── volunteers/
│   │   │       └── export/
│   │   │           └── route.ts
│   │   ├── auth/
│   │   │   ├── send-otp/
│   │   │   │   └── route.ts
│   │   │   └── verify-otp/
│   │   │       └── route.ts
│   │   ├── complaints/
│   │   │   ├── route.ts
│   │   │   └── stats/
│   │   │       └── route.ts
│   │   ├── upload/
│   │   │   └── route.ts
│   │   └── volunteers/
│   │       └── route.ts
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── login/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Dashboard.tsx
│   ├── ComplaintForm.tsx
│   ├── TrackingSection.tsx
│   ├── Profile.tsx
│   ├── Manifesto.tsx
│   ├── VolunteerForm.tsx
│   ├── MediaSection.tsx
│   └── Footer.tsx
├── lib/
│   ├── mongodb.ts
│   ├── sms.ts
│   └── utils.ts
├── models/
│   ├── Complaint.ts
│   ├── User.ts
│   └── Volunteer.ts
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## সেটআপ নির্দেশাবলী

### প্রয়োজনীয় সফটওয়্যার

- Node.js (v18 বা উচ্চতর)
- MongoDB (স্থানীয় বা MongoDB Atlas)
- npm বা yarn

### ইনস্টলেশন ধাপ

1. **রিপোজিটরি ক্লোন করুন**

```bash
git clone <repository-url>
cd manikganj-citizen-service
```

2. **ডিপেন্ডেন্সি ইনস্টল করুন**

```bash
npm install
```

3. **এনভায়রনমেন্ট ভেরিয়েবল সেট করুন**

`.env.example` ফাইলটি `.env` নামে কপি করুন এবং আপনার মান প্রদান করুন:

```bash
cp .env.example .env
```

`.env` ফাইলে নিম্নলিখিত মান প্রদান করুন:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/manikganj-citizen-service

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Twilio SMS
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Admin
ADMIN_PASSWORD=your-secure-admin-password

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **MongoDB সেটআপ**

স্থানীয় MongoDB ইনস্টল করুন:

```bash
# Windows
ডাউনলোড এবং ইনস্টল করুন: https://www.mongodb.com/try/download/community

# Linux/Mac
brew tap mongodb/brew
brew install mongodb-community
```

MongoDB সার্ভার শুরু করুন:

```bash
# Windows
mongod

# Linux/Mac
brew services start mongodb-community
```

অথবা MongoDB Atlas ব্যবহার করুন (ক্লাউড):
1. https://www.mongodb.com/atlas এ গিয়ে একটি ফ্রি অ্যাকাউন্ট তৈরি করুন
2. একটি ক্লাস্টার তৈরি করুন
3. কানেকশন স্ট্রিং কপি করুন
4. `.env` ফাইলে `MONGODB_URI` সেট করুন

5. **Twilio সেটআপ (SMS এর জন্য)**

1. https://www.twilio.com/ এ গিয়ে একটি অ্যাকাউন্ট তৈরি করুন
2. একটি ফ্রি ট্রায়াল নম্বার পান
3. Account SID, Auth Token, এবং Phone Number কপি করুন
4. `.env` ফাইলে মানগুলি সেট করুন

6. **Cloudinary সেটআপ (ইমেজ আপলোডের জন্য)**

1. https://cloudinary.com/ এ গিয়ে একটি ফ্রি অ্যাকাউন্ট তৈরি করুন
2. Cloud Name, API Key, এবং API Secret কপি করুন
3. `.env` ফাইলে মানগুলি সেট করুন

7. **ডেভেলপমেন্ট সার্ভার চালু করুন**

```bash
npm run dev
```

8. **ব্রাউজারে খুলুন**

```
http://localhost:3000
```

## ব্যবহার নির্দেশিকা

### পাবলিক ইউজার

1. **অভিযোগ জমা দেওয়া**
   - "অভিযোগ জানান" সেকশনে যান
   - ফর্ম পূরণ করুন
   - মোবাইল নম্বার ভেরিফাই করুন (OTP)
   - ছবি আপলোড করুন (ঐচ্ছিক)
   - ট্র্যাকিং আইডি পান

2. **অভিযোগ ট্র্যাক করা**
   - "অভিযোগ ট্র্যাক করুন" সেকশনে যান
   - ট্র্যাকিং আইডি লিখুন
   - স্ট্যাটাস দেখুন

3. **স্বেচ্ছাসেবক হিসেবে যোগ দেওয়া**
   - "স্বেচ্ছাসেবক" সেকশনে যান
   - ফর্ম পূরণ করুন
   - নিবন্ধন করুন

### অ্যাডমিন প্যানেল

1. **লগইন করুন**
   - `/admin/login` এ যান
   - পাসওয়ার্ড দিয়ে লগইন করুন

2. **ড্যাশবোর্ড**
   - সকল অভিযোগ দেখুন
   - স্ট্যাটাস ফিল্টার করুন
   - স্ট্যাটাস আপডেট করুন
   - অভিযোগ মুছে ফেলুন
   - স্বেচ্ছাসেবক তালিকা রপ্তানি করুন

## ডিপ্লয়মেন্ট

### Vercel এ ডিপ্লয় করা

1. **Vercel এ প্রজেক্ট আপলোড করুন**

```bash
npm install -g vercel
vercel
```

2. **এনভায়রনমেন্ট ভেরিয়েবল সেট করুন**

Vercel ড্যাশবোর্ডে গিয়ে Environment Variables সেকশনে সকল মান সেট করুন।

3. **MongoDB Atlas ব্যবহার করুন**

প্রোডাকশনের জন্য MongoDB Atlas ব্যবহার করা উচিত।

## টেকনোলজি স্ট্যাক

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express (API Routes)
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, OTP
- **SMS**: Twilio
- **File Storage**: Cloudinary
- **Deployment**: Vercel

## নিরাপত্তা

- HTTPS প্রয়োজনীয় (প্রোডাকশন)
- সংবেদনশীল ডাটা এনক্রিপ্ট করা হয়
- OTP ভেরিফিকেশন বাধ্যতামূলক
- বেসিক স্প্যাম প্রটেকশন

## পারফরম্যান্স

- SEO অপ্টিমাইজড
- দ্রুত লোডিং (<2s)
- ইমেজ অপ্টিমাইজেশন
- লেজি লোডিং

## লাইসেন্স

এই প্রজেক্টটি MIT লাইসেন্সের অধীনে লাইসেন্সকৃত।

## সাপোর্ট

সমস্যা বা প্রশ্ন থাকলে ইস্যু তৈরি করুন অথবা আমাদের সাথে যোগাযোগ করুন।

## অবদানকারী

অবদান স্বাগতম! পুল রিকোয়েস্ট পাঠান এবং আমরা রিভিউ করব।

---

**মানিকগঞ্জ নাগরিক সেবা প্ল্যাটফর্ম** - আপনার সমস্যা, আমার দায়িত্ব
