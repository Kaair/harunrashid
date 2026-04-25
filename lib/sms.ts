const SMS_BASE_URL = process.env.SMS_BASE_URL || 'https://api.smsgateway.com.bd/api';
const SMS_CLIENT_ID = process.env.SMS_CLIENT_ID;
const SMS_API_KEY = process.env.SMS_API_KEY;

interface SMSResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function sendSMS(to: string, message: string): Promise<SMSResponse> {
  try {
    if (!SMS_CLIENT_ID || !SMS_API_KEY) {
      console.error('SMS credentials not configured');
      return { success: false, message: 'SMS credentials not configured' };
    }

    // Ensure phone number is in correct format (880XXXXXXXXXX)
    let formattedPhone = to;
    if (to.startsWith('0')) {
      formattedPhone = '88' + to;
    } else if (!to.startsWith('88')) {
      formattedPhone = '880' + to;
    }

    const response = await fetch(`${SMS_BASE_URL}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: SMS_CLIENT_ID,
        key: SMS_API_KEY,
        recipient: formattedPhone,
        message: message,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('SMS sent successfully:', data);
      return { success: true, message: 'SMS sent successfully', data };
    } else {
      console.error('SMS sending failed:', data);
      return { success: false, message: data.message || 'SMS sending failed' };
    }
  } catch (error) {
    console.error('SMS sending error:', error);
    return { success: false, message: 'SMS sending error' };
  }
}

export async function sendOTP(phone: string, otp: string): Promise<SMSResponse> {
  const message = `সম্মানিত নাগরিক, আপনার ওটিপি কোড হলো: ${otp}। এটি গোপন রাখুন। সৌজন্যে: মাওলানা হারুনুর রশিদ রাহমানী।`;
  return sendSMS(phone, message);
}

export async function sendComplaintConfirmation(phone: string, trackingId: string): Promise<SMSResponse> {
  const message = `আপনার অভিযোগটি সফলভাবে নিবন্ধিত হয়েছে। অভিযোগ আইডি: ${trackingId}। আমরা শীঘ্রই ব্যবস্থা নিচ্ছি। - মাওলানা হারুনুর রশিদ রাহমানী।`;
  return sendSMS(phone, message);
}

export async function sendComplaintStatusUpdate(phone: string, trackingId: string, status: string): Promise<SMSResponse> {
  let statusText = '';
  switch (status) {
    case 'in-progress':
      statusText = 'আপনার অভিযোগটি বর্তমানে পর্যালোচনা ও প্রক্রিয়াধীন রয়েছে।';
      break;
    case 'solved':
      statusText = 'আপনার অভিযোগটির সফল সমাধান করা হয়েছে।';
      break;
    default:
      statusText = 'আপনার অভিযোগটি গ্রহণ করা হয়েছে।';
  }
  const message = `${statusText}। অভিযোগ আইডি: ${trackingId}। জনসেবায় আপনার পাশে - মাওলানা হারুনুর রশিদ রাহমানী।`;
  return sendSMS(phone, message);
}

export async function sendVolunteerConfirmation(phone: string, name: string): Promise<SMSResponse> {
  const message = `ধন্যবাদ ${name}, আপনার সেচ্ছাসেবক আবেদনটি গ্রহণ করা হয়েছে। শীঘ্রই আমাদের টিম আপনার সাথে যোগাযোগ করবে। - মাওলানা হারুনুর রশিদ রাহমানী।`;
  return sendSMS(phone, message);
}

export async function sendFeedbackConfirmation(phone: string): Promise<SMSResponse> {
  const message = `আপনার মূল্যবান মতামতের জন্য ধন্যবাদ। আমরা আপনার পরামর্শ গুরুত্বের সাথে বিবেচনা করছি। - মাওলানা হারুনুর রশিদ রাহমানী।`;
  return sendSMS(phone, message);
}
