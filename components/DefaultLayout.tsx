const DefaultLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
    <section className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='w-[800px]'>
        {children}
      </div>
    </section>
  );
};

export default DefaultLayout;
