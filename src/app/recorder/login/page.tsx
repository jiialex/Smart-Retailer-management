import { redirect } from 'next/navigation';

export default function RecorderLoginPage() {
  redirect('/login?role=Recorder');
}