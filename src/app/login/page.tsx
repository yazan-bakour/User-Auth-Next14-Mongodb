import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../../../lib/authOptions';
import { redirect } from 'next/navigation';
import LoginForm from './Form';

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <main>
      <LoginForm/>
    </main>
  )
}

export default page