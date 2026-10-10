import { redirect } from 'next/navigation';

export default function RecorderSignupPage() {
  redirect('/signup?role=Recorder');
}