// app/hooks/useSMSCount.ts
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useSMSCount() {
  const [totalTexts, setTotalTexts] = useState(0);
  const [monthlyTexts, setMonthlyTexts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSMSCounts();

    // Set up real-time subscription
    const subscription = supabase
      .channel('sms_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sms_queue' },
        () => {
          fetchSMSCounts(); // Refresh counts when SMS table changes
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSMSCounts = async () => {
    try {
      // Get total SMS sent
      const { count: totalCount } = await supabase
        .from('sms_queue')
        .select('*', { count: 'exact', head: true })
        .eq('sent', true);

      // Get this month's SMS
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: monthlyCount } = await supabase
        .from('sms_queue')
        .select('*', { count: 'exact', head: true })
        .eq('sent', true)
        .gte('created_at', startOfMonth.toISOString());

      setTotalTexts(totalCount || 0);
      setMonthlyTexts(monthlyCount || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching SMS counts:', error);
      setLoading(false);
    }
  };

  return { totalTexts, monthlyTexts, loading, refresh: fetchSMSCounts };
}

// Example usage in your dashboard component:
// const { totalTexts, monthlyTexts } = useSMSCount();