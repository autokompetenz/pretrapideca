import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export async function submitLoanRequest(formData) {
  if (!supabase) {
    console.log('Supabase not configured. Form data:', formData);
    return { success: true, mock: true };
  }

  const { error, data } = await supabase
    .from('loan_requests')
    .insert([{
      full_name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      monthly_income: parseFloat(formData.monthlyIncome),
      profession: formData.profession,
      next_payday: formData.nextPayday,
      bank_name: formData.bankName,
      joint_request: formData.jointRequest === 'oui',
      loan_purpose: formData.loanPurpose,
      desired_date: formData.desiredDate,
    }])
    .select();

  if (error) throw new Error(error.message);
  return { success: true, data };
}

export default supabase;
