export const Navbar = () => {
  const routes = [
    {
      name: 'competition',
      href: '/competition',
      child: [
        {
          name: 'paper',
          href: '/competition/paper',
        },
        {
          name: 'poster',
          href: '/competition/poster',
        },
      ],
    },
    {
      name: 'seminar',
      href: '/seminar',
    },
    {
      name: 'faq',
      href: '/faq',
    },
  ];
  return <div className="h-[70px] w-full bg-[pink] text-center text-[40px]">Navbar</div>;
};
