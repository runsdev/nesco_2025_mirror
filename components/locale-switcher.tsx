'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Languages } from 'lucide-react';

const LocaleSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  //   const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  // Define supported locales
  const locales = {
    en: 'English',
    id: 'Bahasa Indonesia',
    // Add more languages as needed
  };

  const handleLocaleChange = (newLocale: string) => {
    // Get the current path without the locale
    // const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');

    // // Construct new path with new locale
    // const newPath = `/${newLocale}${pathWithoutLocale}`;

    // Set cookie (you might want to handle this in middleware instead)
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;

    // Navigate to the new locale path
    // router.push(newPath);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={'sm'}>
          <Languages size={ICON_SIZE} className={'text-muted-foreground'} />
          <span className="ml-2 text-sm">{currentLocale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuRadioGroup value={currentLocale} onValueChange={handleLocaleChange}>
          {Object.entries(locales).map(([locale, label]) => (
            <DropdownMenuRadioItem key={locale} className="flex gap-2" value={locale}>
              <span className="w-6">{locale.toUpperCase()}</span>
              <span>{label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LocaleSwitcher };
