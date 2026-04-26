'use client';

import { GraduationCap, Briefcase, Heart, Award, User, Star, Facebook, Youtube, X } from 'lucide-react';

export default function Profile() {
  // মেয়রের ছবি - এখানে আপনার ছবির path দিন
  // যদি ছবি থাকে তাহলে "/mayor-large.webp" দিন, না থাকলে empty string রাখুন
  const mayorImage = "/mayor-large.webp";

  const education = [
    { degree: 'দাওরায়ে হাদিস (মাস্টার্স সমমান)', institution: 'জামিয়া রাহমানীয়া আরাবিয়া মাদ্রাসা', year: '২০০৬' },
    { degree: 'দারুস সুন্নাহ্', institution: 'ইসলামপুর গাফুরিয়া দারুস সুন্নাহ্ মাদ্রাসা', year: 'স্নাতক' },
    { degree: 'কওমি মাদ্রাসা', institution: 'সাভার ব্যাংক কলোনি কওমি মাদ্রাসা', year: 'উচ্চতর অধ্যয়ন' },
  ];

  const experience = [
    { role: 'সভাপতি', organization: 'মানিকগঞ্জ জেলা বিএনপি কেন্দ্রীয় কমিটি (সৌদি আরব শাখা)', period: 'বর্তমান' },
    { role: 'প্রবাসী কল্যাণ বিষয়ক সম্পাদক', organization: 'মানিকগঞ্জ জেলা বিএনপি', period: 'সাবেক' },
    { role: 'ভারপ্রাপ্ত সভাপতি', organization: 'আল খুবার মহানগর বিএনপি', period: 'সাবেক' },
    { role: 'সিনিয়র সহ-সভাপতি', organization: 'আল খুবার মহানগর বিএনপি', period: 'সাবেক' },
    { role: 'ধর্ম বিষয়ক ও যুগ্ম সাধারণ সম্পাদক', organization: 'দাম্মাম প্রাদেশিক বিএনপি', period: 'সাবেক' },
  ];

  const highlights = [
    '২০০১ সাল থেকে রাজনীতিতে সক্রিয় - ২৫+ বছরের অভিজ্ঞতা',
    'সৌদি আরবে বিএনপির বিভিন্ন গুরুত্বপূর্ণ পদে দায়িত্ব পালন',
    'মানব সেবা ফাউন্ডেশনের প্রতিষ্ঠাতা চেয়ারম্যান',
    'অসংখ্য ধর্মীয় ও শিক্ষা প্রতিষ্ঠানের উন্নয়নে সরাসরি সম্পৃক্ত',
  ];

  const contributions = [
    { title: 'মানব সেবা ফাউন্ডেশন', icon: Heart, color: 'from-rose-500 to-rose-600' },
    { title: 'ধর্মীয় প্রতিষ্ঠান উন্নয়ন', icon: GraduationCap, color: 'from-blue-500 to-blue-600' },
    { title: 'শিক্ষাবৃত্তি প্রদান', icon: Star, color: 'from-amber-500 to-amber-600' },
    { title: 'সামাজিক কর্মসূচি', icon: Award, color: 'from-green-500 to-green-600' },
  ];

  const achievements = [
    { value: '২৫+', label: 'বছর রাজনৈতিক অভিজ্ঞতা', icon: Star },
    { value: '১০+', label: 'গুরুত্বপূর্ণ পদে দায়িত্ব', icon: Award },
    { value: '৫০+', label: 'ধর্মীয় প্রতিষ্ঠান', icon: Heart },
  ];

  return (
    <section id="profile" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md overflow-hidden">
            {mayorImage ? (
              <img 
                src={mayorImage} 
                alt="মাওলানা হারুনুর রশিদ রাহমানী"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-4xl">👨‍💼</div>
            )}
          </div>
          <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900 font-heading mb-2">প্রার্থীর পরিচিতি</h2>
          <p className="text-gray-600 font-body">মানিকগঞ্জের স্বপ্ন সারথী</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            
            {/* Portrait */}
            <div className="md:col-span-1 flex flex-col items-center text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md overflow-hidden">
                {mayorImage ? (
                  <img 
                    src={mayorImage} 
                    alt="মাওলানা হারুনুর রশিদ রাহমানী"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-8xl">👨‍💼</div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 font-heading mb-1">মাওলানা হারুনুর রশিদ রাহমানী</h3>
              <p className="text-gray-600 font-body text-sm mb-4">মেয়র পদপ্রার্থী, মানিকগঞ্জ পৌরসভা</p>
              
              {/* Personal Slogan */}
              <div className="mb-3 px-4">
                <div className="bg-gradient-to-r from-primary-100 to-accent-100 px-3 py-2 rounded-lg border-l-4 border-primary-500">
                  <p className="font-heading text-sm font-bold text-gray-900">"সেবাই আমার ধর্ম"</p>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="mb-3 px-4">
                <p className="font-body text-xs text-gray-600 leading-relaxed">
                  সবাইকে আন্তরিক স্বাগতম। মানিকগঞ্জের উন্নয়নে আপনাদের সহযোগ আমাদের প্রেরণা।
                </p>
              </div>

              {/* Main Goal */}
              <div className="mb-3 px-4">
                <div className="bg-gradient-to-r from-gray-50 to-white px-3 py-2 rounded-lg border border-gray-200">
                  <p className="font-body text-xs text-gray-700 leading-relaxed">
                    <span className="font-bold text-gray-900">লক্ষ্য:</span> দুর্নীতিমুক্ত, আধুনিক ও সেবামূলক ডিজিটাল মানিকগঞ্জ গড়া।
                  </p>
                </div>
              </div>

              {/* Emotional Quote */}
              <div className="mb-3 px-4">
                <p className="font-heading text-lg leading-relaxed mb-2" style={{ color: '#0A1F44' }}>
                  আপনাদের <span className="font-bold" style={{ color: '#D4AF37' }}>দোয়া ও ভালোবাসা</span> নিয়েই, <span className="font-bold" style={{ color: '#D4AF37' }}>উন্নত মানিকগঞ্জ</span> গড়তে আমি বদ্ধপরিকর।
                </p>
                <p className="font-body text-xs italic text-gray-500">
                  আপনারা আমার আপনজন, দোয়া করবেন।
                </p>
              </div>

              {/* Motivational Message */}
              <div className="mb-4 px-4">
                <p className="font-body text-xs italic text-gray-500 leading-relaxed">
                  একসাথে কাজ করলে সব সম্ভব। আসুন, আমরা একটি উন্নত মানিকগঞ্জ গড়ি।
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <Youtube size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <X size={18} />
                </a>
              </div>
            </div>

            {/* Bio Info */}
            <div className="md:col-span-2 space-y-4">
              {/* Bio Details */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Briefcase size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 font-body">সাবেক প্রবাসী কল্যাণ বিষয়ক সম্পাদক</p>
                      <p className="text-gray-600 font-body text-sm">মানিকগঞ্জ জেলা বিএনপি</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Award size={16} className="text-accent-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 font-body">সভাপতি</p>
                      <p className="text-gray-600 font-body text-sm">সৌদি আরবস্থ মানিকগঞ্জ জেলা বিএনপি কেন্দ্রীয় কমিটি</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Star size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 font-body">জন্ম: ১ জানুয়ারি ১৯৮৪</p>
                      <p className="text-gray-600 font-body text-sm">বাঘুটিয়া ইউনিয়ন, দৌলতপুর</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <User size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-body text-base"><span className="font-bold text-gray-900">পিতা:</span> মোহাম্মদ আলেক বেপারী</p>
                      <p className="font-body text-base"><span className="font-bold text-gray-900">মাতা:</span> হাজেরা খাতুন</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Heart size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 font-body">বর্তমান ঠিকানা</p>
                      <p className="text-gray-600 font-body text-sm">গঙ্গাধর পট্টি, মানিকগঞ্জ সিটি</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-5 rounded-xl text-white">
                <p className="italic font-body text-sm leading-relaxed">
                  "একটি দুর্নীতিমুক্ত, আধুনিক ও সেবামূলক ডিজিটাল মানিকগঞ্জ পৌরসভা গড়ে তোলাই আমার মূল লক্ষ্য।"
                </p>
              </div>

              {/* Highlights */}
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-5 rounded-xl border-2 border-primary-300">
                <h4 className="font-bold text-gray-900 font-heading mb-4 flex items-center gap-2">
                  <Star size={18} className="text-primary-600" />
                  এক নজরে
                </h4>
                <ul className="space-y-3 text-gray-700 font-body text-sm">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                      <span className="text-primary-600 mt-1">•</span>
                      <span className="font-medium">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Education & Experience */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card bg-white rounded-3xl shadow-md p-6">
            <h4 className="font-bold text-gray-900 font-heading mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <GraduationCap size={20} className="text-primary-600" />
              </div>
              শিক্ষাগত যোগ্যতা
            </h4>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="bg-gradient-to-r from-primary-50 to-white p-5 rounded-xl border-l-4 border-primary-500 shadow-sm">
                  <p className="font-bold text-gray-900 font-body text-base">{edu.degree}</p>
                  <p className="text-gray-700 font-body text-sm mt-1">{edu.institution}</p>
                  <p className="text-primary-600 font-bold font-body text-sm mt-2">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white rounded-3xl shadow-md p-6">
            <h4 className="font-bold text-gray-900 font-heading mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                <Briefcase size={20} className="text-accent-600" />
              </div>
              পেশাগত অভিজ্ঞতা
            </h4>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="bg-gradient-to-r from-accent-50 to-white p-5 rounded-xl border-l-4 border-accent-500 shadow-sm">
                  <p className="font-bold text-gray-900 font-body text-base">{exp.role}</p>
                  <p className="text-gray-700 font-body text-sm mt-1">{exp.organization}</p>
                  <p className="text-accent-600 font-bold font-body text-sm mt-2">{exp.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Life Story */}
        <div className="card bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
          <h4 className="font-bold text-gray-900 font-heading mb-6 flex items-center gap-2">
            <User size={18} className="text-primary-600" />
            জীবনের গল্প
          </h4>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary-50 to-white p-5 rounded-xl border-l-4 border-primary-500">
              <h5 className="font-bold text-gray-900 mb-2 font-heading">নির্বাচনী ঘোষণা</h5>
              <p className="text-gray-700 text-sm font-body leading-relaxed">মানিকগঞ্জ পৌরসভা নির্বাচনে মেয়র পদে প্রার্থী হওয়ার ঘোষণা দিয়েছেন মানিকগঞ্জ জেলা বিএনপির সাবেক প্রবাসী কল্যাণ বিষয়ক সম্পাদক ও বিশিষ্ট সমাজসেবক মাওলানা হারুনুর রশিদ রাহমানী। বর্তমানে তিনি সৌদি আরবস্থ মানিকগঞ্জ জেলা বিএনপির সভাপতির দায়িত্ব পালনের পাশাপাশি এলাকায় নানামুখী সামাজিক ও মানবিক কর্মকাণ্ডের মাধ্যমে সাধারণ মানুষের নজর কেড়েছেন।</p>
            </div>
            
            <div className="bg-gradient-to-r from-accent-50 to-white p-5 rounded-xl border-l-4 border-accent-500">
              <h5 className="font-bold text-gray-900 mb-2 font-heading">রাজনৈতিক যাত্রা</h5>
              <p className="text-gray-700 text-sm font-body leading-relaxed">শৈশব থেকেই রাজনীতির সঙ্গে ওতপ্রোতভাবে জড়িত। ২০০১ সালে দৌলতপুর উপজেলার বাঘুটিয়া ইউনিয়ন ছাত্রদলের সদস্য পদের মাধ্যমে রাজনৈতিক যাত্রা শুরু। এরপর তিনি উপজেলা যুবদলের সদস্য হিসেবেও মাঠ পর্যায়ে কাজ করেন। প্রবাস জীবনেও তিনি বিএনপির রাজনীতিতে বলিষ্ঠ ভূমিকা রেখেছেন।</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-white p-5 rounded-xl border-l-4 border-blue-500">
              <h5 className="font-bold text-gray-900 mb-2 font-heading">প্রবাস জীবনে সাংগঠনিক দক্ষতা</h5>
              <p className="text-gray-700 text-sm font-body leading-relaxed">সৌদি আরব পূর্বাঞ্চল কেন্দ্রীয় বিএনপির অধীনে আকরাবিয়া ইউনিয়নের সভাপতি থেকে শুরু করে আল খুবার মহানগর বিএনপির সিনিয়র সহ-সভাপতি এবং পরবর্তীতে ভারপ্রাপ্ত সভাপতির দায়িত্ব পালন করেন। এছাড়া দাম্মাম প্রাদেশিক বিএনপির ধর্ম বিষয়ক ও যুগ্ম সাধারণ সম্পাদক এবং আল জুবায়িল প্রাদেশিক বিএনপির সহ-সভাপতি হিসেবে তার সাংগঠনিক দক্ষতা প্রমাণিত। সর্বশেষ তিনি মানিকগঞ্জ জেলা বিএনপির প্রবাসী কল্যাণ বিষয়ক সম্পাদকের দায়িত্ব সফলতার সাথে পালন করেছেন।</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-white p-5 rounded-xl border-l-4 border-purple-500">
              <h5 className="font-bold text-gray-900 mb-2 font-heading">পারিবারিক পরিচয়</h5>
              <p className="text-gray-700 text-sm font-body leading-relaxed">১৯৮৪ সালের ১ জানুয়ারি মানিকগঞ্জের দৌলতপুর উপজেলার বাঘুটিয়া ইউনিয়নের ইসলামপুর গ্রামের এক সম্ভ্রান্ত মুসলিম পরিবারে তিনি জন্ম গ্রহন করেন। তার পিতা মোহাম্মদ আলেক বেপারী ও মাতা হাজেরা খাতুন। বর্তমানে তিনি মানিকগঞ্জ শহরের গঙ্গাধর পট্টি আবাসিক এলাকার স্থায়ী বাসিন্দা।</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-white p-5 rounded-xl border-l-4 border-orange-500">
              <h5 className="font-bold text-gray-900 mb-2 font-heading">শিক্ষা জীবন</h5>
              <p className="text-gray-700 text-sm font-body leading-relaxed">শিক্ষা জীবনে তিনি দৌলতপুর বিকেএস হাইস্কুলে পড়াশোনার পর ধর্মীয় শিক্ষার প্রতি অনুরাগী হয়ে ইসলামপুর গাফুরিয়া দারুস সুন্নাহ্ মাদ্রাসা ও সাভার ব্যাংক কলোনি কওমি মাদ্রাসায় অধ্যয়ন করেন। ২০০৬ সালে রাজধানীর বিখ্যাত জামিয়া রাহমানীয়া আরাবিয়া মাদ্রাসা থেকে মাস্টার্স সমমানের 'দাওরায়ে হাদিস' ডিগ্রি লাভ করেন।</p>
            </div>
            
            <div className="bg-gradient-to-r from-teal-50 to-white p-5 rounded-xl border-l-4 border-teal-500">
              <h5 className="font-bold text-gray-900 mb-2 font-heading">সামাজিক ও মানবিক কর্মকাণ্ড</h5>
              <p className="text-gray-700 text-sm font-body leading-relaxed">রাজনীতির বাইরেও মাওলানা রাহমানী একজন সাদা মনের মানুষ ও দানবীর হিসেবে পরিচিত। তার প্রতিষ্ঠিত 'মানব সেবা ফাউন্ডেশন' নিয়মিতভাবে অসহায় মানুষের দ্বারে দ্বারে সেবা পৌঁছে দিচ্ছে। তিনি বর্তমানে এই ফাউন্ডেশনের প্রতিষ্ঠাতা চেয়ারম্যান হিসেবে দায়িত্ব পালন করছেন।</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-white p-5 rounded-xl border-l-4 border-green-500">
              <h5 className="font-bold text-gray-900 mb-2 font-heading">মানিকগঞ্জের জন্য স্বপ্ন</h5>
              <p className="text-gray-700 text-sm font-body leading-relaxed">মেয়র প্রার্থী মাওলানা হারুনুর রশিদ রাহমানী জানান, তিনি ইসলামী মূল্যবোধে বিশ্বাসী একজন কর্মী হিসেবে মানিকগঞ্জ পৌরবাসীকে একটি আধুনিক, পরিচ্ছন্ন ও সেবাধর্মী পৌরসভা উপহার দিতে চান। নাগরিক সুযোগ-সুবিধা নিশ্চিত করা এবং দুর্নীতিমুক্ত পৌর প্রশাসন গড়াই তার মূল লক্ষ্য।</p>
            </div>
          </div>
        </div>

        {/* Social Contributions */}
        <div className="card bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8">
          <h4 className="font-bold text-gray-900 font-heading mb-6 flex items-center gap-2">
            <Heart size={18} className="text-primary-600" />
            সামাজিক অবদান
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {contributions.map((contribution, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 bg-gradient-to-r ${contribution.color} text-white shadow-md`}
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <contribution.icon className="w-5 h-5" />
                </div>
                <span className="font-medium font-body">{contribution.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl shadow-md p-6 md:p-8">
          <div className="grid grid-cols-3 gap-6 text-center text-white">
            {achievements.map((achievement, index) => (
              <div key={index}>
                <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <achievement.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold mb-1 font-heading">{achievement.value}</div>
                <div className="text-sm text-white/90 font-body">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
