import { redirect } from 'next/navigation';

export default function TermsPage() {
  redirect('/legal/terms-and-conditions.pdf');
}